"use client";

import { useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type FeedbackRating = "thumbs_up" | "thumbs_down";

export function useChatActions(user: { uid: string } | null) {
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, FeedbackRating>>({});

  const handleCopy = useCallback(async (text: string, msgId: string | number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleFeedback = useCallback(async (
    msgId: string | number,
    msgText: string,
    rating: FeedbackRating,
    context?: string
  ) => {
    setFeedbackGiven((prev) => ({ ...prev, [msgId]: rating }));
    if (!user) return;
    try {
      await addDoc(collection(db, "feedback"), {
        userId: user.uid,
        messageId: String(msgId),
        messageText: msgText.slice(0, 500),
        rating,
        context: context || "chat",
        createdAt: serverTimestamp(),
      });
    } catch {
      // silent fail
    }
  }, [user]);

  const handleShare = useCallback(async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // user cancelled or not supported
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  }, []);

  const handleReadAloud = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*_`~\[\]]/g, "").replace(/\n+/g, ". ");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  return {
    copiedId,
    feedbackGiven,
    handleCopy,
    handleFeedback,
    handleShare,
    handleReadAloud,
  };
}
