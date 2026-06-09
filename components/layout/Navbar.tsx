"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, MessageSquare, Zap, LogOut, User } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { Button } from "@heroui/react";

const navLinks = [
  { href: "/upload", label: "Subir", icon: FileText },
  { href: "/chat", label: "Chat", icon: MessageSquare },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[#fafafa] transition-opacity hover:opacity-80"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
            <Zap className="h-4 w-4 text-white" />
          </span>
          <span className="text-base font-semibold tracking-tight">doqify</span>
        </Link>

        {/* Nav links and auth status */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="flex items-center gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href || pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-violet-600/15 text-violet-400"
                          : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </Link>
                  );
                })}
              </div>
              <div className="h-4 w-px bg-zinc-800" />
            </>
          )}

          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-800" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs font-medium text-zinc-400 sm:inline-block max-w-[120px] truncate">
                {user.email}
              </span>
              <span title="Cerrar sesión">
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  onPress={signOut}
                  className="rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-red-400 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </span>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-850 hover:text-white"
            >
              <User className="h-3.5 w-3.5" />
              Ingresar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
