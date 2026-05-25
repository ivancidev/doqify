"use client";

import { useState } from "react";
import { uploadDocument, uploadText } from "@/lib/n8n";
import type { UploadedDocument } from "../types";

export function useUpload() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const tempDoc: UploadedDocument = {
      id: crypto.randomUUID(),
      name: file.name,
      uploadedAt: new Date(),
      type: "pdf",
      status: "uploading",
    };

    setDocuments((prev) => [...prev, tempDoc]);

    const result = await uploadDocument(file);

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === tempDoc.id
          ? { ...doc, status: result.success ? "ready" : "error" }
          : doc
      )
    );

    if (!result.success) setError(result.error || "Upload failed");
    setIsUploading(false);
  };

  const handleTextUpload = async (text: string, name: string) => {
    if (!text.trim() || !name.trim()) return;
    setIsUploading(true);
    setError(null);

    const tempDoc: UploadedDocument = {
      id: crypto.randomUUID(),
      name,
      uploadedAt: new Date(),
      type: "text",
      status: "uploading",
    };

    setDocuments((prev) => [...prev, tempDoc]);

    const result = await uploadText(text, name);

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === tempDoc.id
          ? { ...doc, status: result.success ? "ready" : "error" }
          : doc
      )
    );

    if (!result.success) setError(result.error || "Upload failed");
    setIsUploading(false);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return {
    documents,
    isUploading,
    error,
    handleFileUpload,
    handleTextUpload,
    removeDocument,
  };
}
