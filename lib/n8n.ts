// src/lib/n8n.ts
// All communication with n8n webhooks

const UPLOAD_URL = process.env.NEXT_PUBLIC_N8N_UPLOAD_URL!;
const QUERY_URL = process.env.NEXT_PUBLIC_N8N_QUERY_URL!;

export interface UploadResponse {
  success: boolean;
  documentId?: string;
  documentName?: string;
  error?: string;
}

export interface QueryResponse {
  answer: string;
  sources?: string[];
  error?: string;
}

/**
 * Upload a PDF file to n8n for processing.
 * n8n will extract text, create embeddings, and save to Supabase.
 */
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);

  try {
    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return { success: false, error: "Upload failed" };
    }

    const data = await res.json();
    return { success: true, ...data };
  } catch {
    return { success: false, error: "Network error during upload" };
  }
}

/**
 * Upload plain text to n8n for processing.
 */
export async function uploadText(
  text: string,
  name: string
): Promise<UploadResponse> {
  try {
    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, name }),
    });

    if (!res.ok) {
      return { success: false, error: "Upload failed" };
    }

    const data = await res.json();
    return { success: true, ...data };
  } catch {
    return { success: false, error: "Network error during upload" };
  }
}

/**
 * Send a question to n8n — it will query Supabase and return an AI answer.
 */
export async function queryDocuments(question: string): Promise<QueryResponse> {
  try {
    const res = await fetch(QUERY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) {
      return { answer: "Error connecting to the AI. Please try again." };
    }

    const data = await res.json();
    return {
      answer: data.answer || data.text || data.response || "No answer received.",
      sources: data.sources,
    };
  } catch {
    return { answer: "Network error. Please check your connection and try again." };
  }
}
