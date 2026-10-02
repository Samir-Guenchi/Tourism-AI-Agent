"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  Building2,
  Car,
  UtensilsCrossed,
  Compass,
  Train,
  CalendarCheck,
  ShieldCheck,
  Star,
  Search,
  Mail,
  X,
  Sparkles,
  Map,
  CheckCircle2,
  Clock,
  Layers,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { OFFICIAL_WILAYA_COUNT, officialWilayas, generateSlug } from "@/lib/destinations-data";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// Key counters for credibility and scale
const counters = [
  { icon: MapPin, value: OFFICIAL_WILAYA_COUNT, suffix: "", label: "Wilayas d'Algérie" },
  { icon: Building2, value: 500, suffix: "+", label: "Hôtels & Riads" },
  { icon: Compass, value: 2000, suffix: "+", label: "Sites & Monuments" },
  { icon: ShieldCheck, value: 100, suffix: "%", label: "Tarifs officiels en DA" },
];

// The 4 Acts Story of Algeria
const storyActs = [
  {
    id: "coast",
    act: "Acte I",
    title: "Le Souffle Méditerranéen",
    subtitle: "1 600 km de côtes sauvages & cités blanches",
    description:
      "Des criques turquoises de Tipaza aux ruelles blanches de la Casbah d'Alger, en passant par le port vibrant d'Oran et la corniche de Béjaïa. Une rencontre magique entre mer et histoire millénaire.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/La_baie_d%27Alger_%28cropped%29.jpg/3840px-La_baie_d%27Alger_%28cropped%29.jpg",
    destinations: ["Alger", "Oran", "Tipaza", "Béjaïa", "Annaba"],
    link: "/destinations/algiers",
    tag: "Littoral & Plages",
  },
  {
    id: "history",
    act: "Acte II",
    title: "La Mémoire des Cités Millénaires",
    subtitle: "Ponts suspendus, art zianide & cités romaines",
    description:
      "Franchissez les gorges vertigineuses de Constantine, marchez sur les pavés romains de Timgad et Djémila, et admirez la dentelle d'architecture arabo-andalouse du Mechouar à Tlemcen.",
    image: "/home-page-pic/constantine.jpg",
    destinations: ["Constantine", "Batna (Timgad)", "Tlemcen", "Sétif (Djémila)"],
    link: "/destinations/constantine",
    tag: "Patrimoine & Histoire",
  },
  {
    id: "oasis",
    act: "Acte III",
    title: "La Douceur des Oasis de la Saoura",
    subtitle: "Dunes géantes du Grand Erg & cités du M'Zab",
    description:
      "À l'ombre des palmeraies de Taghit et Timimoun, laissez-vous porter par la terre ocre des ksour ancestraux et la géométrie sacrée des cinq cités de la vallée du M'Zab à Ghardaïa.",
    image: "/home-page-pic/beni-abbes.jpg",
    destinations: ["Taghit", "Timimoun", "Ghardaïa", "Béni Abbès", "Biskra"],
    link: "/destinations/beni-abbes",
    tag: "Oasis & Ksour",
  },
  {
    id: "desert",
    act: "Acte IV",
    title: "L'Infini Sacré du Sahara",
    subtitle: "Forêts de grès du Tassili & sommets du Hoggar",
    description:
      "Sous la voûte d'étoiles la plus pure du monde, vivez l'émerveillement des cathédrales rocheuses de Djanet et les couchers de soleil mythiques sur l'Assekrem à Tamanrasset.",
    image: "/home-page-pic/tassili-djanet.jpg",
    destinations: ["Djanet (Tassili)", "Tamanrasset (Hoggar)", "Illizi"],
    link: "/destinations/djanet",
    tag: "Grand Sud & Bivouac",
  },
];

// Curated highlights for the traveler persona
const travelerProfiles = [
  {
    id: "desert",
    label: "Aventurier du Désert",
    title: "Immersion dans les sables du Grand Sud",
    days: "5 à 8 jours",
    bestSeason: "Octobre à Avril",
    summary: "Bivouac sous les étoiles, méharée dans les dunes et découverte de peintures rupestres datant de 10 000 ans.",
    cities: [
      { name: "Djanet & Tassili", img: "/home-page-pic/tassili-djanet.jpg", slug: "djanet" },
      { name: "Taghit Saoura", img: "/home-page-pic/beni-abbes.jpg", slug: "beni-abbes" },
      { name: "Ghardaïa M'Zab", img: "/home-page-pic/oran.jpg", slug: "oran" },
    ],
  },
  {
    id: "culture",
    label: "Amoureux de Patrimoine",
    title: "Le grand circuit des cités historiques",
    days: "4 à 7 jours",
    bestSeason: "Toute l'année",
    summary: "Palais ottomans, ponts suspendus vertigineux, ruines romaines de Timgad et trésors de l'art andalou.",
    cities: [
      { name: "Constantine", img: "/home-page-pic/constantine.jpg", slug: "constantine" },
      { name: "Tlemcen Zianide", img: "/home-page-pic/tlemcen.jpg", slug: "tlemcen" },
      { name: "Tipaza Romaine", img: "/home-page-pic/tipaza.jpg", slug: "tipaza" },
    ],
  },
  {
    id: "coast",
    label: "Évasion Mer & Montagnes",
    title: "Fraîcheur méditerranéenne et forêts d'altitude",
    days: "3 à 6 jours",
    bestSeason: "Mai à Octobre",
    summary: "Plages secrètes aux eaux cristallines, randonnées dans les cèdres de Chréa et falaises côtières du Djurdjura.",
    cities: [
      { name: "Alger la Blanche", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/La_baie_d%27Alger_%28cropped%29.jpg/3840px-La_baie_d%27Alger_%28cropped%29.jpg", slug: "algiers" },
      { name: "Oran El Bahia", img: "/home-page-pic/oran.jpg", slug: "oran" },
      { name: "Chréa National Park", img: "/home-page-pic/chrea.jpg", slug: "chrea" },
    ],
  },
];

const serviceCards = [
  {
    title: "Hôtels & Riads",
    desc: "Établissements 3 à 5 étoiles, palais sahariens et maisons d'hôtes de charme.",
    icon: Building2,
    href: "/services/hotels",
    badge: "500+ adresses",
  },
  {
    title: "Location de Véhicules",
    desc: "4x4 tout-terrain pour le désert et berlines confortables avec assurance complète.",
    icon: Car,
    href: "/services/cars",
    badge: "Flotte vérifiée",
  },
  {
    title: "Gastronomie & Tables",
    desc: "Plats traditionnels raffinés, poissons frais de la côte et spécialités du terroir.",
    icon: UtensilsCrossed,
    href: "/services/restaurants",
    badge: "Cuisine authentique",
  },
  {
    title: "Activités & Aventures",
    desc: "Excursions guidées, bivouacs sahariens, sorties plongée et randonnées.",
    icon: Compass,
    href: "/services/activities",
    badge: "Guides certifiés",
  },
  {
    title: "Transports & Lignes",
    desc: "Train Coradia SNTF, vols intérieurs Air Algérie et navettes inter-wilayas.",
    icon: Train,
    href: "/services/transport",
    badge: "Réseau national",
  },
];

const whyTexa = [
  {
    number: "01",
    title: "Une authenticité préservée",
    desc: "L'Algérie offre un tourisme à taille humaine, respectueux des traditions locales, sans foules de masse.",
  },
  {
    number: "02",
    title: "Des tarifs officiels et clairs",
    desc: "Tous les prix des hébergements, véhicules et activités sont affichés en Dinars Algériens (DA), sans frais cachés.",
  },
  {
    number: "03",
    title: "Un carnet de route sur mesure",
    desc: "Enregistrez vos coups de cœur et visualisez votre itinéraire jour par jour sur notre carte interactive.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    origin: "Lyon, France",
    text: "Un voyage gravé à jamais dans ma mémoire. Le coucher de soleil sur les dunes de Taghit et l'accueil des habitants ont dépassé toutes mes espérances.",
    rating: 5,
  },
  {
    name: "Karim B.",
    origin: "Alger, Algérie",
    text: "Texa est devenu indispensable pour planifier nos vacances en famille. Trouver un hôtel fiable à Oran ou louer un bon 4x4 se fait en quelques minutes.",
    rating: 5,
  },
  {
    name: "Marco R.",
    origin: "Milan, Italie",
    text: "Les ponts de Constantine et les ruines de Timgad sont des merveilles absolues. Une plateforme propre, efficace et des informations très précises.",
    rating: 5,
  },
];

function Counter({
  icon: Icon,
  value,
  suffix,
  label,
  index,
}: {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  index: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1600;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div
      ref={ref}
      className={`flex items-center justify-center gap-3 px-3 py-3 text-left sm:flex-col sm:gap-2 sm:text-center sm:px-5 sm:py-2 ${
        index % 2 === 1 ? "border-l border-zinc-200" : ""
      } ${index > 0 ? "sm:border-l" : "sm:border-l-0"}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f0ee] text-[#1f5c53]">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <span className="block text-2xl font-bold tracking-tight text-zinc-950 tabular-nums sm:text-3xl">
          {count.toLocaleString()}
          {suffix}
        </span>
        <span className="block truncate text-[11px] font-medium text-zinc-500 sm:text-xs">{label}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeAct, setActiveAct] = useState(0);
  const [activePersona, setActivePersona] = useState("desert");
  const [showContact, setShowContact] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      router.push("/destinations");
    } else {
      router.push(`/destinations?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const selectedPersona =
    travelerProfiles.find((p) => p.id === activePersona) || travelerProfiles[0];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Top Navbar — Crisp light with dark text */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-3.5 sm:px-8 bg-white/90 border-b border-zinc-200/80 backdrop-blur-md shadow-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Texa Logo" className="h-8 w-8 rounded-lg shadow-sm" />
          <span className="text-base font-bold text-zinc-950 tracking-tight">Texa</span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-zinc-600">
          <Link href="/destinations" className="hover:text-zinc-950 transition-colors">
            Destinations
          </Link>
          <Link href="/services/hotels" className="hover:text-zinc-950 transition-colors">
            Hôtels
          </Link>
          <Link href="/services/activities" className="hover:text-zinc-950 transition-colors">
            Activités
          </Link>
          <Link href="/services/transport" className="hover:text-zinc-950 transition-colors">
            Transports
          </Link>
          <Link href="/map" className="hover:text-zinc-950 transition-colors flex items-center gap-1.5">
            <Map className="h-3.5 w-3.5 text-emerald-600" />
            <span>Carte Interactive</span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/auth"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-zinc-800 shadow-sm"
          >
            <span>Mon Espace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section — Inspiring & Luminous */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/La_baie_d%27Alger_%28cropped%29.jpg/3840px-La_baie_d%27Alger_%28cropped%29.jpg"
            alt="Baie d'Alger"
            className="h-full w-full object-cover"
          />
          {/* Subtle gradient overlay to make text pop while keeping photography bright */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center text-white">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
            {/* Main Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight"
            >
              L&apos;Algérie comme vous
              <br />
              <span className="font-light text-white/90">ne l&apos;avez jamais vue</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-white/85">
              Des eaux turquoises de la Méditerranée aux dunes d&apos;or du Sahara, préparez votre voyage en toute sérénité.
            </motion.p>

            {/* Search Box */}
            <motion.form
              variants={fadeUp}
              onSubmit={handleSearchSubmit}
              className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-white/30 bg-white/20 p-2 backdrop-blur-xl shadow-2xl"
            >
              <Search className="ml-3 h-4 w-4 shrink-0 text-white/80" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Où commence votre aventure ? (ex: Oran, Djanet, Taghit...)"
                className="w-full min-w-0 bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none px-2"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-zinc-950 transition-opacity hover:opacity-95 cursor-pointer shadow-md"
              >
                <span>Explorer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.form>

            {/* Quick Suggestions */}
            <motion.div
              variants={fadeUp}
              className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80"
            >
              <span className="text-[11px] uppercase tracking-wider text-white/60 mr-1">Idées de séjour :</span>
              {["Alger", "Oran", "Constantine", "Djanet", "Taghit", "Tipaza", "Tlemcen"].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => router.push(`/destinations?search=${city.toLowerCase()}`)}
                  className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] text-white hover:bg-white/25 transition-colors cursor-pointer"
                >
                  {city}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="h-5 w-5" />
        </div>
      </section>

      {/* Counters Bar — PURE WHITE BACKGROUND */}
      <section className="border-y border-zinc-200/80 bg-[#fbfaf8] py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {counters.map((c, index) => (
              <Counter key={c.label} {...c} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* THE STORY OF ALGERIA (4 Acts) — INNOVATIVE NARRATIVE SCENARIO */}
      <section className="border-b border-zinc-200/80 bg-zinc-50/70 py-12 sm:py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-2">
              Le Grand Récit
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
              L&apos;Algérie en 4 Tableaux
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Un pays continent aux contrastes infinis. Choisissez un univers et laissez-vous transporter.
            </p>
          </div>

          {/* Act Switcher Tabs */}
          <div className="mb-4 grid w-full grid-cols-4 gap-1 sm:flex sm:items-center sm:justify-center sm:gap-2">
            {storyActs.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveAct(idx)}
                className={`flex min-w-0 items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold transition-all sm:shrink-0 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-xs ${
                  activeAct === idx
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                }`}
              >
                <span className="sm:hidden">{item.act}</span>
                <span className="hidden sm:inline">{item.act}</span>
                <span className="hidden sm:inline">{item.title}</span>
              </button>
            ))}
          </div>

          {/* Active Story Card — editorial header with destination cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={storyActs[activeAct].id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8"
            >
              <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{storyActs[activeAct].act}</p>
                  <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl">
                    {storyActs[activeAct].title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{storyActs[activeAct].description}</p>
                </div>
                <span className="shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-600">
                  {storyActs[activeAct].tag}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {storyActs[activeAct].destinations.slice(0, 3).map((name) => {
                  const destination = officialWilayas.find((item) =>
                    name.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(name.toLowerCase())
                  );
                  const image = destination?.image || storyActs[activeAct].image;
                  const href = destination ? `/destinations/${generateSlug(destination.name)}` : storyActs[activeAct].link;

                  return (
                    <Link key={`${storyActs[activeAct].id}-${name}`} href={href} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-md">
                      <div className="relative h-44 overflow-hidden bg-zinc-100 sm:h-48">
                        <img src={image} alt={name} className="h-full w-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
                          <p className="truncate text-sm font-bold text-white">{name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-3.5 py-3 text-xs font-semibold text-zinc-700">
                        <span>Explorer la wilaya</span>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* TRAVEL PERSONA / QUEL VOYAGEUR ÊTES-VOUS ? */}
      <section className="bg-white border-b border-zinc-200/80 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Quel voyageur êtes-vous ?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Choisissez votre style de voyage et découvrez nos recommandations immédiates.
            </p>
          </div>

          {/* Persona selector pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {travelerProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activePersona === p.id
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Persona Detail Card */}
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-zinc-200/80">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900">
                  {selectedPersona.title}
                </h3>
                <p className="text-xs text-zinc-600 mt-1 max-w-xl">
                  {selectedPersona.summary}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="rounded-xl bg-white border border-zinc-200 px-3.5 py-1.5 text-center">
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Durée conseillée</p>
                  <p className="text-xs font-bold text-zinc-800">{selectedPersona.days}</p>
                </div>
                <div className="rounded-xl bg-white border border-zinc-200 px-3.5 py-1.5 text-center">
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Période idéale</p>
                  <p className="text-xs font-bold text-zinc-800">{selectedPersona.bestSeason}</p>
                </div>
              </div>
            </div>

            {/* 3 City Cards */}
            <div className="grid gap-5 sm:grid-cols-3">
              {selectedPersona.cities.map((city) => (
                <Link
                  key={city.name}
                  href={`/destinations/${city.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-zinc-400 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={city.img}
                      alt={city.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-sm font-bold">{city.name}</p>
                    </div>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-700 group-hover:text-zinc-950">
                      Explorer la wilaya
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 SERVICE PILLARS — WHITE & CLEAN */}
      <section className="border-b border-zinc-200/80 bg-[#fbfaf8] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 shadow-sm ring-1 ring-zinc-200">
              Prestations & Confort
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Tout pour organiser votre séjour
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Des prestataires locaux rigoureusement sélectionnés pour voyager sereinement.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
            {serviceCards.map((svc) => (
              <Link
                key={svc.title}
                href={svc.href}
                aria-label={`Consulter ${svc.title}`}
                className="group flex min-h-[252px] flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-lg"
              >
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <svc.icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-600">
                      {svc.badge}
                    </span>
                  </div>
                  <h3 className="mb-2 text-sm font-bold leading-5 text-zinc-950">{svc.title}</h3>
                  <p className="text-xs leading-5 text-zinc-500">{svc.desc}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs font-semibold text-zinc-900">
                  <span>Consulter</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE TEXA */}
      <section className="border-b border-zinc-200/80 bg-[#fbfaf8] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto mb-10 max-w-xl text-center sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Pourquoi voyager avec Texa ?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Une démarche engagée pour valoriser la richesse touristique de notre pays.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {whyTexa.map((item) => (
              <div
                key={item.number}
                className="group flex min-h-[220px] flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md sm:p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tight text-[#1f5c53]">{item.number}</span>
                    <span className="h-2 w-2 rounded-full bg-[#b07a2b] transition-transform group-hover:scale-150" />
                  </div>
                  <h3 className="mb-2 mt-5 text-base font-bold text-zinc-950">{item.title}</h3>
                  <p className="text-sm leading-6 text-zinc-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-b border-zinc-200/80 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Témoignages de voyageurs
            </h2>
            <p className="mt-1.5 text-xs text-zinc-500">
              Des récits sincères d&apos;amoureux de l&apos;Algérie.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex min-h-[245px] flex-col justify-between rounded-2xl border border-zinc-200 bg-[#fbfaf8] p-5 transition-shadow hover:shadow-md sm:p-6"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-3xl font-serif leading-none text-[#b07a2b]">“</span>
                    <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-zinc-700">{t.text}</p>
                </div>
                <div className="mt-5 border-t border-zinc-200 pt-3">
                  <p className="text-xs font-bold text-zinc-900">{t.name}</p>
                  <p className="text-[11px] text-zinc-400">{t.origin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL INVITATION CTA */}
      <section className="bg-[#fbfaf8] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-14">
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              Prêt à explorer les merveilles de l&apos;Algérie ?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-zinc-600 sm:text-sm">
              Consultez les {OFFICIAL_WILAYA_COUNT} wilayas, créez votre itinéraire personnalisé et partez vivre l&apos;inattendu.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-zinc-800"
              >
                <span>Explorer les {OFFICIAL_WILAYA_COUNT} Wilayas</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-800 transition-all hover:bg-zinc-50"
              >
                <Map className="h-3.5 w-3.5 text-[#1f5c53]" />
                <span>Ouvrir la Carte</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER — CRISP CLEAN LIGHT */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Texa Logo" className="h-6 w-6 rounded" />
                <span className="font-bold text-sm tracking-tight text-zinc-950">Texa</span>
              </div>
              <p className="mt-3 max-w-xs text-xs text-zinc-500 leading-relaxed">
                Plateforme officielle de valorisation touristique et de réservation pour les {OFFICIAL_WILAYA_COUNT} wilayas d&apos;Algérie.
              </p>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-900">
                Destinations
              </h4>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li><Link href="/destinations/algiers" className="hover:text-zinc-950">Alger</Link></li>
                <li><Link href="/destinations/oran" className="hover:text-zinc-950">Oran</Link></li>
                <li><Link href="/destinations/constantine" className="hover:text-zinc-950">Constantine</Link></li>
                <li><Link href="/destinations/djanet" className="hover:text-zinc-950">Djanet</Link></li>
                <li><Link href="/destinations/tipaza" className="hover:text-zinc-950">Tipaza</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-900">
                Prestations
              </h4>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li><Link href="/services/hotels" className="hover:text-zinc-950">Hôtels & Riads</Link></li>
                <li><Link href="/services/cars" className="hover:text-zinc-950">Location de Voitures</Link></li>
                <li><Link href="/services/restaurants" className="hover:text-zinc-950">Gastronomie</Link></li>
                <li><Link href="/services/activities" className="hover:text-zinc-950">Activités & Bivouacs</Link></li>
                <li><Link href="/services/transport" className="hover:text-zinc-950">Lignes & Trains</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-900">
                Assistance
              </h4>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li><Link href="/privacy" className="hover:text-zinc-950">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-zinc-950">Conditions Générales</Link></li>
                <li>
                  <button onClick={() => setShowContact(true)} className="hover:text-zinc-950 text-left">
                    Nous Contacter
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400">
            © 2026 Texa Algérie. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowContact(false)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl text-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-900">Contact & Assistance</h3>
              <button
                onClick={() => setShowContact(false)}
                className="rounded-lg p-1 hover:bg-zinc-100 text-zinc-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <Mail className="h-5 w-5" />
              </div>
              <p className="text-xs text-zinc-600">
                Une question sur un itinéraire, un hôtel ou un partenariat ? Écrivez-nous à tout moment.
              </p>
              <a
                href="mailto:contact@texa.dz"
                className="text-sm font-bold text-zinc-900 underline underline-offset-4"
              >
                contact@texa.dz
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
