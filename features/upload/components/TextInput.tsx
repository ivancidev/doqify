"use client";

import { useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { Input } from "@heroui/react";
import { FileSignature } from "lucide-react";

interface TextInputProps {
  onSubmit: (text: string, name: string) => void;
  isUploading: boolean;
}

export function TextInput({ onSubmit, isUploading }: TextInputProps) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !text.trim()) return;
    onSubmit(text, name);
    setName("");
    setText("");
  };

  const canSubmit = name.trim().length > 0 && text.trim().length > 0 && !isUploading;

  return (
    <div className="flex flex-col gap-4">
      {/* Nombre del documento */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Nombre del documento
        </label>
        <Input
          fullWidth
          placeholder="Ej. Mi currículum, Informe Q3…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isUploading}
          className="rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2 text-sm text-[#fafafa] placeholder:text-[#a1a1aa] focus-visible:border-violet-500 focus-visible:outline-none disabled:opacity-50"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Contenido del documento
        </label>
        <textarea
          rows={8}
          placeholder="Pega aquí el texto de tu documento…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isUploading}
          className="w-full resize-none rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#a1a1aa] focus-visible:border-violet-500 focus-visible:outline-none disabled:opacity-50 transition-colors"
        />
        <p className="text-right text-xs text-[#a1a1aa]">
          {text.length.toLocaleString("es")} caracteres
        </p>
      </div>

      <Button
        onPress={handleSubmit}
        isDisabled={!canSubmit}
        isPending={isUploading}
        className="flex items-center gap-2 self-end rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
      >
        {({ isPending }) => (
          <>
            {isPending ? (
              <Spinner size="sm" color="current" />
            ) : (
              <FileSignature className="h-4 w-4" />
            )}
            {isPending ? "Subiendo…" : "Subir texto"}
          </>
        )}
      </Button>
    </div>
  );
}
