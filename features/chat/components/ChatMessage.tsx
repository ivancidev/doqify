"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import type { Message } from "../types";
import { useTranslation } from "@/lib/i18n/I18nContext";

interface ChatMessageProps {
  message: Message;
}

function formatTime(date: Date | string | number, locale: string) {
  const parsedDate = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { locale } = useTranslation();
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-violet-600" : "bg-[#27272a]"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-violet-400" />
        )}
      </div>

      {/* Burbuja + meta */}
      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-sm bg-violet-600 text-white"
              : "rounded-tl-sm bg-[#18181b] text-[#fafafa]"
          )}
        >
          {message.content}
        </div>

        {/* Fuentes */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {message.sources.map((source, i) => (
              <span
                key={i}
                className="rounded-full border border-[#27272a] bg-[#18181b] px-2 py-0.5 text-xs text-[#a1a1aa]"
              >
                {source}
              </span>
            ))}
          </div>
        )}

        {/* Hora */}
        <span className="text-xs text-[#a1a1aa]">{formatTime(message.timestamp, locale)}</span>
      </div>
    </div>
  );
}
