import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getEmbeddings } from "@/lib/embeddings";
import { getGroqChatCompletion, GroqMessage } from "@/lib/groq";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Supabase environment variables are missing on the server. Please check your configuration." },
        { status: 500 }
      );
    }

    const { question } = await request.json();

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    // 1. Generate the embedding for the user's query
    // Use 'search_query' type as recommended by Cohere for retrieval
    const queryEmbeddings = await getEmbeddings([question], "search_query");
    
    if (!queryEmbeddings || queryEmbeddings.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate query embeddings." },
        { status: 500 }
      );
    }

    const queryEmbedding = queryEmbeddings[0];

    // 2. Perform vector similarity search in Supabase using the match_documents RPC function
    interface MatchedDoc {
      name: string;
      content: string;
    }

    const { data: matchedDocsData, error: matchError } = await supabase.rpc(
      "match_documents",
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.2, // cosine similarity threshold
        match_count: 5,        // retrieve top 5 matching blocks
      }
    );

    if (matchError) {
      console.error("Supabase RPC match error:", matchError);
      return NextResponse.json(
        { error: "Failed to search document context." },
        { status: 500 }
      );
    }

    const matchedDocs = (matchedDocsData || []) as MatchedDoc[];

    // 3. Construct the RAG context string
    const hasContext = matchedDocs.length > 0;
    const contextText = hasContext
      ? matchedDocs
          .map((doc: MatchedDoc) => `[Archivo: ${doc.name}]\n${doc.content}`)
          .join("\n\n---\n\n")
      : "No relevant content found in the documents.";

    // 4. Construct the prompt messages for Groq
    const systemPrompt = `Eres "doqify", un asistente inteligente de documentos basado en RAG (Generación Aumentada por Recuperación).
Tu objetivo es responder de forma clara, directa y precisa a la pregunta del usuario utilizando EXCLUSIVAMENTE el CONTEXTO proporcionado.

Instrucciones:
1. Responde basándote en la información que se te da.
2. Si el CONTEXTO no contiene información suficiente para responder, dilo de forma amable: "No encuentro esa información en los documentos cargados actualmente." pero proporciona una respuesta útil basándote en tus conocimientos generales si es relevante, aclarando explícitamente qué parte es conocimiento general y no está en los documentos.
3. Menciona siempre el nombre del archivo de origen de donde sacaste la información (ej. "Según el documento [nombre_archivo.pdf]...").
4. Responde en el mismo idioma en el que se formuló la pregunta (usualmente español).

CONTEXTO DE DOCUMENTOS:
${contextText}`;

    const messages: GroqMessage[] = [
      { role: "system", content: systemPrompt },
      { role: roleAdapter("user"), content: question }
    ];

    // 5. Query Groq for the completion
    const answer = await getGroqChatCompletion(messages);

    // 6. Extract unique file names that served as sources
    const sources = hasContext
      ? (Array.from(new Set(matchedDocs.map((doc: MatchedDoc) => doc.name))) as string[])
      : [];

    return NextResponse.json({
      answer: answer || "No he podido formular una respuesta.",
      sources,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during processing.";
    console.error("Error in /api/chat route:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Helper to cast user role safely
function roleAdapter(role: string): "system" | "user" | "assistant" {
  if (role === "system" || role === "user" || role === "assistant") {
    return role;
  }
  return "user";
}
