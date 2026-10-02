"use client";

import { useEffect, useRef } from "react";

const WAKE_PHRASES = [
  "hi texa",
  "hello texa",
  "hey texa",
  "ok texa",
  "texa",
  "salut texa",
  "bonjour texa",
  "allo texa",
  "ya texa",
  "يا تيكسا",
  "تيكسا",
  "teksa",
  "hey teksa",
  "hello teksa",
  "hi teksa",
  "textile",
  "pixel",
  "text up",
  "hello fix up",
  "hello texar",
  "hi texar",
  "hello texan",
  "text all",
  "high texas",
  "hi texas",
  "hello texas",
  "tiksa",
  "hi tiksa",
  "hello tiksa",
  "bonjour tiksa",
  "salut tiksa"
];

// Phrases that stop Texa mid-session (checked while Texa is active)
const STOP_PHRASES = [
  "stop texa",
  "stop teksa",
  "stop tiksa",
  "close texa",
  "close teksa",
  "close tiksa",
  "exit texa",
  "exit teksa",
  "quit texa",
  "end texa",
  "goodbye texa",
  "bye texa",
  "arrête texa",
  "arrete texa",
  "arrêt texa",
  "ferme texa",
  "اوقف تيكسا",
  "وقف تيكسا",
  "أوقف تيكسا",
];

export default function VoiceListener() {
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const isTexaActiveRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    const lastTriggerRef = { current: 0 };

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        if (!item || !item[0]) continue;
        const transcript = item[0].transcript.trim().toLowerCase();

        // While Texa is active: ONLY listen for stop phrases
        if (isTexaActiveRef.current) {
          const isStop = STOP_PHRASES.some((phrase) => transcript.includes(phrase));
          if (isStop) {
            console.log("🛑 Stop phrase detected:", transcript);
            window.dispatchEvent(new CustomEvent("texa:deactivate"));
          }
          continue; // Never dispatch texa:activate while Texa is open
        }

        // Texa is NOT active: check wake phrases with debounce
        const now = Date.now();
        if (now - lastTriggerRef.current < 2000) continue;

        const containsWakePhrase = WAKE_PHRASES.some((phrase) =>
          transcript.includes(phrase)
        );

        if (containsWakePhrase) {
          lastTriggerRef.current = Date.now();
          console.log("🎤 Wake phrase detected:", transcript);
          window.dispatchEvent(
            new CustomEvent("texa:activate", { detail: { phrase: transcript } })
          );

          // Fallback DOM trigger
          const texaButton =
            document.getElementById("texa-assistant-trigger") ||
            document.querySelector(
              '[class*="fixed"][class*="bottom-6"][class*="right-6"]'
            );
          if (texaButton && texaButton instanceof HTMLElement) {
            texaButton.click();
          }
          break;
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        console.error("Microphone access denied");
      }
    };

    recognition.onend = () => {
      // Always restart recognition (whether Texa is active or not)
      // so stop-phrase detection stays alive during the session
      if (isListeningRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (e) {}
        }, 150);
      }
    };

    recognitionRef.current = recognition;
    isListeningRef.current = true;

    // Listen to Texa active/inactive states
    const onTexaOpened = () => {
      // Keep recognition running but switch to stop-phrase-only mode
      isTexaActiveRef.current = true;
    };

    const onTexaClosed = () => {
      // Switch back to wake-phrase mode (recognition is still running)
      isTexaActiveRef.current = false;
    };

    window.addEventListener("texa:opened", onTexaOpened);
    window.addEventListener("texa:closed", onTexaClosed);

    const timer = setTimeout(() => {
      try {
        recognition.start();
      } catch (e) {}
    }, 200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("texa:opened", onTexaOpened);
      window.removeEventListener("texa:closed", onTexaClosed);
      if (recognitionRef.current) {
        isListeningRef.current = false;
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  return null;
}
