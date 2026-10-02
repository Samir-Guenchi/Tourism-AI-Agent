"use client";

import { use } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Calendar,
  Compass,
  Bed,
  ChevronRight,
  Check,
  Plus,
  Landmark,
  Utensils,
  Shirt,
  Award,
  MessageCircle,
  MapPin,
  Clock,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import ExplorerAgent from "@/components/explorer-agent";
import { getDestinationBySlug } from "@/lib/destinations-data";
import { getWilayaCulture } from "@/lib/wilayas-culture";
import { hotels } from "@/lib/hotels-data";
import { activities } from "@/lib/activities-data";
import { vehicles } from "@/lib/cars-data";
import { restaurants } from "@/lib/restaurants-data";
import { usePlan } from "@/contexts/plan-context";
import { useLanguage } from "@/contexts/language-context";

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const destination = getDestinationBySlug(slug);
  const { addToPlan, removeFromPlan, isInPlan } = usePlan();
  const { t } = useLanguage();
  const [showExplorer, setShowExplorer] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "places" | "food" | "clothing" | "services">("all");
  const culture = destination ? getWilayaCulture(destination.name, destination.region) : null;

  if (!destination) {
    return (
      <AppShell>
        <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{t("detailNotFound")}</h1>
            <p className="text-muted-foreground text-sm mb-4">
              {t("detailNotFoundDesc")}
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("detailBackDestinations")}
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const heroImage = destination.image;

  // Filter data for this specific wilaya
  const wilayaHotels = hotels.filter(
    (h) => h.city.toLowerCase() === destination.name.toLowerCase()
  );
  const wilayaActivities = activities.filter(
    (a) => a.city.toLowerCase() === destination.name.toLowerCase()
  );

  const inPlan = isInPlan(destination.name);

  const togglePlan = () => {
    if (inPlan) {
      removeFromPlan(destination.name);
    } else {
      addToPlan({
        name: destination.name,
        subtitle: destination.subtitle,
        region: destination.region,
        type: destination.type,
        rating: destination.rating,
        description: destination.description,
        image: destination.image,
        category: "wilaya",
      });
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        {/* Clean Hero */}
        <div className="relative h-[55vh] min-h-[400px] max-h-[560px] w-full overflow-hidden bg-neutral-950">
          <img
            src={heroImage}
            alt={destination.name}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />

          {/* Back button only */}
          <div className="absolute top-24 left-0 right-0 z-10 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto">
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3.5 py-2 text-white border border-white/15 text-xs font-medium hover:bg-black/60 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </Link>
            </div>
          </div>

          {/* Hero bottom: Title + Rating only */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-8 pb-10 text-white">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="inline-block rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white/90 border border-white/10 mb-3">
                  Wilaya {destination.code ? String(destination.code).padStart(2, "0") : ""} · {destination.region}
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                  {destination.name}
                </h1>
                <p className="mt-2 text-base sm:text-lg text-white/80 font-medium max-w-xl leading-snug">
                  {destination.subtitle}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{destination.rating}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Action Bar — sits right below hero */}
        <div className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-16 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: "all", label: "Tout", icon: Compass },
                { id: "places", label: "Sites", icon: Landmark },
                { id: "food", label: "Saveurs", icon: Utensils },
                { id: "clothing", label: "Traditions", icon: Shirt },
                { id: "services", label: "Séjour", icon: Bed },
              ].map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowExplorer(true)}
                className="flex items-center gap-1.5 rounded-full bg-[#008C61] hover:bg-[#007652] text-white px-3.5 py-1.5 text-xs font-semibold transition-all"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Guide Local</span>
              </button>

              <button
                onClick={togglePlan}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border ${
                  inPlan
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    : "bg-muted text-foreground border-border hover:bg-muted/80"
                }`}
              >
                {inPlan ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{inPlan ? "Ajouté" : "Carnet"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-10">

              {/* Sites */}
              {culture && culture.touristPlaces.length > 0 && (activeCategory === "all" || activeCategory === "places") && (
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <Landmark className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-foreground">Incontournables</h2>
                    {activeCategory === "all" && culture.touristPlaces.length > 2 && (
                      <button
                        onClick={() => setActiveCategory("places")}
                        className="ml-auto text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-0.5"
                      >
                        Tout voir <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(activeCategory === "all" ? culture.touristPlaces.slice(0, 2) : culture.touristPlaces).map((place, idx) => (
                      <div
                        key={idx}
                        className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {place.image && (
                          <div className="relative h-40 overflow-hidden">
                            <img src={place.image} alt={place.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                              {place.type}
                            </span>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-foreground">{place.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{place.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Food */}
              {culture && culture.famousFoods.length > 0 && (activeCategory === "all" || activeCategory === "food") && (
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <Utensils className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-bold text-foreground">Saveurs Locales</h2>
                    {activeCategory === "all" && culture.famousFoods.length > 2 && (
                      <button
                        onClick={() => setActiveCategory("food")}
                        className="ml-auto text-xs font-semibold text-amber-600 hover:underline flex items-center gap-0.5"
                      >
                        Tout voir <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(activeCategory === "all" ? culture.famousFoods.slice(0, 2) : culture.famousFoods).map((food, idx) => (
                      <div
                        key={idx}
                        className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {food.image && (
                          <div className="relative h-40 overflow-hidden">
                            <img src={food.image} alt={food.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                              {food.tag}
                            </span>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-foreground">{food.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{food.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Clothing / Traditions */}
              {culture && culture.traditionalClothing.length > 0 && (activeCategory === "all" || activeCategory === "clothing") && (
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <Shirt className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-foreground">Traditions</h2>
                    {activeCategory === "all" && culture.traditionalClothing.length > 2 && (
                      <button
                        onClick={() => setActiveCategory("clothing")}
                        className="ml-auto text-xs font-semibold text-purple-600 hover:underline flex items-center gap-0.5"
                      >
                        Tout voir <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(activeCategory === "all" ? culture.traditionalClothing.slice(0, 2) : culture.traditionalClothing).map((clothing, idx) => (
                      <div
                        key={idx}
                        className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {clothing.image && (
                          <div className="relative h-44 overflow-hidden">
                            <img src={clothing.image} alt={clothing.name} className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                            {clothing.heritageBadge && (
                              <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-amber-300 backdrop-blur-sm">
                                <Award className="w-3 h-3 text-amber-400 fill-amber-400" />
                                {clothing.heritageBadge}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-foreground">{clothing.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{clothing.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hotels & Activities */}
              {(wilayaHotels.length > 0 || wilayaActivities.length > 0) && (activeCategory === "all" || activeCategory === "services") && (
                <section className="space-y-8">
                  {wilayaHotels.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-5">
                        <Bed className="h-5 w-5 text-emerald-600" />
                        <h2 className="text-lg font-bold text-foreground">Où séjourner</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(activeCategory === "all" ? wilayaHotels.slice(0, 2) : wilayaHotels).map((hotel) => (
                          <Link
                            key={hotel.id}
                            href={`/services/hotels/${hotel.id}`}
                            className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="relative h-32 overflow-hidden">
                              <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-white text-[11px] font-bold">{hotel.rating}</span>
                              </div>
                            </div>
                            <div className="p-3.5">
                              <p className="text-sm font-bold truncate text-foreground">{hotel.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {hotel.stars}★ · {(hotel.price / 1000).toFixed(1)}k DA / nuit
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {wilayaActivities.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-5">
                        <Compass className="h-5 w-5 text-amber-600" />
                        <h2 className="text-lg font-bold text-foreground">Activités</h2>
                      </div>
                      <div className="space-y-2">
                        {(activeCategory === "all" ? wilayaActivities.slice(0, 3) : wilayaActivities).map((activity) => (
                          <Link
                            key={activity.id}
                            href={`/services/activities/${activity.id}`}
                            className="group flex items-center gap-3 rounded-2xl border border-border/60 p-3 hover:shadow-sm transition-shadow bg-card"
                          >
                            <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0">
                              <img src={activity.image} alt={activity.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground truncate">{activity.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {activity.duration} · {activity.price.toLocaleString()} DA
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Sidebar — compact, no FAQ */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-5">
                {/* Quick facts */}
                <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-4">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Infos pratiques</h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground">Période idéale</span>
                        <p className="text-muted-foreground">{culture?.bestTimeToVisit || "Toute l'année"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground">Durée conseillée</span>
                        <p className="text-muted-foreground">2 à 4 jours</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground">Région</span>
                        <p className="text-muted-foreground capitalize">{destination.region}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guide Local CTA — simple */}
                <button
                  onClick={() => setShowExplorer(true)}
                  className="w-full py-3 rounded-2xl bg-[#008C61] hover:bg-[#007652] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Parler au Guide Local</span>
                </button>

                {/* Add to plan */}
                <button
                  onClick={togglePlan}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                    inPlan
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {inPlan ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span>{inPlan ? "Dans mon carnet" : "Ajouter au carnet"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explorer / Local Guide Modal */}
      {showExplorer && (
        <ExplorerAgent
          wilayaName={destination.name}
          isOpen={showExplorer}
          onOpenChange={setShowExplorer}
        />
      )}
    </AppShell>
  );
}
