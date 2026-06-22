import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/I18nContext";

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  isUploading: boolean;
}

export function DropZone({ onFileAccepted, isUploading }: DropZoneProps) {
  const { t } = useTranslation();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      disabled: isUploading,
    });

  const lastFile = acceptedFiles[acceptedFiles.length - 1];

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 sm:gap-6 rounded-2xl border border-dashed p-6 sm:p-12 text-center transition-all duration-300 cursor-pointer group",
        isDragActive && !isDragReject
          ? "border-violet-500 bg-violet-950/20 shadow-[0_0_40px_rgba(124,58,237,0.12)] scale-[1.01]"
          : isDragReject
          ? "border-red-500 bg-red-950/20 shadow-[0_0_40px_rgba(239,68,68,0.12)]"
          : "border-zinc-800 bg-[#0b0b0e] hover:border-violet-500/50 hover:bg-violet-950/5 hover:shadow-[0_0_30px_rgba(124,58,237,0.04)]",
        isUploading && "cursor-not-allowed opacity-60 pointer-events-none"
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 shadow-inner",
          isDragActive && !isDragReject
            ? "bg-violet-600 text-white scale-110 shadow-lg shadow-violet-500/25"
            : isDragReject
            ? "bg-red-500/20 text-red-400"
            : "bg-zinc-900 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-violet-400 group-hover:scale-105"
        )}
      >
        {isDragReject ? (
          <AlertCircle className="h-8 w-8 text-red-400 animate-pulse" />
        ) : lastFile ? (
          <FileText className="h-8 w-8 text-violet-400" />
        ) : (
          <CloudUpload className="h-8 w-8" />
        )}
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        {isDragReject ? (
          <p className="text-sm font-semibold text-red-400">{t("dropzone.reject")}</p>
        ) : isDragActive ? (
          <p className="text-sm font-semibold text-violet-400">{t("dropzone.active")}</p>
        ) : lastFile ? (
          <>
            <p className="text-sm font-semibold text-zinc-100 truncate max-w-xs">{lastFile.name}</p>
            <p className="text-xs text-zinc-400">
              {(lastFile.size / 1024 / 1024).toFixed(2)} MB · <span className="text-violet-400 font-medium group-hover:text-violet-300 transition-colors">{t("dropzone.replace")}</span>
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-zinc-200">
              {t("dropzone.dragPrompt")}{"  "}
              <span className="text-violet-400 font-semibold group-hover:text-violet-300 transition-colors underline underline-offset-4 decoration-violet-500/30">{t("dropzone.clickPrompt")}</span>
            </p>
            <p className="text-xs text-zinc-500">{t("dropzone.limit")}</p>
          </>
        )}
      </div>
    </div>
  );
}
