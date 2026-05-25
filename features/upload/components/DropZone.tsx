"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  isUploading: boolean;
}

export function DropZone({ onFileAccepted, isUploading }: DropZoneProps) {
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
        "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 transition-all duration-200 cursor-pointer",
        isDragActive && !isDragReject
          ? "border-violet-500 bg-violet-600/10"
          : isDragReject
          ? "border-red-500 bg-red-500/10"
          : "border-[#27272a] bg-[#18181b] hover:border-violet-500/50 hover:bg-violet-600/5",
        isUploading && "cursor-not-allowed opacity-60"
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
          isDragActive && !isDragReject ? "bg-violet-600/20" : "bg-[#27272a]"
        )}
      >
        {isDragReject ? (
          <AlertCircle className="h-7 w-7 text-red-400" />
        ) : lastFile ? (
          <FileText className="h-7 w-7 text-violet-400" />
        ) : (
          <CloudUpload
            className={cn(
              "h-7 w-7 transition-colors",
              isDragActive ? "text-violet-400" : "text-[#a1a1aa]"
            )}
          />
        )}
      </div>

      <div className="text-center">
        {isDragReject ? (
          <p className="text-sm font-medium text-red-400">Solo se aceptan archivos PDF</p>
        ) : isDragActive ? (
          <p className="text-sm font-medium text-violet-400">Suelta tu PDF aquí</p>
        ) : lastFile ? (
          <>
            <p className="text-sm font-medium text-[#fafafa]">{lastFile.name}</p>
            <p className="mt-0.5 text-xs text-[#a1a1aa]">
              {(lastFile.size / 1024 / 1024).toFixed(2)} MB · haz clic para reemplazar
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-[#fafafa]">
              Arrastra tu PDF aquí o{" "}
              <span className="text-violet-400 underline underline-offset-2">haz clic para buscar</span>
            </p>
            <p className="mt-0.5 text-xs text-[#a1a1aa]">Solo archivos PDF · Máx. 50 MB</p>
          </>
        )}
      </div>
    </div>
  );
}
