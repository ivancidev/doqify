"use client";

import { Tabs, Spinner } from "@heroui/react";
import { DropZone } from "./DropZone";
import { TextInput } from "./TextInput";
import { useTranslation } from "@/lib/i18n/I18nContext";

interface UploadTabsProps {
  onFileUpload: (file: File) => void;
  onTextUpload: (text: string, name: string) => void;
  isUploading: boolean;
}

export function UploadTabs({ onFileUpload, onTextUpload, isUploading }: UploadTabsProps) {
  const { t } = useTranslation();
  return (
    <Tabs defaultSelectedKey="pdf" variant="secondary" className="w-full">
      <Tabs.ListContainer>
        <Tabs.List
          aria-label={t("upload.tabs.ariaLabel")}
          className="border-b border-zinc-800/60 pb-px flex gap-6 text-sm font-semibold"
        >
          <Tabs.Tab 
            id="pdf"
            className="pb-3 text-zinc-400 data-[selected=true]:text-zinc-100 cursor-pointer outline-none transition-colors"
          >
            {t("upload.tabs.pdf")}
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab 
            id="text"
            className="pb-3 text-zinc-400 data-[selected=true]:text-zinc-100 cursor-pointer outline-none transition-colors"
          >
            {t("upload.tabs.text")}
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>

      <Tabs.Panel id="pdf" className="pt-6">
        <div className="flex flex-col gap-4">
          <DropZone onFileAccepted={onFileUpload} isUploading={isUploading} />
          {isUploading && (
            <div className="flex items-center gap-3.5 rounded-2xl border border-violet-500/20 bg-violet-600/5 px-5 py-4 shadow-[0_0_30px_rgba(124,58,237,0.06)] animate-pulse">
              <Spinner size="sm" color="accent" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-violet-200">{t("upload.processing")}</span>
                <span className="text-xs text-violet-400/85">{t("upload.processingDesc")}</span>
              </div>
            </div>
          )}
        </div>
      </Tabs.Panel>

      <Tabs.Panel id="text" className="pt-6">
        <TextInput onSubmit={onTextUpload} isUploading={isUploading} />
      </Tabs.Panel>
    </Tabs>
  );
}
