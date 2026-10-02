"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  RefreshCw,
  MoreHorizontal,
  Volume2,
  MapPin,
  Map as MapIcon,
  Bookmark,
  ChevronDown,
  ChevronRight,
  X,
  Plus,
  Loader2,
  Trash2,
  Compass,
  Building2,
  UtensilsCrossed,
  Ticket,
  ClipboardList,
  Star,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Markdown from "react-markdown";
import AppShell from "@/components/app-shell";
import { useChatActions } from "@/hooks/use-chat-actions";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { usePlan } from "@/contexts/plan-context";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

type Message =
  | { id: number | string; role: "ai"; text: string; time: string }
  | { id: number | string; role: "user"; text: string; time: string };

type Session = {
  id: string;
  title: string;
  createdAt: unknown;
  lastMessageAt: unknown;
};

import { type TranslationKeys } from "@/lib/translations";

const popularDestinations = ["Algiers", "Oran", "Constantine", "Annaba", "Tlemcen", "Djanet"];

const getInitialMessages = (greeting: string): Message[] => [
  {
    id: 1,
    role: "ai",
    text: greeting,
    time: "11:23",
  },
];

const getSuggestions = (t: (key: keyof TranslationKeys) => string): {
  label: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
}[] => [
  {
    label: t("chatAlgiersItinerary"),
    description: t("chatAlgiersItineraryDesc"),
    prompt: t("chatAlgiersItineraryPrompt"),
    icon: Compass,
  },
  {
    label: t("chatHotelsOran"),
    description: t("chatHotelsOranDesc"),
    prompt: t("chatHotelsOranPrompt"),
    icon: Building2,
  },
  {
    label: t("chatConstantineDining"),
    description: t("chatConstantineDiningDesc"),
    prompt: t("chatConstantineDiningPrompt"),
    icon: UtensilsCrossed,
  },
  {
    label: t("chatTlemcenActivities"),
    description: t("chatTlemcenActivitiesDesc"),
    prompt: t("chatTlemcenActivitiesPrompt"),
    icon: Ticket,
  },
];

const welcomeContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const welcomeItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function ChatPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { copiedId, feedbackGiven, handleCopy, handleFeedback, handleShare, handleReadAloud } = useChatActions(user);
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(t("chatGreeting")));
  const [input, setInput] = useState("");
  const [openMenu, setOpenMenu] = useState<number | string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sessions: true,
  });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>(messages);
  const streamingAiIdRef = useRef<number | string | null>(null);
  const { items, removeFromPlan } = usePlan();

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "sessions"),
      orderBy("lastMessageAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setSessions(
        snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Session[]
      );
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user || !activeSession) {
      setMessages(getInitialMessages(t("chatGreeting")));
      return;
    }
    const q = query(
      collection(db, "users", user.uid, "sessions", activeSession, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          role: data.role as "user" | "ai",
          text: data.text,
          time: data.time || "",
        };
      });
      setMessages((prev) => {
        const base = msgs.length > 0 ? msgs : getInitialMessages(t("chatGreeting"));
        const pending = prev.find((m) => m.id === streamingAiIdRef.current);
        return pending ? [...base, pending] : base;
      });
    });
    return unsub;
  }, [user, activeSession]);

  const createSession = async () => {
    if (!user) return;
    const docRef = await addDoc(collection(db, "users", user.uid, "sessions"), {
      title: "New conversation",
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
    });
    setActiveSession(docRef.id);
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const msgsSnap = await getDocs(
      collection(db, "users", user.uid, "sessions", sessionId, "messages")
    );
    for (const msgDoc of msgsSnap.docs) {
      await deleteDoc(
        doc(db, "users", user.uid, "sessions", sessionId, "messages", msgDoc.id)
      );
    }
    await deleteDoc(doc(db, "users", user.uid, "sessions", sessionId));
    if (activeSession === sessionId) {
      setActiveSession(null);
      setMessages(getInitialMessages(t("chatGreeting")));
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    let sessionId = activeSession;

    if (!sessionId && user) {
      const docRef = await addDoc(collection(db, "users", user.uid, "sessions"), {
        title: text.slice(0, 50),
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
      });
      sessionId = docRef.id;
      setActiveSession(sessionId);
    }

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = text;
    setInput("");
    setIsLoading(true);
    setStreaming(true);

    if (sessionId && user) {
      await addDoc(
        collection(db, "users", user.uid, "sessions", sessionId, "messages"),
        {
          role: "user",
          text: currentInput,
          time: now,
          createdAt: serverTimestamp(),
        }
      );
      if (messages.length <= 1) {
        await updateDoc(doc(db, "users", user.uid, "sessions", sessionId), {
          title: currentInput.slice(0, 50),
        });
      }
    }

    const aiMsg: Message = {
      id: Date.now() + 1,
      role: "ai",
      text: "",
      time: now,
    };
    streamingAiIdRef.current = aiMsg.id;
    setMessages((prev) => [...prev, aiMsg]);

    try {
      const apiMessages = [
        ...messagesRef.current.filter((m) => m.id !== userMsg.id),
        userMsg,
      ].map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
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

      if (fullText && sessionId && user) {
        streamingAiIdRef.current = null;
        await addDoc(
          collection(db, "users", user.uid, "sessions", sessionId, "messages"),
          {
            role: "ai",
            text: fullText,
            time: aiMsg.time,
            createdAt: serverTimestamp(),
          }
        );
        await updateDoc(doc(db, "users", user.uid, "sessions", sessionId), {
          lastMessageAt: serverTimestamp(),
        });
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? { ...m, text: t("chatError") }
            : m
        )
      );
    } finally {
      streamingAiIdRef.current = null;
      setIsLoading(false);
      setStreaming(false);
    }
  };

  const formatSessionDate = (timestamp: unknown) => {
    if (!timestamp) return "";
    const date =
      timestamp && typeof timestamp === "object" && "toDate" in timestamp
        ? (timestamp as { toDate: () => Date }).toDate()
        : new Date();
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const showWelcome =
    messages.length === 1 &&
    messages[0].id === getInitialMessages(t("chatGreeting"))[0].id &&
    !streaming;

  return (
    <AppShell>
      <div className="flex h-screen flex-col overflow-hidden pt-16">
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-1 flex-col min-w-0 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
              <div className="mx-auto max-w-2xl min-h-full">
                {showWelcome ? (
                  <motion.div
                    variants={welcomeContainer}
                    initial="hidden"
                    animate="show"
                    className="relative flex min-h-full flex-col items-center justify-center pt-40"
                  >
                    <div className="pointer-events-none absolute top-8 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-foreground/[0.04] blur-3xl" />

                    <motion.div
                      variants={welcomeItem}
                      className="flex items-center gap-1.5 rounded-full border border-border/40 bg-background px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground shadow-sm"
                    >
                      <Sparkles className="h-3 w-3" />
                      {t("chatAssistant")}
                    </motion.div>

                    <motion.div variants={welcomeItem} className="mt-5 text-center">
                      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {t("chatHello")}
                        {user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}
                        !
                      </h1>
                      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        {t("chatExplorePrompt")}
                      </p>
                    </motion.div>

                    <motion.div
                      variants={welcomeItem}
                      className="mt-8 grid w-full max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-2"
                    >
                      {getSuggestions(t).map((s) => (
                        <button
                          key={s.label}
                          onClick={() => sendMessage(s.prompt)}
                          className="group flex items-center gap-3 rounded-2xl border border-border/40 bg-background px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-lg hover:shadow-black/5"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                            <s.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{s.label}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {s.description}
                            </p>
                          </div>
                          <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </button>
                      ))}
                    </motion.div>

                    <motion.div
                      variants={welcomeItem}
                      className="mt-8 flex flex-wrap items-center justify-center gap-2"
                    >
                      <span className="mr-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                        {t("chatPopular")}
                      </span>
                      {popularDestinations.map((place) => (
                        <button
                          key={place}
                          onClick={() => sendMessage(`Tell me about ${place}`)}
                          className="flex items-center gap-1.5 rounded-full border border-border/40 bg-background px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
                        >
                          <MapPin className="h-3 w-3" />
                          {place}
                        </button>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-neutral-800 border border-border shadow-sm p-1 mt-0.5">
                        <img src="/logo.png" alt="Texa" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="max-w-[80%]">
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-muted text-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {msg.role === "ai" ? (
                          <div className="prose prose-sm prose-neutral max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:my-1 prose-li:my-0 prose-strong:font-semibold prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                            <Markdown>{msg.text}</Markdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        )}
                        {msg.role === "ai" &&
                          streaming &&
                          msg.id === messages[messages.length - 1]?.id && (
                            <span className="inline-block w-1.5 h-4 bg-foreground/50 animate-pulse ml-0.5 align-text-bottom" />
                          )}
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
                            onClick={() => handleFeedback(msg.id, msg.text, "thumbs_up", "chat")}
                            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-muted ${
                              feedbackGiven[msg.id] === "thumbs_up" ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Good response"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, msg.text, "thumbs_down", "chat")}
                            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-muted ${
                              feedbackGiven[msg.id] === "thumbs_down" ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Poor response"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
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
                                  <div className="px-3 py-2 text-[11px] text-muted-foreground border-b border-border/40">
                                    {t("chatToday")}, {msg.time}
                                  </div>
                                  <button onClick={() => { setOpenMenu(null); handleReadAloud(msg.text); }} className="flex w-full items-center gap-2.5 px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                    <Volume2 className="h-3.5 w-3.5" /> {t("destReadAloud")}
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-border/40 px-4 py-3 shrink-0">
              <div className="mx-auto max-w-2xl">
                <div className="flex items-end gap-2 rounded-2xl border border-border/40 bg-background px-3 py-2 focus-within:border-foreground/20">
                  <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground">
                    <ImageIcon className="h-4 w-4" />
                  </button>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={t("chatInputPlaceholder")}
                    rows={1}
                    className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-30"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                  {t("destDisclaimer")}
                </p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="hidden lg:flex fixed right-0 top-0 z-[60] h-screen w-80 flex-col border-l border-border/20 bg-background/95 backdrop-blur-xl shadow-[-8px_0_30px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-border/20 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t("chatTripPlanner")}</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-3">
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-muted-foreground">{t("chatConversations")}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={createSession}
                        title={t("chatNewConversation")}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-border/30 bg-background text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => toggleSection("sessions")}
                        className="flex items-center justify-center text-muted-foreground"
                      >
                        <motion.div animate={{ rotate: openSections.sessions ? 180 : 0 }}>
                          <ChevronDown className="h-3.5 w-3.5" />
                        </motion.div>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {openSections.sessions && sessions.length > 0 && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden space-y-1"
                      >
                        {sessions.map((session) => (
                          <div
                            key={session.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setActiveSession(session.id)}
                            className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                              activeSession === session.id
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{session.title}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {formatSessionDate(session.lastMessageAt)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => deleteSession(session.id, e)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                            >
                              <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Floating buttons when sidebar is closed */}
          {!sidebarOpen && (
            <div className="hidden lg:block">
              {/* My Plan button - animates between left and right */}
              <motion.button
                animate={{ right: sidebarOpen ? "20rem" : "1rem" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-background/95 backdrop-blur-xl shadow-md transition-colors hover:shadow-lg"
                title={t("navMyPlan")}
              >
                <ClipboardList className="h-4 w-4" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#008C61] text-[8px] font-bold text-white">
                    {items.length}
                  </span>
                )}
              </motion.button>

              {/* Sidebar toggle button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="fixed right-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 bg-background/95 backdrop-blur-xl shadow-md transition-all hover:shadow-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
