"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { useChatActions } from "@/hooks/use-chat-actions";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import {
  MapPin,
  ArrowRight,
  Sparkles,
  FileText,
  Users,
  X,
  Star,
  ArrowLeft,
  MessageCircle,
  Send,
  Paperclip,
  Image as ImageIcon,
  Loader2,
  Check,
  Plus,
  Compass,
  Bed,
  Car,
  UtensilsCrossed,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  RefreshCw,
  MoreHorizontal,
  Volume2,
  Landmark,
  Utensils,
  Shirt,
  Calendar,
  Award,
  ChevronRight,
  Info,
  Sparkle,
  UserCheck,
  User,
  MessageSquareQuote,
} from "lucide-react";
import {
  officialWilayas,
  OFFICIAL_WILAYA_COUNT,
  generateSlug,
} from "@/lib/destinations-data";
import { getWilayaCulture, type WilayaCulture } from "@/lib/wilayas-culture";
import { usePlan } from "@/contexts/plan-context";
import { hotels } from "@/lib/hotels-data";
import { activities } from "@/lib/activities-data";
import { vehicles } from "@/lib/cars-data";
import { restaurants } from "@/lib/restaurants-data";
import Markdown from "react-markdown";

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);

// Build code → name mapping using explicit destination codes
const codeToName: Record<number, (typeof officialWilayas)[number]> = {};
officialWilayas.forEach((dest) => {
  if (dest.code) {
    codeToName[dest.code] = dest;
  }
});

type RegionCard = {
  name: string;
  filterKey: string;
  count: number;
  image: string;
};

const regionCards: RegionCard[] = [
  { name: "North", filterKey: "north", count: officialWilayas.filter((d) => d.region === "north").length, image: "/images/destinations/destinations_15_djurdjura6_jpg.webp" },
  { name: "Highlands", filterKey: "highlands", count: officialWilayas.filter((d) => d.region === "highlands").length, image: "/images/destinations/destinations_5_roman_ruins_of_timgad_jpg.webp" },
  { name: "South", filterKey: "sahara", count: officialWilayas.filter((d) => d.region === "sahara").length, image: "/home-page-pic/tassili-djanet.jpg" },
  { name: "Coastal", filterKey: "littoral", count: officialWilayas.filter((d) => d.type === "Coastal").length, image: "/home-page-pic/tipaza.jpg" },
];

const smoothSpring = { type: "spring" as const, damping: 32, stiffness: 180, mass: 1.2 };
const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export default function DestinationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { copiedId, feedbackGiven, handleCopy, handleFeedback, handleShare, handleReadAloud } = useChatActions(user);
  const [search, setSearch] = useState("");
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const geoJsonLayerRef = useRef<any>(null);
  const [geoJsonLayer, setGeoJsonLayer] = useState<any>(null);
  const { addToPlan, removeFromPlan, isInPlan } = usePlan();
  const [isMobile, setIsMobile] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Flying animation state
  const [flyingItem, setFlyingItem] = useState<{
    image: string;
    name: string;
    startX: number;
    startY: number;
  } | null>(null);

  // Sidebar state
  const [selectedWilaya, setSelectedWilaya] = useState<(typeof officialWilayas)[number] | null>(null);
  const [selectedCode, setSelectedCode] = useState<number | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [regionFilter, setRegionFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"heritage" | "food" | "clothing" | "services" | "ai">("heritage");
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  const isSidebarOpen = !!selectedWilaya;
  const isMapShifted = isSidebarOpen || isInputFocused || chatSidebarOpen;
  const filteredDestinations = regionFilter === "all"
    ? officialWilayas
    : officialWilayas.filter((d) => d.region === regionFilter);

  // Cultural data for selected wilaya
  const selectedCulture = selectedWilaya ? getWilayaCulture(selectedWilaya.name, selectedWilaya.region) : null;

  // Reset tab to heritage when wilaya changes
  useEffect(() => {
    if (selectedWilaya) {
      setActiveTab("heritage");
    }
  }, [selectedWilaya?.name]);

  // Filter real data for selected wilaya
  const sidebarHotels = selectedWilaya ? hotels.filter(h => h.city.toLowerCase() === selectedWilaya.name.toLowerCase()).slice(0, 3) : [];
  const sidebarActivities = selectedWilaya ? activities.filter(a => a.city.toLowerCase() === selectedWilaya.name.toLowerCase()).slice(0, 3) : [];
  const sidebarCars = selectedWilaya ? vehicles.filter(v => v.city.toLowerCase() === selectedWilaya.name.toLowerCase()).slice(0, 2) : [];
  const sidebarRestaurants = selectedWilaya ? restaurants.filter(r => r.city.toLowerCase() === selectedWilaya.name.toLowerCase()).slice(0, 2) : [];
  const [showChatBar, setShowChatBar] = useState(false);

  // Explorer chat state — per-wilaya message storage
  const [chatInput, setChatInput] = useState("");
  const [allChatMessages, setAllChatMessages] = useState<
    Record<string, { id: number | string; role: "user" | "ai"; text: string }[]>
  >({});
  const [chatLoading, setChatLoading] = useState(false);
  const [chatStreaming, setChatStreaming] = useState(false);
  const [chatOpenMenu, setChatOpenMenu] = useState<number | string | null>(null);
  const chatMessagesRef = useRef<{ id: number | string; role: "user" | "ai"; text: string }[]>([]);
  const streamingChatAiIdRef = useRef<number | string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const chatMessages = selectedWilaya
    ? allChatMessages[selectedWilaya.name] || []
    : allChatMessages["__no_wilaya__"] || [];

  useEffect(() => {
    if (isMapShifted) {
      const timer = setTimeout(() => setShowChatBar(true), 250);
      return () => clearTimeout(timer);
    } else {
      setShowChatBar(false);
    }
  }, [isMapShifted]);

  useEffect(() => {
    fetch(
      "/wilaya-boundaries.geojson"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load GeoJSON");
        return res.json();
      })
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Map loading error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isMapShifted, geoData, isMobile]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = geoJsonLayerRef.current || geoJsonLayer;
    if (!map || !layer) return;

    const timer = setTimeout(() => {
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: isMobile ? [54, 54] : [65, 65],
          maxZoom: isMobile ? 4.5 : 5.2,
          animate: false,
        });
        const gentleZoom = Math.min(map.getZoom() + (isMobile ? 0.61 : 0.8), isMobile ? 5.2 : 5.7);
        map.setZoom(gentleZoom, { animate: false });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [geoJsonLayer, isMobile]);

  // Filter features based on search
  useEffect(() => {
    if (!geoJsonLayerRef.current || !search) return;

    geoJsonLayerRef.current.eachLayer((layer: any) => {
      const props = layer.feature?.properties || {};
      const code = Number(props.code);
      const dest = codeToName[code];
      const name = dest?.name || "";
      const matches =
        name.toLowerCase().includes(search.toLowerCase());

      const element = layer.getElement?.();
      if (element) {
        element.style.opacity = matches ? "" : "0.15";
      }
    });
  }, [search]);

  const selectedCodeRef = useRef<number | null>(null);
  selectedCodeRef.current = selectedCode;

  const geoStyle = useCallback(
    (feature: any) => {
      const code = Number(feature?.properties?.code);
      if (code === selectedCodeRef.current) {
        return { color: "#D4DADC", weight: 1.2, opacity: 0.7, fillColor: "#D4F0E5", fillOpacity: 1 };
      }
      return { color: "#D4DADC", weight: 1.2, opacity: 0.7, fillColor: "#FAFAF8", fillOpacity: 1 };
    },
    [selectedCode]
  );

  const onEachFeature = useCallback(
    (feature: any, layer: any) => {
      const props = feature.properties || {};
      const code = Number(props.code);
      const dest = codeToName[code];
      const name = dest?.name || `Wilaya ${code}`;

      layer.bindTooltip(`<b>${name}</b>`, {
        sticky: true,
        direction: "top",
        opacity: 0.98,
        className: "custom-tooltip",
      });

      layer.on({
        mouseover: (e: any) => {
          if (code !== selectedCodeRef.current) {
            e.target.setStyle({ color: "#B8C0C4", weight: 1.8, opacity: 0.9, fillColor: "#F0F0EE", fillOpacity: 1 });
          }
          e.target.bringToFront();
        },
        mouseout: (e: any) => {
          e.target.setStyle(geoStyle(e.target.feature));
        },
        click: () => {
          if (dest) {
            setSelectedCode(code);
            setSelectedWilaya(dest);
            setIsInputFocused(false);
            setChatSidebarOpen(false);
          }
        },
      });
    },
    [selectedCode]
  );

  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allChatMessages]);

  const buildExplorerContext = (wilayaName: string) => {
    const culture = getWilayaCulture(wilayaName, selectedWilaya?.region);
    const places = culture.touristPlaces.map(p => `  - ${p.name} [${p.type}]: ${p.description}`).join("\n");
    const foods = culture.famousFoods.map(f => `  - ${f.name} [${f.tag}]: ${f.description}`).join("\n");
    const clothes = culture.traditionalClothing.map(c => `  - ${c.name}${c.heritageBadge ? ` (${c.heritageBadge})` : ""}: ${c.description} [Matières: ${c.materials || "Traditionnelles"}]`).join("\n");

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

    return `Wilaya sélectionnée: ${wilayaName} (${selectedWilaya?.region || "Algérie"})
Aperçu Historique: ${culture.historicalHighlight}
Période idéale de visite: ${culture.bestTimeToVisit}

Monuments et Lieux Touristiques Majeurs:
${places}

Gastronomie et Spécialités Culinaires:
${foods}

Costumes et Tenues Traditionnelles:
${clothes}

Directives de réponse:
- N'utilisez AUCUN emoji dans vos réponses. Adoptez un style professionnel, élégant et soigné.
- Structurez clairement vos conseils avec des tirets et titres en gras.

Hôtels disponibles:
${wilayaHotels || "  Aucun hôtel répertorié pour le moment"}

Activités disponibles:
${wilayaActivities || "  Aucune activité répertoriée pour le moment"}

Location de véhicules:
${wilayaCars || "  Aucun véhicule répertorié pour le moment"}`;
  };

  const sendChatMessage = async (overrideText?: string) => {
    const text = (overrideText ?? chatInput).trim();
    if (!text || chatLoading) return;

    if (!selectedWilaya) {
      const chatKey = "__no_wilaya__";
      const userMsg = { id: Date.now(), role: "user" as const, text };
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai" as const,
        text: "Please select a wilaya on the map first! Click on any region of Algeria to select it, then I can help you explore hotels, activities, restaurants, and more.",
      };
      setAllChatMessages((prev) => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), userMsg, aiMsg],
      }));
      setChatInput("");
      setChatSidebarOpen(true);
      return;
    }

    const wilayaName = selectedWilaya.name;
    const userMsg = { id: Date.now(), role: "user" as const, text };

    setAllChatMessages((prev) => ({
      ...prev,
      [wilayaName]: [...(prev[wilayaName] || []), userMsg],
    }));
    setChatInput("");
    setChatLoading(true);
    setChatStreaming(true);
    setChatSidebarOpen(true);

    const aiMsg = { id: Date.now() + 1, role: "ai" as const, text: "" };
    streamingChatAiIdRef.current = aiMsg.id;
    setAllChatMessages((prev) => ({
      ...prev,
      [wilayaName]: [...(prev[wilayaName] || []), aiMsg],
    }));

    try {
      const isFirstMessage = chatMessagesRef.current.length === 0;
      const apiMessages = [
        ...chatMessagesRef.current.filter((m) => m.id !== userMsg.id),
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
          context: isFirstMessage ? buildExplorerContext(wilayaName) : undefined,
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
              setAllChatMessages((prev) => {
                const msgs = prev[wilayaName] || [];
                if (!msgs.some((m) => m.id === aiMsg.id)) {
                  return { ...prev, [wilayaName]: [...msgs, { ...aiMsg, text: fullText }] };
                }
                return {
                  ...prev,
                  [wilayaName]: msgs.map((m) =>
                    m.id === aiMsg.id ? { ...m, text: fullText } : m
                  ),
                };
              });
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      setAllChatMessages((prev) => {
        const msgs = prev[wilayaName] || [];
        return {
          ...prev,
          [wilayaName]: msgs.map((m) =>
            m.id === aiMsg.id
              ? { ...m, text: "Sorry, I encountered an error. Please try again." }
              : m
          ),
        };
      });
    } finally {
      streamingChatAiIdRef.current = null;
      setChatLoading(false);
      setChatStreaming(false);
    }
  };

  const handleCloseSidebar = useCallback(() => {
    setSelectedWilaya(null);
    setSelectedCode(null);
    setIsInputFocused(false);
    setChatInput("");
    setChatSidebarOpen(false);
  }, []);

  return (
    <AppShell>
      <style jsx global>{`
        .leaflet-container {
          font-family: inherit;
          background: transparent !important;
          user-select: none;
          -webkit-user-select: none;
        }
        .leaflet-container svg {
          outline: none;
        }
        .leaflet-interactive {
          outline: none;
        }
        .custom-tooltip {
          background: #fff;
          border: 1px solid #e0e8e5;
          color: #1a3b32;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          font-weight: 600;
          font-size: 13px;
          padding: 8px 12px;
        }
        .leaflet-tooltip-left:before {
          border-left-color: #e0e8e5;
        }
        .leaflet-tooltip-right:before {
          border-right-color: #e0e8e5;
        }
        .map-blend-container {
          -webkit-mask-image: radial-gradient(ellipse 96% 94% at 52% 48%, black 0%, black 85%, transparent 100%);
          mask-image: radial-gradient(ellipse 96% 94% at 52% 48%, black 0%, black 85%, transparent 100%);
          filter: drop-shadow(0 8px 40px rgba(0, 140, 97, 0.10));
          animation: mapBreathe 8s ease-in-out infinite;
        }
        @media (max-width: 1023px) {
          .map-blend-container {
            -webkit-mask-image: none !important;
            mask-image: none !important;
            animation: none !important;
          }
        }
        @keyframes mapBreathe {
          0%, 100% {
            -webkit-mask-image: radial-gradient(ellipse 96% 94% at 52% 48%, black 0%, black 85%, transparent 100%);
            mask-image: radial-gradient(ellipse 96% 94% at 52% 48%, black 0%, black 85%, transparent 100%);
          }
          50% {
            -webkit-mask-image: radial-gradient(ellipse 98% 96% at 50% 50%, black 0%, black 88%, transparent 100%);
            mask-image: radial-gradient(ellipse 98% 96% at 50% 50%, black 0%, black 88%, transparent 100%);
          }
        }
        .ai-pulse {
          animation: aiPulse 2.5s ease-in-out infinite;
        }
        @keyframes aiPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>

      <div className="min-h-screen bg-white overflow-x-hidden">
        {/* Hero Section */}
        <motion.section
          animate={{ paddingTop: showChatBar ? "48px" : "128px" }}
          transition={{ duration: 0.9, ease: smoothEase }}
          className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 pb-12"
        >
          <motion.div
            transition={smoothSpring}
            className="flex flex-col lg:flex-row items-start gap-6 lg:gap-12"
            style={{ minHeight: isMapShifted ? 780 : undefined }}
          >
            {/* Left Content — always mounted, collapses when sidebar opens or input focused */}
            <motion.div
                animate={{
                  opacity: isMapShifted ? 0 : 1,
                  x: isMapShifted ? -40 : 0,
                  width: isMapShifted ? 0 : undefined,
                }}
                transition={{ duration: 0.9, ease: smoothEase }}
                className="shrink-0 overflow-hidden w-full lg:w-[42%]"
              >
                <div className="pr-4">
                  <h1
                    className="text-3xl sm:text-4xl lg:text-[52px] font-bold leading-[1.1] tracking-[-0.03em] mb-4 text-foreground"
                  >
                    {t("destHeroTitle1")}
                    <br />
                    <span className="text-foreground">{t("destHeroTitle2")}</span>
                    <br />
                    {t("destHeroTitle3")}
                  </h1>
                  <p
                    className="text-sm sm:text-[17px] text-muted-foreground leading-[1.65] mb-8 max-w-[480px]"
                  >
                    {t("destHeroSubtitle")}
                  </p>

                  {/* AI Agent Prompt */}
                  <div
                    className="flex items-center gap-3 px-[18px] py-[14px] border border-border bg-background rounded-[14px] shadow-sm max-w-[480px] transition-all focus-within:border-foreground/30 focus-within:shadow-md"
                  >
                    <div className="relative">
                      <MessageCircle className="w-5 h-5 text-muted-foreground" />
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-foreground rounded-full ai-pulse" />
                    </div>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      placeholder={t("destSearchPlaceholder")}
                      className="flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Info Cards */}
                  <div
                    className="grid grid-cols-3 gap-4 mt-10 max-w-[480px]"
                  >
                    {[
                      { icon: MapPin, number: t("destStatWilayas"), label: t("destStatWilayasLabel") },
                      { icon: Compass, number: "24/7", label: "Guide Local" },
                      { icon: FileText, number: t("destStatInfo"), label: t("destStatInfoLabel") },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="bg-muted/30 border border-border rounded-[14px] p-[18px] text-center transition-all hover:shadow-md"
                      >
                        <div className="w-11 h-11 mx-auto mb-3 grid place-items-center bg-muted rounded-[10px] text-foreground">
                          <card.icon className="w-[22px] h-[22px]" />
                        </div>
                        <div className="text-xl font-extrabold text-foreground mb-1">{card.number}</div>
                        <div className="text-xs text-muted-foreground font-semibold">{card.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            {/* Map Container — always rendered, expands when left collapses */}
            <motion.div
              animate={{ x: isMapShifted && !isMobile ? 500 : 0 }}
              transition={{ duration: 1.4, ease: smoothEase }}
              className="relative map-blend-container w-full h-[400px] sm:h-[480px] lg:h-[min(780px,max(450px,65vh))] min-h-[360px] sm:min-h-[440px] lg:min-h-[400px] lg:flex-1 rounded-2xl lg:rounded-none overflow-hidden my-4 lg:my-0"
              style={isMobile ? { width: "100%", height: "400px" } : { flex: 1, height: "min(780px, max(450px, 65vh))" }}
            >
              {loading && (
                <div className="absolute inset-0 z-[1200] grid place-items-center bg-background/90 backdrop-blur-[8px]">
                  <div className="text-center text-muted-foreground">
                    <div className="w-8 h-8 border-[3px] border-muted border-t-foreground rounded-full animate-spin mx-auto mb-3" />
                    <div>{t("destLoadingMap")}</div>
                  </div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 z-[1200] grid place-items-center bg-background/90 backdrop-blur-[8px]">
                  <div className="text-center text-muted-foreground max-w-[360px] px-4">
                    <div className="text-xl font-bold text-foreground mb-3">{t("destMapUnavailable")}</div>
                    <div className="leading-relaxed">
                      {t("destMapUnavailableDesc")}
                    </div>
                  </div>
                </div>
              )}
              {!loading && !error && geoData && (
                <MapContainer
                  key={isMobile ? "mobile-map" : "desktop-map"}
                  center={isMobile ? [28.2, 2.5] : [28.8, 2]}
                  zoom={isMobile ? 3.8 : 4.6}
                  minZoom={isMobile ? 3.5 : 4}
                  maxZoom={isMobile ? 4.5 : 5.2}
                  zoomControl={false}
                  attributionControl={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                  dragging={false}
                  touchZoom={false}
                  boxZoom={false}
                  keyboard={false}
                  style={{ width: "100%", height: "100%" }}
                  ref={(map) => {
                    if (map) {
                      mapRef.current = map;
                      setTimeout(() => {
                        map.invalidateSize();
                      }, 100);
                      setTimeout(() => {
                        map.invalidateSize();
                      }, 400);
                    }
                  }}
                >
                  <GeoJSON
                    data={geoData}
                    style={geoStyle}
                    onEachFeature={onEachFeature}
                    ref={(layer) => {
                      geoJsonLayerRef.current = layer;
                      if (layer && !geoJsonLayer) {
                        setGeoJsonLayer(layer);
                      }
                    }}
                  />
                </MapContainer>
              )}
            </motion.div>
          </motion.div>

          {/* Chat Input Bar — fixed at bottom when sidebar is open */}
          {/* Chat Input Bar — fixed at bottom when sidebar is open */}
          <AnimatePresence>
            {showChatBar && !chatSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.4, ease: smoothEase } }}
                exit={{ opacity: 0, y: 30, transition: { duration: 0.25 } }}
                className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[3000] flex flex-col items-center gap-2 w-[calc(100vw-2rem)] max-w-[640px] sm:left-[calc(50%+8rem)] md:left-[calc(50%+15rem)]"
              >
                {/* Cultural Prompt Chips Carousel */}
                {selectedCulture && selectedCulture.aiSuggestedPrompts.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full px-1 py-1">
                    {selectedCulture.aiSuggestedPrompts.slice(0, 3).map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => sendChatMessage(prompt)}
                        className="shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-background/90 hover:bg-background text-foreground border border-border shadow-sm hover:border-emerald-500/50 hover:text-emerald-600 transition-all flex items-center gap-1.5 backdrop-blur-md"
                      >
                        <MessageSquareQuote className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[210px]">{prompt}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-end gap-2 w-full">
                  {/* Floating button to reopen chat sidebar */}
                  <AnimatePresence>
                    {chatMessages.length > 0 && !chatSidebarOpen && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={() => setChatSidebarOpen(true)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#008C61] text-white shadow-lg shadow-[#008C61]/30 transition-transform hover:scale-105"
                        title="Ouvrir le chat interactif"
                      >
                        <Compass className="h-5 w-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Close button when no wilaya selected */}
                  {!selectedWilaya && (
                    <button
                      onClick={() => {
                        setIsInputFocused(false);
                        setShowChatBar(false);
                        setChatSidebarOpen(false);
                      }}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-md transition-transform hover:scale-105 hover:text-foreground"
                      title="Fermer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xl px-3.5 py-2 focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/15 shadow-xl shadow-black/8 transition-all">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                        <MessageCircle className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendChatMessage();
                          }
                        }}
                        placeholder={selectedWilaya ? `${t("destChatPlaceholderAsk")} ${selectedWilaya.name}...` : t("destChatPlaceholderMap")}
                        className="flex-1 bg-transparent px-1 py-1 text-xs sm:text-sm font-medium outline-none placeholder:text-muted-foreground"
                      />
                      <button
                        onClick={() => sendChatMessage()}
                        disabled={!chatInput.trim() || chatLoading}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#008C61] text-white transition-all hover:bg-[#007652] hover:scale-105 disabled:opacity-30 disabled:scale-100 shadow-sm"
                      >
                        {chatLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Wilaya Sidebar — slides in from left (hidden when chatSidebarOpen is true to avoid collision) */}
        <AnimatePresence>
          {isSidebarOpen && !chatSidebarOpen && selectedWilaya && selectedCulture && (
            <motion.div
              key="sidebar"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { type: "spring", damping: 35, stiffness: 160, mass: 1.2 },
              }}
              exit={{
                x: "-100%",
                opacity: 0,
                transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
              }}
              className="fixed top-0 left-0 z-[4000] h-screen w-full sm:w-[480px] bg-background border-r border-border/80 shadow-[12px_0_50px_rgba(0,0,0,0.15)] flex flex-col"
            >
              {/* Clean Top Header */}
              <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/60 px-5 py-3.5 flex items-center justify-between shrink-0">
                <button
                  onClick={handleCloseSidebar}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>{t("destBack")}</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-foreground border border-border/60">
                    Wilaya {selectedCode ? String(selectedCode).padStart(2, "0") : ""}
                  </span>
                  <button
                    onClick={handleCloseSidebar}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto pb-6">
                {/* Hero Showcase */}
                <div className="relative w-full h-[210px] overflow-hidden bg-neutral-900 shrink-0">
                  <img
                    src={selectedWilaya.image}
                    alt={selectedWilaya.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute top-3 right-4">
                    <span className="rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-2.5 py-1 text-xs font-semibold text-yellow-300 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {selectedWilaya.rating}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                      {selectedWilaya.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/85 line-clamp-1 mt-0.5">
                      {selectedWilaya.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-white/75 font-medium">
                      <span className="capitalize">{selectedWilaya.region}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-300" />
                        <span>{selectedCulture.bestTimeToVisit}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Clean Editorial Essence Box */}
                  <div className="rounded-2xl bg-muted/40 border border-border/60 p-4">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      L&apos;Essentiel
                    </span>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                      {selectedCulture.historicalHighlight}
                    </p>
                  </div>

                  {/* Horizontal Pill Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/50 overflow-x-auto no-scrollbar">
                    {[
                      { id: "heritage", label: "Sites", count: selectedCulture.touristPlaces.length, icon: Landmark },
                      { id: "food", label: "Saveurs", count: selectedCulture.famousFoods.length, icon: Utensils },
                      { id: "clothing", label: "Traditions", count: selectedCulture.traditionalClothing.length, icon: Shirt },
                      { id: "services", label: "Séjour", count: sidebarHotels.length + sidebarActivities.length, icon: Bed },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-1 justify-center ${
                            isActive
                              ? "bg-background text-foreground shadow-sm border border-border"
                              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
                          <span>{tab.label}</span>
                          <span className={`text-[10px] ${isActive ? "opacity-90 font-bold" : "opacity-60"}`}>
                            ({tab.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab 1: Heritage & Tourist Places */}
                  {activeTab === "heritage" && (
                    <div className="space-y-3">
                      {selectedCulture.touristPlaces.map((place, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all hover:border-emerald-500/30 hover:shadow-sm"
                        >
                          {place.image && (
                            <div className="relative h-32 w-full overflow-hidden bg-muted">
                              <img
                                src={place.image}
                                alt={place.name}
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                                {place.type}
                              </span>
                            </div>
                          )}
                          <div className="p-3.5">
                            <h4 className="text-sm font-bold text-foreground">
                              {place.name}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                              {place.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 2: Gastronomie */}
                  {activeTab === "food" && (
                    <div className="space-y-3">
                      {selectedCulture.famousFoods.map((food, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all hover:border-amber-500/30 hover:shadow-sm"
                        >
                          {food.image && (
                            <div className="relative h-32 w-full overflow-hidden bg-muted">
                              <img
                                src={food.image}
                                alt={food.name}
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                                {food.tag}
                              </span>
                            </div>
                          )}
                          <div className="p-3.5">
                            <h4 className="text-sm font-bold text-foreground">
                              {food.name}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                              {food.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 3: Tenues Traditionnelles */}
                  {activeTab === "clothing" && (
                    <div className="space-y-3">
                      {selectedCulture.traditionalClothing.map((clothing, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all hover:border-purple-500/30 hover:shadow-sm"
                        >
                          {clothing.image && (
                            <div className="relative h-36 w-full overflow-hidden bg-muted">
                              <img
                                src={clothing.image}
                                alt={clothing.name}
                                className="h-full w-full object-cover object-top"
                              />
                              {clothing.heritageBadge && (
                                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-amber-300 backdrop-blur-md">
                                  <Award className="w-3 h-3 text-amber-400 fill-amber-400" />
                                  {clothing.heritageBadge}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="p-3.5">
                            <h4 className="text-sm font-bold text-foreground">
                              {clothing.name}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                              {clothing.description}
                            </p>
                            {clothing.materials && (
                              <p className="text-[11px] text-muted-foreground/80 mt-1.5">
                                <span className="font-semibold text-foreground/80">Matières: </span>
                                {clothing.materials}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 4: Séjour & Services */}
                  {activeTab === "services" && (
                    <div className="space-y-4">
                      {/* Guide Local Box */}
                      <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 border border-border p-1 flex items-center justify-center shrink-0">
                            <img src="/logo.png" alt="Texa" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground">Guide Local Texa</h4>
                            <p className="text-[10px] text-muted-foreground">Conseils sur-mesure pour {selectedWilaya.name}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                          Une question sur les meilleurs restaurants, itinéraires ou coutumes locales ?
                        </p>
                        <button
                          onClick={() => setChatSidebarOpen(true)}
                          className="w-full py-2 px-3 rounded-xl bg-[#008C61] hover:bg-[#007652] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Poser une question au guide
                        </button>
                      </div>

                      {/* Hotels list */}
                      {sidebarHotels.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                            <Bed className="h-3.5 w-3.5 text-emerald-600" />
                            Hôtels ({sidebarHotels.length})
                          </h4>
                          <div className="space-y-2">
                            {sidebarHotels.map((hotel) => (
                              <div key={hotel.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-2 hover:bg-muted/40 transition-colors">
                                <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                                  <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{hotel.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{hotel.stars}★ • {(hotel.price / 1000).toFixed(1)}k DA</p>
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0">
                                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                  <span className="text-[10px] font-semibold">{hotel.rating}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Activities list */}
                      {sidebarActivities.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                            <Compass className="h-3.5 w-3.5 text-amber-600" />
                            Activités ({sidebarActivities.length})
                          </h4>
                          <div className="space-y-2">
                            {sidebarActivities.map((act) => (
                              <div key={act.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-2 hover:bg-muted/40 transition-colors">
                                <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                                  <img src={act.image} alt={act.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{act.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{act.duration}</p>
                                </div>
                                <span className="text-[10px] font-bold shrink-0">{act.price.toLocaleString()} DA</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Clean Sticky Footer */}
              <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur-md border-t border-border/70 p-3.5 flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    if (selectedWilaya) {
                      if (isInPlan(selectedWilaya.name)) {
                        removeFromPlan(selectedWilaya.name);
                      } else {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        setFlyingItem({
                          image: selectedWilaya.image,
                          name: selectedWilaya.name,
                          startX: rect.left + rect.width / 2,
                          startY: rect.top,
                        });
                        addToPlan({ ...selectedWilaya, category: "wilaya" });
                        setTimeout(() => setFlyingItem(null), 900);
                      }
                    }
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all shrink-0 ${
                    isInPlan(selectedWilaya?.name || "")
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-muted text-foreground hover:bg-muted/80 border border-border/80"
                  }`}
                >
                  {isInPlan(selectedWilaya?.name || "") ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{t("destInPlan")}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t("destAddToPlan")}</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/destinations/${generateSlug(selectedWilaya.name)}`}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-90 shadow-sm"
                >
                  <span>{t("destViewDetails")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setChatSidebarOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#008C61] text-white hover:bg-[#007652] transition-colors shrink-0 shadow-sm text-xs font-semibold"
                  title="Poser une question au guide local"
                  aria-label="Guide local"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Guide IA</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wilaya Selection Sidebar — shown when input is focused, no wilaya selected */}
        <AnimatePresence>
          {isInputFocused && !selectedWilaya && (
            <motion.div
              key="select-wilaya"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { type: "spring", damping: 35, stiffness: 160, mass: 1.2 },
              }}
              exit={{
                x: "-100%",
                opacity: 0,
                transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
              }}
              className="fixed top-0 left-0 z-[2000] h-screen w-full sm:w-[500px] bg-white shadow-[8px_0_40px_rgba(0,0,0,0.12)] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsInputFocused(false);
                    setShowChatBar(false);
                    setChatSidebarOpen(false);
                  }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("destBack")}
                </button>
              </div>

              {/* Prompt */}
              <div className="px-6 pt-6 pb-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.4, ease: smoothEase } }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{t("destDiscoverAlgeria")}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight leading-snug">
                    {t("destChooseDestination")}
                  </h2>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mt-1.5">
                    {t("destChooseSubtitle")}
                  </p>
                </motion.div>
              </div>

              {/* Region Tabs */}
              <div className="px-6 pt-4 pb-2">
                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {[
                    { key: "all", label: t("destTabAll") },
                    { key: "north", label: t("destTabNorth") },
                    { key: "highlands", label: t("destTabHighlands") },
                    { key: "sahara", label: t("destTabSouth") },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setRegionFilter(tab.key)}
                      className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all ${
                        regionFilter === tab.key
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wilaya Grid */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-2 gap-3">
                  {filteredDestinations.map((dest, i) => {
                    const code = dest.code ?? (officialWilayas.indexOf(dest) + 1);
                    const isSelected = selectedCode === code;
                    return (
                      <motion.button
                        key={dest.name}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.05 * Math.min(i, 10), duration: 0.35, ease: smoothEase } }}
                        onClick={() => {
                          setSelectedCode(code);
                          setSelectedWilaya(dest);
                          setIsInputFocused(false);
                        }}
                        className={`group relative overflow-hidden rounded-[14px] border transition-all ${
                          isSelected
                            ? "border-[#008C61] ring-2 ring-[#008C61]/20"
                            : "border-border/60 hover:border-foreground/30 hover:shadow-md"
                        }`}
                      >
                        <div className="relative h-[100px] overflow-hidden">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3">
                            <h3 className="text-white text-[13px] font-bold leading-tight drop-shadow-sm">{dest.name}</h3>
                            <p className="text-white/70 text-[10px] font-medium">{dest.subtitle}</p>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[9px] font-semibold text-white uppercase tracking-wide">
                              {dest.type}
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explorer Chat Sidebar — slides in from left, on top of wilaya sidebar */}
        <AnimatePresence>
          {chatSidebarOpen && (
            <motion.div
              key="chat-sidebar"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { type: "spring", damping: 35, stiffness: 160, mass: 1.2 },
              }}
              exit={{
                x: "-100%",
                opacity: 0,
                transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
              }}
              className="fixed top-0 left-0 z-[4000] h-screen w-full sm:w-[500px] bg-background border-r border-border/80 shadow-[12px_0_50px_rgba(0,0,0,0.15)] flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/60 px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  {selectedWilaya && (
                    <button
                      onClick={() => setChatSidebarOpen(false)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors shrink-0 group"
                      title="Retour aux détails de la wilaya"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      <span className="hidden xs:inline">Détails</span>
                    </button>
                  )}
                  <div className="relative shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white dark:bg-neutral-800 border border-border shadow-sm p-1.5">
                      <img src="/logo.png" alt="Texa" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-foreground truncate">Guide Local Texa</h2>
                    <p className="text-[10px] text-muted-foreground font-medium truncate">
                      {selectedWilaya ? `Conseiller dédié • Wilaya de ${selectedWilaya.name}` : t("destSelectToExplore")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {chatMessages.length > 0 && (
                    <button
                      onClick={() => {
                        const key = selectedWilaya ? selectedWilaya.name : "__no_wilaya__";
                        setAllChatMessages((prev) => ({ ...prev, [key]: [] }));
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs"
                      title="Effacer la conversation"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setChatSidebarOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title={selectedWilaya ? "Retour aux détails" : "Fermer"}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 rounded-3xl bg-white dark:bg-neutral-800 flex items-center justify-center border border-border shadow-md p-3 mx-auto">
                        <img src="/logo.png" alt="Texa" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">
                      {selectedWilaya ? `Bienvenue à ${selectedWilaya.name}` : "Conseiller Voyage Algérie"}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-[280px] mb-6 leading-relaxed">
                      {selectedWilaya
                        ? `Je suis votre guide local dédié à ${selectedWilaya.name}. Posez vos questions sur les plus beaux lieux, les spécialités culinaires, les coutumes et vos déplacements.`
                        : "Sélectionnez une wilaya sur la carte pour échanger avec notre conseiller local."}
                    </p>

                    {selectedCulture && (
                      <div className="space-y-2 w-full max-w-[320px]">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-left px-1 mb-2">
                          Suggestions de questions:
                        </p>
                        {selectedCulture.aiSuggestedPrompts.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendChatMessage(q)}
                            className="w-full rounded-2xl border border-border/80 bg-card p-3 text-left text-xs font-medium text-foreground transition-all hover:border-emerald-500/50 hover:bg-muted/50 hover:shadow-sm flex items-center justify-between group"
                          >
                            <span className="line-clamp-2">{q}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-neutral-800 border border-border shadow-sm p-1 mt-0.5">
                        <img src="/logo.png" alt="Texa" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="max-w-[85%] space-y-1.5">
                      {msg.role === "user" ? (
                        <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs font-medium leading-relaxed shadow-sm">
                          {msg.text}
                        </div>
                      ) : (
                        <div className="bg-card border border-border/70 rounded-2xl rounded-tl-xs p-4 shadow-sm relative overflow-hidden">
                          <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-xs leading-relaxed prose-headings:font-bold prose-headings:text-foreground prose-headings:text-sm prose-p:my-1.5 prose-li:my-0.5 prose-strong:font-bold prose-strong:text-foreground prose-code:text-emerald-600 prose-code:bg-emerald-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[11px] prose-ul:pl-4">
                            <Markdown>{msg.text}</Markdown>
                            {chatStreaming &&
                              msg.role === "ai" &&
                              msg.id === chatMessages[chatMessages.length - 1]?.id && (
                                <span className="inline-block w-1.5 h-3.5 bg-emerald-500 animate-pulse ml-1 align-text-bottom rounded-full" />
                              )}
                          </div>

                          {!chatStreaming && msg.text && (
                            <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleCopy(msg.text, msg.id)}
                                  className="p-1 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                                  title="Copier"
                                >
                                  {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleFeedback(msg.id, msg.text, "thumbs_up", "explorer")}
                                  className={`p-1 rounded-lg transition-colors hover:bg-muted ${
                                    feedbackGiven[msg.id] === "thumbs_up" ? "text-emerald-500" : "hover:text-foreground"
                                  }`}
                                  title="Bonne réponse"
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleFeedback(msg.id, msg.text, "thumbs_down", "explorer")}
                                  className={`p-1 rounded-lg transition-colors hover:bg-muted ${
                                    feedbackGiven[msg.id] === "thumbs_down" ? "text-red-500" : "hover:text-foreground"
                                  }`}
                                  title="Réponse incomplète"
                                >
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleShare(msg.text)}
                                  className="p-1 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                                  title="Partager"
                                >
                                  <Share2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleReadAloud(msg.text)}
                                  className="p-1 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                                  title="Lecture vocale"
                                >
                                  <Volume2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <button
                                onClick={() => {
                                  const lastUserMsg = [...chatMessages].reverse().find(m => m.role === "user");
                                  if (lastUserMsg) sendChatMessage(lastUserMsg.text);
                                }}
                                className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors p-1"
                                title="Régénérer"
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span>Régénérer</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Dedicated Chat Input Pinned At Bottom */}
              <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur-md border-t border-border p-3.5 shrink-0 space-y-2">
                {selectedCulture && chatMessages.length > 0 && !chatLoading && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {selectedCulture.aiSuggestedPrompts.slice(0, 2).map((p, i) => (
                      <button
                        key={i}
                        onClick={() => sendChatMessage(p)}
                        className="shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card px-3.5 py-2 focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage();
                      }
                    }}
                    placeholder={selectedWilaya ? `Écrivez à votre guide local pour ${selectedWilaya.name}...` : "Écrivez à votre conseiller..."}
                    className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground font-medium"
                  />
                  <button
                    onClick={() => sendChatMessage()}
                    disabled={!chatInput.trim() || chatLoading}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#008C61] text-white transition-all hover:bg-[#007652] disabled:opacity-30 shadow-sm"
                  >
                    {chatLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground/70">
                  Conciergerie Texa • Conseils personnalisés pour les {OFFICIAL_WILAYA_COUNT} wilayas d'Algérie
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Regions Section — fades out when sidebar opens or input focused */}
        <AnimatePresence>
          {!isMapShifted && (
            <motion.section
              key="regions"
              initial={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -20,
                transition: { duration: 0.4, ease: smoothEase },
              }}
              className="px-12 py-[72px] bg-gradient-to-b from-background to-muted/20"
            >
              <div className="mx-auto max-w-[1400px]">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-4xl font-bold text-foreground tracking-[-0.02em]">{t("destExploreByRegion")}</h2>
                  <button
                    onClick={() => router.push("/destinations/list?region=all")}
                    className="text-foreground text-[15px] font-semibold flex items-center gap-1.5 transition-all hover:gap-2.5 cursor-pointer"
                  >
                    {t("destViewAll")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {regionCards.map((region) => {
                    const regionLabelKey = region.filterKey === "north" ? "destTabNorth" : region.filterKey === "highlands" ? "destTabHighlands" : region.filterKey === "sahara" ? "destTabSouth" : region.filterKey === "littoral" ? "destTabCoastal" : "destTabAll";
                    return (
                    <div
                      key={region.name}
                      onClick={() => router.push(`/destinations/list?region=${region.filterKey}`)}
                      className="bg-white border border-border rounded-[18px] overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative w-full h-[180px] overflow-hidden">
                        <img src={region.image} alt={region.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      <div className="p-5">
                        <div className="text-[22px] font-bold text-foreground mb-2 tracking-[-0.01em]">{t(regionLabelKey as any)}</div>
                        <div className="text-[13px] text-muted-foreground font-semibold">{region.count} {t("destWilayas")}</div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Flying animation when adding to plan */}
        <AnimatePresence>
          {flyingItem && (
            <motion.div
              key="flying"
              initial={{
                position: "fixed",
                left: flyingItem.startX - 24,
                top: flyingItem.startY - 24,
                width: 48,
                height: 48,
                opacity: 1,
                scale: 1,
                zIndex: 9999,
              }}
              animate={{
                top: 20,
                right: 20,
                left: "auto",
                width: 28,
                height: 28,
                opacity: 0.6,
                scale: 0.4,
                rotate: 20,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0.2, 1] }}
              className="pointer-events-none"
            >
              <img
                src={flyingItem.image}
                alt=""
                className="h-full w-full rounded-full object-cover shadow-lg ring-2 ring-foreground"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppShell>
  );
}
