"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Loader2, Send, X } from "lucide-react";

type AdminMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

type ChartData = {
  type: "bar" | "line";
  title: string;
  subtitle?: string;
  labels: string[];
  values: number[];
  unit?: string;
};

function parseAssistantResponse(text: string) {
  const match = text.match(/```chart\s*([\s\S]*?)```/i);
  if (!match) return { text, chart: null as ChartData | null };

  try {
    const candidate = JSON.parse(match[1]) as ChartData;
    if (
      (candidate.type !== "bar" && candidate.type !== "line") ||
      !Array.isArray(candidate.labels) ||
      !Array.isArray(candidate.values) ||
      candidate.labels.length !== candidate.values.length ||
      candidate.labels.length === 0 ||
      candidate.values.some((value) => typeof value !== "number")
    ) {
      return { text, chart: null as ChartData | null };
    }
    return { text: text.replace(match[0], "").trim(), chart: candidate };
  } catch {
    return { text, chart: null as ChartData | null };
  }
}

function AdminChart({ chart }: { chart: ChartData }) {
  const maximum = Math.max(...chart.values, 1);

  return (
    <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="mb-3">
        <p className="text-sm font-bold text-zinc-950">{chart.title}</p>
        {chart.subtitle && <p className="mt-0.5 text-xs text-zinc-500">{chart.subtitle}</p>}
      </div>
      {chart.type === "line" ? (
        <div className="h-32 w-full">
          <svg viewBox="0 0 320 120" className="h-full w-full" role="img" aria-label={chart.title} preserveAspectRatio="none">
            <polyline
              points={chart.values
                .map((value, index) => `${(index / Math.max(chart.values.length - 1, 1)) * 310 + 5},${115 - (value / maximum) * 100}`)
                .join(" ")}
              fill="none"
              stroke="#1f5c53"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {chart.values.map((value, index) => (
              <circle
                key={`${chart.labels[index]}-${value}`}
                cx={(index / Math.max(chart.values.length - 1, 1)) * 310 + 5}
                cy={115 - (value / maximum) * 100}
                r="4"
                fill="#ffffff"
                stroke="#1f5c53"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      ) : (
        <div className="flex h-32 items-end gap-2">
          {chart.values.map((value, index) => (
            <div key={`${chart.labels[index]}-${value}`} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[10px] font-bold text-zinc-700">{value}</span>
              <div className="flex h-20 w-full items-end rounded-t-md bg-zinc-100">
                <div
                  className="w-full rounded-t-md bg-[#1f5c53]"
                  style={{ height: `${Math.max((value / maximum) * 100, value ? 8 : 2)}%` }}
                />
              </div>
              <span className="w-full truncate text-center text-[10px] text-zinc-500">{chart.labels[index]}</span>
            </div>
          ))}
        </div>
      )}
      {chart.unit && <p className="mt-2 text-right text-[10px] text-zinc-400">Unité : {chart.unit}</p>}
    </div>
  );
}

function AssistantResponse({ text }: { text: string }) {
  const parsed = parseAssistantResponse(text);

  return (
    <div className="space-y-2">
      <Markdown
        components={{
          h1: ({ children }) => <h1 className="text-base font-bold tracking-tight text-zinc-950">{children}</h1>,
          h2: ({ children }) => <h2 className="border-b border-zinc-200 pb-1 text-sm font-bold text-[#35635e]">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold text-zinc-950">{children}</h3>,
          p: ({ children }) => <p className="text-sm leading-6 text-zinc-700">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-zinc-950">{children}</strong>,
          ul: ({ children }) => <ul className="space-y-1 pl-4 text-sm text-zinc-700">{children}</ul>,
          li: ({ children }) => <li className="list-disc leading-6">{children}</li>,
        }}
      >
        {parsed.text || "Analyse terminée."}
      </Markdown>
      {parsed.chart && <AdminChart chart={parsed.chart} />}
    </div>
  );
}

export default function AdminAssistant({
  context,
}: {
  context: string;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: AdminMessage = { id: Date.now(), role: "user", text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.text,
          })),
        }),
      });

      if (!response.ok) throw new Error("Assistant request failed");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      const assistantId = Date.now() + 1;
      setMessages((current) => [...current, { id: assistantId, role: "assistant", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const payload = trimmed.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.content) {
              fullText += parsed.content;
              setMessages((current) =>
                current.map((message) =>
                  message.id === assistantId ? { ...message, text: fullText } : message
                )
              );
            }
          } catch {
            // Ignore incomplete SSE fragments.
          }
        }
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 2,
          role: "assistant",
          text: "Je ne peux pas accéder à l'analyse pour le moment. Vérifiez la configuration Gemini et réessayez.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir l'assistant administrateur"
          title="Assistant administrateur"
          className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
        >
          <img src="/logo.png" alt="Texa" className="h-10 w-10 rounded-xl object-cover" />
        </button>
      )}

      {open && (
        <aside className="fixed inset-0 z-[90] flex flex-col bg-white sm:inset-auto sm:bottom-5 sm:right-5 sm:top-20 sm:w-[min(440px,calc(100vw-2.5rem))] sm:rounded-2xl sm:border sm:border-zinc-200 sm:shadow-2xl">
          <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <img src="/logo.png" alt="Texa" className="h-9 w-9 rounded-xl" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-zinc-950">Assistant administrateur</p>
                <p className="text-xs text-zinc-500">Données Texa en langage naturel</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer l'assistant"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-3 text-sm leading-6 text-zinc-600">
                Posez une question sur les utilisateurs, réservations, hôtels, véhicules, transports ou les chiffres clés.
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-zinc-900 text-white"
                    : "border border-zinc-200 bg-[#fbfaf8] text-zinc-800"
                }`}
              >
                {message.role === "assistant" ? <AssistantResponse text={message.text} /> : message.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Analyse des données...
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
            className="flex gap-2 border-t border-zinc-200 p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ex. Quel hôtel est le plus réservé ?"
              className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-zinc-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Envoyer la question"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
