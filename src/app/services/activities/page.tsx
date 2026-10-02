"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Star,
  ArrowRight,
  ChevronDown,
  Plus,
  Check,
  Compass,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Award,
  Filter,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import SearchBar from "@/components/search-bar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePlan } from "@/contexts/plan-context";
import { activities, activityCities, activityTypes } from "@/lib/activities-data";
import { useLanguage } from "@/contexts/language-context";

const difficultyColors: Record<string, string> = {
  Facile: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Easy: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Modéré: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Moderate: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Sportif: "bg-red-500/15 text-red-700 dark:text-red-300",
  Challenging: "bg-red-500/15 text-red-700 dark:text-red-300",
};

type SortOption = "rating" | "reviews" | "price-low" | "price-high";

function SortDropdown({
  value,
  onChange,
  labels,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
  labels: { rating: string; reviews: string; priceLow: string; priceHigh: string };
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "rating", label: labels.rating },
    { value: "reviews", label: labels.reviews },
    { value: "price-low", label: labels.priceLow },
    { value: "price-high", label: labels.priceHigh },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground backdrop-blur-sm"
      >
        <span>{sortOptions.find((o) => o.value === value)?.label}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-xl border border-border/60 bg-background p-1 shadow-xl backdrop-blur-md"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                  value === option.value
                    ? "bg-foreground/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ActivitiesPage() {
  const { addToPlan, isInPlan, removeFromPlan } = usePlan();
  const { t } = useLanguage();
  const [city, setCity] = useState("All");
  const [type, setType] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const resetFilters = () => {
    setCity("All");
    setType("all");
  };

  const hasActiveFilters = city !== "All" || type !== "all";
  const activeFilterCount = (city !== "All" ? 1 : 0) + (type !== "all" ? 1 : 0);

  const filtered = useMemo(() => {
    return activities
      .filter((a) => {
        if (city !== "All" && a.city.toLowerCase() !== city.toLowerCase()) return false;
        if (type !== "all" && a.type !== type) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "reviews":
            return b.reviews - a.reviews;
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          default:
            return b.rating * b.reviews - a.rating * a.reviews;
        }
      });
  }, [city, type, sortBy]);

  const topActivity = filtered[0];

  const FilterPanel = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-foreground/80" />
          <h3 className="text-sm font-semibold tracking-wide text-foreground">
            {t("svcFilters")}
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t("svcReset")}</span>
          </button>
        )}
      </div>

      {/* Activity Type filter */}
      <div className="mb-6">
        <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Type d'expérience
        </h4>
        <div className="flex flex-col gap-1.5">
          {activityTypes.map((at) => (
            <button
              key={at.id}
              onClick={() => setType(at.id)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                type === at.id
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-border/50 bg-background/50 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              <span>{at.label}</span>
              {type === at.id && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom apply/clear */}
      <div className="flex gap-2 border-t border-border/40 pt-4 mt-auto">
        <button
          onClick={() => {
            resetFilters();
            onClose?.();
          }}
          className="flex-1 rounded-xl border border-border/60 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {t("svcClear")}
        </button>
        <button
          onClick={onClose}
          className="flex-1 rounded-xl bg-foreground py-2.5 text-xs font-medium text-background transition-opacity hover:opacity-90 shadow-sm"
        >
          {t("svcShow")} ({filtered.length})
        </button>
      </div>
    </div>
  );

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        {/* Editorial Minimalist Hero */}
        <section className="relative flex min-h-[46vh] items-center justify-center overflow-hidden border-b border-border/40 bg-neutral-950">
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity [-webkit-mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&q=80')",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
          />

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-32 pb-16 text-center">
            {/* Editorial Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md"
            >
              <Compass className="h-3.5 w-3.5 text-white" />
              <span>{t("actHeroSubtitle")}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {t("actHeroTitle")}
            </motion.h1>

            {/* Subtitle - reduced text, clean and light */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-3.5 max-w-xl text-sm text-white/75 sm:text-base leading-relaxed"
            >
              {t("actHeroDesc")}
            </motion.p>

            {/* Quick Stat Pills */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                <Compass className="h-3.5 w-3.5 text-white/70" />
                <strong className="text-white">{activities.length}</strong> {t("actCount")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-white/70" />
                <strong className="text-white">{activityCities.length - 1}</strong>{" "}
                {t("svcCities")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-white/70" />
                <span>Guides locaux certifiés</span>
              </span>
            </motion.div>
          </div>
        </section>

        {/* Content Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-20">
          {/* Search bar widget */}
          <div className="relative -mt-14 mb-8 z-20">
            <SearchBar
              fields={[
                {
                  key: "destination",
                  label: t("hotelDestination"),
                  placeholder: t("hotelSearchDest"),
                  type: "select",
                  options: activityCities.map((c) => (c === "All" ? t("svcAllCities") : c)),
                  value: city === "All" ? "" : city,
                  onChange: (v) => setCity(v === t("svcAllCities") ? "All" : v),
                },
              ]}
            />
          </div>

          {/* Quick City Horizontal Pills */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {activityCities.map((c) => {
              const isSelected = city.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-foreground text-background shadow-sm"
                      : "border border-border/50 bg-card/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {c === "All" ? t("svcAll") : c}
                </button>
              );
            })}
          </div>

          {/* Top Controls Bar: Filter button, Type chips, Count & Sort */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-border/40 py-3">
            <div className="flex items-center gap-2">
              {/* Filter toggle button */}
              <button
                onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  hasActiveFilters || showFiltersDrawer
                    ? "border-foreground bg-foreground text-background"
                    : "border-border/60 bg-background/80 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>{t("svcFilters")}</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-background text-[10px] font-bold text-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Type Quick Filter chips */}
              <div className="hidden sm:flex items-center gap-1.5">
                {activityTypes.map((at) => (
                  <button
                    key={at.id}
                    onClick={() => setType(at.id)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                      type === at.id
                        ? "bg-foreground text-background"
                        : "border border-border/50 bg-background/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{at.label}</span>
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{t("svcReset")}</span>
                </button>
              )}
            </div>

            {/* Results count & Sort */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                <strong className="text-foreground font-semibold">{filtered.length}</strong>{" "}
                {filtered.length === 1 ? t("svcResult") : t("svcResults")}
              </span>
              <SortDropdown
                value={sortBy}
                onChange={setSortBy}
                labels={{
                  rating: t("commonRating"),
                  reviews: t("commonReviews"),
                  priceLow: t("commonPriceLow"),
                  priceHigh: t("commonPriceHigh"),
                }}
              />
            </div>
          </div>

          {/* Main Layout: Filters Drawer + Grid */}
          <div className="flex items-start gap-8">
            {/* Desktop Filters Drawer */}
            {showFiltersDrawer && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 280 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25 }}
                className="hidden lg:block shrink-0"
              >
                <div className="sticky top-24 w-[280px]">
                  <FilterPanel onClose={() => setShowFiltersDrawer(false)} />
                </div>
              </motion.aside>
            )}

            {/* Mobile Sheet Trigger (floating) */}
            <div className="fixed bottom-6 right-6 z-40 lg:hidden">
              <Sheet>
                <SheetTrigger
                  render={
                    <button className="flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-xs font-semibold text-background shadow-xl hover:opacity-90" />
                  }
                >
                  <Filter className="h-4 w-4" />
                  <span>{t("svcFilters")}</span>
                  {activeFilterCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-background text-[10px] font-bold text-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto p-4 rounded-t-3xl">
                  <FilterPanel onClose={() => {}} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Activities Grid Area */}
            <div className="flex-1 min-w-0">
              {/* Editorial Spotlight Card (Top Activity) */}
              {topActivity && filtered.length > 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mb-8"
                >
                  <Link href={`/services/activities/${topActivity.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all duration-300 group-hover:border-foreground/30 group-hover:shadow-md">
                      <div className="relative aspect-[21/9] min-h-[260px] sm:min-h-[300px] overflow-hidden">
                        <img
                          src={topActivity.image}
                          alt={topActivity.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                        {/* Top Spotlight Badges */}
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/15">
                            <Award className="h-3.5 w-3.5 text-amber-300" />
                            <span>Coup de Cœur Aventure</span>
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md ${
                              difficultyColors[topActivity.difficulty] || "bg-white/20 text-white"
                            }`}
                          >
                            {topActivity.difficulty}
                          </span>
                        </div>

                        {/* Bottom Information */}
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white">
                          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                              <p className="flex items-center gap-1.5 text-xs font-medium text-white/80 mb-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>
                                  {topActivity.city} · {topActivity.duration}
                                </span>
                              </p>
                              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                                {topActivity.name}
                              </h2>
                              {topActivity.highlights && (
                                <div className="mt-2.5 flex flex-wrap gap-1.5">
                                  {topActivity.highlights.slice(0, 3).map((h) => (
                                    <span
                                      key={h}
                                      className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm"
                                    >
                                      {h}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                              <div className="text-left sm:text-right">
                                <div className="text-xl sm:text-2xl font-bold text-white">
                                  {topActivity.price.toLocaleString()}{" "}
                                  <span className="text-xs font-normal text-white/80">DA</span>
                                </div>
                                <span className="text-[11px] text-white/60">par personne</span>
                              </div>
                              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-opacity group-hover:opacity-90">
                                <span>{t("svcViewDetails")}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid of Activities */}
              {filtered.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {(filtered.length > 2 ? filtered.slice(1) : filtered).map((a, i) => {
                    const saved = isInPlan(a.name);
                    return (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(i * 0.025, 0.3) }}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-foreground/30 hover:shadow-md"
                      >
                        {/* Image Header */}
                        <Link href={`/services/activities/${a.id}`} className="block relative">
                          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                            <img
                              src={a.image}
                              alt={a.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                            {/* Rating badge */}
                            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{a.rating}</span>
                              <span className="text-white/60 text-[10px]">({a.reviews})</span>
                            </div>

                            {/* Difficulty tag */}
                            <div className="absolute right-3 top-3">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-md ${
                                  difficultyColors[a.difficulty] || "bg-black/60 text-white"
                                }`}
                              >
                                {a.difficulty}
                              </span>
                            </div>
                          </div>
                        </Link>

                        {/* Card Body - streamlined without heavy text */}
                        <div className="flex flex-1 flex-col p-4 justify-between">
                          <div>
                            {/* City and Duration */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <p className="flex items-center gap-1 font-medium">
                                <MapPin className="h-3 w-3" />
                                <span>{a.city}</span>
                              </p>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{a.duration}</span>
                              </span>
                            </div>

                            <Link href={`/services/activities/${a.id}`}>
                              <h3 className="mt-1 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
                                {a.name}
                              </h3>
                            </Link>

                            {/* Highlights or type tags */}
                            {a.highlights && (
                              <div className="mt-2.5 flex flex-wrap gap-1">
                                {a.highlights.slice(0, 2).map((h) => (
                                  <span
                                    key={h}
                                    className="inline-block rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                                  >
                                    {h}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Card Footer: Price & Direct Actions */}
                          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                            <div>
                              <div className="text-base font-bold text-foreground">
                                {a.price.toLocaleString()}{" "}
                                <span className="text-xs font-normal text-muted-foreground">DA</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground">par personne</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Add / Save to plan button */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (saved) {
                                    removeFromPlan(a.name);
                                  } else {
                                    addToPlan({
                                      name: a.name,
                                      subtitle: `${a.duration} • ${a.city}`,
                                      region: a.city,
                                      type: "Activity",
                                      rating: a.rating,
                                      description: a.description,
                                      image: a.image,
                                      category: "activity",
                                      price: `${a.price.toLocaleString()} DA/pers`,
                                    });
                                  }
                                }}
                                title={saved ? t("svcSaved") : t("svcSave")}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                                  saved
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border/60 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                                }`}
                              >
                                {saved ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                              </button>

                              {/* View Details button */}
                              <Link
                                href={`/services/activities/${a.id}`}
                                className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
                              >
                                <span>Voir</span>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {t("actNoMatch")}
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                    {t("svcNoMatchDesc")}
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 rounded-xl bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90"
                  >
                    {t("svcClearAll")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
