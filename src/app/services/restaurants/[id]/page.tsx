"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Star,
  Leaf,
  Check,
  Plus,
  Phone,
  X,
  ChevronRight,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import { restaurants } from "@/lib/restaurants-data";
import { usePlan } from "@/contexts/plan-context";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const restaurant = restaurants.find((r) => r.id === Number(id));
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isAddingToBooking, setIsAddingToBooking] = useState(false);
  const [guests, setGuests] = useState(2);
  const { addToPlan, removeFromPlan, isInPlan } = usePlan();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleAddToBooking = async () => {
    if (!user || !restaurant) {
      return;
    }

    setIsAddingToBooking(true);
    try {
      await addDoc(collection(db, "users", user.uid, "bookings"), {
        type: "restaurant",
        itemId: restaurant.id,
        name: restaurant.name,
        city: restaurant.city,
        cuisine: restaurant.cuisine,
        priceRange: restaurant.priceRange,
        image: restaurant.image,
        phone: restaurant.phone,
        guests,
        createdAt: serverTimestamp(),
      });
      setShowBookingDialog(false);
    } catch (error) {
      console.error("Error adding to bookings:", error);
    } finally {
      setIsAddingToBooking(false);
    }
  };

  if (!restaurant) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold">{t("navDining")} {t("detailNotFound")}</h1>
            <p className="mb-4 text-sm text-muted-foreground">
              {t("detailNotFoundDesc")}
            </p>
            <Link
              href="/services/restaurants"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("detailBackRestaurants")}
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const similar = restaurants.filter((r) => r.city === restaurant.city && r.id !== restaurant.id).slice(0, 3);

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          <Link
            href="/services/restaurants"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("detailBackRestaurants")}
          </Link>

          {/* Hero */}
          <div className="mb-8 overflow-hidden rounded-3xl border border-border/40">
            <div className="relative aspect-[21/9] min-h-[320px]">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold backdrop-blur">
                    {restaurant.priceRange}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold backdrop-blur">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {restaurant.rating} ({restaurant.reviews} {t("detailReviews")})
                  </span>
                  {restaurant.halal && (
                    <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      <Leaf className="h-2.5 w-2.5" />
                      Halal
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{restaurant.name}</h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                  <MapPin className="h-4 w-4" />
                  {restaurant.city} — {restaurant.cuisine}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-8 lg:col-span-2">
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="mb-3 text-lg font-semibold">{t("detailAboutRestaurant")}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{restaurant.description}</p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <h2 className="mb-3 text-lg font-semibold">{t("detailSpecialties")}</h2>
                <div className="flex flex-wrap gap-2">
                  {restaurant.specialties.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1.5 rounded-full border border-border/40 bg-background px-3 py-1.5 text-sm font-medium"
                    >
                      <Check className="h-3 w-3 text-foreground" />
                      {s}
                    </span>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="mb-3 text-lg font-semibold">{t("detailAbout")}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/40 bg-background px-4 py-3">
                    <p className="text-[10px] text-muted-foreground">{t("detailCuisine")}</p>
                    <p className="text-sm font-medium">{restaurant.cuisine}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-background px-4 py-3">
                    <p className="text-[10px] text-muted-foreground">{t("detailPriceRange")}</p>
                    <p className="text-sm font-medium">{restaurant.priceRange}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-background px-4 py-3">
                    <p className="text-[10px] text-muted-foreground">{t("detailTerrace")}</p>
                    <p className="text-sm font-medium">{restaurant.terrace ? t("detailAvailable") : t("detailNotAvailable")}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-background px-4 py-3">
                    <p className="text-[10px] text-muted-foreground">{t("detailHalal")}</p>
                    <p className="text-sm font-medium">{restaurant.halal ? t("detailYes") : t("detailNo")}</p>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Booking card */}
            <aside>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-24 rounded-2xl border border-border/40 bg-background p-6 shadow-[0_2px_24px_-8px_rgba(0,0,0,0.12)]"
              >
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">{restaurant.priceRange}</span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="h-4 w-4 fill-foreground text-foreground" />
                    {restaurant.rating}
                  </span>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => {
                      if (isInPlan(restaurant.name)) {
                        removeFromPlan(restaurant.name);
                      } else {
                        addToPlan({
                          name: restaurant.name,
                          subtitle: `${restaurant.cuisine} • ${restaurant.city}`,
                          region: restaurant.city,
                          type: "Dining",
                          rating: restaurant.rating,
                          description: restaurant.description,
                          image: restaurant.image,
                          category: "dining",
                          price: restaurant.priceRange,
                        });
                      }
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isInPlan(restaurant.name)
                        ? "bg-muted text-foreground border border-border"
                        : "border border-border/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {isInPlan(restaurant.name) ? (
                      <><Check className="h-4 w-4" /> {t("detailInPlan")}</>
                    ) : (
                      <><Plus className="h-4 w-4" /> {t("detailAddToPlan")}</>
                    )}
                  </button>
                  <button
                    onClick={() => setShowBookingDialog(true)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    {t("detailReserve")}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </aside>
          </div>

          {/* Booking Dialog */}
          <AnimatePresence>
            {showBookingDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                onClick={() => setShowBookingDialog(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-md rounded-2xl border border-border/40 bg-background p-6 shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t("detailContactToReserve")}</h3>
                    <button
                      onClick={() => setShowBookingDialog(false)}
                      className="rounded-lg p-1 hover:bg-muted"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{restaurant.phone}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("detailCallReservation")}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/40 p-4">
                      <p className="mb-2 text-sm font-semibold">{t("detailBookingSummary")}</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>{t("detailRestaurantLabel")}</span>
                          <span className="font-medium text-foreground">{restaurant.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("detailCuisine")}:</span>
                          <span className="font-medium text-foreground">{restaurant.cuisine}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("detailGuestsLabel")}</span>
                          <span className="font-medium text-foreground">{guests}</span>
                        </div>
                        <div className="flex justify-between border-t border-border/40 pt-2 mt-2">
                          <span>{t("detailPriceRange")}:</span>
                          <span className="font-bold text-foreground">
                            {restaurant.priceRange}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToBooking}
                      disabled={isAddingToBooking}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isAddingToBooking ? (
                        t("detailAdding")
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          {t("detailAddMyBooking")}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Similar restaurants */}
          {similar.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-4 text-xl font-bold tracking-tight">{t("detailMoreIn")} {restaurant.city}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((r) => (
                  <Link
                    key={r.id}
                    href={`/services/restaurants/${r.id}`}
                    className="group block overflow-hidden rounded-2xl border border-border/40 bg-background transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-foreground text-foreground" />
                        {r.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold">{r.name}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {r.city}
                      </p>
                      <div className="mt-2 flex items-end justify-between">
                        <span className="text-sm font-bold">{r.priceRange}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </AppShell>
  );
}
