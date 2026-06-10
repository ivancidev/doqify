"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "motion/react";
import { FileText, Sparkles, Send } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function InteractiveDemo() {
  const [typedQuestion, setTypedQuestion] = useState("");
  const [demoState, setDemoState] = useState<"typing" | "searching" | "highlighting" | "answering" | "idle">("typing");

  const questionText = "¿Cuál es el plazo para entregar los informes?";

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (demoState === "typing") {
      let index = 0;
      const interval = setInterval(() => {
        if (index < questionText.length) {
          setTypedQuestion(questionText.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          timer = setTimeout(() => {
            setDemoState("searching");
          }, 800);
        }
      }, 50);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }

    if (demoState === "searching") {
      timer = setTimeout(() => {
        setDemoState("highlighting");
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (demoState === "highlighting") {
      timer = setTimeout(() => {
        setDemoState("answering");
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (demoState === "answering") {
      timer = setTimeout(() => {
        setDemoState("idle");
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (demoState === "idle") {
      timer = setTimeout(() => {
        setTypedQuestion("");
        setDemoState("typing");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [demoState]);

  return (
    <motion.div
      variants={fadeUp}
      className="w-full max-w-4xl mx-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md overflow-hidden shadow-2xl shadow-violet-500/5 mt-12 relative z-10"
    >
      {/* Window Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/40 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          <FileText className="h-3.5 w-3.5 text-violet-400" />
          contrato_servicios_final.pdf
        </div>
        <div className="w-12" />
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800/80 min-h-[340px]">
        {/* Left: Document Viewer */}
        <div className="col-span-1 md:col-span-7 p-6 text-left relative overflow-hidden flex flex-col justify-between">
          {/* Scanning Line overlay */}
          {demoState === "searching" && (
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 280 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60 shadow-[0_0_10px_#8b5cf6]"
            />
          )}

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600">Documento cargado</h4>
            <div className="space-y-3 text-xs text-zinc-400 leading-relaxed font-mono">
              <p className="opacity-60">... 2. Objeto del Contrato. El Proveedor ejecutará el desarrollo del software según especificaciones técnicas.</p>
              <p className="opacity-60">3. Precio y Facturación. El monto total acordado será pagado en tres hitos de entrega correspondientes.</p>

              {/* Highlightable Paragraph */}
              <div
                className={`p-2.5 rounded-lg border transition-all duration-500 ${
                  demoState === "highlighting" || demoState === "answering"
                    ? "bg-violet-600/10 border-violet-500/40 text-zinc-100 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                    : "border-transparent text-zinc-400"
                }`}
              >
                <span className="font-bold text-violet-400 mr-1.5">[CLÁUSULA 4]</span>
                <strong>Plazos de Entrega:</strong> El Proveedor se compromete a entregar los informes finales en un plazo máximo de <strong>10 días hábiles</strong> tras la finalización de cada fase de auditoría.
              </div>

              <p className="opacity-60">5. Propiedad Intelectual. Toda la propiedad intelectual desarrollada durante el proyecto pertenecerá al Cliente...</p>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-4 pt-4 border-t border-zinc-900/60 flex justify-between items-center text-[10px] text-zinc-600">
            <span>Página 4 de 12</span>
            <span>2.4 KB procesados</span>
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="col-span-1 md:col-span-5 p-6 bg-zinc-950/20 text-left flex flex-col justify-between gap-4">
          <div className="space-y-4 flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Asistente de respuestas
            </h4>

            <div className="space-y-3">
              {/* User message */}
              {typedQuestion && (
                <div className="flex flex-col items-end">
                  <div className="rounded-2xl rounded-tr-sm bg-violet-600 px-3.5 py-2 text-xs text-white max-w-[85%] font-medium">
                    {typedQuestion}
                  </div>
                </div>
              )}

              {/* AI replies / Loading state */}
              {demoState === "searching" && (
                <div className="flex gap-2.5 items-start">
                  <div className="h-6 w-6 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-violet-400">
                    DQ
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-zinc-900 px-3.5 py-2 text-xs text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {(demoState === "highlighting" || demoState === "answering") && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 items-start"
                >
                  <div className="h-6 w-6 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400">
                    DQ
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-300 leading-relaxed space-y-1">
                    <p>
                      El proveedor tiene un plazo máximo de <strong className="text-violet-400">10 días hábiles</strong> para entregar los informes finales.
                    </p>
                    <div className="inline-flex items-center gap-1 bg-violet-500/10 text-violet-400 rounded px-1.5 py-0.5 text-[9px] font-mono mt-1">
                      Fuente: Cláusula 4
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Simulated Input Area */}
          <div className="border-t border-zinc-900/60 pt-3 flex items-center gap-2">
            <div className="flex-1 bg-zinc-900/50 rounded-xl px-3 py-2 border border-zinc-800/60 text-[11px] text-zinc-600 flex items-center justify-between">
              <span>Haz una pregunta...</span>
              <Send className="h-3 w-3 text-zinc-700" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
