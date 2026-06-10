"use client";

import { useState, useEffect } from "react";
import { uploadDocument, uploadText } from "@/lib/n8n";
import type { UploadedDocument } from "../types";
import { useAuth } from "@/components/providers/AuthContext";

export function useUpload() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { session } = useAuth();

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!session?.access_token) return;

    let isMounted = true;

    const fetchDocuments = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      setIsLoadingDocs(true);
      
      try {
        const res = await fetch("/api/upload", {
          headers: {
            "Authorization": `Bearer ${session.access_token}`
          }
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setDocuments(data.documents || []);
        } else if (isMounted) {
          const errData = await res.json().catch(() => ({}));
          setError(errData.error || "No se pudieron cargar los documentos.");
        }
      } catch {
        if (isMounted) {
          setError("Error de red al cargar tus documentos.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingDocs(false);
        }
      }
    };

    fetchDocuments();

    return () => {
      isMounted = false;
    };
  }, [session, refreshTrigger]);

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

    const result = await uploadDocument(file, session?.access_token);

    if (result.success) {
      triggerRefresh();
    } else {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === tempDoc.id ? { ...doc, status: "error" } : doc
        )
      );
      setError(result.error || "Error al subir el archivo.");
    }
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

    const result = await uploadText(text, name, session?.access_token);

    if (result.success) {
      triggerRefresh();
    } else {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === tempDoc.id ? { ...doc, status: "error" } : doc
        )
      );
      setError(result.error || "Error al subir el texto.");
    }
    setIsUploading(false);
  };

  const removeDocument = async (id: string) => {
    const docToDelete = documents.find((doc) => doc.id === id);
    if (!docToDelete) return;

    // Optimistic UI update
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));

    if (!session?.access_token) return;

    try {
      const res = await fetch(`/api/upload?name=${encodeURIComponent(docToDelete.name)}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Error al eliminar el documento de la base de datos.");
        triggerRefresh();
      }
    } catch {
      setError("Error de red al eliminar el documento.");
      triggerRefresh();
    }
  };

  return {
    documents,
    isUploading,
    isLoadingDocs,
    error,
    handleFileUpload,
    handleTextUpload,
    removeDocument,
  };
}
