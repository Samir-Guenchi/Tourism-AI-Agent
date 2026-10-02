"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Users,
  Check,
  Plus,
  Mountain,
  Waves,
  Landmark,
  TreePine,
  Phone,
  X,
  ChevronRight,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import { activities } from "@/lib/activities-data";
import { usePlan } from "@/contexts/plan-context";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700",
  Moderate: "bg-amber-100 text-amber-700",
  Challenging: "bg-red-100 text-red-700",
};

const typeIcons: Record<string, typeof Mountain> = {
  desert: Mountain,
  hiking: TreePine,
  water: Waves,
  cultural: Landmark,
  guided: Landmark,
};

export default function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const activity = activities.find((a) => a.id === Number(id));
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isAddingToBooking, setIsAddingToBooking] = useState(false);
  const [participants, setParticipants] = useState(2);
  const { addToPlan, removeFromPlan, isInPlan } = usePlan();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleAddToBooking = async () => {
    if (!user || !activity) {
      return;
    }

    setIsAddingToBooking(true);
    try {
      await addDoc(collection(db, "users", user.uid, "bookings"), {
        type: "activity",
        itemId: activity.id,
        name: activity.name,
        city: activity.city,
        price: activity.price,
        image: activity.image,
        phone: activity.phone,
        participants,
        totalPrice: activity.price * participants,
        duration: activity.duration,
        difficulty: activity.difficulty,
        createdAt: serverTimestamp(),
      });
      setShowBookingDialog(false);
    } catch (error) {
      console.error("Error adding to bookings:", error);
    } finally {
      setIsAddingToBooking(false);
    }
  };

  if (!activity) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold">{t("navActivities")} {t("detailNotFound")}</h1>
            <p className="mb-4 text-sm text-muted-foreground">
              {t("detailNotFoundDesc")}
            </p>
            <Link
              href="/services/activities"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("detailBackActivities")}
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const TypeIcon = typeIcons[activity.type] || Mountain;
  const similar = activities.filter((a) => a.type === activity.type && a.id !== activity.id).slice(0, 3);

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          <Link
            href="/services/activities"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("detailBackActivities")}
          </Link>

          {/* Hero */}
          <div className="mb-8 overflow-hidden rounded-3xl border border-border/40">
            <div className="relative aspect-[21/9] min-h-[320px]">
              <img
                src={activity.image}
                alt={activity.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold backdrop-blur">
                    <TypeIcon className="h-3 w-3" />
                    {activity.type}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColors[activity.difficulty]}`}>
                    {activity.difficulty}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold backdrop-blur">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {activity.rating} ({activity.reviews} {t("detailReviews")})
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{activity.name}</h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                  <MapPin className="h-4 w-4" />
                  {activity.city}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-8 lg:col-span-2">
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="mb-3 text-lg font-semibold">{t("detailAboutActivity")}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{activity.description}</p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <h2 className="mb-3 text-lg font-semibold">{t("detailAbout")}</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background px-4 py-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">{t("detailDuration")}</p>
                      <p className="text-sm font-medium">{activity.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background px-4 py-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">{t("detailGroupPriceLabel")}</p>
                      <p className="text-sm font-medium">{activity.groupPrice.toLocaleString()} DA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background px-4 py-3">
                    <Mountain className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">{t("detailDifficulty")}</p>
                      <p className="text-sm font-medium">{activity.difficulty}</p>
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="mb-3 text-lg font-semibold">{t("detailHighlights")}</h2>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {[
                    `${activity.duration} ${t("detailGuidedExperience")}`,
                    `${activity.difficulty} ${t("detailDifficultyLevel")}`,
                    `${t("detailGroupDiscount")} ${activity.groupPrice.toLocaleString()} DA`,
                    t("detailExpertGuides"),
                  ].map((h, i) => (
                    <li key={i} className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-background px-3.5 py-2.5 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                        <Check className="h-3 w-3" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
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
                    <span className="text-2xl font-bold">{activity.price.toLocaleString()} DA</span>
                    <span className="text-sm text-muted-foreground"> /person</span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="h-4 w-4 fill-foreground text-foreground" />
                    {activity.rating}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border/40 p-3">
                      <label className="mb-1 text-[10px] font-medium text-muted-foreground">
                        {t("detailDurationLabel")}
                      </label>
                      <p className="text-sm font-medium">{activity.duration}</p>
                    </div>
                    <div className="rounded-xl border border-border/40 p-3">
                      <label className="mb-1 text-[10px] font-medium text-muted-foreground">
                        {t("detailDifficulty")}
                      </label>
                      <p className="text-sm font-medium">{activity.difficulty}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2 border-t border-border/40 pt-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("detailIndividualPrice")}</span>
                    <span>{activity.price.toLocaleString()} DA</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("detailGroupPrice")}</span>
                    <span>{activity.groupPrice.toLocaleString()} DA</span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span>{t("detailBestValue")}</span>
                    <span>{t("detailSave")} {((1 - activity.groupPrice / activity.price) * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => {
                      if (isInPlan(activity.name)) {
                        removeFromPlan(activity.name);
                      } else {
                        addToPlan({
                          name: activity.name,
                          subtitle: `${activity.type} • ${activity.city}`,
                          region: activity.city,
                          type: "Activity",
                          rating: activity.rating,
                          description: activity.description,
                          image: activity.image,
                          category: "activity",
                          price: `${activity.price.toLocaleString()} DA`,
                        });
                      }
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isInPlan(activity.name)
                        ? "bg-muted text-foreground border border-border"
                        : "border border-border/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {isInPlan(activity.name) ? (
                      <><Check className="h-4 w-4" /> {t("detailInPlan")}</>
                    ) : (
                      <><Plus className="h-4 w-4" /> {t("detailAddToPlan")}</>
                    )}
                  </button>
                  <button
                    onClick={() => setShowBookingDialog(true)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    {t("detailBookNow")}
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
                    <h3 className="text-lg font-semibold">{t("detailContactToBook")}</h3>
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
                        <span className="text-sm font-medium">{activity.phone}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("detailCallReservation")}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/40 p-4">
                      <p className="mb-2 text-sm font-semibold">{t("detailBookingSummary")}</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>{t("detailActivityLabel")}</span>
                          <span className="font-medium text-foreground">{activity.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("detailDuration")}:</span>
                          <span className="font-medium text-foreground">{activity.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("detailParticipantsLabel")}</span>
                          <span className="font-medium text-foreground">{participants}</span>
                        </div>
                        <div className="flex justify-between border-t border-border/40 pt-2 mt-2">
                          <span>{t("detailTotal")}:</span>
                          <span className="font-bold text-foreground">
                            {(activity.price * participants).toLocaleString()} DA
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

          {/* Similar activities */}
          {similar.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-4 text-xl font-bold tracking-tight">{t("detailSimilarActivities")}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((a) => {
                  const SimIcon = typeIcons[a.type] || Mountain;
                  return (
                    <Link
                      key={a.id}
                      href={`/services/activities/${a.id}`}
                      className="group block overflow-hidden rounded-2xl border border-border/40 bg-background transition-shadow hover:shadow-lg"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={a.image}
                          alt={a.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
                          <SimIcon className="h-3 w-3" />
                          {a.type}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold">{a.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {a.city}
                        </p>
                        <div className="mt-2 flex items-end justify-between">
                          <span className="text-sm font-bold">{a.price.toLocaleString()} DA</span>
                          <span className="text-xs text-muted-foreground">/person</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </AppShell>
  );
}
