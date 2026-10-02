"use client";

/**
 * GlobalVoice – singleton wrapper mounted ONCE in the root layout.
 * Renders TexaAssistant + VoiceListener so they persist across all page
 * navigations and are never duplicated regardless of how many pages
 * import <AppShell>.
 */
import TexaAssistant from "@/components/texa-assistant";
import VoiceListener from "@/components/voice-listener";

export default function GlobalVoice({ apiKey }: { apiKey: string }) {
  return (
    <>
      <VoiceListener />
      <TexaAssistant apiKey={apiKey} />
    </>
  );
}
