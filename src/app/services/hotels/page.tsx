"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  SlidersHorizontal,
  ArrowRight,
  Plus,
  Check,
  ChevronDown,
  Building2,
  Bed,
  Filter,
  RotateCcw,
  ShieldCheck,
  Award,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import SearchBar from "@/components/search-bar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { hotels, amenityIcons, amenityLabels, cities } from "@/lib/hotels-data";
import { usePlan } from "@/contexts/plan-context";
import { useLanguage } from "@/contexts/language-context";

type SortOption = "rating" | "price-low" | "price-high" | "reviews";

function SortDropdown({
  value,
  onChange,
  labels,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
  labels: { rating: string; priceLow: string; priceHigh: string; reviews: string };
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "rating", label: labels.rating },
    { value: "price-low", label: labels.priceLow },
    { value: "price-high", label: labels.priceHigh },
    { value: "reviews", label: labels.reviews },
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

export default function HotelsPage() {
  const { addToPlan, isInPlan, removeFromPlan } = usePlan();
  const { t } = useLanguage();
  const [city, setCity] = useState("All");
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const toggleStar = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setCity("All");
    setPriceRange([0, 30000]);
    setSelectedStars([]);
    setSelectedAmenities([]);
  };

  const hasActiveFilters =
    city !== "All" ||
    selectedStars.length > 0 ||
    selectedAmenities.length > 0 ||
    priceRange[1] < 30000;

  const activeFilterCount =
    (city !== "All" ? 1 : 0) +
    selectedStars.length +
    selectedAmenities.length +
    (priceRange[1] < 30000 ? 1 : 0);

  const filtered = useMemo(() => {
    return hotels
      .filter((h) => {
        if (city !== "All" && h.city.toLowerCase() !== city.toLowerCase()) return false;
        if (h.price < priceRange[0] || h.price > priceRange[1]) return false;
        if (selectedStars.length > 0 && !selectedStars.includes(h.stars)) return false;
        if (
          selectedAmenities.length > 0 &&
          !selectedAmenities.every((a) => h.amenities.includes(a))
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "rating":
            return b.rating * b.reviews - a.rating * a.reviews;
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "reviews":
            return b.reviews - a.reviews;
          default:
            return 0;
        }
      });
  }, [city, priceRange, selectedStars, selectedAmenities, sortBy]);

  const topHotel = filtered[0];

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

      {/* Stars filter */}
      <div className="mb-6">
        <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("svcStars")}
        </h4>
        <div className="grid grid-cols-5 gap-1.5">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => toggleStar(star)}
              className={`flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium transition-all ${
                selectedStars.includes(star)
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-border/50 bg-background/50 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              <span>{star}</span>
              <Star
                className={`h-3 w-3 ${
                  selectedStars.includes(star) ? "fill-amber-400 text-amber-400" : "fill-current"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Max Price filter */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("svcMaxPrice")}
          </h4>
          <span className="text-xs font-semibold text-foreground">
            {priceRange[1].toLocaleString()} DA
          </span>
        </div>
        <input
          type="range"
          min={3000}
          max={30000}
          step={1000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="h-1.5 w-full accent-foreground cursor-pointer"
        />
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>3 000 DA</span>
          <span>30 000 DA</span>
        </div>
      </div>

      {/* Amenities filter */}
      <div className="mb-6 flex-1">
        <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("hotelAmenities")}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(amenityLabels).map((amenity) => {
            const Icon = amenityIcons[amenity];
            const isSelected = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border/50 bg-background/50 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="h-3 w-3" />}
                <span>{amenityLabels[amenity]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom apply/clear */}
      <div className="flex gap-2 border-t border-border/40 pt-4">
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
                "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop&q=80')",
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
              <Building2 className="h-3.5 w-3.5 text-white" />
              <span>{t("hotelHeroSubtitle")}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {t("hotelHeroTitle")}
            </motion.h1>

            {/* Subtitle - reduced text, clean and light */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-3.5 max-w-xl text-sm text-white/75 sm:text-base leading-relaxed"
            >
              {t("hotelHeroDesc")}
            </motion.p>

            {/* Quick Stat Pills */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                <Bed className="h-3.5 w-3.5 text-white/70" />
                <strong className="text-white">{hotels.length}</strong> {t("hotelCount")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-white/70" />
                <strong className="text-white">{cities.length - 1}</strong> {t("svcCities")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-white/70" />
                <span>100% Vérifiés</span>
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
                  options: cities.map((c) => (c === "All" ? t("svcAllCities") : c)),
                  value: city === "All" ? "" : city,
                  onChange: (v) => setCity(v === t("svcAllCities") ? "All" : v),
                },
                {
                  key: "checkin",
                  label: t("hotelCheckin"),
                  placeholder: t("transAddDate"),
                  type: "date",
                  value: checkIn,
                  onChange: setCheckIn,
                },
                {
                  key: "checkout",
                  label: t("hotelCheckout"),
                  placeholder: t("transAddDate"),
                  type: "date",
                  value: checkOut,
                  onChange: setCheckOut,
                },
                {
                  key: "guests",
                  label: t("hotelGuests"),
                  placeholder: t("hotelAddGuests"),
                  type: "counter",
                  value: guests,
                  min: 1,
                  suffix: t("hotelGuestsSuffix"),
                  onChange: setGuests,
                },
              ]}
            />
          </div>

          {/* Quick City Horizontal Pills */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {cities.map((c) => {
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

          {/* Top Controls Bar: Filter button, Stars quick chips, Count & Sort */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-border/40 py-3">
            <div className="flex items-center gap-2">
              {/* Filter toggle button (Sheet for mobile / Drawer for desktop) */}
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

              {/* Star Rating Quick Filter chips */}
              <div className="hidden sm:flex items-center gap-1.5">
                {[5, 4, 3].map((star) => (
                  <button
                    key={star}
                    onClick={() => toggleStar(star)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                      selectedStars.includes(star)
                        ? "bg-foreground text-background"
                        : "border border-border/50 bg-background/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{star}</span>
                    <Star
                      className={`h-2.5 w-2.5 ${
                        selectedStars.includes(star)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-current"
                      }`}
                    />
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
                  priceLow: t("commonPriceLow"),
                  priceHigh: t("commonPriceHigh"),
                  reviews: t("commonReviews"),
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

            {/* Hotels Grid Area */}
            <div className="flex-1 min-w-0">
              {/* Editorial Spotlight Card (Top Hotel) */}
              {topHotel && filtered.length > 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mb-8"
                >
                  <Link href={`/services/hotels/${topHotel.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all duration-300 group-hover:border-foreground/30 group-hover:shadow-md">
                      <div className="relative aspect-[21/9] min-h-[260px] sm:min-h-[300px] overflow-hidden">
                        <img
                          src={topHotel.image}
                          alt={topHotel.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                        {/* Top Spotlight Badges */}
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/15">
                            <Award className="h-3.5 w-3.5 text-amber-300" />
                            <span>Coup de cœur</span>
                          </span>
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-black/40 px-2.5 py-1 text-xs text-white backdrop-blur-md">
                            {Array.from({ length: topHotel.stars }).map((_, j) => (
                              <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </span>
                        </div>

                        {/* Bottom Information */}
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white">
                          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                              <p className="flex items-center gap-1.5 text-xs font-medium text-white/80 mb-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{topHotel.city}</span>
                              </p>
                              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                                {topHotel.name}
                              </h2>
                              <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {topHotel.highlights.slice(0, 3).map((h) => (
                                  <span
                                    key={h}
                                    className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm"
                                  >
                                    {h}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                              <div className="text-left sm:text-right">
                                <div className="text-xl sm:text-2xl font-bold text-white">
                                  {topHotel.price.toLocaleString()}{" "}
                                  <span className="text-xs font-normal text-white/80">DA</span>
                                </div>
                                <span className="text-[11px] text-white/60">{t("svcPerNight")}</span>
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

              {/* Grid of Hotels */}
              {filtered.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {(filtered.length > 2 ? filtered.slice(1) : filtered).map((hotel, i) => {
                    const saved = isInPlan(hotel.name);
                    return (
                      <motion.div
                        key={hotel.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(i * 0.025, 0.3) }}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-foreground/30 hover:shadow-md"
                      >
                        {/* Image Header */}
                        <Link href={`/services/hotels/${hotel.id}`} className="block relative">
                          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                            <img
                              src={hotel.image}
                              alt={hotel.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                            {/* Rating badge */}
                            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{hotel.rating}</span>
                              <span className="text-white/60 text-[10px]">({hotel.reviews})</span>
                            </div>

                            {/* Stars category badge */}
                            <div className="absolute right-3 top-3 flex items-center gap-0.5 rounded-full bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-medium text-white/90">
                              <span>{hotel.stars}★</span>
                            </div>
                          </div>
                        </Link>

                        {/* Card Body - streamlined without heavy text */}
                        <div className="flex flex-1 flex-col p-4 justify-between">
                          <div>
                            {/* City and Name */}
                            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>{hotel.city}</span>
                            </p>
                            <Link href={`/services/hotels/${hotel.id}`}>
                              <h3 className="mt-1 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
                                {hotel.name}
                              </h3>
                            </Link>

                            {/* Key Feature tags (concise, scannable) */}
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {hotel.highlights.slice(0, 2).map((h) => (
                                <span
                                  key={h}
                                  className="inline-block rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>

                            {/* Amenity icons row */}
                            <div className="mt-3 flex items-center gap-2">
                              {hotel.amenities.slice(0, 4).map((amenity) => {
                                const Icon = amenityIcons[amenity];
                                if (!Icon) return null;
                                return (
                                  <div
                                    key={amenity}
                                    title={amenityLabels[amenity]}
                                    className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50 text-muted-foreground"
                                  >
                                    <Icon className="h-3 w-3" />
                                  </div>
                                );
                              })}
                              {hotel.amenities.length > 4 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{hotel.amenities.length - 4}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card Footer: Price & Direct Actions */}
                          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                            <div>
                              <div className="text-base font-bold text-foreground">
                                {hotel.price.toLocaleString()}{" "}
                                <span className="text-xs font-normal text-muted-foreground">DA</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                {t("svcPerNight")}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Add / Save to plan button */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (saved) {
                                    removeFromPlan(hotel.name);
                                  } else {
                                    addToPlan({
                                      name: hotel.name,
                                      subtitle: `${hotel.stars}★ · ${hotel.city}`,
                                      region: hotel.city,
                                      type: "Hotel",
                                      rating: hotel.rating,
                                      description: hotel.description,
                                      image: hotel.image,
                                      category: "hotel",
                                      price: `${hotel.price.toLocaleString()} DA/nuit`,
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
                                href={`/services/hotels/${hotel.id}`}
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
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {t("hotelNoMatch")}
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
