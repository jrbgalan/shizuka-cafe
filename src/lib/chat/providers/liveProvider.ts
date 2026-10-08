import type { ChatMessage, ChatProvider, CardPayload } from "../types";

/**
 * Stubbed LiveProvider for streaming from an external LLM backend.
 * 
 * ARCHITECTURE NOTE:
 * Because this Vite single-page application runs entirely in the browser,
 * never put your LLM API secret (e.g. GEMINI_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY)
 * into client-side environment variables or browser code.
 * 
 * TO ENABLE LIVE MODE:
 * 1. Set up a small backend proxy or serverless function (e.g. Express, Nitro, Cloudflare Worker, Vercel Serverless)
 *    listening at `/api/chat`.
 * 2. Keep your LLM API key strictly in the backend's environment variables.
 * 3. Have the `/api/chat` endpoint forward the conversation history with the system prompt,
 *    and stream SSE (Server-Sent Events) or JSON chunks back to this client.
 * 4. Set `VITE_CHAT_MODE=live` in your `.env.local` file.
 */
export class LiveProvider implements ChatProvider {
  private endpoint: string;

  constructor(endpoint: string = "/api/chat") {
    this.endpoint = endpoint;
  }

  public async *send(
    messages: ChatMessage[],
    options?: {
      signal?: AbortSignal;
      reducedMotion?: boolean;
    }
  ): AsyncIterable<{
    chunk: string;
    finalMeta?: {
      quickReplies?: string[];
      card?: CardPayload;
    };
  }> {
    const signal = options?.signal;

    // In a live deployment, this will call the backend endpoint:
    /*
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal
    });

    if (!response.ok || !response.body) {
      throw new Error(`Live chat error: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      yield { chunk: text };
    }
    */

    // Demo fallback for when VITE_CHAT_MODE=live is enabled without a running backend:
    yield {
      chunk:
        "The LiveProvider is currently stubbed in demo mode. To connect a live LLM (such as Gemini 1.5, Claude, or GPT-4), please configure a backend proxy at `/api/chat` with your server-side API key. In the meantime, switch `VITE_CHAT_MODE=demo` to use the deterministic local engine.",
      finalMeta: {
        quickReplies: ["Menu", "Opening hours", "Recommend a coffee", "Reserve a table"]
      }
    };
  }
}

