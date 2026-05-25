"use client";

import { useChat } from "@/features/chat/hooks/useChat";
import { ChatWindow } from "@/features/chat/components/ChatWindow";
import { ChatInput } from "@/features/chat/components/ChatInput";
import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";

export default function ChatPage() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-[#27272a] px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-sm font-semibold text-[#fafafa]">Chat de documentos</h1>
          <p className="text-xs text-[#a1a1aa]">Las respuestas se generan a partir de tus documentos</p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onPress={clearChat}
            isDisabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[#a1a1aa] transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Limpiar conversación
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSuggest={sendMessage}
        />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
