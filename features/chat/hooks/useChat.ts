"use client";

import { useState } from "react";
import { queryDocuments } from "@/lib/n8n";
import type { Message } from "../types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const result = await queryDocuments(content);

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: result.answer,
      timestamp: new Date(),
      sources: result.sources,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const clearChat = () => setMessages([]);

  return { messages, isLoading, sendMessage, clearChat };
}
