import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { PlanProvider } from "@/contexts/plan-context";
import { LanguageProvider } from "@/contexts/language-context";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// GlobalVoiceLoader is a "use client" component that internally does
// dynamic(() => import("global-voice"), { ssr: false }) — this is required
// because ssr:false is not allowed inside Server Components like layout.tsx.
import GlobalVoiceLoader from "@/components/global-voice-loader";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Texa",
  description: "Ultra professional web application",
  other: {
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <LanguageProvider>
            <PlanProvider>
              <AuthProvider>{children}</AuthProvider>
            </PlanProvider>
          </LanguageProvider>
          {/* Single Texa + VoiceListener instance shared across all pages */}
          <GlobalVoiceLoader apiKey={GEMINI_API_KEY} />
        </ThemeProvider>
      </body>
    </html>
  );
}
