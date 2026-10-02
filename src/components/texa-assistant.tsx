"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X } from "lucide-react";

interface TexaAssistantProps {
  apiKey: string;
}

// Phrases that cause Texa to immediately stop (matched from Gemini's own STT transcript)
const TEXA_STOP_PHRASES = [
  "stop texa",
  "stop teksa",
  "close texa",
  "exit texa",
  "quit texa",
  "end texa",
  "goodbye texa",
  "bye texa",
  "arrête texa",
  "ferme texa",
  "اوقف تيكسا",
  "وقف تيكسا",
];

export default function TexaAssistant({ apiKey }: TexaAssistantProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"idle" | "blur" | "ready">("idle");
  const [shutter, setShutter] = useState(false);
  const [sweep, setSweep] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const standbyReadyRef = useRef<boolean>(false);
  const isActiveRef = useRef<boolean>(false);
  const isDeactivatingRef = useRef<boolean>(false);
  const standbyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const isPlayingAudioRef = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const playbackGainRef = useRef<GainNode | null>(null);
  const nextTimeRef = useRef(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Sync ref with state
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const scheduleStandbyReconnect = (delayMs = 3000) => {
    if (standbyTimeoutRef.current) {
      clearTimeout(standbyTimeoutRef.current);
    }
    standbyTimeoutRef.current = setTimeout(() => {
      if (!isActiveRef.current && !isDeactivatingRef.current) {
        connectStandbyWs();
      }
    }, delayMs);
  };

  const handleWsMessage = async (event: MessageEvent) => {
    try {
      let text = "";
      if (event.data instanceof ArrayBuffer) {
        const bytes = new Uint8Array(event.data);
        for (const b of bytes) text += String.fromCharCode(b);
      } else {
        text = event.data;
      }

      if (text.includes("setupComplete")) {
        console.log("⚡ Gemini Live WebSocket ready in standby");
        standbyReadyRef.current = true;
        if (isActiveRef.current) {
          setIsConnected(true);
        }
        return;
      }

      if (text.includes("serverContent")) {
        try {
          const msg = JSON.parse(text);
          const sc = msg.serverContent;

          if (sc?.interrupted) {
            flushPlayback();
            return;
          }

          if (sc?.modelTurn?.parts) {
            for (const part of sc.modelTurn.parts) {
              if (part.inlineData) {
                await playAudio(part.inlineData.data);
              }
              if (part.text) {
                setResponse(part.text);
              }
            }
          }
          if (sc?.inputTranscription?.text) {
            const userText = sc.inputTranscription.text;
            const lowerText = userText.trim().toLowerCase();

            // Intercept stop commands from Gemini's own STT — deactivate before reply plays
            const isStopCmd = TEXA_STOP_PHRASES.some((p) => lowerText.includes(p));
            if (isStopCmd) {
              console.log("🛑 Texa stop command from transcript:", userText);
              deactivateTexa();
              return;
            }

            setTranscript(userText);
          }
        } catch {}
        return;
      }

      if (text.includes("error")) {
        if (isActiveRef.current) {
          setError("Server error");
        }
        return;
      }

      if (text.includes("sessionResumptionUpdate")) {
        return;
      }
    } catch {}
  };

  const connectStandbyWs = () => {
    if (!apiKey) return;
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    try {
      const ws = new WebSocket(
        `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`
      );
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;
      standbyReadyRef.current = false;

      ws.onopen = () => {
        try {
          ws.send(
            JSON.stringify({
              setup: {
                model: `models/${process.env.NEXT_PUBLIC_GEMINI_LIVE_MODEL || "gemini-3.1-flash-live-preview"}`,
                generationConfig: {
                  responseModalities: ["AUDIO"],
                  speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: "Aoede" },
                    },
                  },
                },
                inputAudioTranscription: {},
                systemInstruction: {
                  parts: [
                    {
                      text: "You are Texa, a helpful, charming AI travel assistant for tourists visiting Algeria. Keep responses concise (1-2 sentences max) and enthusiastic. Help with hotels, restaurants, activities, and travel planning in French, English, or Arabic as requested.",
                    },
                  ],
                },
              },
            })
          );
        } catch (e) {
          console.warn("Standby setup send error:", e);
        }
      };

      ws.onmessage = handleWsMessage;

      ws.onerror = (e) => {
        console.warn("Standby WebSocket error:", e);
      };

      ws.onclose = () => {
        standbyReadyRef.current = false;
        if (wsRef.current === ws) {
          wsRef.current = null;
        }
        if (isActiveRef.current) {
          setIsConnected(false);
        } else if (!isDeactivatingRef.current) {
          // Auto-reconnect standby after 3s so it stays hot and ready
          scheduleStandbyReconnect(3000);
        }
      };
    } catch (e) {
      console.warn("Could not initialize standby WS:", e);
    }
  };

  const connectFreshWs = async (): Promise<WebSocket> => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && standbyReadyRef.current) {
      return wsRef.current;
    }

    try { wsRef.current?.close(); } catch {}
    wsRef.current = null;
    standbyReadyRef.current = false;

    const ws = new WebSocket(
      `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`
    );
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onmessage = handleWsMessage;
    ws.onerror = () => {
      if (isActiveRef.current) setError("Connection error");
    };
    ws.onclose = () => {
      standbyReadyRef.current = false;
      if (wsRef.current === ws) wsRef.current = null;
      if (isActiveRef.current) setIsConnected(false);
    };

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => resolve(), 3000);
      ws.onopen = () => {
        clearTimeout(timeout);
        resolve();
      };
    });

    ws.send(
      JSON.stringify({
        setup: {
          model: `models/${process.env.NEXT_PUBLIC_GEMINI_LIVE_MODEL || "gemini-3.1-flash-live-preview"}`,
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Aoede" },
              },
            },
          },
          inputAudioTranscription: {},
          systemInstruction: {
            parts: [
              {
                text: "You are Texa, a helpful, charming AI travel assistant for tourists visiting Algeria. Keep responses concise (1-2 sentences max) and enthusiastic. Help with hotels, restaurants, activities, and travel planning in French, English, or Arabic as requested.",
              },
            ],
          },
        },
      })
    );

    return ws;
  };

  const activateTexa = async (wakeWord?: string) => {
    if (isActiveRef.current) return;
    isActiveRef.current = true;
    setIsActive(true);
    setTranscript("");
    setResponse("");
    setError("");

    // Notify VoiceListener that Texa is opened
    window.dispatchEvent(new CustomEvent("texa:opened"));

    // Show visual immediately without delay
    setPhase("ready");
    setShutter(true);
    setSweep(true);
    setTimeout(() => {
      setShutter(false);
      setSweep(false);
    }, 280);

    const isStandbyHot =
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      standbyReadyRef.current;

    if (isStandbyHot) {
      setIsConnected(true);
    }

    try {
      // 1. Mic stream: reuse cached pre-warm stream or fetch fresh
      let stream = mediaStreamRef.current;
      if (
        !stream ||
        !stream.active ||
        stream.getAudioTracks().length === 0 ||
        stream.getAudioTracks()[0].readyState === "ended"
      ) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        mediaStreamRef.current = stream;
      }

      // 2. AudioContext for mic capture
      let actx = audioContextRef.current;
      if (!actx || actx.state === "closed") {
        actx = new AudioContext();
        audioContextRef.current = actx;
      }
      if (actx.state === "suspended") {
        await actx.resume();
      }

      // 3. Ensure WebSocket is ready (instant if standby was hot!)
      let ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN || !standbyReadyRef.current) {
        ws = await connectFreshWs();
      }
      setIsConnected(true);

      // 4. Send initial wake phrase to Gemini immediately so it talks right away
      const initialTurn = wakeWord?.trim() || "Bonjour Texa";
      console.log("⚡ Transferring wake phrase to LLM immediately:", initialTurn);
      try {
        ws.send(
          JSON.stringify({
            clientContent: {
              turns: [
                {
                  role: "user",
                  parts: [{ text: initialTurn }],
                },
              ],
              turnComplete: true,
            },
          })
        );
      } catch (err) {
        console.warn("Failed to send initial wake turn:", err);
      }

      // 5. Start audio streaming to LLM
      startAudio(ws, actx, stream);
    } catch (err: any) {
      console.error("Failed to activate:", err);
      setError(err.message || "Failed to connect");
      deactivateTexa();
    }
  };

  // Pre-connect standby WebSocket on mount so it's ready BEFORE the user speaks "Hi Texa"
  useEffect(() => {
    if (apiKey) {
      connectStandbyWs();
    }
    return () => {
      if (standbyTimeoutRef.current) {
        clearTimeout(standbyTimeoutRef.current);
      }
      try {
        wsRef.current?.close();
      } catch {}
      wsRef.current = null;
      standbyReadyRef.current = false;
    };
  }, [apiKey]);

  // Pre-warm mic stream on mount
  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      .then((s) => {
        if (!cancelled) {
          mediaStreamRef.current = s;
        } else {
          s.getTracks().forEach((t) => t.stop());
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleActivate = (e: any) => {
      const phrase = e?.detail?.phrase;
      if (!isActiveRef.current) activateTexa(phrase);
    };
    window.addEventListener("texa:activate", handleActivate as EventListener);
    return () => window.removeEventListener("texa:activate", handleActivate as EventListener);
  }, []);

  // Programmatic stop: window.dispatchEvent(new CustomEvent("texa:deactivate"))
  useEffect(() => {
    const handleDeactivate = () => {
      if (isActiveRef.current) deactivateTexa();
    };
    window.addEventListener("texa:deactivate", handleDeactivate);
    return () => window.removeEventListener("texa:deactivate", handleDeactivate);
  }, []);

  const startAudio = (ws: WebSocket, actx: AudioContext, stream: MediaStream) => {
    const source = actx.createMediaStreamSource(stream);
    const processor = actx.createScriptProcessor(2048, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      if (!isActiveRef.current) return;

      // Gate: don't send mic audio while Texa is speaking — prevents self-interruption
      if (isPlayingAudioRef.current) return;

      const input = e.inputBuffer.getChannelData(0);

      const ratio = actx.sampleRate / 16000;
      const newLen = Math.round(input.length / ratio);
      const resampled = new Float32Array(newLen);
      for (let i = 0; i < newLen; i++) {
        const pos = i * ratio;
        const idx = Math.floor(pos);
        const frac = pos - idx;
        resampled[i] =
          idx + 1 < input.length
            ? input[idx] * (1 - frac) + input[idx + 1] * frac
            : input[idx];
      }

      const int16 = new Int16Array(resampled.length);
      for (let i = 0; i < resampled.length; i++) {
        const s = Math.max(-1, Math.min(1, resampled[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      const bytes = new Uint8Array(int16.buffer);
      let bin = "";
      for (const b of bytes) bin += String.fromCharCode(b);
      const b64 = btoa(bin);

      ws.send(
        JSON.stringify({
          realtimeInput: {
            audio: {
              data: b64,
              mimeType: "audio/pcm;rate=16000",
            },
          },
        })
      );
    };

    source.connect(processor);
    // Connect to a silent GainNode (gain=0) so the processor stays alive
    // but mic audio is NOT routed to speakers (prevents acoustic feedback loop)
    const silentGain = actx.createGain();
    silentGain.gain.value = 0;
    processor.connect(silentGain);
    silentGain.connect(actx.destination);
  };

  const flushPlayback = () => {
    // Stop all active sources
    for (const src of activeSourcesRef.current) {
      try { src.stop(); } catch {}
    }
    activeSourcesRef.current = [];
    nextTimeRef.current = 0;

    // Close and nullify the AudioContext so any in-flight WebSocket messages
    // for the OLD response call playAudio on a null ctx and create a fresh one
    try { playbackCtxRef.current?.close(); } catch {}
    playbackCtxRef.current = null;
    playbackGainRef.current = null;

    // Keep mic gated for 200ms after Texa stops speaking
    setTimeout(() => {
      if (!isDeactivatingRef.current) {
        isPlayingAudioRef.current = false;
        setIsSpeaking(false);
      }
    }, 200);
  };

  const playAudio = async (b64: string) => {
    // Bail immediately if deactivate was called
    if (isDeactivatingRef.current) return;

    try {
      const raw = atob(b64);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

      if (!playbackCtxRef.current || playbackCtxRef.current.state === "closed") {
        playbackCtxRef.current = new AudioContext();
        playbackGainRef.current = playbackCtxRef.current.createGain();
        playbackGainRef.current.gain.value = 1.0;
        playbackGainRef.current.connect(playbackCtxRef.current.destination);
      }
      const ctx = playbackCtxRef.current;
      if (ctx.state === "suspended") await ctx.resume();

      if (isDeactivatingRef.current) return;

      // Decode PCM16 LE at 24 kHz → Float32
      const int16 = new Int16Array(bytes.buffer);
      const float32_24k = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) float32_24k[i] = int16[i] / 32768;

      // Resample 24 kHz → native rate with linear interpolation
      const nativeRate = ctx.sampleRate;
      const ratio = nativeRate / 24000;
      const outLen = Math.ceil(float32_24k.length * ratio);
      const float32 = new Float32Array(outLen);
      for (let i = 0; i < outLen; i++) {
        const pos = i / ratio;
        const idx = Math.floor(pos);
        const frac = pos - idx;
        float32[i] =
          idx + 1 < float32_24k.length
            ? float32_24k[idx] * (1 - frac) + float32_24k[idx + 1] * frac
            : float32_24k[idx];
      }

      const buf = ctx.createBuffer(1, outLen, nativeRate);
      buf.copyToChannel(float32, 0);

      const src = ctx.createBufferSource();
      src.buffer = buf;
      if (playbackGainRef.current) src.connect(playbackGainRef.current);

      isPlayingAudioRef.current = true;
      setIsSpeaking(true);
      activeSourcesRef.current.push(src);

      const now = ctx.currentTime;
      const startAt = Math.max(now, nextTimeRef.current);
      src.start(startAt);
      nextTimeRef.current = startAt + buf.duration;

      src.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== src);
        if (activeSourcesRef.current.length === 0 && nextTimeRef.current <= ctx.currentTime + 0.1) {
          setTimeout(() => {
            if (activeSourcesRef.current.length === 0 && !isDeactivatingRef.current) {
              isPlayingAudioRef.current = false;
              setIsSpeaking(false);
            }
          }, 200);
        }
      };
    } catch (err) {
      console.error("Error playing audio:", err);
    }
  };

  const deactivateTexa = () => {
    // Set flag FIRST so any queued playAudio calls bail out immediately
    isDeactivatingRef.current = true;
    isActiveRef.current = false;

    setPhase("idle");
    setShutter(false);
    setSweep(false);
    setIsActive(false);
    setIsConnected(false);
    setTranscript("");
    setResponse("");
    setIsSpeaking(false);
    isPlayingAudioRef.current = false;
    nextTimeRef.current = 0;

    // Close WebSocket immediately — exact requirement: "when say Stop Texa, the WebSocket close"
    try {
      wsRef.current?.close();
    } catch {}
    wsRef.current = null;
    standbyReadyRef.current = false;

    // Stop all active playback sources
    for (const src of activeSourcesRef.current) {
      try {
        src.stop();
      } catch {}
    }
    activeSourcesRef.current = [];

    // Destroy audio contexts so nothing can play
    try {
      playbackCtxRef.current?.close();
    } catch {}
    playbackCtxRef.current = null;
    playbackGainRef.current = null;

    // Stop mic
    try {
      processorRef.current?.disconnect();
    } catch {}
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    try {
      audioContextRef.current?.close();
    } catch {}
    processorRef.current = null;
    mediaStreamRef.current = null;
    audioContextRef.current = null;

    // Notify VoiceListener to resume wake-word detection
    window.dispatchEvent(new CustomEvent("texa:closed"));

    // Reset deactivating flag and reconnect standby WebSocket ready for next time
    setTimeout(() => {
      isDeactivatingRef.current = false;
      if (!isActiveRef.current) {
        connectStandbyWs();
      }
    }, 1500);
  };

  return (
    <>
      {/* Floating Mic Button - Invisible but clickable for voice activation */}
      <AnimatePresence>
        {!isActive && (
          <motion.button
            id="texa-assistant-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ scale: 0, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => activateTexa("Bonjour Texa")}
            className="fixed bottom-6 right-6 z-[90] w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center invisible"
          >
            <Mic className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && (
          <>
            {/* Sonic ring burst on activation — subtle, centered, no white flash screen */}
            {shutter && (
              <div className="fixed inset-0 z-[199] pointer-events-none overflow-hidden flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 40, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-20 h-20 rounded-full origin-center border-[2px] border-purple-300/60"
                />
              </div>
            )}

            {/* Scriber — glossy diagonal sweep */}
            {sweep && (
              <div className="fixed inset-0 z-[198] pointer-events-none overflow-hidden">
                <motion.div
                  initial={{ x: "-130%", opacity: 0.7 }}
                  animate={{ x: "320%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-y-0 -skew-x-12 w-[38vw] bg-gradient-to-r from-transparent via-purple-300/20 to-transparent"
                />
              </div>
            )}

            {/* Aesthetic backdrop — page stays visible, focus pulled to center */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-[96]"
              onClick={deactivateTexa}
            >
              {/* Spotlight vignette */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase !== "idle" ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,0) 15%, rgba(10,4,40,0.15) 52%, rgba(10,4,40,0.55) 100%)",
                }}
              />

              {/* Aurora wash */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase !== "idle" ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 mix-blend-soft-light"
              >
                <motion.div
                  animate={{ x: ["-12%", "12%", "-12%"], y: ["-10%", "8%", "-10%"] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-1/4 -left-1/4 w-[75vw] h-[75vw] rounded-full bg-purple-500/40 blur-[140px]"
                />
                <motion.div
                  animate={{ x: ["10%", "-10%", "10%"], y: ["-8%", "10%", "-8%"] }}
                  transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-1/4 -right-1/4 w-[75vw] h-[75vw] rounded-full bg-indigo-500/40 blur-[140px]"
                />
                <motion.div
                  animate={{ x: ["-6%", "8%", "-6%"], y: ["12%", "-12%", "12%"] }}
                  transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                  className="absolute -top-1/4 right-1/4 w-[55vw] h-[55vw] rounded-full bg-fuchsia-400/25 blur-[140px]"
                />
              </motion.div>

              {/* Center glow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase !== "idle" ? 0.6 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle 46vmin at 50% 45%, rgba(167,139,250,0.2) 0%, rgba(0,0,0,0) 70%)",
                }}
              />

              {/* Floating dust particles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase !== "idle" ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 overflow-hidden pointer-events-none"
              >
                {[...Array(16)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0.1, y: 0 }}
                    animate={{ opacity: [0.1, 0.55, 0.1], y: [0, -26, 0] }}
                    transition={{
                      duration: 6 + (i % 5),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.45,
                    }}
                    style={{ left: `${(i * 37 + 11) % 100}%`, top: `${(i * 53 + 7) % 100}%` }}
                    className="absolute w-[3px] h-[3px] rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Centered overlay — orb + stop button (Instant appearance, 0ms delay!) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "ready" ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none px-6"
            >
              {/* Stop / Close button — top-right corner */}
              <motion.button
                id="texa-stop-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 18, stiffness: 220 }}
                whileHover={{ scale: 1.12, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); deactivateTexa(); }}
                className="absolute top-6 right-6 pointer-events-auto w-10 h-10 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label="Stop Texa"
                title="Stop Texa (or tap anywhere)"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Center orb — appears immediately on wake with no delay */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 240 }}
                className="relative mb-10"
              >
                {/* Speaking ripples */}
                {isSpeaking && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border border-white/40"
                    />
                    <motion.div
                      animate={{ scale: [1, 2], opacity: [0.25, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                      className="absolute inset-0 rounded-full border border-white/20"
                    />
                  </>
                )}

                {/* Main orb */}
                <motion.div
                  animate={isConnected ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={{ duration: 0.8, repeat: isConnected ? Infinity : 0, ease: "easeInOut" }}
                  className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-violet-400 to-indigo-400 shadow-[0_0_60px_rgba(147,51,234,0.4)] flex items-center justify-center"
                >
                  <motion.div
                    animate={isConnected ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.3 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-3 rounded-full bg-white/30 blur-xl"
                  />

                  <motion.div
                    animate={
                      isSpeaking
                        ? { scale: [1, 1.4, 0.9, 1.2, 1] }
                        : isConnected
                        ? { scale: [1, 1.15, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: isSpeaking ? 0.6 : 1, repeat: isSpeaking || isConnected ? Infinity : 0, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-full bg-white shadow-lg"
                  />

                  {!isConnected && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[-6px]"
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                        <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="3" strokeDasharray="60 220" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>

              {/* Texa Logo Title — appears instantly */}
              <motion.h1
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 240 }}
                className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-violet-200 to-indigo-200 bg-clip-text text-transparent"
              >
                Texa
              </motion.h1>

              {/* Status subtitle — appears instantly */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-base text-white/60 mb-8"
              >
                {!isConnected ? "Connecting..." : isSpeaking ? "Speaking..." : "Listening..."}
              </motion.p>

              <AnimatePresence>
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 mb-3 max-w-xl w-full"
                  >
                    <p className="text-xs text-white/40 mb-1">You said</p>
                    <p className="text-sm text-white/85">{transcript}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-5 max-w-2xl w-full"
                  >
                    <p className="text-xs text-white/40 mb-2">Texa</p>
                    <p className="text-base text-white/90 leading-relaxed">{response}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!response && isConnected && !transcript && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/40 text-sm text-center max-w-md"
                >
                  Ask me anything about traveling in Algeria...
                </motion.p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {error && (
        <div className="fixed bottom-20 right-6 z-50 bg-red-500 text-white px-4 py-2 rounded-lg text-sm max-w-xs">
          {error}
        </div>
      )}
    </>
  );
}
