"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  X,
  Compass,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  RefreshCw,
  MoreHorizontal,
  Volume2,
  Check,
} from "lucide-react";
import Markdown from "react-markdown";
import { useChatActions } from "@/hooks/use-chat-actions";
import { useAuth } from "@/contexts/auth-context";
import { hotels } from "@/lib/hotels-data";
import { activities } from "@/lib/activities-data";
import { vehicles } from "@/lib/cars-data";

type Message = {
  id: number | string;
  role: "user" | "ai";
  text: string;
};

export default function ExplorerAgent({
  wilayaName,
  isOpen: controlledOpen,
  onOpenChange,
}: {
  wilayaName: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
  const { user } = useAuth();
  const { copiedId, feedbackGiven, handleCopy, handleFeedback, handleShare, handleReadAloud } = useChatActions(user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>(messages);
  const streamingAiIdRef = useRef<number | string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const buildContext = () => {
    const wilayaHotels = hotels
      .filter((h) => h.city.toLowerCase() === wilayaName.toLowerCase())
      .map((h) => `  - ${h.name} (${h.stars}★, ${h.price} DA/night, rating: ${h.rating}): ${h.highlights.join(", ")}`)
      .join("\n");

    const wilayaActivities = activities
      .filter((a) => a.city.toLowerCase() === wilayaName.toLowerCase())
      .map((a) => `  - ${a.name} (${a.duration}, ${a.price} DA, rating: ${a.rating}): ${a.description}`)
      .join("\n");

    const wilayaCars = vehicles
      .filter((v) => v.city.toLowerCase() === wilayaName.toLowerCase())
      .map((v) => `  - ${v.name} (${v.type}, ${v.price} DA/day, ${v.seats} seats): ${v.description}`)
      .join("\n");

    return `Selected Wilaya: ${wilayaName}

Available Hotels:
${wilayaHotels || "  No hotels listed yet"}

Available Activities:
${wilayaActivities || "  No activities listed yet"}

Available Car Rentals:
${wilayaCars || "  No car rentals listed yet"}`;
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setStreaming(true);

    const aiMsg: Message = {
      id: Date.now() + 1,
      role: "ai",
      text: "",
    };
    streamingAiIdRef.current = aiMsg.id;
    setMessages((prev) => [...prev, aiMsg]);

    try {
      const isFirstMessage = messagesRef.current.length === 0;
      const apiMessages = [
        ...messagesRef.current.filter((m) => m.id !== userMsg.id),
        userMsg,
      ].map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const response = await fetch("/api/explorer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          context: isFirstMessage ? buildContext() : undefined,
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullText += parsed.content;
              setMessages((prev) => {
                if (!prev.some((m) => m.id === aiMsg.id)) {
                  return [...prev, { ...aiMsg, text: fullText }];
                }
                return prev.map((m) =>
                  m.id === aiMsg.id ? { ...m, text: fullText } : m
                );
              });
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? { ...m, text: "Sorry, I encountered an error. Please try again." }
            : m
        )
      );
    } finally {
      streamingAiIdRef.current = null;
      setIsLoading(false);
      setStreaming(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="fixed right-6 bottom-24 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#008C61] text-white shadow-lg shadow-[#008C61]/30 transition-transform hover:scale-110"
            title="Contacter votre Guide Local"
          >
            <Compass className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed right-0 top-0 z-[80] flex h-screen w-[400px] flex-col border-l border-border/20 bg-background/95 backdrop-blur-xl shadow-[-8px_0_30px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center justify-between border-b border-border/20 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-neutral-800 border border-border shadow-sm p-1">
                    <img src="/logo.png" alt="Texa" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">Conseiller Local Texa</h2>
                    <p className="text-[10px] text-muted-foreground">
                      Expert dédié • {wilayaName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-neutral-800 border border-border shadow-md p-3 mb-4">
                      <img src="/logo.png" alt="Texa" className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">
                      Découvrez {wilayaName}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-[250px] mb-6">
                      Posez vos questions sur les hôtels, expériences, gastronomie ou itinéraire pour votre séjour à {wilayaName}.
                    </p>
                    <div className="space-y-2 w-full max-w-[280px]">
                      {[
                        `Quels sont les incontournables à visiter à ${wilayaName} ?`,
                        `Quelles spécialités culinaires goûter absolument ?`,
                        `Propose-moi un itinéraire authentique de 2 jours`,
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="w-full rounded-xl border border-border/40 bg-background px-3 py-2.5 text-left text-xs transition-colors hover:bg-muted"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-neutral-800 border border-border shadow-sm p-1 mt-0.5">
                        <img src="/logo.png" alt="Texa" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="max-w-[85%]">
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-muted text-foreground"
                            : "text-foreground"
                        }`}
                      >
                        <div className="prose prose-sm prose-neutral max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:my-1 prose-li:my-0 prose-strong:font-semibold prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                          <Markdown>{msg.text}</Markdown>
                          {streaming &&
                            msg.role === "ai" &&
                            msg.id === messages[messages.length - 1]?.id && (
                              <span className="inline-block w-1.5 h-4 bg-foreground/50 animate-pulse ml-0.5 align-text-bottom" />
                            )}
                        </div>
                      </div>
                      {msg.role === "ai" && !streaming && msg.text && (
                        <div className="mt-1.5 flex items-center gap-0.5">
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Copy"
                          >
                            {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, msg.text, "thumbs_up", "explorer")}
                            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-muted ${
                              feedbackGiven[msg.id] === "thumbs_up" ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Good response"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, msg.text, "thumbs_down", "explorer")}
                            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-muted ${
                              feedbackGiven[msg.id] === "thumbs_down" ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Poor response"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleShare(msg.text)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Share"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
                              if (lastUserMsg) sendMessage(lastUserMsg.text);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Regenerate"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenMenu(openMenu === msg.id ? null : msg.id)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                            <AnimatePresence>
                              {openMenu === msg.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute bottom-full left-0 mb-1 w-48 overflow-hidden rounded-xl border border-border/40 bg-background shadow-lg"
                                >
                                  <button onClick={() => { setOpenMenu(null); handleReadAloud(msg.text); }} className="flex w-full items-center gap-2.5 px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                    <Volume2 className="h-3.5 w-3.5" /> Read aloud
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-border/20 px-3 py-3">
                <div className="flex items-end gap-2 rounded-2xl border border-border/40 bg-background px-3 py-2 focus-within:border-foreground/20">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={`Ask about ${wilayaName}...`}
                    rows={1}
                    className="flex-1 resize-none bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#008C61] text-white transition-opacity hover:opacity-90 disabled:opacity-30"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
