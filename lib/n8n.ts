// src/lib/n8n.ts
// All communication with n8n webhooks

const UPLOAD_URL = "/api/upload";
const QUERY_URL = "/api/chat";

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
 * Upload a PDF file to local API for processing.
 */
export async function uploadDocument(file: File, token?: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || "Upload failed" };
    }

    const data = await res.json();
    return { success: true, ...data };
  } catch {
    return { success: false, error: "Network error during upload" };
  }
}

/**
 * Upload plain text to local API for processing.
 */
export async function uploadText(
  text: string,
  name: string,
  token?: string
): Promise<UploadResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ text, name }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || "Upload failed" };
    }

    const data = await res.json();
    return { success: true, ...data };
  } catch {
    return { success: false, error: "Network error during upload" };
  }
}

/**
 * Send a question to local API to query Supabase and return an AI answer.
 */
export async function queryDocuments(question: string, token?: string): Promise<QueryResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(QUERY_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ question }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { answer: errData.error || "Error connecting to the AI. Please try again." };
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
