import Link from "next/link";
import { ArrowRight, Upload, MessageSquare, Zap, Search, FileCheck } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Sube cualquier documento",
    description: "Arrastra y suelta PDFs o pega texto directamente. Se procesa de forma automática.",
  },
  {
    icon: MessageSquare,
    title: "Chatea con tus documentos",
    description: "Haz preguntas en lenguaje natural y obtén respuestas precisas basadas en tu contenido.",
  },
  {
    icon: Search,
    title: "Búsqueda inteligente",
    description: "El sistema analiza el contenido completo y encuentra exactamente lo que necesitas.",
  },
  {
    icon: FileCheck,
    title: "Respuestas en contexto",
    description: "Las respuestas se generan únicamente a partir de los documentos que hayas cargado.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-600/10 px-3 py-1 text-xs font-medium text-violet-400">
          <Zap className="h-3 w-3" />
          Asistente inteligente de documentos
        </span>

        {/* Headline */}
        <div className="flex flex-col gap-4">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#fafafa] sm:text-5xl">
            Tu asistente que entiende{" "}
            <span className="bg-linear-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              cada palabra de tus documentos
            </span>
          </h1>
          <p className="mx-auto max-w-lg text-base text-[#a1a1aa] sm:text-lg">
            Sube cualquier PDF o texto y obtén respuestas precisas al instante,
            sin tener que leer página por página.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-600/25"
          >
            <Upload className="h-4 w-4" />
            Subir documento
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl border border-[#27272a] bg-[#18181b] px-6 py-3 text-sm font-semibold text-[#fafafa] transition-colors hover:border-violet-500/50 hover:bg-violet-600/10"
          >
            <MessageSquare className="h-4 w-4" />
            Ir al chat
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#27272a] bg-[#18181b]/50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-[#fafafa]">
            Todo lo que necesitas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-[#27272a] bg-[#18181b] p-5 transition-colors hover:border-violet-500/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600/15">
                  <Icon className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#fafafa]">{title}</h3>
                  <p className="mt-1 text-sm text-[#a1a1aa]">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#27272a] px-4 py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 sm:flex-row">
          <span className="text-xs text-[#a1a1aa]">
            © {new Date().getFullYear()} doqify · Todos los derechos reservados
          </span>
          <span className="text-xs text-[#a1a1aa]">
            Consulta tus documentos de forma segura e inteligente
          </span>
        </div>
      </footer>
    </div>
  );
}
