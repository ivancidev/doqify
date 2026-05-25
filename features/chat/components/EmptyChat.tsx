"use client";

import { Sparkles } from "lucide-react";

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
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-[#fafafa]">
          Pregunta cualquier cosa sobre tus documentos
        </h2>
        <p className="text-sm text-[#a1a1aa]">
          Sube un documento primero y luego escribe tu pregunta.
        </p>
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
