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
    <div className="flex flex-col gap-5">
      {/* Nombre del documento */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Nombre del documento
        </label>
        <Input
          fullWidth
          placeholder="Ej. Manual de Empleado, Políticas Corporativas…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isUploading}
          className="w-full rounded-xl border border-zinc-800 bg-[#0d0d11] px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 outline-none disabled:opacity-50 transition-all duration-200"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Contenido del documento
        </label>
        <textarea
          rows={8}
          placeholder="Pega aquí el texto de tu documento..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isUploading}
          className="w-full resize-none rounded-xl border border-zinc-800 bg-[#0d0d11] px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 outline-none disabled:opacity-50 transition-all duration-200 shadow-inner"
        />
        <p className="text-right text-xs text-zinc-500 font-medium">
          {text.length.toLocaleString("es")} caracteres
        </p>
      </div>

      <Button
        onPress={handleSubmit}
        isDisabled={!canSubmit}
        isPending={isUploading}
        className="flex items-center gap-2 self-end rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
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
