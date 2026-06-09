const GROQ_API_KEY = process.env.GROQ_API_KEY;

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Generates a chat completion using the Groq API.
 * Uses Llama 3.3 70B (llama-3.3-70b-versatile) by default, which is extremely fast and high-quality.
 */
export async function getGroqChatCompletion(
  messages: GroqMessage[],
  model: string = "llama-3.3-70b-versatile",
  temperature: number = 0.2
): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined in environment variables");
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        model,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Groq API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error during Groq API call:", error);
    throw error;
  }
}
