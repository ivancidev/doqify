"use client";

import { useUpload } from "@/features/upload/hooks/useUpload";
import { UploadTabs } from "@/features/upload/components/UploadTabs";
import { DocumentList } from "@/features/upload/components/DocumentList";
import { AlertCircle } from "lucide-react";

export default function UploadPage() {
  const { documents, isUploading, error, handleFileUpload, handleTextUpload, removeDocument } =
    useUpload();

  return (
    <div className="relative mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      {/* Glow background effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Heading */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight">Subir documentos</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Añade archivos PDF o pega texto. Procesamos y vectorizamos tus documentos al instante para consultas inteligentes.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <p className="text-sm font-medium text-red-400">{error}</p>
        </div>
      )}

      {/* Upload tabs */}
      <div className="rounded-3xl border border-zinc-800/80 bg-[#141419]/60 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
        <UploadTabs
          onFileUpload={handleFileUpload}
          onTextUpload={handleTextUpload}
          isUploading={isUploading}
        />
      </div>

      {/* Document list */}
      {documents.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
              Documentos subidos
            </h2>
            <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-400">
              {documents.length}
            </span>
          </div>
          <DocumentList documents={documents} onRemove={removeDocument} />
        </div>
      )}
    </div>
  );
}
