"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Sparkles } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useAuth } from "@/components/providers/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/upload");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

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
          },
        });
        if (signUpErr) throw signUpErr;
        setSuccessMessage("¡Cuenta creada! Revisa tu correo electrónico para confirmar tu registro.");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || "Ocurrió un error inesperado.");
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
    <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="w-full max-w-md rounded-3xl border border-zinc-800/80 bg-[#141419]/60 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-600/10 px-3 py-1 text-xs font-semibold text-violet-400">
            <Sparkles className="h-3 w-3" />
            Acceso seguro a doqify
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-zinc-50 tracking-tight">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {isLogin
              ? "Ingresa tus datos para acceder a tu panel"
              : "Registra tus credenciales para comenzar a chatear"}
          </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Correo electrónico
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-zinc-800 bg-[#0d0d11] pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Contraseña
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
            isDisabled={loading || !email.trim() || !password.trim()}
            isPending={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <Spinner size="sm" color="current" />
            ) : isLogin ? (
              <>
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Registrarse
              </>
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
              ? "¿No tienes una cuenta? Regístrate"
              : "¿Ya tienes una cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
