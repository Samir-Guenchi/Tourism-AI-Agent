"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ChevronRight } from "lucide-react";
import AppShell from "@/components/app-shell";
import { officialWilayas, generateSlug } from "@/lib/destinations-data";
import { useLanguage } from "@/contexts/language-context";

const regionMeta: Record<string, { name: string; description: string }> = {
  all: { name: "Toutes les Wilayas", description: "wilayas à explorer en Algérie" },
  north: { name: "Nord", description: "wilayas du nord de l'Algérie" },
  highlands: { name: "Hauts Plateaux", description: "wilayas des Hauts Plateaux algériens" },
  sahara: { name: "Sud & Sahara", description: "wilayas du Sahara algérien" },
  littoral: {
    name: "Littoral",
    description: "wilayas bordant la Méditerranée",
  },
};

const littoralWilayas = new Set([
  "Chlef", "Béjaïa", "Jijel", "Skikda", "Annaba", "El Tarf",
  "Oran", "Mostaganem", "Aïn Témouchent", "Boumerdès", "Tipaza",
  "Algiers", "Blida", "Mila", "Guelma",
]);

function getFilteredDestinations(filterKey: string) {
  if (filterKey === "littoral") {
    return officialWilayas.filter((d) => littoralWilayas.has(d.name));
  }
    if (filterKey === "all") return officialWilayas;
    return officialWilayas.filter((d) => d.region === filterKey);
}

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

function ListContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const region = searchParams.get("region") || "all";
  const filtered = getFilteredDestinations(region);
  const meta = regionMeta[region] || regionMeta.all;

  const filterTabs = [
    { id: "all", label: "Toutes", count: officialWilayas.length },
    { id: "north", label: "Nord", count: officialWilayas.filter((d) => d.region === "north").length },
    { id: "highlands", label: "Hauts Plateaux", count: officialWilayas.filter((d) => d.region === "highlands").length },
    { id: "sahara", label: "Sud & Sahara", count: officialWilayas.filter((d) => d.region === "sahara").length },
    { id: "littoral", label: "Littoral", count: officialWilayas.filter((d) => littoralWilayas.has(d.name)).length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12 pt-28 sm:pt-36 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: smoothEase }}
        >
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-medium mb-6 rounded-full bg-muted/60 px-3.5 py-1.5 border border-border/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("destBackToMap")}</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-2">
                {t(`region${region.charAt(0).toUpperCase() + region.slice(1)}` as any) || meta.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filtered.length} wilayas prêtes à être explorées
              </p>
            </div>

            {/* Region Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl border border-border/60 overflow-x-auto no-scrollbar max-w-full">
              {filterTabs.map((tab) => {
                const isActive = region === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={tab.id === "all" ? "/destinations/list" : `/destinations/list?region=${tab.id}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-background text-foreground shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] ${isActive ? "text-emerald-600 font-bold" : "opacity-60"}`}>
                      {tab.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.02, 0.3) } }}
            >
              <Link
                href={`/destinations/${generateSlug(dest.name)}`}
                className="group block bg-card border border-border/70 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative w-full h-[160px] overflow-hidden bg-muted">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-white uppercase">
                      {dest.type}
                    </span>
                    <span className="flex items-center gap-1 text-white text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {dest.rating}
                    </span>
                  </div>
                </div>
                <div className="p-3.5">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">{dest.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{dest.subtitle}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DestinationListPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="min-h-screen bg-white grid place-items-center">
          <p className="text-[#5A7A6F] text-lg">Loading...</p>
        </div>
      }>
        <ListContent />
      </Suspense>
    </AppShell>
  );
}
