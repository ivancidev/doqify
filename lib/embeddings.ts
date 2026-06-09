const COHERE_API_KEY = process.env.COHERE_API_KEY;

export interface EmbedResponse {
  embeddings: number[][];
  texts: string[];
}

/**
 * Generates embeddings for a list of texts using the Cohere API.
 * Uses the high-performance 'embed-multilingual-v3.0' model (1024 dimensions).
 * 
 * @param texts Array of text strings to embed.
 * @param inputType 'search_document' for chunking documents, 'search_query' for user questions.
 */
export async function getEmbeddings(
  texts: string[],
  inputType: "search_document" | "search_query" = "search_document"
): Promise<number[][]> {
  if (!COHERE_API_KEY) {
    throw new Error("COHERE_API_KEY is not defined in environment variables");
  }

  if (texts.length === 0) {
    return [];
  }

  try {
    const response = await fetch("https://api.cohere.com/v1/embed", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texts,
        model: "embed-multilingual-v3.0",
        input_type: inputType,
        embedding_types: ["float"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Cohere API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    // In Cohere v3, the response structure under embedding_types is:
    // data.embeddings.float or data.embeddings if embedding_types is specified or not.
    // If we specify embedding_types: ["float"], the response has:
    // embeddings: { float: [[...], [...]] }
    if (data.embeddings && data.embeddings.float) {
      return data.embeddings.float;
    } else if (Array.isArray(data.embeddings)) {
      return data.embeddings;
    }

    throw new Error("Invalid response structure from Cohere API");
  } catch (error) {
    console.error("Error generating embeddings with Cohere:", error);
    throw error;
  }
}
