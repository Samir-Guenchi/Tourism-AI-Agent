"use client";

/**
 * GlobalVoiceLoader – client component that lazy-loads GlobalVoice with no SSR.
 * Must be a "use client" file because next/dynamic with ssr:false is only
 * allowed inside Client Components, not Server Components like layout.tsx.
 */
import dynamic from "next/dynamic";

const GlobalVoice = dynamic(() => import("@/components/global-voice"), {
  ssr: false,
});

export default function GlobalVoiceLoader({ apiKey }: { apiKey: string }) {
  return <GlobalVoice apiKey={apiKey} />;
}
