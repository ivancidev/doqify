"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button, Spinner } from "@heroui/react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/I18nContext";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="border-t border-[#27272a] bg-[#09090b] px-4 py-4">
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <div className="flex flex-1 items-end gap-2 rounded-xl border border-[#27272a] bg-[#18181b] px-3 py-2 transition-colors focus-within:border-violet-500/50">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t("chatinput.placeholder")}
            disabled={isLoading}
            className={cn(
              "flex-1 resize-none bg-transparent text-sm text-[#fafafa] placeholder:text-[#a1a1aa] focus:outline-none disabled:opacity-50",
              "max-h-40 overflow-y-auto py-0.5"
            )}
          />
        </div>

        <Button
          isIconOnly
          onPress={handleSend}
          isDisabled={!value.trim() || isLoading}
          isPending={isLoading}
          className={cn(
            "h-10 w-10 shrink-0 rounded-xl transition-all",
            value.trim() && !isLoading
              ? "bg-violet-600 text-white hover:bg-violet-700"
              : "bg-[#27272a] text-[#a1a1aa]"
          )}
        >
          {({ isPending }) =>
            isPending ? (
              <Spinner size="sm" color="current" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )
          }
        </Button>
      </div>

      <p className="mt-2 text-center text-xs text-[#a1a1aa]">
        {t("chatinput.footer")}
      </p>
    </div>
  );
}
