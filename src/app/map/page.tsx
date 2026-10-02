"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Landmark,
  Mountain,
  Waves,
  Snowflake,
  Plane,
  Train,
  X,
  ChevronRight,
  ChevronDown,
  Map,
  ListTodo,
  Sparkles,
  Hotel,
  Car,
  Loader2,
  UtensilsCrossed,
  ArrowLeft,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  Star,
  Send,
  Paperclip,
  Image as ImageIcon,
  MessageSquare,
  Compass,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  RefreshCw,
  MoreHorizontal,
  Volume2,
  Plus,
  Check,
  Menu,
  PanelLeftClose,
  Hand,
  ZoomIn,
  ZoomOut,
  LocateFixed,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import Markdown from "react-markdown";
import { db } from "@/lib/firebase";
import { usePlan, type PlanCategory } from "@/contexts/plan-context";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/auth-context";
import { useChatActions } from "@/hooks/use-chat-actions";
import { useLanguage } from "@/contexts/language-context";
import { type TranslationKeys } from "@/lib/translations";
import { OFFICIAL_WILAYA_COUNT, officialWilayas as destinationsData } from "@/lib/destinations-data";
import { hotels as hotelsData } from "@/lib/hotels-data";
import { activities as activitiesData } from "@/lib/activities-data";
import { vehicles as vehiclesData } from "@/lib/cars-data";
import { restaurants as restaurantsData } from "@/lib/restaurants-data";

type Layer = "unesco" | "historical" | "parks" | "beaches" | "ski" | "airports" | "trains";
type ArrangementMode = "horizontal" | "vertical";

type CanvasNode = {
  id: string;
  type: "destination" | "hotel" | "transport" | "activity" | "dining";
  x: number;
  y: number;
  data: Record<string, string | number | string[]>;
};

type CanvasEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
};

const layers: { id: Layer; label: string; icon: typeof Landmark }[] = [
  { id: "unesco", label: "UNESCO Sites", icon: Landmark },
  { id: "historical", label: "Historical", icon: Landmark },
  { id: "parks", label: "National Parks", icon: Mountain },
  { id: "beaches", label: "Beaches", icon: Waves },
  { id: "ski", label: "Ski Stations", icon: Snowflake },
  { id: "airports", label: "Airports", icon: Plane },
  { id: "trains", label: "Train Stations", icon: Train },
];

const layerLabels: Record<Layer, keyof TranslationKeys> = {
  unesco: "mapLayerUnesco",
  historical: "mapLayerHistorical",
  parks: "mapLayerParks",
  beaches: "mapLayerBeaches",
  ski: "mapLayerSki",
  airports: "mapLayerAirports",
  trains: "mapLayerTrains",
};

// Coordinates mapping for destinations
const coordinatesMap: Record<string, { lat: number; lng: number }> = {
  "Algiers": { lat: 36.7538, lng: 3.0588 },
  "Oran": { lat: 35.6969, lng: -0.6331 },
  "Constantine": { lat: 36.365, lng: 6.6147 },
  "Tlemcen": { lat: 34.8828, lng: -1.3167 },
  "Tamanrasset": { lat: 22.785, lng: 5.5228 },
  "Djanet": { lat: 24.555, lng: 9.4839 },
  "Tipaza": { lat: 36.5897, lng: 2.4475 },
  "Batna": { lat: 35.5569, lng: 6.1742 },
  "Béjaïa": { lat: 36.7509, lng: 5.0567 },
  "Biskra": { lat: 34.8484, lng: 5.7264 },
  "Béchar": { lat: 31.6167, lng: -2.2167 },
  "Blida": { lat: 36.4703, lng: 2.8282 },
  "Bouira": { lat: 36.3733, lng: 3.9008 },
  "Tizi Ouzou": { lat: 36.7119, lng: 4.0497 },
  "Tébessa": { lat: 35.4, lng: 8.1167 },
  "Tiaret": { lat: 35.3833, lng: 1.3167 },
  "Djelfa": { lat: 34.6703, lng: 3.2503 },
  "Jijel": { lat: 36.8211, lng: 5.7667 },
  "Sétif": { lat: 36.1898, lng: 5.4108 },
  "Saïda": { lat: 34.8333, lng: 0.15 },
  "Skikda": { lat: 36.8761, lng: 6.9094 },
  "Sidi Bel Abbès": { lat: 35.2, lng: -0.6333 },
  "Annaba": { lat: 36.9, lng: 7.7667 },
  "Guelma": { lat: 36.4625, lng: 7.4264 },
  "Médéa": { lat: 36.1333, lng: 2.75 },
  "Mostaganem": { lat: 35.9333, lng: 0.0833 },
  "M'Sila": { lat: 35.7001, lng: 4.5428 },
  "Mascara": { lat: 35.4, lng: 0.1333 },
  "Ouargla": { lat: 31.95, lng: 5.3167 },
  "El Bayadh": { lat: 33.6833, lng: 1.0167 },
  "Illizi": { lat: 26.5, lng: 8.6167 },
  "Bordj Bou Arréridj": { lat: 36.0667, lng: 4.7667 },
  "Boumerdès": { lat: 36.7589, lng: 3.4778 },
  "El Tarf": { lat: 36.7667, lng: 8.3167 },
  "Tindouf": { lat: 27.6742, lng: -8.1478 },
  "Tissemsilt": { lat: 35.6, lng: 1.81 },
  "El Oued": { lat: 33.35, lng: 6.85 },
  "Khenchela": { lat: 35.4333, lng: 7.1333 },
  "Souk Ahras": { lat: 36.2864, lng: 7.9511 },
  "Mila": { lat: 36.45, lng: 6.2667 },
  "Aïn Defla": { lat: 36.2644, lng: 1.9686 },
  "Naâma": { lat: 33.2667, lng: -0.3167 },
  "Aïn Témouchent": { lat: 35.3, lng: -1.1333 },
  "Ghardaïa": { lat: 32.4911, lng: 3.6744 },
  "Relizane": { lat: 35.7375, lng: 0.5567 },
  "Timimoun": { lat: 29.2639, lng: 0.2392 },
  "Bordj Badji Mokhtar": { lat: 21.3217, lng: 0.9561 },
  "Ouled Djellal": { lat: 34.4167, lng: 5.0667 },
  "Béni Abbès": { lat: 30.1331, lng: -2.1667 },
  "In Salah": { lat: 27.1925, lng: 2.485 },
  "In Guezzam": { lat: 19.5684, lng: 5.7747 },
  "Touggourt": { lat: 33.1, lng: 6.0667 },
  "El M'Ghair": { lat: 33.95, lng: 5.9167 },
  "El Menia": { lat: 30.5833, lng: 2.8833 },
  "Adrar": { lat: 27.8667, lng: -0.2833 },
  "Chlef": { lat: 36.1667, lng: 1.3333 },
  "Laghouat": { lat: 33.8, lng: 2.8833 },
  "Oum El Bouaghi": { lat: 35.8776, lng: 7.1135 },
  "Aflou": { lat: 34.1167, lng: 2.1 },
  "Barika": { lat: 35.3833, lng: 5.3667 },
  "El Kantara": { lat: 35.2333, lng: 5.7 },
  "Bir El Ater": { lat: 35.3833, lng: 8.0167 },
  "El Aricha": { lat: 35.1167, lng: -1.2833 },
  "Ksar Chellala": { lat: 35.2167, lng: 2.3167 },
  "Aïn Oussara": { lat: 35.45, lng: 2.9167 },
  "Messaad": { lat: 34.15, lng: 3.5 },
  "Ksar El Boukhari": { lat: 35.8833, lng: 2.75 },
  "Bou Saâda": { lat: 35.2167, lng: 4.1833 },
  "El Abiodh Sidi Cheikh": { lat: 32.9167, lng: 1.25 },
  "Djémila": { lat: 36.3197, lng: 5.7361 },
  "Timgad": { lat: 35.4844, lng: 6.4672 },
};

// Merge destinations data with coordinates — all official wilayas of Algeria
const destinations = destinationsData
  .filter((dest) => (dest.code ?? 0) >= 1 && (dest.code ?? 0) <= OFFICIAL_WILAYA_COUNT)
  .map((dest) => {
    const coords = coordinatesMap[dest.name] || { lat: 36.7538, lng: 3.0588 }; // Default to Algiers if not found
    // Normalize type for map rendering
    const mapType = dest.type === "Capital" ? "capital"
      : dest.type === "UNESCO" ? "unesco"
      : dest.type === "City" ? "city"
      : dest.type === "Historical" ? "historical"
      : dest.type === "Sahara" ? "sahara"
      : dest.type === "Oasis" ? "sahara"
      : dest.type === "Coastal" ? "beaches"
      : dest.type === "Mountains" ? "parks"
      : "city";
    
    return {
      ...dest,
      ...coords,
      mapType, // Keep original type as is, add mapType for marker styling
    };
  });

const normalizeDestName = (raw?: any): string => {
  if (raw === undefined || raw === null) return "";
  const clean = String(Array.isArray(raw) ? raw[0] : raw).trim();
  if (!clean) return "";
  const lower = clean.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Direct match
  const direct = destinations.find((d) => d.name.toLowerCase() === clean.toLowerCase());
  if (direct) return direct.name;
  // Normalized match without accents
  const normMatch = destinations.find(
    (d) => d.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === lower
  );
  if (normMatch) return normMatch.name;
  // Common aliases
  if (lower === "alger" || lower === "algiers" || lower === "algeria") return "Algiers";
  if (lower === "tipasa") return "Tipaza";
  if (lower === "oran") return "Oran";
  if (lower === "constantine") return "Constantine";
  if (lower === "bejaia") return "Béjaïa";
  if (lower === "setif") return "Sétif";
  if (lower === "boumerdes") return "Boumerdès";
  if (lower === "msila" || lower === "m'sila") return "M'Sila";
  if (lower === "ghardaia") return "Ghardaïa";
  if (lower === "saida") return "Saïda";
  if (lower === "tebessa") return "Tébessa";
  if (lower === "medea") return "Médéa";
  if (lower === "naama") return "Naâma";
  if (lower === "ain defla") return "Aïn Defla";
  if (lower === "ain temouchent") return "Aïn Témouchent";
  if (lower === "beni abbes") return "Béni Abbès";
  if (lower === "bou saada") return "Bou Saâda";
  return clean;
};

const findDestination = (name?: any) => {
  if (name === undefined || name === null) return undefined;
  const target = normalizeDestName(name);
  const str = String(Array.isArray(name) ? name[0] : name).toLowerCase();
  return (
    destinations.find((d) => d.name === target) ||
    destinations.find((d) => d.name.toLowerCase() === str)
  );
};

const circuits = [
  {
    name: "Roman Circuit",
    icon: Landmark,
    destinations: ["Tipaza", "Djémila", "Timgad"],
    color: "bg-foreground",
    hotels: [
      { name: "Dar El Ghaba", subtitle: "4-star • Tipaza", rating: 4.6, price: "9,000 DA/night", parent: "Tipaza" },
      { name: "Hotel Sidi Amrane", subtitle: "3-star • Batna", rating: 4.2, price: "5,500 DA/night", parent: "Timgad" },
    ],
    activities: [
      { name: "Tipaza Archaeological Tour", subtitle: "Half day • Tipaza", rating: 4.8, price: "2,000 DA", parent: "Tipaza" },
      { name: "Djémila Ruins Guided Walk", subtitle: "Half day • Sétif", rating: 4.7, price: "1,500 DA", parent: "Djémila" },
      { name: "Timgad Heritage Tour", subtitle: "Full day • Batna", rating: 4.9, price: "3,000 DA", parent: "Timgad" },
    ],
  },
  {
    name: "Sahara Route",
    icon: Mountain,
    destinations: ["Tamanrasset", "Djanet"],
    color: "bg-foreground",
    hotels: [
      { name: "Tamanrasset Hotel", subtitle: "3-star • Tamanrasset", rating: 4.3, price: "6,000 DA/night", parent: "Tamanrasset" },
      { name: "Auberge du Ahaggar", subtitle: "Lodge • Tamanrasset", rating: 4.7, price: "8,000 DA/night", parent: "Tamanrasset" },
    ],
    activities: [
      { name: "Tassili N'Ajjer Trek", subtitle: "4 days • Djanet", rating: 4.9, price: "22,000 DA", parent: "Djanet" },
      { name: "Camel Riding — Sahara", subtitle: "Full day • Djanet", rating: 4.9, price: "4,500 DA", parent: "Djanet" },
      { name: "Ahaggar Mountains Excursion", subtitle: "2 days • Tamanrasset", rating: 4.8, price: "7,000 DA", parent: "Tamanrasset" },
    ],
  },
  {
    name: "Mediterranean Coast",
    icon: Waves,
    destinations: ["Algiers", "Tipaza", "Oran", "Annaba"],
    color: "bg-foreground",
    hotels: [
      { name: "Sofitel Algiers Hamma", subtitle: "5-star • Algiers", rating: 4.8, price: "22,000 DA/night", parent: "Algiers" },
      { name: "Sheraton Oran Hotel", subtitle: "5-star • Oran", rating: 4.7, price: "15,500 DA/night", parent: "Oran" },
      { name: "Hotel El Djazaïr", subtitle: "4-star • Algiers", rating: 4.3, price: "12,000 DA/night", parent: "Algiers" },
      { name: "Hotel d'Annaba", subtitle: "3-star • Annaba", rating: 4.1, price: "7,500 DA/night", parent: "Annaba" },
      { name: "Tipaza Beach Resort", subtitle: "3-star • Tipaza", rating: 4.2, price: "8,000 DA/night", parent: "Tipaza" },
    ],
    activities: [
      { name: "Casbah Walking Tour", subtitle: "Half day • Algiers", rating: 4.7, price: "1,500 DA", parent: "Algiers" },
      { name: "Tipaza Coastal Walk", subtitle: "Half day • Tipaza", rating: 4.6, price: "1,500 DA", parent: "Tipaza" },
      { name: "Oran Beach Day", subtitle: "Full day • Oran", rating: 4.5, price: "2,000 DA", parent: "Oran" },
      { name: "Annaba Historical Tour", subtitle: "Half day • Annaba", rating: 4.7, price: "1,800 DA", parent: "Annaba" },
    ],
  },
];

const nodeStyles: Record<string, { bg: string; icon: typeof MapPin; label: string; shortLabel: string; gradient: string; glow: string; ringColor: string; borderColor: string; particleColor: string; emoji: string }> = {
  destination: { bg: "bg-gray-900 dark:bg-gray-200", icon: MapPin, label: "Destination", shortLabel: "Dest", gradient: "from-gray-700 via-gray-800 to-gray-950 dark:from-gray-200 dark:via-gray-300 dark:to-gray-400", glow: "shadow-gray-500/40", ringColor: "ring-gray-400/50", borderColor: "border-gray-600 dark:border-gray-400", particleColor: "#9ca3af", emoji: "📍" },
  hotel: { bg: "bg-emerald-500", icon: Hotel, label: "Hotel", shortLabel: "Hotel", gradient: "from-emerald-400 via-emerald-500 to-emerald-700", glow: "shadow-emerald-500/40", ringColor: "ring-emerald-400/50", borderColor: "border-emerald-400", particleColor: "#34d399", emoji: "🏨" },
  transport: { bg: "bg-blue-500", icon: Car, label: "Transport", shortLabel: "Move", gradient: "from-blue-400 via-blue-500 to-blue-700", glow: "shadow-blue-500/40", ringColor: "ring-blue-400/50", borderColor: "border-blue-400", particleColor: "#60a5fa", emoji: "🚗" },
  activity: { bg: "bg-amber-500", icon: Sparkles, label: "Activity", shortLabel: "Do", gradient: "from-amber-400 via-amber-500 to-amber-700", glow: "shadow-amber-500/40", ringColor: "ring-amber-400/50", borderColor: "border-amber-400", particleColor: "#fbbf24", emoji: "✨" },
  dining: { bg: "bg-orange-500", icon: UtensilsCrossed, label: "Dining", shortLabel: "Eat", gradient: "from-orange-400 via-orange-500 to-orange-700", glow: "shadow-orange-500/40", ringColor: "ring-orange-400/50", borderColor: "border-orange-400", particleColor: "#fb923c", emoji: "🍽️" },
};

const markerStyles: Record<string, { color: string; shape: string }> = {
  capital: { color: "#ef4444", shape: "star" },
  city: { color: "#3b82f6", shape: "circle" },
  unesco: { color: "#a855f7", shape: "diamond" },
  historical: { color: "#d97706", shape: "circle" },
  sahara: { color: "#eab308", shape: "circle" },
  parks: { color: "#16a34a", shape: "circle" },
  beaches: { color: "#06b6d4", shape: "circle" },
  ski: { color: "#6366f1", shape: "circle" },
  airport: { color: "#9ca3af", shape: "plane" },
};

function CollapsibleSection({ title, count, defaultOpen = true, grow, children }: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  grow?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors shrink-0"
      >
        <h3 className="text-[11px] font-semibold text-muted-foreground">
          {title}{count !== undefined ? ` (${count})` : ""}
        </h3>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MapPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { copiedId, feedbackGiven, handleCopy, handleFeedback, handleShare, handleReadAloud } = useChatActions(user);
  const { items: planItems, removeFromPlan, addToPlan, clearPlan, budget, setBudget, luxury, setLuxury, days, setDays } = usePlan();
  const [activeLayers, setActiveLayers] = useState<Layer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDest, setSelectedDest] = useState<typeof destinations[0] | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "plan">("plan");
  const mapRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [edges, setEdges] = useState<CanvasEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasTool, setCanvasTool] = useState<"select" | "pan">("pan");
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ w: 1200, h: 800 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [arrangementMode, setArrangementMode] = useState<ArrangementMode>("horizontal");
  const [sidebarMode, setSidebarMode] = useState<"default" | "node-details">("default");
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [showChatInput, setShowChatInput] = useState(false);
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [chatMessages, setChatMessages] = useState<{id: number | string; role: "user" | "ai"; text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatStreaming, setChatStreaming] = useState(false);
  const [chatOpenMenu, setChatOpenMenu] = useState<number | string | null>(null);
  const [isConstructingPlan, setIsConstructingPlan] = useState(false);
  const chatMessagesRef = useRef(chatMessages);
  const streamingChatAiIdRef = useRef<number | string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mobile sidebar toggle
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Circuit preview state
  const [circuitPreview, setCircuitPreview] = useState<{ nodes: CanvasNode[]; edges: CanvasEdge[] } | null>(null);
  const [originalBeforePreview, setOriginalBeforePreview] = useState<{ nodes: CanvasNode[]; edges: CanvasEdge[] } | null>(null);
  const [routeOptimizedToast, setRouteOptimizedToast] = useState<{ count: number; routeText: string } | null>(null);


  // Load arrangement mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("arrangementMode") as ArrangementMode;
    if (savedMode) setArrangementMode(savedMode);
  }, []);

  // Calculate dynamic canvas size based on number of nodes
  const canvasSize = {
    width: Math.max(5000, nodes.length * 500),
    height: Math.max(3000, nodes.length * 500),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  const planLayerGroup = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const markersRef = useRef<any[]>([]);

  useEffect(() => { setMounted(true); }, []);

  // Load graph data from Firebase
  useEffect(() => {
    const loadGraphData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const graphDoc = await getDoc(doc(db, "travelPlans", user.uid));
        if (graphDoc.exists()) {
          const data = graphDoc.data();
          if (data.nodes && data.edges) {
            // Deduplicate nodes and edges by id (fixes old persisted bad keys)
            const seenNodes = new Set<string>();
            const uniqueNodes = data.nodes.filter((n: CanvasNode) => {
              if (seenNodes.has(n.id)) return false;
              seenNodes.add(n.id);
              return true;
            });
            const seenEdges = new Set<string>();
            const uniqueEdges = data.edges.filter((e: CanvasEdge) => {
              if (seenEdges.has(e.id)) return false;
              seenEdges.add(e.id);
              return true;
            });
            setNodes(uniqueNodes);
            setEdges(uniqueEdges);
          }
        }
      } catch (error) {
        console.error("Error loading graph data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGraphData();
  }, [user]);

  // Save graph data to Firebase
  const saveGraphData = useCallback(async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const graphRef = doc(db, "travelPlans", user.uid);
      await setDoc(graphRef, {
        nodes,
        edges,
        updatedAt: serverTimestamp(),
        userId: user.uid,
      }, { merge: true });
    } catch (error) {
      console.error("Error saving graph data:", error);
    } finally {
      setIsSaving(false);
    }
  }, [user, nodes, edges]);

  // Auto-save when nodes or edges change (debounced)
  useEffect(() => {
    if (isLoading) return;
    
    const timeoutId = setTimeout(() => {
      saveGraphData();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, saveGraphData, isLoading]);

  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const buildPlannerContext = () => {
    const budgetDA = budget * 500;
    const luxuryLevel = Math.max(1, Math.round(luxury / 20));
    const wilayaItems = planItems.filter(i => i.category === "wilaya");
    const hotelItems = planItems.filter(i => i.category === "hotel");
    const activityItems = planItems.filter(i => i.category === "activity");
    const carItems = planItems.filter(i => i.category === "car");
    const diningItems = planItems.filter(i => i.category === "dining");

    // Current active destinations that user wants to plan / optimize:
    const canvasDestinationNodes = nodes.filter(n => n.type === "destination");
    const canvasSupportNodes = nodes.filter(n => n.type !== "destination");

    const activeWilayaNames = canvasDestinationNodes.length > 0
      ? canvasDestinationNodes.map(n => String(n.data.name))
      : wilayaItems.map(i => i.name);

    const canvasDestinationsList = canvasDestinationNodes.map((n, i) => {
      const dest = findDestination(n.data.name);
      return `  ${i + 1}. ${n.data.name}${dest ? ` (${dest.region}, ${dest.type})` : ""}`;
    }).join("\n");

    const canvasSupportList = canvasSupportNodes.map(n => {
      const nodeType = n.type.charAt(0).toUpperCase() + n.type.slice(1);
      return `  - ${n.data.name} (${nodeType})`;
    }).join("\n");

    const canvasEdgesList = edges.map(e => {
      const fromNode = nodes.find(n => n.id === e.from);
      const toNode = nodes.find(n => n.id === e.to);
      if (!fromNode || !toNode) return "";
      return `  ${fromNode.data.name} → ${toNode.data.name}`;
    }).filter(Boolean).join("\n");

    return `Trip Preferences:
- Budget: ${budgetDA.toLocaleString()} DA
- Luxury Level: ${luxuryLevel}/5
- Days to Stay: ${days} day${days !== 1 ? 's' : ''}

CURRENT ACTIVE WILAYAS TO OPTIMIZE (${activeWilayaNames.length} Wilayas):
${activeWilayaNames.length > 0 ? activeWilayaNames.map((w, idx) => `  ${idx + 1}. ${w}`).join("\n") : "  None selected yet."}

CRITICAL RULES:
- The active trip route MUST consist of EXACTLY the ${activeWilayaNames.length} wilayas listed above.
- You MUST include ALL ${activeWilayaNames.length} wilayas in your response and in the \`\`\`canvas destinations array.
- DO NOT drop, omit, or replace ANY of these ${activeWilayaNames.length} wilayas.
- DO NOT include any old wilayas from previous chat turns that are not in this list. Any previous wilaya not listed above was DELETED by the user.

Connected services on canvas:
${canvasSupportNodes.length > 0 ? canvasSupportList : "  No services added yet"}

Route connections:
${edges.length > 0 ? canvasEdgesList : "  No connections yet"}

You can modify the canvas itinerary. To do so, append a JSON block at the very end of your response like this:

\`\`\`canvas
{"action":"replace","destinations":["Algiers","Tipaza","Oran"],"services":[{"name":"Sofitel Algiers Hamma","type":"hotel","parent":"Algiers"},{"name":"Tassili N'Ajjer Trek","type":"activity","parent":"Tipaza"}]}
\`\`\`

Actions:
- "replace" — clears the canvas and places only the listed destinations/services
- "add" — adds new destinations/services to the existing canvas without removing current ones
- "remove" — removes listed destinations and their connected services from the canvas

CRITICAL: The JSON MUST be a single line with no line breaks. Always include opening { and closing }.`;
  };

  const applyCanvasAction = (text: string) => {
    // Try multiple parsing strategies to extract the canvas action
    let action: { action: string; destinations: string[]; services?: { name: string; type: string; parent: string }[] } | null = null;

    // Strategy 1: Look for ```canvas or ```json block
    const fencedMatch = text.match(/```(?:canvas|json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (fencedMatch) {
      try {
        const parsed = JSON.parse(fencedMatch[1].trim());
        if (parsed && (parsed.action || parsed.destinations)) {
          action = parsed;
        }
      } catch {}
    }

    // Strategy 2: Look for <!-- plan_update --> followed by JSON block or object
    if (!action) {
      const planUpdateMatch = text.match(/<!--\s*plan_update\s*-->[\s\S]*?(\{[\s\S]*?\})/);
      if (planUpdateMatch) {
        try {
          const parsed = JSON.parse(planUpdateMatch[1].trim());
          if (parsed && (parsed.action || parsed.destinations)) {
            action = parsed;
          }
        } catch {}
      }
    }

    // Strategy 3: Look for "action": "..." pattern with a JSON object anywhere in the text
    if (!action) {
      const jsonPatterns = text.match(/\{[\s\S]*?"action"\s*:\s*"(replace|add|remove)"[\s\S]*?\}/g);
      if (jsonPatterns) {
        for (const pattern of jsonPatterns) {
          try {
            const cleaned = pattern.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
            action = JSON.parse(cleaned);
            if (action && action.destinations) break;
          } catch {}
        }
      }
    }

    // Strategy 4: Look for "action": "..." with "destinations": [...] even without wrapping {}
    if (!action) {
      const actionMatch = text.match(/"action"\s*:\s*"(replace|add|remove)"/);
      const destMatch = text.match(/"destinations"\s*:\s*\[([\s\S]*?)\]/);
      if (actionMatch && destMatch) {
        try {
          const dests = JSON.parse(`[${destMatch[1]}]`);
          const servicesMatch = text.match(/"services"\s*:\s*\[([\s\S]*?)\]/);
          let services: { name: string; type: string; parent: string }[] | undefined;
          if (servicesMatch) {
            try { services = JSON.parse(`[${servicesMatch[1]}]`); } catch {}
          }
          action = { action: actionMatch[1], destinations: dests, services };
        } catch {}
      }
    }

    if (!action || !action.destinations || action.destinations.length === 0) return;

    // Normalize destinations to standard Algerian wilaya names
    action.destinations = action.destinations
      .map((d: string) => normalizeDestName(d))
      .filter(Boolean);

    if (action.services && Array.isArray(action.services)) {
      action.services = action.services.map((svc: any) => ({
        ...svc,
        parent: normalizeDestName(svc.parent),
      }));
    }

    try {
      const base = Date.now();

      if (action.action === "replace") {
        const newNodes: CanvasNode[] = [];
        const newEdges: CanvasEdge[] = [];

        action.destinations.forEach((destName: string, i: number) => {
          const id = `n${base}_${i}`;
          let x = 0, y = 0;
          const viewportWidth = window.innerWidth - 288;
          const spacing = Math.min(220, Math.max(140, (viewportWidth - 200) / action.destinations.length));
          if (arrangementMode === "horizontal") { x = 350 + i * spacing; y = 350; }
          else { x = 700; y = 150 + i * spacing; }

          newNodes.push({ id, type: "destination", x, y, data: { name: destName, days: 1 } });
          if (i > 0) {
            newEdges.push({ id: `e${base}_${i}`, from: `n${base}_${i - 1}`, to: id });
          }
        });

        if (action.services && Array.isArray(action.services)) {
          const serviceCounters: Record<string, number> = {};
          action.services.forEach((svc: { name: string; type: string; parent: string }, svcIdx: number) => {
            const parentIdx = action.destinations.indexOf(svc.parent);
            if (parentIdx === -1) return;
            const parentId = `n${base}_${parentIdx}`;
            const childId = `n${base}_svc_${svcIdx}`;
            const parentNode = newNodes.find(n => n.id === parentId);
            if (!parentNode) return;

            const isTopGroup = svc.type === "activity" || svc.type === "dining";
            const childNodeType = (["hotel", "activity", "transport", "dining"].includes(svc.type) ? svc.type : "activity") as CanvasNode["type"];
            const groupKey = `${parentId}-${isTopGroup ? "top" : "bottom"}`;
            const count = serviceCounters[groupKey] || 0;
            serviceCounters[groupKey] = count + 1;

            const baseOffset = 160;
            const spreadFactor = 80;
            let childX = parentNode.x;
            let childY = parentNode.y;

            if (arrangementMode === "vertical") {
              const direction = isTopGroup ? -1 : 1;
              childX = parentNode.x + direction * baseOffset;
              if (count === 0) {
                childY = parentNode.y;
              } else {
                const spread = count * spreadFactor;
                childY = parentNode.y + (count % 2 === 0 ? spread : -spread);
              }
            } else {
              const direction = isTopGroup ? -1 : 1;
              childY = parentNode.y + direction * baseOffset;
              if (count === 0) {
                childX = parentNode.x;
              } else {
                const spread = count * spreadFactor;
                childX = parentNode.x + (count % 2 === 0 ? spread : -spread);
              }
            }

            newNodes.push({ id: childId, type: childNodeType, x: childX, y: childY, data: { name: svc.name, days: 1 } });
            newEdges.push({ id: `e${base}_svc_${svcIdx}`, from: parentId, to: childId });
          });
        }

        setNodes(newNodes);
        setEdges(newEdges);
        setCanvasOffset({ x: 0, y: 0 });
        setCanvasZoom(1);

        // Sync with plan items: clear old and add only the newly optimized items!
        clearPlan();
        action.destinations.forEach((destName: string) => {
          const destObj = findDestination(destName);
          if (destObj) {
            addToPlan({
              name: destObj.name,
              subtitle: destObj.subtitle || "Wilaya",
              region: destObj.region,
              type: destObj.type,
              rating: destObj.rating || 4.5,
              description: destObj.description || "",
              image: destObj.image,
              category: "wilaya",
            });
          }
        });

        if (action.services && Array.isArray(action.services)) {
          action.services.forEach((svc: any) => {
            addToPlan({
              name: svc.name,
              subtitle: `${svc.type} • ${svc.parent}`,
              region: "",
              type: svc.type,
              rating: 4.5,
              description: "",
              image: "/images/destinations/default.jpg",
              category: (["hotel", "activity", "car", "dining"].includes(svc.type) ? svc.type : "activity") as PlanCategory,
            });
          });
        }

        setRouteOptimizedToast({
          count: action.destinations.length,
          routeText: action.destinations.join(" → "),
        });
        setTimeout(() => setRouteOptimizedToast(null), 8000);
      } else if (action.action === "add") {
        const destNodes = nodes.filter(n => n.type === "destination");
        const lastDest = destNodes[destNodes.length - 1];
        let lastX = lastDest ? lastDest.x : 200;
        let lastY = lastDest ? lastDest.y : 200;

        const addedNodes: CanvasNode[] = [];
        const addedEdges: CanvasEdge[] = [];
        let addIdx = 0;

        action.destinations.forEach((destName: string) => {
          if (nodes.some(n => n.type === "destination" && n.data.name === destName)) return;
          const id = `n${base}_add_${addIdx}`;
          if (arrangementMode === "horizontal") { lastX += 280; }
          else { lastY += 280; }

          addedNodes.push({ id, type: "destination", x: lastX, y: lastY, data: { name: destName, days: 1 } });

          const prevDest = destNodes[destNodes.length - 1] || (addedNodes.length > 1 ? addedNodes[addedNodes.length - 2] : null);
          if (prevDest) {
            addedEdges.push({ id: `e${base}_add_${addIdx}`, from: prevDest.id, to: id });
          }
          addIdx++;
        });

        setNodes(prev => [...prev, ...addedNodes]);
        setEdges(prev => [...prev, ...addedEdges]);
      } else if (action.action === "remove") {
        const namesToRemove = new Set(action.destinations);
        setNodes(prev => {
          const idsToRemove = new Set(
            prev.filter(n => namesToRemove.has(n.data.name as string)).map(n => n.id)
          );
          return prev.filter(n => !idsToRemove.has(n.id));
        });
        setEdges(prev => {
          const removedIds = nodes.filter(n => namesToRemove.has(n.data.name as string)).map(n => n.id);
          return prev.filter(e => !removedIds.includes(e.from) && !removedIds.includes(e.to));
        });
      }
    } catch {
      // skip malformed canvas block
    }
  };

  const stripCanvasBlock = (text: string) => {
    let cleaned = text.replace(/<!--\s*plan_update\s*-->[\s\S]*$/gi, "");
    cleaned = cleaned.replace(/```canvas\s*\n?[\s\S]*?\n?\s*```/g, "");
    cleaned = cleaned.replace(/\{[\s\S]*?"action"\s*:\s*"(replace|add|remove)"[\s\S]*?\}/g, "");
    cleaned = cleaned.replace(/canvas\s+itinerary[^.]*\.?\s*/gi, "");
    cleaned = cleaned.replace(/canvas\s+update[^.]*\.?\s*/gi, "");
    cleaned = cleaned.replace(/here\s+is\s+the\s+updated[^.]*\.?\s*/gi, "");
    cleaned = cleaned.replace(/canvas\s+has\s+been\s+updated[^.]*\.?\s*/gi, "");
    cleaned = cleaned.replace(/canvas\s+plan[^.]*\.?\s*/gi, "");
    cleaned = cleaned.replace(/visual\s+canvas[^.]*\.?\s*/gi, "");
    cleaned = cleaned.replace(/canvas\s*\{[^}]*\}/gi, "");
    cleaned = cleaned.replace(/^\s*[-•]\s*canvas[^\n]*$/gim, "");
    cleaned = cleaned.replace(/^\s*[-•]\s*here[^\n]*canvas[^\n]*$/gim, "");
    return cleaned.replace(/\n{3,}/g, "\n\n").trim();
  };

  const sendPlannerMessage = async (overrideText?: string) => {
    const text = (overrideText ?? chatInput).trim();
    if (!text || chatLoading) return;

    const userMsg = { id: Date.now(), role: "user" as const, text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    setChatStreaming(true);
    setIsConstructingPlan(false);
    setShowChatSidebar(true);

    const aiMsg = { id: Date.now() + 1, role: "ai" as const, text: "" };
    streamingChatAiIdRef.current = aiMsg.id;
    setChatMessages((prev) => [...prev, aiMsg]);

    let fullText = "";

    try {
      // Send only the most recent conversation context so old deleted wilayas don't bleed into new plans
      const recentHistory = chatMessagesRef.current
        .filter((m) => m.id !== userMsg.id && m.id !== aiMsg.id)
        .slice(-2);

      const apiMessages = [
        ...recentHistory,
        userMsg,
      ].map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const response = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          context: buildPlannerContext(),
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let canvasAlreadyApplied = false;

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
              if (!isConstructingPlan && fullText.includes("<!-- plan_update -->")) {
                setIsConstructingPlan(true);
              }
              const displayText = stripCanvasBlock(fullText);
              setChatMessages((prev) => {
                if (!prev.some((m) => m.id === aiMsg.id)) {
                  return [...prev, { ...aiMsg, text: displayText }];
                }
                return prev.map((m) =>
                  m.id === aiMsg.id ? { ...m, text: displayText } : m
                );
              });

              // Eager update: as soon as the canvas block is complete, update map & canvas immediately!
              if (!canvasAlreadyApplied && fullText.match(/```(?:canvas|json)?[\s\S]*?```/)) {
                canvasAlreadyApplied = true;
                applyCanvasAction(fullText);
              }
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? { ...m, text: "Sorry, I encountered an error. Please try again." }
            : m
        )
      );
    } finally {
      streamingChatAiIdRef.current = null;
      setChatLoading(false);
      setChatStreaming(false);
      setIsConstructingPlan(false);
      applyCanvasAction(fullText);
    }
  };

  const activateCircuit = (circuit: typeof circuits[0]) => {
    // Save current state as original
    setOriginalBeforePreview({ nodes: [...nodes], edges: [...edges] });

    // Create nodes for each destination in the circuit
    const newNodes: CanvasNode[] = [];
    const newEdges: CanvasEdge[] = [];

    circuit.destinations.forEach((destName, index) => {
      const dest = findDestination(destName);
      const id = `circuit_${Date.now()}_${index}`;

      let x = 0;
      let y = 0;
      const viewportWidth = window.innerWidth - 288;
      const spacing = Math.min(320, Math.max(200, (viewportWidth - 200) / circuit.destinations.length));

      if (arrangementMode === "horizontal") {
        x = 400 + index * spacing;
        y = 380;
      } else {
        x = 750;
        y = 150 + index * spacing;
      }

      newNodes.push({
        id,
        type: "destination",
        x,
        y,
        data: { name: destName, days: 1 },
      });

      // Add hotels as service nodes (only for matching parent)
      const parentDestName = destName;
      const nodeHotels = circuit.hotels.filter(h => h.parent === parentDestName);
      nodeHotels.forEach((hotel, hi) => {
        const hId = `circuit_hotel_${Date.now()}_${index}_${hi}`;
        const baseOffset = 220;
        const spreadFactor = 100;
        let childX = x;
        let childY = y;
        if (arrangementMode === "horizontal") {
          childY = y + baseOffset;
          childX = x + (hi % 2 === 0 ? hi * spreadFactor : -hi * spreadFactor);
        } else {
          childX = x + baseOffset;
          childY = y + (hi % 2 === 0 ? hi * spreadFactor : -hi * spreadFactor);
        }
        newNodes.push({ id: hId, type: "hotel", x: childX, y: childY, data: { name: hotel.name, days: 1 } });
        newEdges.push({ id: `e_hotel_${Date.now()}_${index}_${hi}`, from: id, to: hId });
      });

      // Add activities as service nodes (only for matching parent)
      const nodeActivities = circuit.activities.filter(a => a.parent === parentDestName);
      nodeActivities.forEach((activity, ai) => {
        const aId = `circuit_activity_${Date.now()}_${index}_${ai}`;
        const baseOffset = 220;
        const spreadFactor = 100;
        let childX = x;
        let childY = y;
        if (arrangementMode === "horizontal") {
          childY = y - baseOffset;
          childX = x + (ai % 2 === 0 ? ai * spreadFactor : -ai * spreadFactor);
        } else {
          childX = x - baseOffset;
          childY = y + (ai % 2 === 0 ? ai * spreadFactor : -ai * spreadFactor);
        }
        newNodes.push({ id: aId, type: "activity", x: childX, y: childY, data: { name: activity.name, days: 1 } });
        newEdges.push({ id: `e_activity_${Date.now()}_${index}_${ai}`, from: id, to: aId });
      });

      // Create edge to previous destination node
      if (index > 0) {
        const prevId = `circuit_${Date.now()}_${index - 1}`;
        newEdges.push({
          id: `e_circuit_${Date.now()}_${index}`,
          from: prevId,
          to: id,
        });
      }
    });

    setCircuitPreview({ nodes: newNodes, edges: newEdges });
    setActiveTab("plan");
  };

  const validateCircuit = () => {
    if (!circuitPreview) return;
    setNodes(circuitPreview.nodes);
    setEdges(circuitPreview.edges);
    setCircuitPreview(null);
    setOriginalBeforePreview(null);
  };

  const rejectCircuit = () => {
    if (originalBeforePreview) {
      setNodes(originalBeforePreview.nodes);
      setEdges(originalBeforePreview.edges);
    }
    setCircuitPreview(null);
    setOriginalBeforePreview(null);
  };

  const toggleLayer = (layer: Layer) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.region.toLowerCase().includes(search.toLowerCase()) ||
      (d.subtitle && d.subtitle.toLowerCase().includes(search.toLowerCase())) ||
      (d.code && String(d.code) === search.trim()) ||
      (d.code && String(d.code).padStart(2, "0") === search.trim()) ||
      (d.code && `wilaya ${d.code}`.includes(search.toLowerCase().trim()))
  );

  // Initialize Leaflet map with Algeria boundaries and markers
  useEffect(() => {
    console.log('Map effect triggered:', { mounted, hasMapRef: !!mapRef.current, activeTab, hasMapInstance: !!mapInstance.current });
    
    if (!mounted || !mapRef.current) return;
    if (activeTab !== "map") return;
    
    // If map already exists and we're just changing layers, update markers
    if (mapInstance.current && mapInstance.current !== true) {
      console.log('Updating markers for layer change');
      const map = mapInstance.current;
      
      // Remove existing markers
      map.eachLayer((layer: any) => {
        if (layer.options && layer.options.icon) {
          map.removeLayer(layer);
        }
      });
      
      // Re-add filtered markers
      destinations.forEach((dest) => {
        // Filter by active layers
        if (activeLayers.length > 0) {
          const destLayer = dest.mapType === "unesco" ? "unesco" 
            : dest.mapType === "historical" ? "historical"
            : dest.mapType === "parks" ? "parks"
            : dest.mapType === "beaches" ? "beaches"
            : dest.mapType === "ski" ? "ski"
            : dest.mapType === "airport" ? "airports"
            : null;
          
          if (!destLayer || !activeLayers.includes(destLayer)) {
            return;
          }
        }

        const style = markerStyles[dest.mapType] || markerStyles.city;
        const isAirport = dest.mapType === "airport";
        const size = isAirport ? 24 : dest.mapType === "capital" ? 22 : 16;
        
        // Dynamically import Leaflet for marker creation
        import("leaflet").then(({ default: L }) => {
          let html = "";
          if (style.shape === "plane") {
            html = `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${style.color};border-radius:50%;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
            </div>`;
          } else if (style.shape === "diamond") {
            html = `<div style="width:${size}px;height:${size}px;background:${style.color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);transform:rotate(45deg);border-radius:3px"></div>`;
          } else if (style.shape === "triangle") {
            html = `<div style="width:0;height:0;border-left:${size/2}px solid transparent;border-right:${size/2}px solid transparent;border-bottom:${size}px solid ${style.color};filter:drop-shadow(0 2px 4px rgba(0,0,0,0.25))"></div>`;
          } else if (style.shape === "square") {
            html = `<div style="width:${size}px;height:${size}px;background:${style.color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);border-radius:3px"></div>`;
          } else if (style.shape === "star") {
            html = `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${style.color};border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
            </div>`;
          } else {
            html = `<div style="width:${size}px;height:${size}px;background:${style.color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);border-radius:50%"></div>`;
          }
          
          const icon = L.divIcon({ className: "", html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
          const marker = L.marker([dest.lat, dest.lng], { icon }).addTo(map);

          const isMajor = dest.mapType === "capital" || dest.mapType === "unesco" || dest.mapType === "city" || dest.mapType === "historical" || dest.mapType === "sahara" || dest.mapType === "beaches" || dest.mapType === "parks";
          if (!isAirport && isMajor) {
            const tooltip = marker.bindTooltip(dest.name, {
              permanent: true,
              direction: "top",
              offset: [0, -size / 2 - 6],
              className: "map-tooltip",
              opacity: 0.95,
            });

            const updateLabelVisibility = () => {
              const zoom = map.getZoom();
              if (zoom < 6.5) {
                if (dest.mapType === "capital" || dest.mapType === "unesco") {
                  tooltip.openTooltip();
                } else {
                  tooltip.closeTooltip();
                }
              } else {
                tooltip.openTooltip();
              }
            };

            updateLabelVisibility();
            map.on('zoomend', updateLabelVisibility);
          }

          marker.on("click", () => setSelectedDest(dest));
        });
      });
      
      return;
    }
    
    if (mapInstance.current) return; // Already initialized

    console.log('Initializing map...');
    const container = mapRef.current;

    const initMap = async () => {
      try {
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        console.log('Loading Leaflet...');
        const L = (await import("leaflet")).default;
        console.log('Leaflet loaded:', L);
        
        const algeria = L.latLngBounds([12, -9.5], [44, 12.5]);

        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        console.log('Creating map on container (isMobile:', isMobile, '):', container);
        const map = L.map(container, {
          center: isMobile ? [29.2, 2.5] : [28.0339, 1.6596],
          zoom: isMobile ? 4.75 : 5.5,
          minZoom: isMobile ? 3.8 : 4.8,
          maxZoom: 14,
          zoomSnap: 0.25,
          zoomControl: false,
          attributionControl: false,
          maxBounds: algeria,
          maxBoundsViscosity: 0.8,
          preferCanvas: true,
          zoomAnimation: true,
          markerZoomAnimation: true,
        });

        console.log('Map created:', map);

        L.control.zoom({ position: isMobile ? "topright" : "bottomright" }).addTo(map);

        const handleResize = () => {
          map.invalidateSize();
        };
        window.addEventListener("resize", handleResize);

        const tileUrl =
          process.env.NEXT_PUBLIC_CARTO_API_KEY
            ? `https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_CARTO_API_KEY}`
            : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";

        L.tileLayer(tileUrl, {
          maxZoom: 16,
          attribution: "&copy; Esri, OpenStreetMap contributors",
          updateWhenIdle: false,
          updateWhenZooming: false,
          keepBuffer: 2,
        }).addTo(map);

        let stateLayerRef: any = null;

        try {
          const response = await fetch('/api/algeria-boundaries');
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const algeriaStates = await response.json();

          stateLayerRef = L.geoJSON(algeriaStates, {
          style: {
            fillColor: '#e5e7eb',
            fillOpacity: 0.3,
            color: '#9ca3af',
            weight: 1,
          },
          pane: 'overlayPane',
          onEachFeature: (feature, layer) => {
            const stateName = feature.properties.shapeName || 
                             feature.properties.shapeGroup || 
                             feature.properties.name || 
                             feature.properties.NAME || 
                             feature.properties.NAME_1 ||
                             'Unknown';
            
            let hoverTimeout: any = null;
            layer.on({
              mouseover: (e) => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                  const layer = e.target;
                  layer.setStyle({
                    fillColor: '#6366f1',
                    fillOpacity: 0.5,
                    weight: 2,
                    color: '#4f46e5',
                  });
                }, 50);
              },
              mouseout: (e) => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
                stateLayerRef.resetStyle(e.target);
              },
              click: (e) => {
                map.fitBounds(e.target.getBounds());
              }
            });

            layer.bindTooltip(stateName, {
              permanent: false,
              direction: 'center',
              className: 'state-tooltip',
              sticky: true,
            });
          }
        });

        const toggleStateLayer = () => {
          const zoom = map.getZoom();
          if (zoom >= 6 && !map.hasLayer(stateLayerRef)) {
            stateLayerRef.addTo(map);
          } else if (zoom < 6 && map.hasLayer(stateLayerRef)) {
            map.removeLayer(stateLayerRef);
          }
        };

        toggleStateLayer();
        map.on('zoomend', toggleStateLayer);
      } catch (error) {
        console.error('Failed to load Algeria state boundaries:', error);
      }

      destinations.forEach((dest) => {
        // Filter by active layers
        if (activeLayers.length > 0) {
          const destLayer = dest.mapType === "unesco" ? "unesco" 
            : dest.mapType === "historical" ? "historical"
            : dest.mapType === "parks" ? "parks"
            : dest.mapType === "beaches" ? "beaches"
            : dest.mapType === "ski" ? "ski"
            : dest.mapType === "airport" ? "airports"
            : null;
          
          if (!destLayer || !activeLayers.includes(destLayer)) {
            return; // Skip this destination
          }
        }

        const style = markerStyles[dest.mapType] || markerStyles.city;
        const isAirport = dest.mapType === "airport";
        const size = isAirport ? 24 : dest.mapType === "capital" ? 22 : 16;
        let html = "";

        if (style.shape === "plane") {
          html = `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${style.color};border-radius:50%;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
          </div>`;
        } else if (style.shape === "diamond") {
          html = `<div style="width:${size}px;height:${size}px;background:${style.color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);transform:rotate(45deg);border-radius:3px"></div>`;
        } else if (style.shape === "triangle") {
          html = `<div style="width:0;height:0;border-left:${size/2}px solid transparent;border-right:${size/2}px solid transparent;border-bottom:${size}px solid ${style.color};filter:drop-shadow(0 2px 4px rgba(0,0,0,0.25))"></div>`;
        } else if (style.shape === "square") {
          html = `<div style="width:${size}px;height:${size}px;background:${style.color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);border-radius:3px"></div>`;
        } else if (style.shape === "star") {
          html = `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${style.color};border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
          </div>`;
        } else {
          html = `<div style="width:${size}px;height:${size}px;background:${style.color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);border-radius:50%"></div>`;
        }

        const icon = L.divIcon({ className: "", html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
        const marker = L.marker([dest.lat, dest.lng], { icon }).addTo(map);

        const isMajor = dest.mapType === "capital" || dest.mapType === "unesco" || dest.mapType === "city" || dest.mapType === "historical" || dest.mapType === "sahara" || dest.mapType === "beaches" || dest.mapType === "parks";
        if (!isAirport && isMajor) {
          const tooltip = marker.bindTooltip(dest.name, {
            permanent: true,
            direction: "top",
            offset: [0, -size / 2 - 6],
            className: "map-tooltip",
            opacity: 0.95,
          });

          const updateLabelVisibility = () => {
            const zoom = map.getZoom();
            if (zoom < 6.5) {
              if (dest.mapType === "capital" || dest.mapType === "unesco") {
                tooltip.openTooltip();
              } else {
                tooltip.closeTooltip();
              }
            } else {
              tooltip.openTooltip();
            }
          };

          updateLabelVisibility();
          map.on('zoomend', updateLabelVisibility);
        }

        marker.on("click", () => setSelectedDest(dest));
      });

      mapInstance.current = map;
      setMapReady(true);
      setTimeout(() => map.invalidateSize(), 100);
      console.log('Map initialization complete!');
    } catch (error) {
      console.error('Map initialization error:', error);
    }
    };

    initMap().catch(error => {
      console.error('Failed to initialize map:', error);
    });
  }, [mounted, activeTab, activeLayers]);

  // Render plan nodes and routes on the map
  useEffect(() => {
    if (!mounted || !mapInstance.current || activeTab !== "map") return;
    if (!mapReady) return; // Wait for map to be fully ready
    
    const L = (window as any).L;
    if (!L) return;

    // Clear existing plan markers and routes
    if (planLayerGroup.current) {
      planLayerGroup.current.clearLayers();
    } else {
      planLayerGroup.current = L.layerGroup().addTo(mapInstance.current);
    }

    // Filter destination nodes from the plan
    const destinationNodes = nodes.filter(n => n.type === "destination");
    if (destinationNodes.length === 0) return;

    // Add markers for each destination in the plan
    destinationNodes.forEach((node, index) => {
      const dest = findDestination(node.data.name);
      if (!dest) return;

      // Create a distinct marker for plan nodes (larger, with border)
      const size = 28;
      const html = `<div style="
        width:${size}px;
        height:${size}px;
        background:#3b82f6;
        border:3px solid #fff;
        box-shadow:0 4px 12px rgba(59,130,246,0.4);
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#fff;
        font-size:12px;
        font-weight:bold;
      ">${index + 1}</div>`;

      const icon = L.divIcon({ 
        className: "", 
        html, 
        iconSize: [size, size], 
        iconAnchor: [size / 2, size / 2] 
      });
      
      const marker = L.marker([dest.lat, dest.lng], { icon }).addTo(planLayerGroup.current);
      
      // Add tooltip with destination name
      marker.bindTooltip(`${index + 1}. ${dest.name}`, {
        permanent: false,
        direction: "top",
        offset: [0, -size / 2 - 6],
        className: "map-tooltip",
      });

      marker.on("click", () => setSelectedDest(dest));
    });

    // Draw polylines between connected destinations using actual routes
    edges.forEach(async (edge) => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (!fromNode || !toNode) return;
      if (fromNode.type !== "destination" || toNode.type !== "destination") return;

      const fromDest = findDestination(fromNode.data.name);
      const toDest = findDestination(toNode.data.name);
      
      if (!fromDest || !toDest) return;

      try {
        // Use OSRM routing service to get actual route
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${fromDest.lng},${fromDest.lat};${toDest.lng},${toDest.lat}?overview=full&geometries=geojson`
        );
        
        if (!response.ok) throw new Error('Routing failed');
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const routeCoordinates = data.routes[0].geometry.coordinates.map(
            (coord: number[]) => [coord[1], coord[0]] // Convert [lng, lat] to [lat, lng]
          );
          
          // Draw animated polyline route with actual road path
          L.polyline(routeCoordinates, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(planLayerGroup.current);
        } else {
          // Fallback to straight line if routing fails
          L.polyline(
            [[fromDest.lat, fromDest.lng], [toDest.lat, toDest.lng]], 
            {
              color: '#3b82f6',
              weight: 4,
              opacity: 0.7,
              dashArray: '10, 10',
              lineCap: 'round',
              lineJoin: 'round',
            }
          ).addTo(planLayerGroup.current);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        // Fallback to straight line on error
        L.polyline(
          [[fromDest.lat, fromDest.lng], [toDest.lat, toDest.lng]], 
          {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineCap: 'round',
            lineJoin: 'round',
          }
        ).addTo(planLayerGroup.current);
      }
    });

    // Fit bounds to show entire route after all routes are drawn
    if (destinationNodes.length > 0) {
      const bounds = L.latLngBounds(
        destinationNodes.map(n => {
          const d = findDestination(n.data.name);
          return d ? [d.lat, d.lng] : [36.7538, 3.0588];
        })
      );
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [mounted, activeTab, nodes, edges, destinations, mapReady]);

  useEffect(() => {
    if (activeTab === "map" && mapReady && mapInstance.current) {
      // Use multiple invalidation attempts to ensure map renders correctly
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 100);
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 300);
    }
  }, [activeTab, mapReady]);

  // Auto-arrange nodes whenever a node is added
  const autoArrangeNodes = useCallback((nodesList: CanvasNode[]) => {
    const destinationNodes = nodesList.filter((n) => n.type === "destination");
    if (destinationNodes.length === 0) return nodesList;
    
    const viewportWidth = window.innerWidth - 288;
    const viewportHeight = window.innerHeight - 200;
    const maxNodes = Math.max(destinationNodes.length, 3);
    const positioned: Record<string, { x: number; y: number }> = {};
    let arrangedDestNodes: CanvasNode[] = [];

    if (arrangementMode === "horizontal") {
      const dynamicSpacing = Math.min(320, Math.max(200, (viewportWidth - 200) / maxNodes));
      const startY = 380;
      const startX = 400;
      
      arrangedDestNodes = nodesList.map((node) => {
        if (node.type === "destination") {
          const destIndex = destinationNodes.findIndex(n => n.id === node.id);
          const pos = { x: startX + destIndex * dynamicSpacing, y: startY };
          positioned[node.id] = pos;
          return { ...node, x: pos.x, y: pos.y };
        }
        return node;
      });
    } else {
      const dynamicSpacing = Math.min(320, Math.max(200, (viewportHeight - 200) / maxNodes));
      const startY = 150;
      const startX = 750;
      
      arrangedDestNodes = nodesList.map((node) => {
        if (node.type === "destination") {
          const destIndex = destinationNodes.findIndex(n => n.id === node.id);
          const pos = { x: startX, y: startY + destIndex * dynamicSpacing };
          positioned[node.id] = pos;
          return { ...node, x: pos.x, y: pos.y };
        }
        return node;
      });
    }

    // Now position child nodes relative to their parent destination using group-based logic
    const siblingCounters: Record<string, number> = {};
    
    return arrangedDestNodes.map((node) => {
      if (node.type === "destination") return node;
      
      let parentId: string | null = null;
      const nodeIndex = nodesList.findIndex(n => n.id === node.id);
      for (let i = nodeIndex - 1; i >= 0; i--) {
        if (nodesList[i].type === "destination") {
          parentId = nodesList[i].id;
          break;
        }
      }
      
      if (!parentId && destinationNodes.length > 0) {
        parentId = destinationNodes[0].id;
      }
      
      if (parentId && positioned[parentId]) {
        const parentPos = positioned[parentId];
        const isTopGroup = node.type === "activity" || node.type === "dining";
        const key = `${parentId}-${isTopGroup ? "top" : "bottom"}`;
        const count = siblingCounters[key] || 0;
        siblingCounters[key] = count + 1;

        const baseOffset = 160;
        const spreadFactor = 80;

        if (arrangementMode === "vertical") {
          const direction = isTopGroup ? -1 : 1;
          const childX = parentPos.x + direction * baseOffset;
          const childY = count === 0
            ? parentPos.y
            : parentPos.y + (count % 2 === 0 ? count * spreadFactor : -count * spreadFactor);
          return { ...node, x: childX, y: childY };
        } else {
          const direction = isTopGroup ? -1 : 1;
          const childY = parentPos.y + direction * baseOffset;
          const childX = count === 0
            ? parentPos.x
            : parentPos.x + (count % 2 === 0 ? count * spreadFactor : -count * spreadFactor);
          return { ...node, x: childX, y: childY };
        }
      }
      
      return node;
    });
  }, [arrangementMode]);

  // Auto-create edges when nodes are added
  const autoCreateEdges = useCallback((nodesList: CanvasNode[], edgesList: CanvasEdge[]) => {
    const destinationNodes = nodesList.filter((n) => n.type === "destination");
    if (destinationNodes.length < 2) return edgesList;
    
    const newEdges: CanvasEdge[] = [];
    for (let i = 0; i < destinationNodes.length - 1; i++) {
      const from = destinationNodes[i].id;
      const to = destinationNodes[i + 1].id;
      
      const edgeExists = edgesList.some(e => 
        (e.from === from && e.to === to) || (e.from === to && e.to === from)
      );
      
      if (!edgeExists) {
        newEdges.push({ id: `e${Date.now()}_${i}`, from, to });
      }
    }
    
    return [...edgesList, ...newEdges];
  }, []);

  const addNodeFromDestination = useCallback((dest: typeof destinations[0]) => {
    const existing = nodes.find((n) => n.type === "destination" && n.data.name === dest.name);
    if (existing) return;
    
    const id = `n${Date.now()}`;
    
    // Position next to the last destination without rearranging existing nodes
    const destinationNodes = nodes.filter(n => n.type === "destination");
    let newX = arrangementMode === "horizontal" ? 400 : 750;
    let newY = arrangementMode === "horizontal" ? 380 : 150;
    
    if (destinationNodes.length > 0) {
      const last = destinationNodes[destinationNodes.length - 1];
      if (arrangementMode === "horizontal") {
        newX = last.x + 280;
        newY = last.y;
      } else {
        newX = last.x;
        newY = last.y + 280;
      }
    }
    
    const newNode: CanvasNode = { 
      id, 
      type: "destination", 
      x: newX, 
      y: newY, 
      data: { name: dest.name, days: 1 } 
    };
    
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = autoCreateEdges(updatedNodes, edges);
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [nodes, edges, autoCreateEdges, arrangementMode]);

  const addStayNodeToCanvas = useCallback((name: string, nodeType: "hotel" | "activity" | "transport" | "dining") => {
    if (!selectedNode) return;
    const existing = nodes.find(n =>
      n.type === nodeType && n.data.name === name &&
      edges.some(e => (e.from === selectedNode && e.to === n.id) || (e.to === selectedNode && e.from === n.id))
    );
    if (existing) return;

    const parentNode = nodes.find(n => n.id === selectedNode);
    if (!parentNode) return;

    const isTopGroup = nodeType === "activity" || nodeType === "dining";
    const baseOffset = 160;
    const spreadFactor = 80;

    const groupTypes: string[] = isTopGroup ? ["activity", "dining"] : ["hotel", "transport"];
    const siblingsInGroup = nodes.filter(n =>
      groupTypes.includes(n.type) &&
      edges.some(e => (e.from === selectedNode && e.to === n.id) || (e.to === selectedNode && e.from === n.id))
    );
    const groupCount = siblingsInGroup.length;

    let childX = parentNode.x;
    let childY = parentNode.y;

    if (arrangementMode === "vertical") {
      const direction = isTopGroup ? -1 : 1;
      if (groupCount === 0) {
        childX = parentNode.x + direction * baseOffset;
        childY = parentNode.y;
      } else {
        childX = parentNode.x + direction * baseOffset;
        const spread = groupCount * spreadFactor;
        childY = parentNode.y + (groupCount % 2 === 0 ? spread : -spread);
      }
    } else {
      const direction = isTopGroup ? -1 : 1;
      if (groupCount === 0) {
        childX = parentNode.x;
        childY = parentNode.y + direction * baseOffset;
      } else {
        childY = parentNode.y + direction * baseOffset;
        const spread = groupCount * spreadFactor;
        childX = parentNode.x + (groupCount % 2 === 0 ? spread : -spread);
      }
    }

    const id = `n${Date.now()}`;
    const newNode: CanvasNode = { id, type: nodeType, x: childX, y: childY, data: { name, days: 1 } };
    setNodes([...nodes, newNode]);
    setEdges([...edges, { id: `e${Date.now()}`, from: selectedNode, to: id }]);
  }, [selectedNode, nodes, edges, arrangementMode]);

  const deleteNode = useCallback((nodeId: string) => {
    // Find connected child nodes (non-destination nodes connected to this one)
    const connectedChildIds = edges
      .filter(e => e.from === nodeId || e.to === nodeId)
      .map(e => e.from === nodeId ? e.to : e.from)
      .filter(id => {
        const n = nodes.find(nd => nd.id === id);
        return n && n.type !== "destination";
      });

    const idsToRemove = new Set([nodeId, ...connectedChildIds]);
    
    // Remove deleted nodes and connected child services from plan context
    nodes.filter(n => idsToRemove.has(n.id)).forEach(n => {
      if (n.data?.name) {
        removeFromPlan(String(n.data.name));
      }
    });

    const updatedNodes = nodes.filter(n => !idsToRemove.has(n.id));
    const updatedEdges = edges.filter(e => !idsToRemove.has(e.from) && !idsToRemove.has(e.to));
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setSelectedNode(null);
    setSidebarMode("default");
  }, [nodes, edges, removeFromPlan]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (canvasTool === "pan" && (e.button === 0 || e.button === 1)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      setSidebarMode("default");
      setSelectedNode(null);
    }
  }, [canvasOffset, canvasTool]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Touch event handlers for mobile panning
  const handleCanvasTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsPanning(true);
      setPanStart({ x: touch.clientX - canvasOffset.x, y: touch.clientY - canvasOffset.y });
      setSidebarMode("default");
      setSelectedNode(null);
    }
  }, [canvasOffset]);

  const handleCanvasTouchMove = useCallback((e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setCanvasOffset({ x: touch.clientX - panStart.x, y: touch.clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handleCanvasTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNode(nodeId);
    setSidebarMode("node-details");
  }, []);

  const getNodeCenter = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    const isDest = node.type === "destination";
    const w = isDest ? 120 : 72;
    const h = isDest ? 130 : 76;
    return { x: node.x + w / 2, y: node.y + h / 2 };
  }, [nodes]);

  const handleArrangementModeChange = useCallback((mode: ArrangementMode) => {
    setArrangementMode(mode);
    localStorage.setItem("arrangementMode", mode);
    
    const destinationNodes = nodes.filter((n) => n.type === "destination");
    if (destinationNodes.length === 0) return;
    
    const viewportWidth = window.innerWidth - 288;
    const viewportHeight = window.innerHeight - 200;
    const maxNodes = Math.max(destinationNodes.length, 3);
    
    const positioned: Record<string, { x: number; y: number }> = {};
    let arrangedNodes: CanvasNode[] = [];

    if (mode === "horizontal") {
      const dynamicSpacing = Math.min(320, Math.max(200, (viewportWidth - 200) / maxNodes));
      const startY = 380;
      const startX = 400;
      
      arrangedNodes = nodes.map((node) => {
        if (node.type === "destination") {
          const destIndex = destinationNodes.findIndex(n => n.id === node.id);
          const pos = { x: startX + destIndex * dynamicSpacing, y: startY };
          positioned[node.id] = pos;
          return { ...node, x: pos.x, y: pos.y };
        }
        return node;
      });
    } else {
      const dynamicSpacing = Math.min(320, Math.max(200, (viewportHeight - 200) / maxNodes));
      const startY = 150;
      const startX = 750;
      
      arrangedNodes = nodes.map((node) => {
        if (node.type === "destination") {
          const destIndex = destinationNodes.findIndex(n => n.id === node.id);
          const pos = { x: startX, y: startY + destIndex * dynamicSpacing };
          positioned[node.id] = pos;
          return { ...node, x: pos.x, y: pos.y };
        }
        return node;
      });
    }

    // Position child nodes relative to connected parent using group-based logic
    const siblingCounters: Record<string, number> = {};
    arrangedNodes = arrangedNodes.map((node) => {
      if (node.type === "destination") return node;
      
      const parentEdge = edges.find(e => e.from === node.id || e.to === node.id);
      const parentId = parentEdge
        ? (parentEdge.from === node.id ? parentEdge.to : parentEdge.from)
        : (destinationNodes.length > 0 ? destinationNodes[0].id : null);
      
      if (parentId && positioned[parentId]) {
        const parentPos = positioned[parentId];
        const isTopGroup = node.type === "activity" || node.type === "dining";
        const key = `${parentId}-${isTopGroup ? "top" : "bottom"}`;
        const count = siblingCounters[key] || 0;
        siblingCounters[key] = count + 1;

        const baseOffset = 160;
        const spreadFactor = 80;

        let childX = parentPos.x;
        let childY = parentPos.y;

        if (mode === "vertical") {
          const direction = isTopGroup ? -1 : 1;
          childX = parentPos.x + direction * baseOffset;
          if (count === 0) {
            childY = parentPos.y;
          } else {
            const spread = count * spreadFactor;
            childY = parentPos.y + (count % 2 === 0 ? spread : -spread);
          }
        } else {
          const direction = isTopGroup ? -1 : 1;
          childY = parentPos.y + direction * baseOffset;
          if (count === 0) {
            childX = parentPos.x;
          } else {
            const spread = count * spreadFactor;
            childX = parentPos.x + (count % 2 === 0 ? spread : -spread);
          }
        }
        
        return { ...node, x: childX, y: childY };
      }
      return node;
    });
    
    setNodes(arrangedNodes);
  }, [nodes, edges]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setCanvasZoom((z) => Math.min(Math.max(z + delta, 0.3), 3));
    };
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const updateSize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Get selected node data
  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const selectedDestination = selectedNodeData?.type === "destination" 
    ? findDestination(selectedNodeData.data.name)
    : null;
  // Fallback: if sidebar is in node-details mode but only selectedDest is set (from list double-click)
  const effectiveDestination = selectedDestination || (sidebarMode === "node-details" && selectedDest ? selectedDest : null);

  const stayActions = (() => {
    const wilayaName = effectiveDestination?.name ?? "";
    const matchingHotels = hotelsData.filter(h => h.city === wilayaName).slice(0, 4);
    const matchingRestaurants = restaurantsData.filter(r => r.city === wilayaName).slice(0, 4);
    const matchingActivities = activitiesData.filter(a => a.city === wilayaName).slice(0, 4);
    const matchingCars = vehiclesData.filter(v => v.city === wilayaName || v.city === "Alger" || v.city === "Algiers").slice(0, 4);

    const hotelItems = matchingHotels.length > 0
      ? matchingHotels.map((h, i) => ({ id: `h${i}`, name: h.name, subtitle: `${h.stars}-star • ${h.city}`, rating: h.rating, price: `${h.price.toLocaleString()} DA/night` }))
      : hotelsData.slice(0, 4).map((h, i) => ({ id: `h${i}`, name: h.name, subtitle: `${h.stars}-star • ${h.city}`, rating: h.rating, price: `${h.price.toLocaleString()} DA/night` }));

    const restaurantItems = matchingRestaurants.length > 0
      ? matchingRestaurants.map((r, i) => ({ id: `d${i}`, name: r.name, subtitle: `${r.cuisine} • ${r.city}`, rating: r.rating, price: r.priceRange }))
      : restaurantsData.slice(0, 4).map((r, i) => ({ id: `d${i}`, name: r.name, subtitle: `${r.cuisine} • ${r.city}`, rating: r.rating, price: r.priceRange }));

    const activityItems = matchingActivities.length > 0
      ? matchingActivities.map((a, i) => ({ id: `a${i}`, name: a.name, subtitle: `${a.duration} • ${a.city}`, rating: a.rating, price: `${a.price.toLocaleString()} DA` }))
      : activitiesData.slice(0, 4).map((a, i) => ({ id: `a${i}`, name: a.name, subtitle: `${a.duration} • ${a.city}`, rating: a.rating, price: `${a.price.toLocaleString()} DA` }));

    const carItems = matchingCars.length > 0
      ? matchingCars.map((c, i) => ({ id: `t${i}`, name: c.name, subtitle: `${c.type} • ${c.city}`, rating: c.rating, price: `${c.price.toLocaleString()} DA/day` }))
      : vehiclesData.slice(0, 4).map((c, i) => ({ id: `t${i}`, name: c.name, subtitle: `${c.type} • ${c.city}`, rating: c.rating, price: `${c.price.toLocaleString()} DA/day` }));

    return [
      { id: "hotels", icon: Hotel, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", title: "Hotels", desc: "Find stays", nodeType: "hotel" as const, items: hotelItems },
      { id: "dining", icon: UtensilsCrossed, color: "bg-orange-500/10 text-orange-600 dark:text-orange-400", title: "Dining", desc: "Local cuisine", nodeType: "dining" as const, items: restaurantItems },
      { id: "activities", icon: Sparkles, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", title: "Activities", desc: "Things to do", nodeType: "activity" as const, items: activityItems },
      { id: "transport", icon: Car, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", title: "Transport", desc: "Get around", nodeType: "transport" as const, items: carItems },
    ];
  })();

  // Look up real data for selected service node
  const serviceHotel = selectedNodeData?.type === "hotel"
    ? hotelsData.find(h => h.name === (selectedNodeData.data.name as string)) ?? null : null;
  const serviceActivity = selectedNodeData?.type === "activity"
    ? activitiesData.find(a => a.name === (selectedNodeData.data.name as string)) ?? null : null;
  const serviceVehicle = selectedNodeData?.type === "transport"
    ? vehiclesData.find(v => v.name === (selectedNodeData.data.name as string)) ?? null : null;
  const serviceRestaurant = selectedNodeData?.type === "dining"
    ? restaurantsData.find(r => r.name === (selectedNodeData.data.name as string)) ?? null : null;

  return (
    <AppShell>
    <div className="flex h-screen flex-col overflow-hidden">
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("mapLoadingPlan")}</p>
          </div>
        </div>
      ) : (
      <div className="flex flex-1">
        {/* Sidebar - single container with crossfading content */}
        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[39] sm:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <aside className={`fixed left-0 top-0 bottom-0 w-[85vw] max-w-[400px] sm:w-[400px] flex-col border-r border-border/40 bg-background flex z-[40] transition-transform duration-300 ease-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}>
          <AnimatePresence mode="wait" initial={false}>
            {sidebarMode === "default" ? (
              <motion.div
                key="default-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="flex flex-col flex-1 overflow-y-auto hide-scrollbar"
              >
                {/* Mobile close button + Search */}
                <div className="border-b border-border/40 p-3">
                  <div className="flex items-center gap-2 mb-2 sm:hidden">
                    <button
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 hover:bg-muted transition-colors"
                      aria-label="Close sidebar"
                    >
                      <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <span className="text-xs font-semibold text-foreground">Texa Planner</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/50 px-3 py-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t("mapSearchCity")}
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    {search && (
                      <button onClick={() => setSearch("")}>
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mode Switcher: Plan vs Map */}
                <div className="px-3 pt-2.5 pb-2 border-b border-border/40">
                  <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/40">
                    <button
                      onClick={() => setActiveTab("plan")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === "plan"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ListTodo className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Itinéraire</span>
                      {nodes.filter((n) => n.type === "destination").length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          {nodes.filter((n) => n.type === "destination").length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("map")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === "map"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Map className="w-3.5 h-3.5 text-blue-600" />
                      <span>Carte ({OFFICIAL_WILAYA_COUNT})</span>
                    </button>
                  </div>
                </div>

                {/* Arrangement Mode Toggle (Plan only) */}
                {activeTab === "plan" && (
                  <div className="border-b border-border/40 p-3">
                    <p className="text-[10px] font-semibold text-muted-foreground mb-2">{t("mapLayout")}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleArrangementModeChange("horizontal")}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-medium transition-all ${
                          arrangementMode === "horizontal"
                            ? "bg-foreground text-background"
                            : "border border-border/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <AlignHorizontalDistributeCenter className="h-3.5 w-3.5" />
                        {t("mapHorizontal")}
                      </button>
                      <button
                        onClick={() => handleArrangementModeChange("vertical")}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-medium transition-all ${
                          arrangementMode === "vertical"
                            ? "bg-foreground text-background"
                            : "border border-border/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <AlignVerticalDistributeCenter className="h-3.5 w-3.5" />
                        {t("mapVertical")}
                      </button>
                    </div>
                  </div>
                )}

                {/* Map Layers (Map only) */}
                {activeTab === "map" && (
                  <div className="border-b border-border/40 p-3">
                    <p className="text-[10px] font-semibold text-muted-foreground mb-2">{t("mapLayers")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {layers.map((layer) => {
                        const Icon = layer.icon;
                        const isActive = activeLayers.includes(layer.id);
                        return (
                          <button
                            key={layer.id}
                            onClick={() => {
                              setActiveLayers((prev) =>
                                prev.includes(layer.id)
                                  ? prev.filter((l) => l !== layer.id)
                                  : [...prev, layer.id]
                              );
                            }}
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-all ${
                              isActive
                                ? "bg-foreground text-background"
                                : "border border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
                            }`}
                          >
                            <Icon className="h-3 w-3" />
                            {t(layerLabels[layer.id])}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Circuits */}
                <CollapsibleSection title={t("mapCircuits")}>
                  <div className="space-y-1.5">
                    {circuits.map((circuit) => {
                      const Icon = circuit.icon;
                      const previewDestNodes = circuitPreview?.nodes.filter(n => n.type === "destination") ?? [];
                      const isActivePreview = circuitPreview !== null &&
                        previewDestNodes.length === circuit.destinations.length &&
                        circuit.destinations.every((d, i) => previewDestNodes[i]?.data.name === d);
                      return (
                        <div
                          key={circuit.name}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs transition-colors ${isActivePreview ? "bg-muted ring-1 ring-foreground/20" : ""}`}
                        >
                          <button
                            onClick={() => {
                              if (!isActivePreview) {
                                activateCircuit(circuit);
                              }
                            }}
                            className="flex flex-1 items-center gap-2.5 text-left"
                          >
                            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${circuit.color} text-background`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{circuit.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {circuit.destinations.join(" → ")}
                              </p>
                            </div>
                          </button>
                          {isActivePreview ? (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => validateCircuit()}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                                title="Accept circuit"
                              >
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                              </button>
                              <button
                                onClick={() => rejectCircuit()}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                title="Reject circuit"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleSection>

                {/* My Plan */}
                <CollapsibleSection title={t("navMyPlan")} count={planItems.length} defaultOpen={planItems.length > 0}>
                  {planItems.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground text-center py-2">{t("navPlanEmpty")}</p>
                  ) : (
                    <div className="space-y-1">
                      {planItems.map((item, i) => {
                        const destData = findDestination(item.name);
                        return (
                          <div
                            key={item.name}
                            onDoubleClick={() => {
                              if (destData) {
                                setSelectedDest(destData);
                                setSidebarMode("node-details");
                              }
                            }}
                            className="group flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-[9px] font-bold">
                              {i + 1}
                            </span>
                            {item.image ? (
                              <div className="relative h-8 w-8 rounded-lg overflow-hidden shrink-0 bg-muted">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                            )}
                            <div
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => {
                                window.location.href = `/destinations/${item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim()}`;
                              }}
                            >
                              <p className="font-medium truncate hover:underline">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{item.type} · {item.region}</p>
                            </div>
                            <button
                              onClick={() => removeFromPlan(item.name)}
                              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CollapsibleSection>

                {/* Destinations List (official wilayas) */}
                <CollapsibleSection title={`${t("destWilayas")} (${OFFICIAL_WILAYA_COUNT})`} count={filtered.length} defaultOpen={true} grow>
                  <div className="space-y-1">
                    {filtered.map((dest) => {
                      const isOnCanvas = nodes.some((n) => n.type === "destination" && n.data.name === dest.name);
                      return (
                        <div
                          key={dest.name}
                          onClick={() => {
                            setSelectedDest(dest);
                          }}
                          className={`group flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs transition-colors hover:bg-muted cursor-pointer border border-transparent ${
                            selectedDest?.name === dest.name ? "bg-muted border-border/40" : ""
                          }`}
                        >
                          {/* Wilaya Code */}
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted/80 text-[10px] font-bold text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                            {dest.code ? String(dest.code).padStart(2, "0") : ""}
                          </span>

                          {/* Image */}
                          <div className="relative h-7 w-7 rounded-lg overflow-hidden shrink-0 bg-muted">
                            <img src={dest.image} alt={dest.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate text-foreground text-[12px]">{dest.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{dest.subtitle || dest.region}</p>
                          </div>

                          {/* Insert / Delete Button */}
                          <div className="flex items-center gap-1 shrink-0">
                            {isOnCanvas ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nodeToRemove = nodes.find(n => n.type === "destination" && n.data.name === dest.name);
                                  if (nodeToRemove) {
                                    deleteNode(nodeToRemove.id);
                                  }
                                }}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all active:scale-95"
                                title={`Retirer ${dest.name} du plan`}
                                aria-label={`Retirer ${dest.name}`}
                              >
                                <X className="h-3 w-3" />
                                <span>Retirer</span>
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addNodeFromDestination(dest);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#008C61] hover:bg-[#007652] text-white shadow-xs transition-all active:scale-95"
                                title={`Insérer ${dest.name} dans le plan`}
                                aria-label={`Insérer ${dest.name}`}
                              >
                                <Plus className="h-3 w-3" />
                                <span>Insérer</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleSection>
              </motion.div>
            ) : (
              <motion.div
                key="node-details-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="flex flex-col flex-1 overflow-y-auto hide-scrollbar"
              >
                {/* Back button header */}
                <div className="border-b border-border/40 p-3 flex items-center gap-2 shrink-0">
                  <motion.button
                    onClick={() => {
                      setSidebarMode("default");
                      setSelectedNode(null);
                    }}
                    className="flex items-center gap-2 text-sm font-medium hover:text-foreground text-muted-foreground transition-colors"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("commonBack")}
                  </motion.button>
                </div>

                {/* ===== DESTINATION NODE ===== */}
                {effectiveDestination && (
                  <>
                    {/* Hero Image */}
                    <motion.div
                      className="relative h-48 w-full overflow-hidden shrink-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                    >
                      <div className="relative h-full w-full bg-muted">
                        <img
                          src={effectiveDestination.image}
                          alt={effectiveDestination.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
                      <motion.div
                        className="absolute top-3 right-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: 0.15 }}
                      >
                        <span className="inline-flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold shadow-sm border border-border/30">
                           {effectiveDestination.type}
                        </span>
                      </motion.div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.12 }}
                        >
                          <p className="text-[10px] font-medium text-muted-foreground mb-1 tracking-wider uppercase">
                            {effectiveDestination.subtitle}
                          </p>
                          <h2 className="text-xl font-bold tracking-tight">
                             {effectiveDestination.name}
                          </h2>
                        </motion.div>
                      </div>
                    </motion.div>

                    <div className="flex flex-col">
                      {/* Stats Row */}
                      <motion.div
                        className="flex items-center gap-2 px-4 py-3 border-b border-border/40"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.18 }}
                      >
                        <div className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1.5">
                          <span className="text-amber-500 text-xs">★</span>
                          <span className="text-[11px] font-semibold">{effectiveDestination.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1.5">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[11px] font-medium text-muted-foreground capitalize">{effectiveDestination.region}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1.5">
                          <Landmark className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[11px] font-medium text-muted-foreground">{effectiveDestination.type}</span>
                        </div>
                      </motion.div>

                      {/* Description */}
                      <motion.div
                        className="px-4 py-3"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.22 }}
                      >
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {effectiveDestination.description}
                        </p>
                      </motion.div>

                      {/* Plan Your Stay */}
                      <div className="px-4 pb-1">
                        <motion.p
                          className="text-[10px] font-semibold text-muted-foreground mb-2.5 tracking-wider"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.26 }}
                        >
                          {t("mapPlanYourStay")}
                        </motion.p>

                        <div className="grid grid-cols-2 gap-2">
                          {stayActions.map((action) => {
                            const isExpanded = expandedAction === action.id;
                            const isOther = expandedAction !== null && !isExpanded;
                            const Icon = action.icon;
                            return (
                              <motion.div
                                key={action.id}
                                layout
                                transition={{ layout: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
                                className={isExpanded ? "col-span-2" : ""}
                              >
                                <motion.button
                                  layout
                                  onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                                  whileTap={{ scale: 0.97 }}
                                  animate={{ opacity: isOther ? 0.4 : 1, scale: isOther ? 0.95 : 1 }}
                                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                  className={`group flex w-full items-center gap-2.5 rounded-xl border p-3 text-left transition-shadow duration-500 ${
                                    isExpanded
                                      ? "flex-row border-foreground/20 shadow-lg"
                                      : "flex-col items-start gap-1.5 border-border/40 hover:border-border hover:shadow-sm"
                                  }`}
                                >
                                  <div className={`flex shrink-0 items-center justify-center rounded-lg ${action.color} ${
                                    isExpanded ? "h-8 w-8" : "h-7 w-7"
                                  }`}>
                                    <Icon className={`${isExpanded ? "h-4 w-4" : "h-3.5 w-3.5"}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-semibold">{action.title}</p>
                                    <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                                  </div>
                                  <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    className="shrink-0"
                                  >
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                  </motion.div>
                                </motion.button>

                                <AnimatePresence initial={false}>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pt-2.5 pb-1 space-y-1">
                                        {action.items.map((item, j) => {
                                          const isStayInPlan = planItems.some(p => p.name === item.name) && selectedNode && edges.some(e => {
                                            const connectedId = e.from === selectedNode ? e.to : e.to === selectedNode ? e.from : null;
                                            if (!connectedId) return false;
                                            const connectedNode = nodes.find(n => n.id === connectedId);
                                            return connectedNode?.data.name === item.name;
                                          });
                                          return (
                                            <motion.button
                                              key={item.id}
                                              initial={{ opacity: 0, y: 6 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.45, delay: j * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (isStayInPlan) {
                                                  removeFromPlan(item.name);
                                                } else {
                                                  const categoryMap: Record<string, PlanCategory> = {
                                                    hotel: "hotel", activity: "activity", transport: "car", dining: "dining"
                                                  };
                                                  const cat = categoryMap[action.nodeType] || "wilaya";
                                                  let lookupImage = "";
                                                  if (cat === "hotel") {
                                                    const found = hotelsData.find(h => h.name === item.name);
                                                    if (found) lookupImage = found.image;
                                                  } else if (cat === "activity") {
                                                    const found = activitiesData.find(a => a.name === item.name);
                                                    if (found) lookupImage = found.image;
                                                  } else if (cat === "car") {
                                                    const found = vehiclesData.find(v => v.name === item.name);
                                                    if (found) lookupImage = found.image;
                                                  } else if (cat === "dining") {
                                                    const found = restaurantsData.find(r => r.name === item.name);
                                                    if (found) lookupImage = found.image;
                                                  }
                                                  addToPlan({
                                                    name: item.name,
                                                    subtitle: item.subtitle,
                                                    region: "",
                                                    type: action.title,
                                                    rating: item.rating,
                                                    description: "",
                                                    image: lookupImage,
                                                    category: cat,
                                                    price: item.price,
                                                  });
                                                  addStayNodeToCanvas(item.name, action.nodeType);
                                                }
                                              }}
                                              className="flex w-full items-center gap-2 rounded-lg border border-border/30 px-2.5 py-2 text-left hover:bg-muted/50 hover:border-border transition-all cursor-pointer"
                                            >
                                              <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-medium truncate">{item.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
                                              </div>
                                              <div className="shrink-0 text-right">
                                                <p className="text-[10px] font-semibold">{item.price}</p>
                                                <div className="flex items-center gap-0.5 justify-end">
                                                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                                  <p className="text-[9px] text-muted-foreground">{item.rating}</p>
                                                </div>
                                              </div>
                                              <div className={`h-6 w-6 shrink-0 flex items-center justify-center rounded-full transition-colors ${isStayInPlan ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
                                                {isStayInPlan ? (
                                                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                                                ) : (
                                                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                                                )}
                                              </div>
                                            </motion.button>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ===== HOTEL / ACTIVITY / TRANSPORT NODE ===== */}
                {selectedNodeData && selectedNodeData.type !== "destination" && (
                  <div className="flex flex-col">
                    {/* Node header card */}
                    <motion.div
                      className="mx-4 mt-4 rounded-xl border border-border/40 p-4"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.08 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${nodeStyles[selectedNodeData.type].bg} text-white`}>
                          {(() => { const Ic = nodeStyles[selectedNodeData.type].icon; return <Ic className="h-5 w-5" />; })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase mb-0.5">
                            {nodeStyles[selectedNodeData.type].label}
                          </p>
                          <h2 className="text-base font-bold truncate">{selectedNodeData.data.name as string}</h2>
                        </div>
                      </div>

                      {/* Info pills */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5" />
                          Connected to {selectedNodeData.type === "hotel" ? t("mapConnectedStay") : selectedNodeData.type === "transport" ? t("mapConnectedJourney") : t("mapConnectedExperience")}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                          <Landmark className="h-2.5 w-2.5" />
                          {selectedNodeData.data.days as number} day(s)
                        </span>
                      </div>
                    </motion.div>

                    {/* Connected parent node */}
                    {selectedNode && edges.filter(e => e.from === selectedNode || e.to === selectedNode).length > 0 && (
                      <motion.div
                        className="px-4 pt-3"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.14 }}
                      >
                        <p className="text-[10px] font-semibold text-muted-foreground mb-2 tracking-wider">{t("mapLinkedTo")}</p>
                        <div className="space-y-1.5">
                          {edges
                            .filter(e => e.from === selectedNode || e.to === selectedNode)
                            .map((edge) => {
                              const connectedId = edge.from === selectedNode ? edge.to : edge.from;
                              const connectedNode = nodes.find(n => n.id === connectedId);
                              if (!connectedNode) return null;
                              const connStyle = nodeStyles[connectedNode.type];
                              const ConnIcon = connStyle.icon;
                              return (
                                <button
                                  key={edge.id}
                                  onClick={() => setSelectedNode(connectedNode.id)}
                                  className="flex w-full items-center gap-2.5 rounded-lg border border-border/40 px-2.5 py-2 text-left transition-all hover:border-border hover:bg-muted/50"
                                >
                                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${connStyle.bg} text-white`}>
                                    <ConnIcon className="h-3 w-3" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-medium truncate">{connectedNode.data.name as string}</p>
                                    <p className="text-[10px] text-muted-foreground">{connStyle.label}</p>
                                  </div>
                                  <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                                </button>
                              );
                            })}
                        </div>
                      </motion.div>
                    )}

                    {/* Quick info based on type */}
                    <motion.div
                      className="px-4 pt-3"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.18 }}
                    >
                      <p className="text-[10px] font-semibold text-muted-foreground mb-2 tracking-wider">
                        {selectedNodeData.type === "hotel" ? t("mapHotelDetails") :
                         selectedNodeData.type === "transport" ? t("mapVehicleDetails") :
                         selectedNodeData.type === "dining" ? t("mapRestaurantDetails") : t("mapActivityDetails")}
                      </p>
                      <div className="rounded-xl border border-border/40 p-3 space-y-2">
                        {selectedNodeData.type === "hotel" && serviceHotel && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapCategory")}</span>
                              <span className="text-[11px] font-medium">{"★".repeat(serviceHotel.stars)} Hotel</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapPrice")}</span>
                              <span className="text-[11px] font-medium">{serviceHotel.price.toLocaleString()} DA/night</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapAmenities")}</span>
                              <span className="text-[11px] font-medium">{serviceHotel.amenities?.slice(0, 3).join(", ") ?? "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapRating")}</span>
                              <span className="text-[11px] font-medium">★ {serviceHotel.rating}</span>
                            </div>
                          </>
                        )}
                        {selectedNodeData.type === "transport" && serviceVehicle && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("destType")}</span>
                              <span className="text-[11px] font-medium">{serviceVehicle.type}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapPrice")}</span>
                              <span className="text-[11px] font-medium">{serviceVehicle.price.toLocaleString()} DA/day</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapIncluded")}</span>
                              <span className="text-[11px] font-medium">{serviceVehicle.kmIncluded ?? "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapSeats")}</span>
                              <span className="text-[11px] font-medium">{serviceVehicle.seats}</span>
                            </div>
                          </>
                        )}
                        {selectedNodeData.type === "activity" && serviceActivity && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapDuration")}</span>
                              <span className="text-[11px] font-medium">{serviceActivity.duration}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapPrice")}</span>
                              <span className="text-[11px] font-medium">{serviceActivity.price.toLocaleString()} DA</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapDifficulty")}</span>
                              <span className="text-[11px] font-medium">{serviceActivity.difficulty}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapRating")}</span>
                              <span className="text-[11px] font-medium">★ {serviceActivity.rating}</span>
                            </div>
                          </>
                        )}
                        {selectedNodeData.type === "dining" && serviceRestaurant && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapCuisine")}</span>
                              <span className="text-[11px] font-medium">{serviceRestaurant.cuisine}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapPriceRange")}</span>
                              <span className="text-[11px] font-medium">{serviceRestaurant.priceRange}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapRating")}</span>
                              <span className="text-[11px] font-medium">★ {serviceRestaurant.rating}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{t("mapSpecialties")}</span>
                              <span className="text-[11px] font-medium">{serviceRestaurant.specialties?.slice(0, 2).join(", ") ?? "N/A"}</span>
                            </div>
                          </>
                        )}
                        {selectedNodeData.type === "hotel" && !serviceHotel && (
                          <p className="text-[11px] text-muted-foreground text-center py-2">{t("mapNoDetails")}</p>
                        )}
                        {selectedNodeData.type === "transport" && !serviceVehicle && (
                          <p className="text-[11px] text-muted-foreground text-center py-2">{t("mapNoDetails")}</p>
                        )}
                        {selectedNodeData.type === "activity" && !serviceActivity && (
                          <p className="text-[11px] text-muted-foreground text-center py-2">{t("mapNoDetails")}</p>
                        )}
                        {selectedNodeData.type === "dining" && !serviceRestaurant && (
                          <p className="text-[11px] text-muted-foreground text-center py-2">{t("mapNoDetails")}</p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Delete */}
                <motion.div
                  className="px-4 py-3 mt-auto border-t border-border/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.42 }}
                >
                  <button
                    onClick={() => selectedNode && deleteNode(selectedNode)}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs font-medium text-red-600 transition-all hover:bg-red-500/10 hover:border-red-500/30"
                  >
                    <X className="h-3.5 w-3.5" />
                    {t("mapRemoveFromPlan")}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Chat Sidebar — slides in on top when Plan with AI pressed */}
        <AnimatePresence>
          {showChatSidebar && (
            <motion.div
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -500, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-full sm:w-[680px] flex flex-col bg-white z-[45] shadow-[8px_0_40px_rgba(0,0,0,0.12)]"
            >
              {/* Sidebar Header */}
              <div className="flex items-center gap-3 border-b border-border/40 px-3 py-2.5 shrink-0">
                {/* Back button */}
                <button
                  onClick={() => { setShowChatSidebar(false); setShowChatInput(false); }}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                  aria-label="Back to plan"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">{t("commonBack")}</span>
                </button>

                {/* Divider */}
                <div className="h-5 w-px bg-border/60 shrink-0" />

                {/* Agent identity */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#008C61] text-white">
                    <Compass className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold truncate">{t("mapPlannerAgent")}</h3>
                    <p className="text-[10px] text-muted-foreground">{planItems.length} {t("mapItemsInPlan")}</p>
                  </div>
                </div>

                {/* Clear chat */}
                {chatMessages.length > 0 && (
                  <button
                    onClick={() => setChatMessages([])}
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Clear conversation"
                    aria-label="Clear chat"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-1 min-h-0">
                {/* Chat Messages */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                    {chatMessages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#008C61]/10 mb-3">
                          <Compass className="h-7 w-7 text-[#008C61]" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1">{t("mapPlanTrip")}</h3>
                        <p className="text-[11px] text-muted-foreground max-w-[220px] mb-5">
                          {t("mapPlanTripDesc")}
                        </p>
                        <div className="space-y-1.5 w-full max-w-[240px]">
                          {[
                            t("mapSuggestionItinerary"),
                            t("mapSuggestionRoute"),
                            t("mapSuggestionHotels"),
                          ].map((q) => (
                            <button
                              key={q}
                              onClick={() => sendPlannerMessage(q)}
                              className="w-full rounded-xl border border-border/40 bg-background px-3 py-2 text-left text-[11px] transition-colors hover:bg-muted"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "ai" && (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-neutral-800 border border-border shadow-sm p-0.5 mt-0.5">
                            <img src="/logo.png" alt="Texa" className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="max-w-[85%]">
                          {msg.role === "user" ? (
                            <div className="rounded-2xl bg-muted px-3.5 py-2.5 text-sm text-foreground">
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                          ) : (
                            <>
                              <div className="prose prose-sm prose-neutral max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:my-1 prose-li:my-0 prose-strong:font-semibold prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                                <Markdown>{msg.text}</Markdown>
                                {chatStreaming &&
                                  msg.id === chatMessages[chatMessages.length - 1]?.id && (
                                    isConstructingPlan ? (
                                      <div className="mt-3 rounded-xl border border-[#008C61]/20 bg-[#008C61]/5 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                          <div className="relative flex h-8 w-8 items-center justify-center">
                                            <div className="absolute inset-0 rounded-full border-2 border-[#008C61]/20" />
                                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#008C61] animate-spin" />
                                            <Map className="h-3.5 w-3.5 text-[#008C61] relative z-10" />
                                          </div>
                                          <div>
                                            <p className="text-[11px] font-semibold text-[#008C61]">{t("mapConstructingPlan")}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{t("mapMappingRoutes")}</p>
                                          </div>
                                        </div>
                                        <div className="mt-2.5 flex gap-1">
                                          <div className="h-1 flex-1 rounded-full bg-[#008C61]/20 overflow-hidden">
                                            <div className="h-full w-1/3 rounded-full bg-[#008C61] animate-[slide_1.5s_ease-in-out_infinite]" />
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="inline-block w-1.5 h-4 bg-foreground/50 animate-pulse ml-0.5 align-text-bottom" />
                                    )
                                  )}
                              </div>
                              {!chatStreaming && msg.text && (
                                <div className="mt-1.5 flex items-center gap-0.5">
                                  <button
                                    onClick={() => handleCopy(msg.text, msg.id)}
                                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Copy"
                                  >
                                    {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(msg.id, msg.text, "thumbs_up", "planner")}
                                    className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted ${
                                      feedbackGiven[msg.id] === "thumbs_up" ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"
                                    }`}
                                    title="Good response"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(msg.id, msg.text, "thumbs_down", "planner")}
                                    className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted ${
                                      feedbackGiven[msg.id] === "thumbs_down" ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                                    }`}
                                    title="Poor response"
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleShare(msg.text)}
                                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Share"
                                  >
                                    <Share2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const lastUserMsg = [...chatMessages].reverse().find(m => m.role === "user");
                                      if (lastUserMsg) sendPlannerMessage(lastUserMsg.text);
                                    }}
                                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Regenerate"
                                  >
                                    <RefreshCw className="h-3 w-3" />
                                  </button>
                                  <div className="relative">
                                    <button
                                      onClick={() => setChatOpenMenu(chatOpenMenu === msg.id ? null : msg.id)}
                                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </button>
                                    <AnimatePresence>
                                      {chatOpenMenu === msg.id && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                          transition={{ duration: 0.15 }}
                                          className="absolute bottom-full left-0 mb-1 w-48 overflow-hidden rounded-xl border border-border/40 bg-background shadow-lg"
                                        >
                                          <button onClick={() => { setChatOpenMenu(null); handleReadAloud(msg.text); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                            <Volume2 className="h-3 w-3" /> {t("destReadAloud")}
                                          </button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* Plan Items Panel */}
                <div className="hidden sm:block w-[260px] border-l border-border/40 overflow-y-auto shrink-0 px-3 py-4 space-y-4">
                  {/* Budget / Luxury Sliders */}
                  <div className="rounded-xl border border-border/50 p-3 space-y-3">
                    <span className="text-[10px] font-semibold text-foreground">{t("mapTripPreferences")}</span>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-muted-foreground">{t("mapBudget")}</span>
                        <span className="text-[10px] font-bold text-foreground">{(budget * 500).toLocaleString()} DA</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-muted-foreground">{t("mapLuxury")}</span>
                        <span className="text-[10px] font-bold text-amber-500">
                          {Array.from({ length: Math.max(1, Math.round(luxury / 20)) }).map((_, i) => (
                            <span key={i}>&#9733;</span>
                          ))}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={luxury}
                        onChange={(e) => setLuxury(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-muted-foreground">{t("mapDaysToStay")}</span>
                        <span className="text-[10px] font-bold text-foreground">{days} day{days !== 1 ? 's' : ''}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={30}
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-foreground"
                      />
                    </div>
                  </div>

                  {/* Plan Items */}
                  {planItems.length === 0 ? (
                    <div className="text-center py-6">
                      <ListTodo className="h-5 w-5 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-[10px] text-muted-foreground">{t("mapNoItems")}</p>
                    </div>
                  ) : (
                    (["wilaya", "hotel", "activity", "dining", "car", "transport"] as PlanCategory[]).map(cat => {
                      const catItems = planItems.filter(i => i.category === cat);
                      if (catItems.length === 0) return null;
                      const catLabels: Record<PlanCategory, string> = {
                        wilaya: t("mapWilayas"), hotel: t("mapHotels"), activity: t("mapActivities"), dining: t("mapDining"), car: t("servicesCarsName"), transport: t("mapTransport")
                      };
                      const catIcons: Record<PlanCategory, typeof MapPin> = {
                        wilaya: MapPin, hotel: Hotel, activity: Compass, dining: UtensilsCrossed, car: Car, transport: Train
                      };
                      const CatIcon = catIcons[cat];
                      return (
                        <div key={cat}>
                          <div className="flex items-center gap-1 mb-1.5">
                            <CatIcon className="h-2.5 w-2.5 text-muted-foreground" />
                            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{catLabels[cat]}</span>
                          </div>
                          <div className="space-y-1">
                            {catItems.map(item => (
                              <div key={item.name} className="flex items-center gap-2 rounded-lg border border-border/30 px-2 py-1.5 group hover:bg-muted/30 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold truncate">{item.name}</p>
                                </div>
                                <button
                                  onClick={() => removeFromPlan(item.name)}
                                  className="opacity-0 group-hover:opacity-100 h-4 w-4 flex items-center justify-center rounded-full text-muted-foreground hover:text-red-500 transition-all shrink-0"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ─── Always-visible chat input ─── */}
              <div className="shrink-0 border-t border-border/40 px-3 py-3 bg-background">
                <div className="flex items-end gap-2 rounded-2xl border border-border/50 bg-muted/40 px-3 py-2 focus-within:border-foreground/30 focus-within:bg-background transition-colors shadow-sm">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendPlannerMessage();
                      }
                    }}
                    placeholder={t("mapAskAI")}
                    rows={1}
                    disabled={chatLoading}
                    className="flex-1 resize-none bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50 max-h-32 leading-relaxed"
                    style={{ fieldSizing: "content" } as React.CSSProperties}
                  />
                  <button
                    onClick={() => sendPlannerMessage()}
                    disabled={!chatInput.trim() || chatLoading}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#008C61] text-white transition-all hover:bg-[#007652] disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    aria-label="Send message"
                  >
                    {chatLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[9px] text-muted-foreground/60">
                  {t("destDisclaimer")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile sidebar open button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="fixed top-14 left-3 z-[35] flex sm:hidden h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-xl shadow-md border border-border/40 transition-all hover:scale-105 active:scale-95"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <div className="relative flex-1 sm:ml-[400px] ml-0 z-[30]">
          {/* Auto-save indicator */}
          {user && isSaving && (
            <div className="absolute top-4 left-4 z-[60] flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-xl px-3 py-1.5 shadow-lg border border-border/40">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{t("mapAutoSaving")}</span>
            </div>
          )}

          {/* Route Optimized Banner */}
          <AnimatePresence>
            {routeOptimizedToast && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-[70] flex flex-wrap items-center gap-3 rounded-2xl bg-background/95 backdrop-blur-xl px-4 py-2.5 shadow-2xl border border-emerald-500/30 text-xs max-w-[90vw]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>Route Optimized ({routeOptimizedToast.count} Wilayas)</span>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate max-w-[260px] sm:max-w-md">
                    {routeOptimizedToast.routeText}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={() => {
                      setActiveTab("map");
                      setShowChatSidebar(false);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      activeTab === "map"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    View Map
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("plan");
                      setShowChatSidebar(false);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      activeTab === "plan"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    View Canvas
                  </button>
                  <button
                    onClick={() => setRouteOptimizedToast(null)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plan View - Infinite Canvas */}
          {activeTab === "plan" && (
            <motion.div
              key="plan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 overflow-hidden bg-[#f8f9fa] dark:bg-[#0a0a0a] ${canvasTool === "pan" ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onTouchStart={handleCanvasTouchStart}
                onTouchMove={handleCanvasTouchMove}
                onTouchEnd={handleCanvasTouchEnd}
                style={{ touchAction: 'none' }}
                ref={canvasRef}
              >
                {/* Desktop canvas tools */}
                <div className="absolute right-4 top-4 z-30 hidden items-center gap-1 rounded-2xl border border-border/50 bg-background/90 p-1.5 shadow-lg backdrop-blur-xl sm:flex">
                  <button
                    type="button"
                    onClick={() => setCanvasTool("pan")}
                    title="Pan canvas"
                    aria-label="Pan canvas"
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${canvasTool === "pan" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    <Hand className="h-4 w-4" />
                  </button>
                  <span className="mx-0.5 h-5 w-px bg-border/70" />
                  <button
                    type="button"
                    onClick={() => setCanvasZoom((zoom) => Math.min(zoom + 0.1, 3))}
                    title="Zoom in"
                    aria-label="Zoom in"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanvasZoom((zoom) => Math.max(zoom - 0.1, 0.3))}
                    title="Zoom out"
                    aria-label="Zoom out"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCanvasOffset({ x: 0, y: 0 });
                      setCanvasZoom(1);
                    }}
                    title="Reset canvas view"
                    aria-label="Reset canvas view"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <LocateFixed className="h-4 w-4" />
                  </button>
                </div>

                {/* Mobile canvas tools - Zoom controls */}
                <div className="absolute right-4 bottom-20 z-30 flex sm:hidden flex-col items-center gap-1 rounded-2xl border border-border/50 bg-background/95 p-1.5 shadow-lg backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => setCanvasZoom((zoom) => Math.min(zoom + 0.15, 3))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors active:bg-muted active:text-foreground"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                  <span className="h-px w-6 bg-border/70" />
                  <button
                    type="button"
                    onClick={() => setCanvasZoom((zoom) => Math.max(zoom - 0.15, 0.3))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors active:bg-muted active:text-foreground"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <span className="h-px w-6 bg-border/70" />
                  <button
                    type="button"
                    onClick={() => {
                      setCanvasOffset({ x: 0, y: 0 });
                      setCanvasZoom(1);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors active:bg-muted active:text-foreground"
                    aria-label="Reset view"
                  >
                    <LocateFixed className="h-5 w-5" />
                  </button>
                </div>

                {/* Grid Background */}
                <div
                  className="absolute inset-0 canvas-grid-bg"
                  style={{
                    backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
                    backgroundSize: `${24 * canvasZoom}px ${24 * canvasZoom}px`,
                  }}
                />

                {/* Canvas Content */}
                <div
                  className="absolute"
                  style={{
                    transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
                    transformOrigin: "0 0",
                    width: `${canvasSize.width}px`,
                    height: `${canvasSize.height}px`,
                  }}
                >
                  {/* SVG Edges */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}
                  >
                    <defs>
                      {/* Arrow markers */}
                      <marker id="arrowhead" markerWidth="14" markerHeight="14" refX="12" refY="3.5" orient="auto" markerUnits="strokeWidth">
                        <polygon points="0 0, 14 3.5, 0 7" fill="#6366f1" fillOpacity="0.85" />
                      </marker>
                      <marker id="arrowhead-hover" markerWidth="16" markerHeight="16" refX="14" refY="4" orient="auto" markerUnits="strokeWidth">
                        <polygon points="0 0, 16 4, 0 8" fill="#4f46e5" />
                      </marker>
                      <marker id="arrowhead-preview" markerWidth="14" markerHeight="14" refX="12" refY="3.5" orient="auto" markerUnits="strokeWidth">
                        <polygon points="0 0, 14 3.5, 0 7" fill="#10b981" fillOpacity="0.85" />
                      </marker>
                      <marker id="arrowhead-service" markerWidth="10" markerHeight="10" refX="8" refY="2.5" orient="auto" markerUnits="strokeWidth">
                        <polygon points="0 0, 10 2.5, 0 5" fill="#94a3b8" fillOpacity="0.6" />
                      </marker>

                      {/* Glow filters */}
                      <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="node-glow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="soft-shadow" x="-20%" y="-10%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.12" />
                      </filter>

                      {/* Edge gradients */}
                      <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.3" />
                        <stop offset="30%" stopColor="#818cf8" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#6366f1" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="edge-gradient-hover" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.5" />
                        <stop offset="30%" stopColor="#818cf8" stopOpacity="1" />
                        <stop offset="70%" stopColor="#6366f1" stopOpacity="1" />
                        <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.5" />
                      </linearGradient>
                      <linearGradient id="preview-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.3" />
                        <stop offset="30%" stopColor="#6ee7b7" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#10b981" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="service-edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
                      </linearGradient>

                      {/* Animations */}
                      <style>{`
                        @keyframes dash-flow {
                          to { stroke-dashoffset: -24; }
                        }
                        @keyframes dash-flow-reverse {
                          to { stroke-dashoffset: 24; }
                        }
                        .edge-animated { animation: dash-flow 1.2s linear infinite; }
                        .edge-animated-reverse { animation: dash-flow-reverse 1.2s linear infinite; }
                        .edge-draw { stroke-dasharray: 1000; animation: edge-draw 0.8s ease-out forwards; }
                      `}</style>
                    </defs>
                    {/* Render current edges */}
                    {!circuitPreview && edges.map((edge) => {
                      const from = getNodeCenter(edge.from);
                      const to = getNodeCenter(edge.to);
                      const midX = (from.x + to.x) / 2;
                      const midY = (from.y + to.y) / 2;
                      
                      const dx = to.x - from.x;
                      const dy = to.y - from.y;
                      const length = Math.sqrt(dx * dx + dy * dy);
                      
                      const shortenBy = 4;
                      const ratio = Math.max(0.1, (length - shortenBy) / length);
                      const endX = from.x + dx * ratio;
                      const endY = from.y + dy * ratio;
                      
                      // Determine if this is a destination-to-destination edge
                      const fromNode = nodes.find(n => n.id === edge.from);
                      const toNode = nodes.find(n => n.id === edge.to);
                      const isDestToDest = fromNode?.type === "destination" && toNode?.type === "destination";
                      
                      // Smoother bezier curve
                      const curveStrength = Math.min(length * 0.18, 55);
                      const perpX = -dy / length * curveStrength;
                      const perpY = dx / length * curveStrength;
                      const ctrl1x = from.x + dx * 0.3 + perpX * 0.7;
                      const ctrl1y = from.y + dy * 0.3 + perpY * 0.7;
                      const ctrl2x = from.x + dx * 0.7 + perpX * 0.35;
                      const ctrl2y = from.y + dy * 0.7 + perpY * 0.35;
                      
                      const pathD = `M ${from.x} ${from.y} C ${ctrl1x} ${ctrl1y}, ${ctrl2x} ${ctrl2y}, ${endX} ${endY}`;

                      return (
                        <g key={edge.id}>
                          {/* Wide hover area */}
                          <path
                            d={pathD}
                            stroke="transparent"
                            strokeWidth="24"
                            fill="none"
                            strokeLinecap="round"
                            className="pointer-events-auto cursor-pointer"
                            onClick={() => setEdges((prev) => prev.filter((e) => e.id !== edge.id))}
                          />

                          {/* Outer glow shadow */}
                          <path
                            d={pathD}
                            stroke={isDestToDest ? "#6366f1" : "#94a3b8"}
                            strokeWidth={isDestToDest ? "12" : "6"}
                            strokeOpacity="0.07"
                            fill="none"
                            strokeLinecap="round"
                          />

                          {/* Main edge */}
                          <path
                            d={pathD}
                            stroke={isDestToDest ? "url(#edge-gradient)" : "url(#service-edge-gradient)"}
                            strokeWidth={isDestToDest ? "3.5" : "2"}
                            strokeOpacity={isDestToDest ? "0.85" : "0.5"}
                            strokeDasharray={isDestToDest ? "16 8" : "5 7"}
                            fill="none"
                            strokeLinecap="round"
                            markerEnd={isDestToDest ? "url(#arrowhead)" : "url(#arrowhead-service)"}
                            className="pointer-events-none edge-animated"
                          />

                          {/* Flowing light overlay */}
                          <path
                            d={pathD}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth={isDestToDest ? "1.5" : "1"}
                            strokeDasharray="3 24"
                            fill="none"
                            strokeLinecap="round"
                            className="pointer-events-none edge-animated-reverse"
                          />

                          {/* Animated particles along the edge */}
                          {isDestToDest && [0, 1, 2].map((i) => (
                            <circle
                              key={`particle-${edge.id}-${i}`}
                              r="2.5"
                              fill="#818cf8"
                              opacity="0.7"
                              className="edge-particle"
                              style={{
                                offsetPath: `path('${pathD}')`,
                                animationDelay: `${i * 0.8}s`,
                              }}
                            />
                          ))}

                          {/* Edge label */}
                          {edge.label && (
                            <g>
                              <rect
                                x={midX - edge.label.length * 3.5}
                                y={midY - 26}
                                width={edge.label.length * 7 + 14}
                                height="20"
                                rx="10"
                                fill="white"
                                stroke="#e5e7eb"
                                strokeWidth="1"
                                filter="url(#soft-shadow)"
                                className="pointer-events-none"
                              />
                              <text
                                x={midX}
                                y={midY - 13}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-gray-600 pointer-events-none"
                                style={{ fontSize: "10px", fontWeight: "600" }}
                              >
                                {edge.label}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                    {/* Render preview edges */}
                    {circuitPreview && circuitPreview.edges.map((edge) => {
                      const fromNode = circuitPreview.nodes.find(n => n.id === edge.from);
                      const toNode = circuitPreview.nodes.find(n => n.id === edge.to);
                      if (!fromNode || !toNode) return null;

                      const from = { x: fromNode.x + 60, y: fromNode.y + 65 };
                      const to = { x: toNode.x + 60, y: toNode.y + 65 };
                      const dx = to.x - from.x;
                      const dy = to.y - from.y;
                      const length = Math.sqrt(dx * dx + dy * dy);
                      const shortenBy = 4;
                      const ratio = Math.max(0.1, (length - shortenBy) / length);
                      const endX = from.x + dx * ratio;
                      const endY = from.y + dy * ratio;

                      const curveStrength = Math.min(length * 0.15, 40);
                      const perpX = -dy / length * curveStrength;
                      const perpY = dx / length * curveStrength;
                      const ctrl1x = from.x + dx * 0.3 + perpX * 0.6;
                      const ctrl1y = from.y + dy * 0.3 + perpY * 0.6;
                      const ctrl2x = from.x + dx * 0.7 + perpX * 0.3;
                      const ctrl2y = from.y + dy * 0.7 + perpY * 0.3;
                      const pathD = `M ${from.x} ${from.y} C ${ctrl1x} ${ctrl1y}, ${ctrl2x} ${ctrl2y}, ${endX} ${endY}`;

                      return (
                        <g key={edge.id}>
                          {/* Outer glow */}
                          <path
                            d={pathD}
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeOpacity="0.08"
                            fill="none"
                            strokeLinecap="round"
                          />
                          {/* Main edge */}
                          <path
                            d={pathD}
                            stroke="url(#preview-gradient)"
                            strokeWidth="4"
                            strokeOpacity="0.85"
                            strokeDasharray="14 8"
                            fill="none"
                            strokeLinecap="round"
                            markerEnd="url(#arrowhead-preview)"
                            className="edge-animated"
                          />
                          {/* Flowing light overlay */}
                          <path
                            d={pathD}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="1.5"
                            strokeDasharray="3 24"
                            fill="none"
                            strokeLinecap="round"
                            className="pointer-events-none edge-animated-reverse"
                          />
                          {/* Particles */}
                          {[0, 1].map((i) => (
                            <circle
                              key={`preview-particle-${edge.id}-${i}`}
                              r="2"
                              fill="#34d399"
                              opacity="0.6"
                              className="edge-particle"
                              style={{
                                offsetPath: `path('${pathD}')`,
                                animationDelay: `${i * 1}s`,
                              }}
                            />
                          ))}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Circle Nodes - Current */}
                  {!circuitPreview && nodes.map((node) => {
                    const style = nodeStyles[node.type];
                    const Icon = style.icon;
                    const isSelected = selectedNode === node.id;
                    const isDestination = node.type === "destination";
                    const dest = isDestination ? findDestination(node.data.name) : null;
                    
                    // Step number only for destination (wilaya) nodes
                    const destNodes = nodes.filter(n => n.type === "destination");
                    const stepNum = isDestination ? destNodes.findIndex(n => n.id === node.id) + 1 : null;

                    return (
                      <div
                        key={node.id}
                        className={`canvas-node absolute select-none ${isSelected ? "z-20" : "z-10"}`}
                        style={{ left: node.x, top: node.y }}
                        onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                      >
                        <div className="group relative">
                          {/* Selection pulse ring */}
                          {isSelected && (
                            <>
                              <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br ${style.gradient} opacity-10 blur-xl`} />
                              <div className="absolute -inset-3 rounded-3xl border-2 border-current opacity-20 animate-[node-pulse-ring_2s_ease-out_infinite]" style={{ borderColor: style.particleColor }} />
                            </>
                          )}

                          {/* Direct Delete button on node */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNode(node.id);
                            }}
                            className="absolute -top-2 -right-2 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100 opacity-90 hover:scale-110 active:scale-95"
                            title="Supprimer cette étape"
                            aria-label="Supprimer"
                          >
                            <X className="h-3 w-3 stroke-[2.5]" />
                          </button>

                          {isDestination ? (
                            /* Destination node: rich card with image, badge, and type pill */
                            <div
                              className={`relative flex flex-col items-center w-[120px] rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-white dark:bg-gray-900 border ${
                                isSelected 
                                  ? `border-gray-300 dark:border-gray-600 shadow-2xl scale-105 ${style.glow}`
                                  : `border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-[1.03] hover:border-gray-300 dark:hover:border-gray-600`
                              }`}
                              style={{ filter: isSelected ? 'none' : undefined }}
                            >
                              {/* Image strip */}
                              <div className="relative w-full h-[52px] overflow-hidden">
                                {dest?.image ? (
                                  <div className="relative w-full h-full bg-muted">
                                    <img
                                      src={dest.image}
                                      alt={dest.name as string}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                  </div>
                                ) : (
                                  <div className={`w-full h-full bg-gradient-to-br ${style.gradient}`} />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                
                                {/* Step number badge */}
                                {stepNum !== null && (
                                  <div className="absolute top-1.5 left-1.5 node-badge-pop">
                                    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-md border border-white/80">
                                      <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">{stepNum}</span>
                                    </div>
                                  </div>
                                )}

                                {/* Rating badge */}
                                {dest?.rating && (
                                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded-full bg-black/50 backdrop-blur-sm px-1.5 py-0.5">
                                    <span className="text-amber-400 text-[8px]">★</span>
                                    <span className="text-white text-[8px] font-semibold">{dest.rating}</span>
                                  </div>
                                )}
                              </div>

                              {/* Content area */}
                              <div className="w-full px-2.5 py-2">
                                {/* Icon + Name */}
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${style.gradient} text-white shadow-sm`}>
                                    <Icon className="h-3 w-3 drop-shadow-sm" />
                                  </div>
                                  <p className="text-[11px] font-bold leading-tight text-gray-900 dark:text-white truncate">
                                    {node.data.name as string}
                                  </p>
                                </div>

                                {/* Type pill */}
                                {dest && (
                                  <div className="flex items-center gap-1">
                                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${
                                      dest.type === "UNESCO" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                                      dest.type === "Capital" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                      dest.type === "Sahara" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                      dest.type === "Coastal" ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" :
                                      dest.type === "Mountains" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                      dest.type === "Historical" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                    }`}>
                                      {dest.type}
                                    </span>
                                    {dest.region && (
                                      <span className="text-[8px] text-gray-400 dark:text-gray-500 truncate">{dest.region}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* Service node: compact vertical card with icon on top, name below */
                            <div
                              className={`relative flex flex-col items-center w-[72px] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer bg-white dark:bg-gray-900 border ${
                                isSelected 
                                  ? `shadow-xl scale-110 ${style.glow}`
                                  : `shadow-md hover:shadow-lg hover:scale-105`
                              }`}
                              style={{ borderColor: isSelected ? style.particleColor : undefined }}
                            >
                              {/* Icon centered */}
                              <div className="flex items-center justify-center pt-2 pb-1">
                                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${style.gradient} text-white shadow-md`}>
                                  <Icon className="h-4.5 w-4.5 drop-shadow-sm" />
                                </div>
                              </div>

                              {/* Name below icon */}
                              <div className="w-full px-1.5 pb-2 text-center">
                                <p className="text-[9px] font-bold leading-tight text-gray-700 dark:text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-[64px] mx-auto">
                                  {node.data.name as string}
                                </p>
                              </div>

                              {/* Bottom accent strip */}
                              <div className="w-full h-[3px]" style={{ backgroundColor: style.particleColor }} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Circuit Preview Nodes */}
                  {circuitPreview && circuitPreview.nodes.map((node) => {
                    const Icon = MapPin;
                    const dest = findDestination(node.data.name);
                    return (
                      <div
                        key={node.id}
                        className="canvas-node absolute select-none z-10"
                        style={{ left: node.x, top: node.y }}
                      >
                        <div className="group relative">
                          {/* Glow */}
                          <div className="absolute -inset-4 rounded-3xl bg-emerald-400 opacity-10 blur-xl" />
                          
                          <div className="relative flex flex-col items-center w-[120px] rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border-2 border-emerald-400 shadow-xl ring-3 ring-emerald-300/50 scale-105 transition-all">
                            {/* Content */}
                            <div className="w-full px-2.5 py-3">
                              <div className="flex items-center gap-1.5">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-sm">
                                  <Icon className="h-3 w-3 drop-shadow-sm" />
                                </div>
                                <p className="text-[11px] font-bold leading-tight text-gray-900 dark:text-white truncate">
                                  {node.data.name as string}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Circuit Preview Banner - Removed, accept/reject now inline in sidebar */}
                </div>

                {/* Mini Map — only on desktop, top-right so it never overlaps content */}
                {nodes.length > 0 && (
                <div className="absolute top-4 right-4 z-[60] hidden sm:block">
                  <div className="h-24 w-36 rounded-xl border border-border/40 bg-background/90 backdrop-blur-xl shadow-lg overflow-hidden">
                    <div className="px-2 pt-1.5 pb-0.5 flex items-center justify-between">
                      <span className="text-[8px] font-semibold text-muted-foreground/60 uppercase tracking-wider">{t("mapOverview")}</span>
                      <span className="text-[8px] text-muted-foreground/50">{nodes.filter(n => n.type === 'destination').length} étapes</span>
                    </div>
                    <div className="relative h-[calc(100%-20px)] w-full px-1 pb-1">
                      {/* Draw mini edges */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {(circuitPreview ? circuitPreview.edges : edges).map((edge) => {
                          const allNodes = circuitPreview ? circuitPreview.nodes : nodes;
                          const fromNode = allNodes.find(n => n.id === edge.from);
                          const toNode = allNodes.find(n => n.id === edge.to);
                          if (!fromNode || !toNode) return null;
                          const isDest = fromNode.type === "destination" && toNode.type === "destination";
                          const x1 = Math.max(0, Math.min(100, (fromNode.x / canvasSize.width) * 100));
                          const y1 = Math.max(0, Math.min(100, (fromNode.y / canvasSize.height) * 100));
                          const x2 = Math.max(0, Math.min(100, (toNode.x / canvasSize.width) * 100));
                          const y2 = Math.max(0, Math.min(100, (toNode.y / canvasSize.height) * 100));
                          return (
                            <line key={edge.id} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} 
                              stroke={circuitPreview ? "#10b981" : isDest ? "#6366f1" : "#94a3b8"}
                              strokeWidth={isDest ? "1.5" : "1"}
                              strokeOpacity={isDest ? "0.5" : "0.25"}
                              strokeDasharray={isDest ? "none" : "2 2"} />
                          );
                        })}
                      </svg>
                      {(circuitPreview ? circuitPreview.nodes : nodes).map((node) => {
                        const leftPercent = Math.max(0, Math.min(98, (node.x / canvasSize.width) * 100));
                        const topPercent = Math.max(0, Math.min(98, (node.y / canvasSize.height) * 100));
                        return (
                          <div
                            key={node.id}
                            className="absolute shadow-sm"
                            style={{ 
                              left: `${leftPercent}%`, 
                              top: `${topPercent}%`, 
                              transform: 'translate(-50%, -50%)',
                              width: node.type === 'destination' ? '7px' : '4px',
                              height: node.type === 'destination' ? '7px' : '4px',
                              borderRadius: '2px',
                              backgroundColor: circuitPreview ? "#10b981" : nodeStyles[node.type].particleColor,
                              border: node.type === 'destination' ? `1.5px solid rgba(255,255,255,0.8)` : 'none',
                            }}
                          />
                        );
                      })}
                      <div
                        className="absolute border border-foreground/20 rounded-sm bg-foreground/[0.03]"
                        style={{
                          left: `${Math.max(0, Math.min(100, (-canvasOffset.x / canvasZoom / canvasSize.width) * 100))}%`,
                          top: `${Math.max(0, Math.min(100, (-canvasOffset.y / canvasZoom / canvasSize.height) * 100))}%`,
                          width: `${Math.min(100, (windowSize.w / canvasZoom / canvasSize.width) * 100)}%`,
                          height: `${Math.min(100, (windowSize.h / canvasZoom / canvasSize.height) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                )}
              </motion.div>
            )}

            {/* Map View - Leaflet Map */}
            {mounted && (
              <div
                className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
                  activeTab === "map" ? "opacity-100 z-[1]" : "opacity-0 pointer-events-none -z-10"
                }`}
                ref={mapRef}
                style={{ width: '100%', height: '100%' }}
              />
            )}

            {/* Map Legend */}
            {activeTab === "map" && mounted && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="absolute top-20 right-3 sm:top-6 sm:right-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2.5 z-[1000] max-w-[150px] hidden sm:block"
              >
                <h3 className="text-[10px] font-semibold mb-2 text-gray-900 dark:text-white">{t("mapLegend")}</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                    </div>
                    <span className="text-[10px] text-gray-700 dark:text-gray-300">{t("mapLegendCapital")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-purple-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{transform: 'rotate(45deg)', borderRadius: '2px'}}></div>
                    <span className="text-[10px] text-gray-700 dark:text-gray-300">{t("mapLayerUnesco")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <span className="text-[10px] text-gray-700 dark:text-gray-300">{t("mapLegendCities")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-amber-600 flex-shrink-0"></div>
                    <span className="text-[10px] text-gray-700 dark:text-gray-300">{t("mapLayerHistorical")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
                    <span className="text-[10px] text-gray-700 dark:text-gray-300">{t("mapLegendSahara")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-600 flex-shrink-0"></div>
                    <span className="text-[10px] text-gray-700 dark:text-gray-300">{t("mapLegendParks")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0"></div>
                    <span className="text-[10px] text-gray-700 dark:text-gray-300">{t("mapLegendBeaches")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                      <Plane className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-[10px] text-gray-700 dark:text-gray-300">{t("mapLayerAirports")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0"></div>
                    <span className="text-[10px] text-gray-700 dark:text-gray-300">{t("mapLayerSki")}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Destination Quick Actions Panel */}
            <AnimatePresence>
              {activeTab === "map" && selectedDest && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 sm:bottom-6 sm:left-auto sm:right-4 sm:translate-x-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-[1000] w-[calc(100vw-2rem)] max-w-[260px]"
                >
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedDest(null)}
                    className="absolute top-2 right-2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </button>

                  {/* Destination Info */}
                  <div className="mb-2.5 pr-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {selectedDest.code && (
                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[9px] font-bold text-muted-foreground">
                          {String(selectedDest.code).padStart(2, '0')}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {selectedDest.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">
                        <span className="text-amber-500 text-[10px]">★</span>
                        <span className="text-[10px] font-semibold text-gray-900 dark:text-white">{selectedDest.rating}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize bg-muted px-1.5 py-0.5 rounded">{selectedDest.type}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">{selectedDest.region}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        window.location.href = `/destinations/${selectedDest.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()}`;
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-background hover:bg-foreground/90 px-3 py-2 rounded-xl text-[11px] font-medium transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      {t("commonDiscover")}
                    </button>
                    <button
                      onClick={() => {
                        addNodeFromDestination(selectedDest);
                        setActiveTab("plan");
                        setSelectedDest(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#008C61] hover:bg-[#007652] text-white px-3 py-2 rounded-xl text-[11px] font-medium transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {t("commonAddToPlan")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          {/* Floating Sub Navigation + Chat Input */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center gap-3">
            <AnimatePresence>
              {showChatInput && (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 40, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex items-end gap-2"
                >
                  {/* Floating button to reopen chat sidebar */}
                  <AnimatePresence>
                    {chatMessages.length > 0 && !showChatSidebar && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={() => setShowChatSidebar(true)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#008C61] text-white shadow-lg shadow-[#008C61]/30 transition-transform hover:scale-110 mb-6"
                        title="Open Planner Chat"
                      >
                        <Compass className="h-4 w-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <div className="w-[520px] max-w-[calc(100vw-2rem)]">
                    <div className="flex items-end gap-2 rounded-2xl border border-border/40 bg-background/95 backdrop-blur-xl px-3 py-2 shadow-lg shadow-black/5 focus-within:border-foreground/20">
                      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground">
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground">
                        <ImageIcon className="h-4 w-4" />
                      </button>
                      <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendPlannerMessage();
                          }
                        }}
                        placeholder={t("mapAskAI")}
                        rows={1}
                        className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                      />
                      <button
                        onClick={() => sendPlannerMessage()}
                        disabled={!chatInput.trim() || chatLoading}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-30"
                      >
                        {chatLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1.5 text-center text-[8px] text-muted-foreground">
                      {t("destDisclaimer")}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-background/95 backdrop-blur-xl border border-border shadow-lg max-w-[calc(100vw-2rem)]">
              {/* Mobile button to open Wilayas list */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title={`${OFFICIAL_WILAYA_COUNT} Wilayas`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{OFFICIAL_WILAYA_COUNT}</span>
              </button>

              {/* Plan Mode Toggle */}
              <button
                onClick={() => setActiveTab("plan")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === "plan"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <ListTodo className="h-3.5 w-3.5" />
                <span>Plan</span>
                {nodes.filter((n) => n.type === "destination").length > 0 && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    activeTab === "plan" 
                      ? "bg-background/20 text-background" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {nodes.filter((n) => n.type === "destination").length}
                  </span>
                )}
              </button>

              {/* Map Mode Toggle */}
              <button
                onClick={() => setActiveTab("map")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === "map"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Map className="h-3.5 w-3.5" />
                <span>Carte</span>
              </button>

              {/* AI Chat Button */}
              <button
                onClick={() => {
                  setShowChatSidebar(!showChatSidebar);
                  setShowChatInput(!showChatInput);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title="Conseiller IA"
                aria-label="Assistant IA"
              >
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
    </AppShell>
  );
}
