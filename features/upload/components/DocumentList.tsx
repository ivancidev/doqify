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
    className: "text-violet-400 bg-violet-600/10 border border-violet-500/20",
    icon: null,
  },
  ready: {
    label: "Listo",
    className: "text-[#10b981] bg-emerald-500/10 border border-emerald-500/20",
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
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#27272a] bg-[#18181b] py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#27272a]">
          <InboxIcon className="h-6 w-6 text-[#a1a1aa]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#fafafa]">Aún no hay documentos</p>
          <p className="mt-0.5 text-xs text-[#a1a1aa]">Sube un PDF o pega texto para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {documents.map((doc) => {
        const status = statusConfig[doc.status];
        const StatusIcon = status.icon;
        const DocIcon = doc.type === "pdf" ? FileType2 : FileText;

        return (
          <div
            key={doc.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-[#27272a] bg-[#18181b] px-4 py-3 transition-colors",
              doc.status === "error" && "border-red-500/30"
            )}
          >
            {/* Icono de archivo */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#27272a]">
              <DocIcon className="h-4.5 w-4.5 text-violet-400" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#fafafa]">{doc.name}</p>
              <p className="text-xs text-[#a1a1aa]">{formatDate(doc.uploadedAt)}</p>
            </div>

            {/* Badge de estado */}
            <span
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                status.className
              )}
            >
              {doc.status === "uploading" ? (
                <Spinner size="sm" color="current" className="h-3 w-3" />
              ) : StatusIcon ? (
                <StatusIcon className="h-3 w-3" />
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
              className="shrink-0 rounded-lg text-[#a1a1aa] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
