"use client";

import { Button, Spinner } from "@heroui/react";
import { FileText, FileType2, Trash2, CheckCircle2, AlertCircle, InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadedDocument } from "../types";

interface DocumentListProps {
  documents: UploadedDocument[];
  onRemove: (id: string) => void;
}

const statusConfig = {
  uploading: {
    label: "Procesando…",
    className: "text-violet-400 bg-violet-500/10 border border-violet-500/20",
    icon: null,
  },
  ready: {
    label: "Listo",
    className: "text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20",
    icon: CheckCircle2,
  },
  error: {
    label: "Error",
    className: "text-red-400 bg-red-500/10 border border-red-500/20",
    icon: AlertCircle,
  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function DocumentList({ documents, onRemove }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-800 bg-[#0b0b0e]/60 py-14 text-center backdrop-blur-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-500 shadow-inner">
          <InboxIcon className="h-6 w-6 text-zinc-400" />
        </div>
        <div className="flex flex-col gap-1 max-w-xs">
          <p className="text-sm font-semibold text-zinc-200">Aún no hay documentos</p>
          <p className="text-xs text-zinc-500">Sube un archivo PDF o pega texto plano para comenzar a chatear.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {documents.map((doc) => {
        const status = statusConfig[doc.status];
        const StatusIcon = status.icon;
        const DocIcon = doc.type === "pdf" ? FileType2 : FileText;

        return (
          <div
            key={doc.id}
            className={cn(
              "flex items-center gap-4 rounded-2xl border border-zinc-800/80 bg-[#0d0d11]/80 px-5 py-3.5 transition-all duration-300 hover:bg-[#121217] hover:border-zinc-700/80 group/row shadow-sm hover:shadow-[0_0_20px_rgba(124,58,237,0.02)]",
              doc.status === "error" && "border-red-500/20 bg-red-950/5 hover:border-red-500/30"
            )}
          >
            {/* Icono de archivo */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover/row:border-violet-500/30 group-hover/row:text-violet-400 transition-colors">
              <DocIcon className="h-5 w-5" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
              <p className="truncate text-sm font-semibold text-zinc-200 group-hover/row:text-zinc-100 transition-colors">
                {doc.name}
              </p>
              <p className="text-xs text-zinc-500 font-medium">
                {formatDate(doc.uploadedAt)}
              </p>
            </div>

            {/* Badge de estado */}
            <span
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm border",
                status.className
              )}
            >
              {doc.status === "uploading" ? (
                <Spinner size="sm" color="current" className="h-3 w-3" />
              ) : StatusIcon ? (
                <StatusIcon className="h-3.5 w-3.5" />
              ) : null}
              {status.label}
            </span>

            {/* Botón eliminar */}
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onPress={() => onRemove(doc.id)}
              isDisabled={doc.status === "uploading"}
              className="shrink-0 rounded-xl text-zinc-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40 cursor-pointer animate-fade"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
