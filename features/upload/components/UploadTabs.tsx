"use client";

import { Tabs, Spinner } from "@heroui/react";
import { DropZone } from "./DropZone";
import { TextInput } from "./TextInput";

interface UploadTabsProps {
  onFileUpload: (file: File) => void;
  onTextUpload: (text: string, name: string) => void;
  isUploading: boolean;
}

export function UploadTabs({ onFileUpload, onTextUpload, isUploading }: UploadTabsProps) {
  return (
    <Tabs defaultSelectedKey="pdf" className="w-full">
      <Tabs.ListContainer>
        <Tabs.List
          aria-label="Método de carga"
          className="*:data-[selected=true]:text-violet-400 *:text-[#a1a1aa] *:text-sm *:font-medium"
        >
          <Tabs.Tab id="pdf">
            Subir PDF
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Separator />
          <Tabs.Tab id="text">
            Pegar texto
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>

      <Tabs.Panel id="pdf" className="pt-5">
        <div className="flex flex-col gap-4">
          <DropZone onFileAccepted={onFileUpload} isUploading={isUploading} />
          {isUploading && (
            <div className="flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-600/10 px-4 py-3">
              <Spinner size="sm" color="current" className="text-violet-400" />
              <span className="text-sm text-violet-400">Procesando tu documento…</span>
            </div>
          )}
        </div>
      </Tabs.Panel>

      <Tabs.Panel id="text" className="pt-5">
        <TextInput onSubmit={onTextUpload} isUploading={isUploading} />
      </Tabs.Panel>
    </Tabs>
  );
}
