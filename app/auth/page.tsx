"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Spinner } from "@heroui/react";
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Zap, Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useAuth } from "@/components/providers/AuthContext";
import { useTranslation } from "@/lib/i18n/I18nContext";
import { DotGrid } from "@/features/landing/components/DotGrid";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    setMousePosition({ x: clientX - left, y: clientY - top });
  };

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/upload");
    }
  }, [user, authLoading, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { error: oauthErr } = await supabaseBrowser.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthErr) throw oauthErr;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || t("auth.unexpectedError"));
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    try {
      if (isLogin) {
        const { error: signInErr } = await supabaseBrowser.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (signInErr) throw signInErr;
        router.push("/upload");
      } else {
        const { error: signUpErr } = await supabaseBrowser.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: name.trim(),
            },
          },
        });
        if (signUpErr) throw signUpErr;
        setSuccessMessage(t("auth.accountCreated"));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || t("auth.unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#09090b]">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 overflow-hidden"
    >
      <DotGrid />

      {/* Mouse follow radial glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.08), transparent 85%)`,
          }}
        />
      )}

      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-zinc-800/80 bg-[#141419]/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/40 relative z-10"
      >
        {/* Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Zap className="h-4.5 w-4.5 text-white" />
            </span>
            <span className="text-xl font-semibold tracking-tight text-zinc-50">doqify</span>
          </Link>

          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full mt-4"
          >
            <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight">
              {isLogin ? t("auth.welcome") : t("auth.createAccount")}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {isLogin
                ? t("auth.welcomeDesc")
                : t("auth.createAccountDesc")}
            </p>
          </motion.div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <p className="text-xs font-medium text-red-400">{error}</p>
          </div>
        )}

        {/* Success banner */}
        {successMessage && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <Sparkles className="h-5 w-5 shrink-0 text-emerald-400" />
            <p className="text-xs font-medium text-emerald-400">{successMessage}</p>
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="mb-4">
          <Button
            type="button"
            onPress={handleGoogleSignIn}
            isDisabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-[#0d0d11]/80 hover:bg-[#141419] px-6 py-2.5 text-sm font-semibold text-zinc-200 transition-all duration-200 hover:border-zinc-700 active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
            <span>{t("auth.googleSignIn")}</span>
          </Button>
        </div>

        {/* Separator */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-zinc-800/80" />
          <span className="px-3 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
            {t("auth.or")}
          </span>
          <div className="flex-1 h-px bg-zinc-800/80" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {t("auth.name")}
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder={t("auth.namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-zinc-800 bg-[#0d0d11] pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 outline-none disabled:opacity-50 transition-all duration-200"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t("auth.email")}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-zinc-800 bg-[#0d0d11] pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t("auth.password")}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-zinc-800 bg-[#0d0d11] pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          <Button
            type="submit"
            isDisabled={loading || !email.trim() || !password.trim() || (!isLogin && !name.trim())}
            isPending={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <Spinner size="sm" color="current" />
            ) : (
              <motion.div
                key={isLogin ? "loginBtn" : "signupBtn"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center gap-2"
              >
                {isLogin ? (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>{t("auth.signIn")}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>{t("auth.signUp")}</span>
                  </>
                )}
              </motion.div>
            )}
          </Button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccessMessage(null);
            }}
            className="text-xs text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer outline-none bg-transparent border-none"
          >
            {isLogin
              ? t("auth.noAccount")
              : t("auth.hasAccount")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
