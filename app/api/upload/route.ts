import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getEmbeddings } from "@/lib/embeddings";
import { splitText } from "@/lib/textSplitter";

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
      const { parsePDF } = await import("@/lib/documentProcessor");
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

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Supabase environment variables are missing on the server. Please check your Vercel configuration." },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired session. Please log in again." },
        { status: 401 }
      );
    }
    const userId = user.id;

    const result = await supabase
      .from("documents")
      .select("name, created_at")
      .eq("user_id", userId);

    let data: { name: string; created_at?: string }[] | null = result.data as { name: string; created_at?: string }[] | null;
    const error = result.error;

    if (error) {
      const fallbackResult = await supabase
        .from("documents")
        .select("name")
        .eq("user_id", userId);
      
      if (fallbackResult.error) {
        return NextResponse.json(
          { error: fallbackResult.error.message },
          { status: 500 }
        );
      }
      data = fallbackResult.data as { name: string; created_at?: string }[] | null;
    }

    if (!data) {
      return NextResponse.json({ documents: [] });
    }

    const uniqueDocsMap = new Map<string, { id: string; name: string; uploadedAt: string; type: string; status: string }>();

    data.forEach((row: { name: string; created_at?: string }) => {
      if (!uniqueDocsMap.has(row.name)) {
        uniqueDocsMap.set(row.name, {
          id: row.name,
          name: row.name,
          uploadedAt: row.created_at || new Date().toISOString(),
          type: row.name.toLowerCase().endsWith(".pdf") ? "pdf" : "text",
          status: "ready"
        });
      }
    });

    return NextResponse.json({
      documents: Array.from(uniqueDocsMap.values())
    });
  } catch (error) {
    console.error("Error in GET /api/upload:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Supabase environment variables are missing on the server. Please check your Vercel configuration." },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired session. Please log in again." },
        { status: 401 }
      );
    }
    const userId = user.id;

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Document name is required." },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("name", name)
      .eq("user_id", userId);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully."
    });
  } catch (error) {
    console.error("Error in DELETE /api/upload:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
