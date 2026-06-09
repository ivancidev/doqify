import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getEmbeddings } from "@/lib/embeddings";
import { parsePDF, splitText } from "@/lib/documentProcessor";

// Enforce standard Node.js runtime because pdf-parse needs Node FS/Buffer APIs
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { success: false, error: "Supabase environment variables are missing on the server. Please check your configuration." },
        { status: 500 }
      );
    }

    // Authenticate user via Authorization Bearer token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session. Please log in again." },
        { status: 401 }
      );
    }
    const userId = user.id;

    let text = "";
    let name = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided" },
          { status: 400 }
        );
      }
      name = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      text = await parsePDF(buffer);
    } else {
      // JSON payload for pasted text
      const body = await request.json();
      text = body.text;
      name = body.name;
    }

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "The document contains no readable text." },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Document name is required." },
        { status: 400 }
      );
    }

    // Split text into overlapping chunks
    const chunks = splitText(text);

    if (chunks.length === 0) {
      return NextResponse.json(
        { success: false, error: "Could not split the document into valid text chunks." },
        { status: 400 }
      );
    }

    // Generate embeddings in batches of 90 to stay safe within Cohere limits
    const embeddings: number[][] = [];
    const batchSize = 90;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchEmbeddings = await getEmbeddings(batch, "search_document");
      embeddings.push(...batchEmbeddings);
    }

    if (embeddings.length !== chunks.length) {
      return NextResponse.json(
        { success: false, error: "Mismatched embeddings count. Processing failed." },
        { status: 500 }
      );
    }

    // Overwrite behavior: Delete existing document chunks with the same name and user_id
    // to avoid duplicate search results.
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("name", name)
      .eq("user_id", userId);

    if (deleteError) {
      console.warn("Could not delete old chunks (non-blocking):", deleteError.message, deleteError.details);
    }

    // Insert new chunks
    const records = chunks.map((chunk, index) => ({
      name,
      content: chunk,
      embedding: embeddings[index],
      user_id: userId,
    }));

    const { error: insertError } = await supabase
      .from("documents")
      .insert(records);

    if (insertError) {
      console.error("Supabase insert error:", insertError.message, insertError.details, insertError.hint);
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to store document: ${insertError.message}. Details: ${insertError.details || 'None'}. Hint: ${insertError.hint || 'None'}` 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documentName: name,
      chunksCount: chunks.length,
      message: "Document uploaded, processed, and indexed successfully.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during processing.";
    console.error("Error in /api/upload route:", error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
