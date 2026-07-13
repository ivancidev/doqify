"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@heroui/react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    // Listen for auth state changes. When code is exchanged for a session, redirect.
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/upload");
      } else if (event === "SIGNED_OUT") {
        router.replace("/auth");
      }
    });

    // Also directly verify if a session is already present
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/upload");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, code]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" color="accent" />
      <p className="text-sm text-zinc-400">Completing sign in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#09090b]">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" color="accent" />
            <p className="text-sm text-zinc-400">Loading auth context...</p>
          </div>
        }
      >
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
