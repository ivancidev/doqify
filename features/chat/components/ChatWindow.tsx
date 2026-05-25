"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { EmptyChat } from "./EmptyChat";
import { Spinner } from "@heroui/react";
import { Bot } from "lucide-react";
import type { Message } from "../types";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSuggest: (text: string) => void;
}

export function ChatWindow({ messages, isLoading, onSuggest }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return <EmptyChat onSuggest={onSuggest} />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}

      {/* Indicador de carga */}
      {isLoading && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#27272a]">
            <Bot className="h-4 w-4 text-violet-400" />
          </div>
          <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-[#18181b] px-4 py-2.5">
            <Spinner size="sm" color="current" className="text-violet-400" />
            <span className="text-sm text-[#a1a1aa]">Analizando…</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
