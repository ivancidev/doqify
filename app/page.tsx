"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Upload,
  MessageSquare,
  Zap,
  Search,
  FileCheck,
  User,
  ChevronDown,
  Brain,
  Cpu,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useTranslation } from "@/lib/i18n/I18nContext";
import { Spinner } from "@heroui/react";
import { motion, type Variants } from "motion/react";
import { SiSupabase, SiSupabaseHex } from "@icons-pack/react-simple-icons";
import { DotGrid } from "@/features/landing/components/DotGrid";
import { InteractiveDemo } from "@/features/landing/components/InteractiveDemo";

/* ─── Variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};


/* ─── Page ─── */
export default function HomePage() {
  const { user, loading } = useAuth();
  const { t, locale } = useTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    setMousePosition({ x: clientX - left, y: clientY - top });
  };

  const techStack = [
    {
      name: "Supabase",
      color: `#${SiSupabaseHex}`,
      icon: SiSupabase,
      label: t("home.tech.vector"),
    },
    {
      name: "Cohere",
      color: "#a78bfa",
      icon: Brain,
      label: t("home.tech.embeddings"),
    },
    {
      name: "Groq",
      color: "#F55036",
      icon: Cpu,
      label: t("home.tech.inference"),
    },
  ];

  const stats = [
    { value: "< 3s", label: t("home.stats.processing") },
    { value: locale === "es" ? "PDF + Texto" : "PDF + Text", label: t("home.stats.formats") },
    { value: locale === "es" ? "100% Privado" : "100% Private", label: t("home.stats.yourData") },
  ];

  const steps = [
    { num: "01", title: t("home.steps.upload.title"), desc: t("home.steps.upload.desc") },
    { num: "02", title: t("home.steps.ask.title"), desc: t("home.steps.ask.desc") },
    { num: "03", title: t("home.steps.get.title"), desc: t("home.steps.get.desc") },
  ];

  const features = [
    {
      icon: Upload,
      title: t("home.features.upload.title"),
      description: t("home.features.upload.desc"),
    },
    {
      icon: MessageSquare,
      title: t("home.features.chat.title"),
      description: t("home.features.chat.desc"),
    },
    {
      icon: Search,
      title: t("home.features.search.title"),
      description: t("home.features.search.desc"),
    },
    {
      icon: FileCheck,
      title: t("home.features.answers.title"),
      description: t("home.features.answers.desc"),
    },
  ];

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Orbs */}
      <div
        className="animate-float-orb-1 absolute -top-32 left-1/2 -translate-x-[55%] w-[700px] h-[700px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
        }}
      />
      <div
        className="animate-float-orb-2 absolute top-[25%] right-[-120px] w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* ═══════════════════════════════
          HERO
      ═══════════════════════════════ */}
      <section
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex sm:flex-1 flex-col items-center justify-start sm:justify-center gap-0 px-6 pt-12 pb-16 text-center sm:pt-28 sm:pb-20 md:pt-40 md:pb-28 overflow-hidden"
      >
        <DotGrid />

        {/* Interactive Radial Glow */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.1), transparent 80%)`,
            }}
          />
        )}

        <motion.div
          className="flex flex-col items-center gap-8 w-full"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Headline */}
          <motion.div variants={fadeUp} className="max-w-4xl space-y-6">
            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight min-[400px]:text-5xl sm:text-6xl md:text-7xl">
              <span
                style={{
                  background: "linear-gradient(135deg, #fafafa 0%, #d4d4d8 55%, #a1a1aa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("home.title1")}
              </span>{" "}
              <span className="shimmer-text">
                {t("home.title2")}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl leading-relaxed">
              {t("home.subtitle")}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 pt-2 w-full max-w-sm sm:max-w-none px-4 sm:px-0"
          >
            {loading ? (
              <Spinner size="sm" color="accent" />
            ) : user ? (
              <>
                <Link
                  href="/upload"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-violet-600 px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto"
                >
                  <Upload className="h-5 w-5" />
                  {t("home.uploadDoc")}
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-zinc-600 bg-zinc-800/70 px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-zinc-100 shadow-sm transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-700/80 hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto"
                >
                  <MessageSquare className="h-5 w-5" />
                  {t("home.goToChat")}
                  <ArrowRight className="h-5 w-5 text-zinc-400" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-violet-600 px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto"
                >
                  <Zap className="h-5 w-5" />
                  {t("home.startFree")}
                  <ArrowRight className="h-5 w-5 text-violet-200" />
                </Link>
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-zinc-600 bg-zinc-800/70 px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-zinc-100 shadow-sm transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-700/80 hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto"
                >
                  <User className="h-5 w-5" />
                  {t("home.login")}
                </Link>
              </>
            )}
          </motion.div>

          {/* Interactive Demo */}
          <InteractiveDemo />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            {t("home.seeMore")}
          </span>
          <ChevronDown className="animate-bounce-soft h-5 w-5 text-zinc-600" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════
          POWERED BY
      ═══════════════════════════════ */}
      <section className="border-t border-zinc-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-600">
              {t("home.poweredBy")}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {techStack.map(({ name, color, icon: Icon, label }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col items-center gap-5 rounded-2xl border border-zinc-800/70 bg-zinc-900/20 px-8 py-10 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40 hover:-translate-y-1"
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-300 group-hover:scale-110"
                  style={{ boxShadow: `0 0 30px ${color}18` }}
                >
                  <Icon className="h-8 w-8" style={{ color }} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-zinc-100">{name}</p>
                  <p className="mt-1 text-sm text-zinc-500">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════
          STATS
      ═══════════════════════════════ */}
      <section className="border-t border-zinc-900 px-6 py-20 md:py-28 bg-[#0a0a0e]/60">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/10 px-6 py-8 sm:px-8 sm:py-10 text-center backdrop-blur-sm"
              >
                <span className="text-4xl font-extrabold tracking-tight text-violet-400 sm:text-5xl">
                  {value}
                </span>
                <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          CÓMO FUNCIONA
      ═══════════════════════════════ */}
      <section className="border-t border-zinc-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">
              {t("home.howItWorks")}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-zinc-100 sm:text-4xl">
              {t("home.threeSteps")}
            </h2>
          </motion.div>

          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:gap-0">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className="flex flex-1 flex-col items-center sm:flex-row">
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.15 }}
                  className="flex flex-1 flex-col items-center gap-4 rounded-2xl border border-zinc-800/70 bg-zinc-900/20 px-6 py-8 sm:px-8 sm:py-10 text-center backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900/30 hover:-translate-y-1"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-600/10 text-xl font-black text-violet-400">
                    {num}
                  </span>
                  <div>
                    <p className="text-xl font-bold text-zinc-100">{title}</p>
                    <p className="mt-1.5 text-sm text-zinc-500">{desc}</p>
                  </div>
                </motion.div>

                {/* Desktop arrow */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.3 }}
                    style={{ transformOrigin: "left" }}
                    className="hidden sm:flex items-center justify-center w-12 shrink-0 mt-0"
                  >
                    <ArrowRight className="h-5 w-5 text-zinc-700" />
                  </motion.div>
                )}
                {/* Mobile divider */}
                {i < steps.length - 1 && (
                  <div className="sm:hidden flex flex-col items-center py-2">
                    <div className="w-px h-6 bg-zinc-800" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          FEATURES
      ═══════════════════════════════ */}
      <section className="border-t border-zinc-900 bg-[#0a0a0e]/60 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">
              {t("home.features.label")}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-zinc-100 sm:text-4xl">
              {t("home.features.title")}
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 rounded-2xl border border-zinc-800/70 bg-zinc-900/10 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900/20 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(124,58,237,0.05)]"
              >
                <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/10 group-hover:bg-violet-600/20 group-hover:border-violet-500/25 group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">{title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          FINAL CTA
      ═══════════════════════════════ */}
      <section className="border-t border-zinc-900 px-6 py-20 md:py-28 relative overflow-hidden">
        {/* Glow Orb in background */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-violet-500/20 bg-zinc-900/20 px-6 py-12 sm:px-16 text-center backdrop-blur-md overflow-hidden shadow-2xl shadow-violet-500/5 sm:py-16"
          >
            {/* Grid overlay */}
            <DotGrid />

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight text-white">
                {t("home.cta.title")}
              </h2>
              <p className="text-base text-zinc-400 sm:text-lg leading-relaxed">
                {t("home.cta.desc")}
              </p>
              <div className="flex justify-center pt-4 w-full max-w-xs mx-auto">
                {loading ? (
                  <Spinner size="sm" color="accent" />
                ) : user ? (
                  <Link
                    href="/upload"
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-violet-600 px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-[0.98] w-full"
                  >
                    <Upload className="h-5 w-5" />
                    {t("home.uploadDoc")}
                  </Link>
                ) : (
                  <Link
                    href="/auth"
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-violet-600 px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-[0.98] w-full"
                  >
                    <Zap className="h-5 w-5" />
                    {t("home.startFree")}
                    <ArrowRight className="h-5 w-5 text-violet-200" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════
          FOOTER
      ═══════════════════════════════ */}
      <footer className="border-t border-zinc-900 bg-[#09090b] px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-xs text-zinc-600 font-medium text-center sm:text-left">
            {t("home.footer.rights", { year: new Date().getFullYear() })}
          </span>
          <span className="text-xs text-zinc-600 font-medium text-center sm:text-left max-w-xs sm:max-w-none">
            {t("home.footer.secure")}
          </span>
        </div>
      </footer>
    </div>
  );
}
