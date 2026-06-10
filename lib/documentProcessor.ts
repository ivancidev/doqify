import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";
import type { PDFParse as PDFParseType } from "pdf-parse";

let isWorkerInitialized = false;

/**
 * Initializes the PDF worker source dynamically (only at runtime).
 */
function initializePDFWorker(PDFParseClass: typeof PDFParseType) {
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
      PDFParseClass.setWorker(workerUrl);
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
  const { PDFParse } = (await import("pdf-parse")) as { PDFParse: typeof PDFParseType };
  initializePDFWorker(PDFParse);
  let parser: PDFParseType | null = null;
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

