export const GEMINI_CONFIG = {
  apiKey:
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    "",
  chatModel:
    process.env.CHAT_MODEL ||
    process.env.GEMINI_MODEL ||
    "gemini-3.5-flash",
  liveModel:
    process.env.MODEL ||
    process.env.NEXT_PUBLIC_GEMINI_LIVE_MODEL ||
    "gemini-3.1-flash-live-preview",
};

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "model";
  content: string;
}

/**
 * Transforms standard chat messages into Gemini API format:
 * - Extracts any system messages to combine into systemInstruction
 * - Maps 'assistant' role to 'model'
 * - Merges consecutive messages of the same role to satisfy Gemini's alternating role rule
 */
export function formatGeminiContents(
  messages: ChatMessage[],
  systemPrompt?: string
) {
  const systemTexts: string[] = [];
  if (systemPrompt) {
    systemTexts.push(systemPrompt);
  }

  const rawContents: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  for (const msg of messages) {
    if (msg.role === "system") {
      systemTexts.push(msg.content);
    } else {
      const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
      if (!msg.content || typeof msg.content !== "string") continue;
      rawContents.push({
        role,
        parts: [{ text: msg.content }],
      });
    }
  }

  // Merge consecutive turns of the same role
  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];
  for (const item of rawContents) {
    if (contents.length > 0 && contents[contents.length - 1].role === item.role) {
      contents[contents.length - 1].parts[0].text += "\n\n" + item.parts[0].text;
    } else {
      contents.push(item);
    }
  }

  // Ensure first turn is from user if contents is not empty
  if (contents.length > 0 && contents[0].role === "model") {
    contents.unshift({ role: "user", parts: [{ text: "Hello" }] });
  }

  const systemInstruction =
    systemTexts.length > 0
      ? { parts: [{ text: systemTexts.join("\n\n") }] }
      : undefined;

  return { contents, systemInstruction };
}

/**
 * Creates an SSE streaming Response from Google Gemini API
 * Outputting SSE in the format: data: {"content": "..."}\n\n
 */
export async function streamGeminiChat({
  messages,
  systemPrompt,
  model = GEMINI_CONFIG.chatModel,
  apiKey = GEMINI_CONFIG.apiKey,
  temperature = 0.7,
  maxOutputTokens = 8192,
}: {
  messages: ChatMessage[];
  systemPrompt?: string;
  model?: string;
  apiKey?: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<Response> {
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "Missing GEMINI_API_KEY environment variable. Please configure it in .env or .env.local.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { contents, systemInstruction } = formatGeminiContents(messages, systemPrompt);

  const fallbackModels = [
    model,
    "gemini-3.5-flash",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
  ].filter((m, i, arr) => m && arr.indexOf(m) === i);

  let geminiResponse: Response | null = null;
  let lastErrorText = "";

  for (const currentModel of fallbackModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:streamGenerateContent?key=${apiKey}&alt=sse`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(systemInstruction ? { systemInstruction } : {}),
          contents,
          generationConfig: {
            temperature,
            maxOutputTokens,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      });

      if (res.ok) {
        geminiResponse = res;
        break;
      } else {
        lastErrorText = await res.text();
        console.warn(`Gemini model ${currentModel} returned ${res.status}:`, lastErrorText);
      }
    } catch (err: any) {
      lastErrorText = err?.message || String(err);
      console.warn(`Gemini model ${currentModel} fetch failed:`, lastErrorText);
    }
  }

  if (!geminiResponse || !geminiResponse.ok) {
    return new Response(JSON.stringify({ error: lastErrorText || "All models failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const reader = geminiResponse.body?.getReader();
  if (!reader) {
    return new Response(JSON.stringify({ error: "No stream available" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const dataStr = trimmed.slice(6);
            if (dataStr === "[DONE]") {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              continue;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                console.warn("Gemini in-stream error:", parsed.error);
                continue;
              }
              const parts = parsed.candidates?.[0]?.content?.parts || [];
              for (const part of parts) {
                if (part.text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: part.text })}\n\n`)
                  );
                }
              }
            } catch {
              // skip unparseable fragments
            }
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      Connection: "keep-alive",
    },
  });
}
