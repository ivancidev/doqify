"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { useChat } from "@/features/chat/hooks/useChat";
import { ChatWindow } from "@/features/chat/components/ChatWindow";
import { ChatInput } from "@/features/chat/components/ChatInput";
import { Button, Spinner } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/I18nContext";

export default function ChatPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const { messages, isLoading, sendMessage, clearChat } = useChat();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#09090b]">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat header */}
      <div className="border-b border-[#27272a]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-sm font-semibold text-[#fafafa]">{t("chat.title")}</h1>
            <p className="text-xs text-[#a1a1aa]">{t("chat.subtitle")}</p>
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
              {t("chat.clearBtn")}
            </Button>
          )}
        </div>
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
