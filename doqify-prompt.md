# doqify — Build Prompt for Claude Code / Cursor

## Project Overview

**doqify** is a RAG-powered document assistant. Users upload any document (PDF or plain text) from a web panel and can query it via the web chat or WhatsApp/Telegram. The app has NO custom backend — all logic runs through n8n webhooks.

**Stack:**
- Next.js 15 (App Router, TypeScript, Tailwind CSS v4)
- HeroUI v3 (`@heroui/react` + `@heroui/styles`) for UI components
- n8n as backend (webhooks for upload + query)
- Supabase pgvector (handled by n8n, not this frontend)
- OpenAI (handled by n8n, not this frontend)

---

## Step 1 — Install dependencies

Run these commands inside the `doqify` project:

```bash
pnpm add @heroui/react @heroui/styles
pnpm add react-dropzone
pnpm add framer-motion
```

---

## Step 2 — Configure HeroUI in layout

Update `src/app/layout.tsx` to wrap with `HeroUIProvider`:

```tsx
import type { Metadata } from "next";
import { HeroUIProvider } from "@heroui/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "doqify — Ask your documents anything",
  description: "Upload any document and query it from the web or WhatsApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </body>
    </html>
  );
}
```

---

## Step 3 — Color theme

Use HeroUI dark theme. The primary color is **violet**. Add this to `globals.css`:

```css
@import "@heroui/styles";

:root {
  --color-primary: #7C3AED;
  --color-primary-foreground: #ffffff;
}
```

Color reference used throughout the app:
- Background: `#09090b` (zinc-950)
- Surface cards: `#18181b` (zinc-900)
- Border: `#27272a` (zinc-800)
- Primary: Violet `#7C3AED`
- Text primary: `#fafafa`
- Text muted: `#a1a1aa`
- Success: `#10b981` (emerald-500)
- Error: `#ef4444`

---

## Step 4 — Environment variables

Create `.env.local` at the root with these placeholders (user will fill these in):

```env
# n8n webhook — receives file upload (PDF or text), processes embeddings, saves to Supabase
NEXT_PUBLIC_N8N_UPLOAD_URL=https://YOUR_N8N_URL/webhook/doqify-upload

# n8n webhook — receives a question, queries Supabase vector store, returns AI answer
NEXT_PUBLIC_N8N_QUERY_URL=https://YOUR_N8N_URL/webhook/doqify-query
```

---

## Step 5 — Project structure to create

```
src/
├── app/
│   ├── layout.tsx              ✅ done above
│   ├── globals.css             ✅ done above
│   ├── page.tsx                → Home/landing page
│   ├── upload/
│   │   └── page.tsx            → Upload panel page
│   └── chat/
│       └── page.tsx            → Chat page
├── features/
│   ├── upload/
│   │   ├── components/
│   │   │   ├── DropZone.tsx    → Drag & drop PDF upload area
│   │   │   ├── TextInput.tsx   → Paste plain text option
│   │   │   ├── DocumentList.tsx→ List of uploaded docs with delete
│   │   │   └── UploadTabs.tsx  → Tabs to switch between PDF / Text
│   │   ├── hooks/
│   │   │   └── useUpload.ts    → Upload logic, calls n8n webhook
│   │   └── types.ts
│   └── chat/
│       ├── components/
│       │   ├── ChatWindow.tsx  → Messages list
│       │   ├── ChatMessage.tsx → Single message bubble (user/bot)
│       │   ├── ChatInput.tsx   → Input + send button
│       │   └── EmptyChat.tsx   → Empty state with suggestions
│       ├── hooks/
│       │   └── useChat.ts      → Chat logic, calls n8n query webhook
│       └── types.ts
├��─ components/
│   └── layout/
│       └── Navbar.tsx          → Top navigation bar
└── lib/
    └── n8n.ts                  → Centralized webhook call functions
```

---

## Step 6 — lib/n8n.ts

```typescript
// src/lib/n8n.ts
// All communication with n8n webhooks

const UPLOAD_URL = process.env.NEXT_PUBLIC_N8N_UPLOAD_URL!;
const QUERY_URL = process.env.NEXT_PUBLIC_N8N_QUERY_URL!;

export interface UploadResponse {
  success: boolean;
  documentId?: string;
  documentName?: string;
  error?: string;
}

export interface QueryResponse {
  answer: string;
  sources?: string[];
  error?: string;
}

/**
 * Upload a PDF file to n8n for processing
 * n8n will extract text, create embeddings, and save to Supabase
 */
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);

  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    return { success: false, error: "Upload failed" };
  }

  const data = await res.json();
  return { success: true, ...data };
}

/**
 * Upload plain text to n8n for processing
 */
export async function uploadText(text: string, name: string): Promise<UploadResponse> {
  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, name }),
  });

  if (!res.ok) {
    return { success: false, error: "Upload failed" };
  }

  const data = await res.json();
  return { success: true, ...data };
}

/**
 * Send a question to n8n — it will query Supabase and return an AI answer
 */
export async function queryDocuments(question: string): Promise<QueryResponse> {
  const res = await fetch(QUERY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    return { answer: "Error connecting to the AI. Please try again." };
  }

  const data = await res.json();
  return { answer: data.answer || data.text || data.response, sources: data.sources };
}
```

---

## Step 7 — features/upload/types.ts

```typescript
export interface UploadedDocument {
  id: string;
  name: string;
  uploadedAt: Date;
  type: "pdf" | "text";
  status: "uploading" | "ready" | "error";
}
```

---

## Step 8 — features/upload/hooks/useUpload.ts

```typescript
import { useState } from "react";
import { uploadDocument, uploadText } from "@/lib/n8n";
import type { UploadedDocument } from "../types";

export function useUpload() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const tempDoc: UploadedDocument = {
      id: crypto.randomUUID(),
      name: file.name,
      uploadedAt: new Date(),
      type: "pdf",
      status: "uploading",
    };

    setDocuments((prev) => [...prev, tempDoc]);

    const result = await uploadDocument(file);

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === tempDoc.id
          ? { ...doc, status: result.success ? "ready" : "error" }
          : doc
      )
    );

    if (!result.success) setError(result.error || "Upload failed");
    setIsUploading(false);
  };

  const handleTextUpload = async (text: string, name: string) => {
    if (!text.trim() || !name.trim()) return;
    setIsUploading(true);
    setError(null);

    const tempDoc: UploadedDocument = {
      id: crypto.randomUUID(),
      name,
      uploadedAt: new Date(),
      type: "text",
      status: "uploading",
    };

    setDocuments((prev) => [...prev, tempDoc]);

    const result = await uploadText(text, name);

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === tempDoc.id
          ? { ...doc, status: result.success ? "ready" : "error" }
          : doc
      )
    );

    if (!result.success) setError(result.error || "Upload failed");
    setIsUploading(false);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return { documents, isUploading, error, handleFileUpload, handleTextUpload, removeDocument };
}
```

---

## Step 9 — features/chat/types.ts

```typescript
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}
```

---

## Step 10 — features/chat/hooks/useChat.ts

```typescript
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
```

---

## Step 11 — Build all UI components

### Navbar.tsx
Clean top navigation with logo "doqify" on the left and two nav links: "Upload" and "Chat". Dark background, violet accent on active link.

### DropZone.tsx
Drag & drop area using `react-dropzone`. Shows dashed border, cloud upload icon, "Drop your PDF here or click to browse" text. When dragging over, highlight with violet border. Only accept PDF files. On upload show file name and progress.

### TextInput.tsx
Two inputs: one for the document name, one textarea for pasting text content. A submit button below.

### UploadTabs.tsx
Tabs component (HeroUI Tabs) to switch between "Upload PDF" and "Paste Text" tabs. Contains DropZone and TextInput respectively.

### DocumentList.tsx
List of uploaded documents. Each row shows: file icon (pdf/text), document name, upload date, status badge (uploading/ready/error), and a delete button. Empty state shows "No documents yet. Upload one to get started."

### ChatMessage.tsx
Message bubble. User messages aligned right with violet background. Assistant messages aligned left with zinc-800 background. Show timestamp below. If sources exist, show them as small chips below the assistant message.

### ChatWindow.tsx
Scrollable container of ChatMessage components. Auto-scrolls to bottom on new message. Shows EmptyChat when no messages.

### EmptyChat.tsx
Centered empty state with a sparkles icon, "Ask anything about your documents" title, and 3 suggestion chips the user can click (e.g. "Summarize my document", "What are the key points?", "What skills do I have?"). Clicking a chip sends that message.

### ChatInput.tsx
Fixed bottom input area with a text input and a send button (violet). Disabled when isLoading. Shows a pulsing indicator when loading.

---

## Step 12 — Pages

### src/app/page.tsx (Home)
Simple landing with:
- Large heading: "Ask anything about your documents"
- Subtitle: "Upload any PDF or text, query it from the web or WhatsApp"
- Two CTA buttons: "Upload a document" → /upload, "Start chatting" → /chat
- Dark background, centered content

### src/app/upload/page.tsx
```tsx
import { UploadTabs } from "@/features/upload/components/UploadTabs";
import { DocumentList } from "@/features/upload/components/DocumentList";
// Compose the upload page using UploadTabs + DocumentList
// Show UploadTabs on top, DocumentList below
// Use useUpload hook to connect them
```

### src/app/chat/page.tsx
```tsx
import { ChatWindow } from "@/features/chat/components/ChatWindow";
import { ChatInput } from "@/features/chat/components/ChatInput";
// Full height chat layout
// ChatWindow takes available height, ChatInput sticks to bottom
// Use useChat hook
```

---

## Step 13 — Important notes for the editor

1. Use HeroUI components wherever possible: `Button`, `Input`, `Textarea`, `Tabs`, `Tab`, `Badge`, `Card`, `Spinner`, `Chip`
2. All components must be `"use client"` since they use hooks and state
3. Keep pages as Server Components — only import Client Components inside them
4. Use `cn()` from `tailwind-merge` + `clsx` for conditional classes
5. The app uses dark theme throughout — `bg-zinc-950` base, `bg-zinc-900` for cards
6. Violet is the primary color — use `bg-violet-600`, `text-violet-400`, `border-violet-500`
7. All API calls go through `src/lib/n8n.ts` — never call fetch directly in components
8. No backend routes needed (`/api/*`) — everything calls n8n webhooks directly

---

## What the user will configure after build

Once everything is built, the user only needs to fill in `.env.local`:

```env
NEXT_PUBLIC_N8N_UPLOAD_URL=https://their-n8n-url/webhook/doqify-upload
NEXT_PUBLIC_N8N_QUERY_URL=https://their-n8n-url/webhook/doqify-query
```

That's it. No other configuration needed.
