import { PDFParse } from "pdf-parse";
import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";

let isWorkerInitialized = false;

/**
 * Initializes the PDF worker source dynamically (only at runtime).
 */
function initializePDFWorker() {
  if (isWorkerInitialized) return;

  try {
    let workerPath = "";

    try {
      // Resolve the real path of pdf-parse folder, following symlinks (needed for pnpm layout)
      const pdfParseRealDir = fs.realpathSync(path.join(process.cwd(), "node_modules", "pdf-parse"));
      
      const paths = [
        // 1. pdfjs-dist sibling to pdf-parse inside pnpm store (pnpm layout)
        path.resolve(pdfParseRealDir, "..", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs"),
        // 2. pdf-parse internal worker
        path.join(pdfParseRealDir, "dist", "worker", "pdf.worker.js"),
        // 3. hoisted pdfjs-dist (standard npm/yarn layout)
        path.join(process.cwd(), "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs")
      ];

      for (const p of paths) {
        if (fs.existsSync(p)) {
          workerPath = p;
          break;
        }
      }
    } catch (cwdErr) {
      console.warn("CWD path checks failed, falling back to require.resolve path checks:", cwdErr);
    }

    // Fallback: try require.resolve path resolution if cwd checks fail
    if (!workerPath) {
      try {
        const entryPath = require.resolve("pdf-parse");
        const pdfParseDir = path.resolve(entryPath, "..", "..", "..", "..");
        const p1 = path.join(pdfParseDir, "dist", "worker", "pdf.worker.js");
        const p2 = path.join(pdfParseDir, "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs");
        const p3 = path.resolve(pdfParseDir, "..", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs");

        if (fs.existsSync(p1)) workerPath = p1;
        else if (fs.existsSync(p2)) workerPath = p2;
        else if (fs.existsSync(p3)) workerPath = p3;
      } catch {}
    }

    if (workerPath) {
      // Converts the file path to a file:// URL (crucial for Windows Node ESM worker importing)
      const workerUrl = pathToFileURL(workerPath).href;
      PDFParse.setWorker(workerUrl);
      isWorkerInitialized = true;
    } else {
      console.warn("Could not find pdf.worker file path inside node_modules.");
    }
  } catch (err) {
    console.warn("Could not dynamically resolve pdf.worker path:", err);
  }
}

/**
 * Extracts raw text from a PDF buffer.
 */
export async function parsePDF(buffer: Buffer): Promise<string> {
  initializePDFWorker();
  let parser: PDFParse | null = null;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text || "";
  } catch (error) {
    console.error("Error parsing PDF file:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse PDF: ${errorMessage}`);
  } finally {
    if (parser) {
      await parser.destroy().catch((err) => {
        console.warn("Failed to destroy PDFParse instance:", err);
      });
    }
  }
}

/**
 * Splits text into chunks of roughly `chunkSize` characters with a given `chunkOverlap`.
 * Attempts to split at natural boundaries like newlines, sentence endings, or word spaces.
 */
export function splitText(
  text: string,
  chunkSize: number = 800,
  chunkOverlap: number = 150
): string[] {
  const chunks: string[] = [];
  
  // Clean up excessive whitespace
  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  
  let currentIndex = 0;

  while (currentIndex < normalizedText.length) {
    // If the remaining text fits in one chunk, push it and finish
    if (currentIndex + chunkSize >= normalizedText.length) {
      const chunk = normalizedText.slice(currentIndex).trim();
      if (chunk.length > 0) {
        chunks.push(chunk);
      }
      break;
    }

    const searchRange = normalizedText.slice(currentIndex, currentIndex + chunkSize);
    let splitIndex = chunkSize;

    // Look for natural split points, starting from the end of our chunk size
    const lastDoubleNewline = searchRange.lastIndexOf("\n\n");
    const lastNewline = searchRange.lastIndexOf("\n");
    const lastSentence = searchRange.lastIndexOf(". ");
    const lastSpace = searchRange.lastIndexOf(" ");

    // Prioritize paragraphs (\n\n), then newlines (\n), then sentence endings (. ), then spaces
    if (lastDoubleNewline > chunkSize * 0.6) {
      splitIndex = lastDoubleNewline + 2;
    } else if (lastNewline > chunkSize * 0.7) {
      splitIndex = lastNewline + 1;
    } else if (lastSentence > chunkSize * 0.75) {
      splitIndex = lastSentence + 2;
    } else if (lastSpace > chunkSize * 0.5) {
      splitIndex = lastSpace + 1;
    }

    const chunk = normalizedText.slice(currentIndex, currentIndex + splitIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move next index back by overlap
    currentIndex += splitIndex - chunkOverlap;

    // Safeguard to prevent infinite loops if overlap is too aggressive
    if (splitIndex <= chunkOverlap) {
      currentIndex = currentIndex + chunkSize - chunkOverlap;
    }
  }

  return chunks;
}
