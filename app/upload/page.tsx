"use client";

import { useUpload } from "@/features/upload/hooks/useUpload";
import { UploadTabs } from "@/features/upload/components/UploadTabs";
import { DocumentList } from "@/features/upload/components/DocumentList";
import { AlertCircle } from "lucide-react";

export default function UploadPage() {
  const { documents, isUploading, error, handleFileUpload, handleTextUpload, removeDocument } =
    useUpload();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#fafafa]">Subir documentos</h1>
        <p className="mt-1 text-sm text-[#a1a1aa]">
          Añade PDFs o pega texto. Se procesarán automáticamente para que puedas consultarlos.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Upload tabs */}
      <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-6">
        <UploadTabs
          onFileUpload={handleFileUpload}
          onTextUpload={handleTextUpload}
          isUploading={isUploading}
        />
      </div>

      {/* Document list */}
      {documents.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#fafafa]">
              Documentos subidos
            </h2>
            <span className="rounded-full bg-[#27272a] px-2 py-0.5 text-xs text-[#a1a1aa]">
              {documents.length}
            </span>
          </div>
          <DocumentList documents={documents} onRemove={removeDocument} />
        </div>
      )}
    </div>
  );
}
