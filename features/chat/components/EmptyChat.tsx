"use client";

import { Sparkles, Upload } from "lucide-react";
import Link from "next/link";

const SUGGESTIONS = [
  "Resume mi documento",
  "¿Cuáles son los puntos clave?",
  "¿Qué habilidades se mencionan?",
];

interface EmptyChatProps {
  onSuggest: (text: string) => void;
}

export function EmptyChat({ onSuggest }: EmptyChatProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      {/* Icono */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/15">
        <Sparkles className="h-8 w-8 text-violet-400" />
      </div>

      {/* Encabezado */}
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-xl font-semibold text-[#fafafa]">
          Pregunta cualquier cosa sobre tus documentos
        </h2>
        <p className="text-sm text-[#a1a1aa] max-w-sm">
          Sube tus archivos PDF o copia texto en la sección de carga para poder interactuar con ellos aquí.
        </p>
        <Link
          href="/upload"
          className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/10 transition-all hover:bg-violet-500 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <Upload className="h-3.5 w-3.5" />
          Subir documentos
        </Link>
      </div>

      {/* Chips de sugerencia */}
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggest(suggestion)}
            className="rounded-full border border-[#27272a] bg-[#18181b] px-4 py-2 text-sm text-[#a1a1aa] transition-colors hover:border-violet-500/50 hover:bg-violet-600/10 hover:text-violet-400"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
