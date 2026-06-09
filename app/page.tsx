"use client";

import Link from "next/link";
import { ArrowRight, Upload, MessageSquare, Zap, Search, FileCheck, User } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { Spinner } from "@heroui/react";

const features = [
  {
    icon: Upload,
    title: "Sube cualquier documento",
    description: "Arrastra y suelta PDFs o pega texto directamente. Se procesa y fragmenta de forma automática.",
  },
  {
    icon: MessageSquare,
    title: "Chatea con tus documentos",
    description: "Haz preguntas en lenguaje natural y obtén respuestas precisas basadas en tu contenido en tiempo real.",
  },
  {
    icon: Search,
    title: "Búsqueda inteligente",
    description: "El motor vectorial analiza el contenido completo y encuentra el contexto exacto al instante.",
  },
  {
    icon: FileCheck,
    title: "Respuestas en contexto",
    description: "Respuestas directas generadas exclusivamente a partir de las fuentes que tú mismo cargues.",
  },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Premium background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/10 via-indigo-950/5 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-fuchsia-600/5 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-28 text-center md:py-36">
        {/* Decorative Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/25 bg-violet-600/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-violet-400 shadow-sm shadow-violet-500/5 animate-fade-in">
          <Zap className="h-3 w-3" />
          Asistente inteligente de documentos RAG
        </span>

        {/* Headline */}
        <div className="flex flex-col gap-6 max-w-4xl">
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-zinc-50 sm:text-6xl">
            Tu asistente que entiende{" "}
            <span className="text-violet-500">
              cada palabra de tus documentos
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-zinc-400 sm:text-lg">
            Sube cualquier PDF o texto y obtén respuestas precisas al instante, sin tener que leer página por página. Impulsado por Supabase, Cohere y Groq.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 min-h-[52px] items-center">
          {loading ? (
            <Spinner size="sm" color="accent" />
          ) : user ? (
            <>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-500/10 transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98] cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                Subir documento
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#0d0d11]/80 px-7 py-3.5 text-sm font-semibold text-zinc-200 shadow-sm transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900 active:scale-[0.98] cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                Ir al chat
                <ArrowRight className="h-4 w-4 text-zinc-500" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-500/10 transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98] cursor-pointer"
              >
                <Zap className="h-4 w-4" />
                Comenzar gratis
                <ArrowRight className="h-4 w-4 text-violet-200" />
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#0d0d11]/80 px-7 py-3.5 text-sm font-semibold text-zinc-200 shadow-sm transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900 active:scale-[0.98] cursor-pointer"
              >
                <User className="h-4 w-4" />
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-zinc-900 bg-[#0d0d11]/40 px-4 py-20 backdrop-blur-xs">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Características</span>
            <h2 className="mt-2 text-2xl font-bold text-zinc-100 sm:text-3xl">
              Todo lo que necesitas
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 p-6 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900/20 hover:-translate-y-0.5 shadow-sm group hover:shadow-[0_10px_30px_rgba(124,58,237,0.02)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/10 group-hover:bg-violet-600/20 group-hover:border-violet-500/25 group-hover:scale-105 transition-all duration-300">
                  <Icon className="h-5.5 w-5.5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200 group-hover:text-zinc-100 transition-colors">{title}</h3>
                  <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#09090b] px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-xs text-zinc-500 font-medium">
            © {new Date().getFullYear()} doqify · Todos los derechos reservados
          </span>
          <span className="text-xs text-zinc-500 font-medium">
            Consulta tus documentos de forma segura e inteligente
          </span>
        </div>
      </footer>
    </div>
  );
}
