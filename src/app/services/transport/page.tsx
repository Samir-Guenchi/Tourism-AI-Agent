"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Train,
  Bus,
  Plane,
  Ship,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus,
  RotateCcw,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import SearchBar from "@/components/search-bar";
import { useLanguage } from "@/contexts/language-context";
import { usePlan } from "@/contexts/plan-context";
import {
  transportRoutes,
  transportTypes,
  transportCities,
  type TransportRoute,
} from "@/lib/transport-data";

const typeIcons: Record<string, typeof Train> = {
  train: Train,
  bus: Bus,
  flight: Plane,
  ferry: Ship,
};

const typeColors: Record<string, { bg: string; text: string }> = {
  train: { bg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", text: "text-emerald-600" },
  bus: { bg: "bg-blue-500/15 text-blue-600 dark:text-blue-400", text: "text-blue-600" },
  flight: { bg: "bg-purple-500/15 text-purple-600 dark:text-purple-400", text: "text-purple-600" },
  ferry: { bg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400", text: "text-cyan-600" },
};

export default function TransportPage() {
  const { t } = useLanguage();
  const { addToPlan, isInPlan, removeFromPlan } = usePlan();
  const [from, setFrom] = useState("All");
  const [to, setTo] = useState("All");
  const [type, setType] = useState<string>("all");
  const [date, setDate] = useState("");

  const resetFilters = () => {
    setFrom("All");
    setTo("All");
    setType("all");
    setDate("");
  };

  const hasActiveFilters = from !== "All" || to !== "All" || type !== "all" || date !== "";

  const filtered = useMemo(() => {
    return transportRoutes.filter((s) => {
      if (from !== "All" && s.from.toLowerCase() !== from.toLowerCase()) return false;
      if (to !== "All" && s.to.toLowerCase() !== to.toLowerCase()) return false;
      if (type !== "all" && s.type !== type) return false;
      return true;
    });
  }, [from, to, type]);

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
                "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&h=1080&fit=crop&q=80')",
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
              <Train className="h-3.5 w-3.5 text-white" />
              <span>Réseau & Liaisons · Algérie</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {t("transTitle")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-3.5 max-w-xl text-sm text-white/75 sm:text-base leading-relaxed"
            >
              {t("transSubtitle")}
            </motion.p>

            {/* Quick Stat Pills */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                <Train className="h-3.5 w-3.5 text-white/70" />
                <strong className="text-white">{transportRoutes.length}</strong> Liaisons régulières
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                <Plane className="h-3.5 w-3.5 text-white/70" />
                <span>Trains, Vols, Bus & Ferries</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-white/70" />
                <span>Horaires vérifiés</span>
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
                  key: "from",
                  label: t("transFrom"),
                  placeholder: t("transWhereFrom"),
                  type: "select",
                  options: transportCities.map((c) => (c === "All" ? t("svcAllCities") : c)),
                  value: from === "All" ? "" : from,
                  onChange: (v) => setFrom(v === t("svcAllCities") ? "All" : v),
                },
                {
                  key: "to",
                  label: t("transTo"),
                  placeholder: t("transWhereTo"),
                  type: "select",
                  options: transportCities.map((c) => (c === "All" ? t("svcAllCities") : c)),
                  value: to === "All" ? "" : to,
                  onChange: (v) => setTo(v === t("svcAllCities") ? "All" : v),
                },
                {
                  key: "date",
                  label: t("transDate"),
                  placeholder: t("transAddDate"),
                  type: "date",
                  value: date,
                  onChange: setDate,
                },
              ]}
            />
          </div>

          {/* Quick Mode Filter Chips */}
          <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {transportTypes.map((tt) => {
                const isSelected = type === tt.id;
                return (
                  <button
                    key={tt.id}
                    onClick={() => setType(tt.id)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-foreground text-background shadow-sm"
                        : "border border-border/50 bg-card/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {tt.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{t("svcReset")}</span>
                </button>
              )}
              <span className="text-xs text-muted-foreground">
                <strong className="text-foreground font-semibold">{filtered.length}</strong>{" "}
                {t("transRoutes")}
              </span>
            </div>
          </div>

          {/* Routes List */}
          <div className="space-y-4">
            {filtered.map((s, i) => {
              const Icon = typeIcons[s.type] || Train;
              const color = typeColors[s.type] || typeColors.train;
              const saved = isInPlan(`${s.from} - ${s.to} (${s.operator})`);

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-foreground/30 hover:shadow-md"
                >
                  {/* Left: Mode icon + Operator info */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color.bg}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{s.operator}</span>
                        <span className="rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {s.classType}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.frequency}</p>
                    </div>
                  </div>

                  {/* Middle: Depart & Arrive Schedule */}
                  <div className="flex flex-1 items-center justify-center gap-4 px-2 sm:px-6">
                    <div className="text-left sm:text-right">
                      <p className="text-base font-bold text-foreground">{s.departure}</p>
                      <p className="text-xs font-medium text-muted-foreground">{s.from}</p>
                    </div>

                    <div className="flex flex-1 max-w-[180px] flex-col items-center gap-1">
                      <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{s.duration}</span>
                      </span>
                      <div className="flex w-full items-center gap-1">
                        <div className="h-px flex-1 bg-border/80" />
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <div className="h-px flex-1 bg-border/80" />
                      </div>
                    </div>

                    <div className="text-right sm:text-left">
                      <p className="text-base font-bold text-foreground">{s.arrival}</p>
                      <p className="text-xs font-medium text-muted-foreground">{s.to}</p>
                    </div>
                  </div>

                  {/* Right: Price & CTA */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-foreground">
                        {s.price.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-muted-foreground">DA</span>
                      </p>
                      <span className="text-[10px] text-muted-foreground">par trajet</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Add to plan */}
                      <button
                        onClick={() => {
                          const planKey = `${s.from} - ${s.to} (${s.operator})`;
                          if (saved) {
                            removeFromPlan(planKey);
                          } else {
                            addToPlan({
                              name: planKey,
                              subtitle: `${s.departure} - ${s.arrival} (${s.duration})`,
                              region: `${s.from} → ${s.to}`,
                              type: "Transport",
                              rating: 4.8,
                              description: s.description,
                              category: "transport",
                              price: `${s.price.toLocaleString()} DA`,
                              image: "",
                            });
                          }
                        }}
                        title={saved ? t("svcSaved") : t("svcSave")}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                          saved
                            ? "border-foreground bg-foreground text-background"
                            : "border-border/60 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        }`}
                      >
                        {saved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>

                      {/* Direct booking CTA */}
                      <button
                        disabled={!s.available}
                        className="rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                      >
                        {s.available ? t("transBook") : t("transSoldOut")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                <Train className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{t("transNoRoutes")}</h3>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                {t("transNoRoutesDesc")}
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
    </AppShell>
  );
}
