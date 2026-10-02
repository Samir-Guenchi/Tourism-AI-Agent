"use client";

import { useState, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Star, Calendar, Users, Phone, Check, ChevronRight, Plus, X } from "lucide-react";
import AppShell from "@/components/app-shell";
import { hotels, amenityIcons, amenityLabels } from "@/lib/hotels-data";
import { usePlan } from "@/contexts/plan-context";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hotel = hotels.find((h) => h.id === Number(id));
  const [activeImage, setActiveImage] = useState(0);
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(2);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isAddingToBooking, setIsAddingToBooking] = useState(false);
  const { addToPlan, removeFromPlan, isInPlan } = usePlan();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleAddToBooking = async () => {
    if (!user || !hotel) return;
    setIsAddingToBooking(true);
    try {
      await addDoc(collection(db, "users", user.uid, "bookings"), {
        type: "hotel", itemId: hotel.id, name: hotel.name, city: hotel.city, stars: hotel.stars,
        price: hotel.price, image: hotel.image, phone: hotel.phone, guests, nights,
        totalPrice: hotel.price * nights, createdAt: serverTimestamp(),
      });
      setShowBookingDialog(false);
    } catch (error) { console.error("Error adding to bookings:", error); } finally { setIsAddingToBooking(false); }
  };

  if (!hotel) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold">{t("detailNotFound")}</h1>
            <p className="mb-4 text-sm text-muted-foreground">{t("detailNotFoundDesc")}</p>
            <Link href="/services/hotels" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
              <ArrowLeft className="h-4 w-4" />{t("detailBackHotels")}
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const similar = hotels.filter((h) => h.city === hotel.city && h.id !== hotel.id).slice(0, 3);
  const total = hotel.price * nights;

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          <Link href="/services/hotels" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />{t("detailBackHotels")}
          </Link>

          <div className="mb-8 overflow-hidden rounded-3xl border border-border/40">
            <div className="relative aspect-[21/9] min-h-[320px]">
              <img
                src={(hotel.gallery && hotel.gallery[activeImage]) || hotel.image}
                alt={hotel.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="mb-2 flex items-center gap-1.5">
                  {Array.from({ length: hotel.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold backdrop-blur">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {hotel.rating} ({hotel.reviews} {t("detailReviews")})
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{hotel.name}</h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                  <MapPin className="h-4 w-4" />
                  {hotel.address}
                </p>
              </div>
            </div>
            {hotel.gallery && hotel.gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto bg-background p-3">
                {hotel.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      activeImage === i
                        ? "border-foreground"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${hotel.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="mb-3 text-lg font-semibold">{t("detailAboutHotel")}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{hotel.description}</p>
              </motion.section>
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <h2 className="mb-3 text-lg font-semibold">{t("detailHighlights")}</h2>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {hotel.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-background px-3.5 py-2.5 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background"><Check className="h-3 w-3" /></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.section>
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="mb-3 text-lg font-semibold">{t("svcAmenities") || "Amenities"}</h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => { const Icon = amenityIcons[amenity]; return (
                    <span key={amenity} className="flex h-8 items-center gap-1.5 rounded-full border border-border/40 bg-background px-3 text-xs font-medium">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />{amenityLabels[amenity]}
                    </span>
                  ); })}
                </div>
              </motion.section>
            </div>

            <aside>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="sticky top-24 rounded-2xl border border-border/40 bg-background p-6 shadow-[0_2px_24px_-8px_rgba(0,0,0,0.12)]">
                <div className="mb-5 flex items-end justify-between">
                  <div><span className="text-2xl font-bold">{hotel.price.toLocaleString()} DA</span><span className="text-sm text-muted-foreground"> /{t("hotelNight")}</span></div>
                  <span className="flex items-center gap-1 text-sm font-semibold"><Star className="h-4 w-4 fill-foreground text-foreground" />{hotel.rating}</span>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border/40 p-3">
                      <label className="mb-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><Calendar className="h-3 w-3" /> {t("detailCheckin")}</label>
                      <input type="date" className="w-full bg-transparent text-xs outline-none" />
                    </div>
                    <div className="rounded-xl border border-border/40 p-3">
                      <label className="mb-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><Calendar className="h-3 w-3" /> {t("detailCheckout")}</label>
                      <input type="date" className="w-full bg-transparent text-xs outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border/40 p-3">
                      <label className="mb-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><Users className="h-3 w-3" /> {t("detailGuests")}</label>
                      <div className="flex items-center justify-between">
                        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="flex h-6 w-6 items-center justify-center rounded-full border border-border/40 text-xs">-</button>
                        <span className="text-xs font-medium">{guests}</span>
                        <button onClick={() => setGuests(guests + 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-border/40 text-xs">+</button>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/40 p-3">
                      <label className="mb-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><Calendar className="h-3 w-3" /> {t("detailNights")}</label>
                      <div className="flex items-center justify-between">
                        <button onClick={() => setNights(Math.max(1, nights - 1))} className="flex h-6 w-6 items-center justify-center rounded-full border border-border/40 text-xs">-</button>
                        <span className="text-xs font-medium">{nights}</span>
                        <button onClick={() => setNights(nights + 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-border/40 text-xs">+</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 space-y-2 border-t border-border/40 pt-4 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>{hotel.price.toLocaleString()} DA × {nights} {t("detailNightsLabel")}</span><span>{total.toLocaleString()} DA</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>{t("detailTaxes")}</span><span>{t("detailIncluded")}</span></div>
                  <div className="flex justify-between text-base font-bold"><span>{t("detailTotal")}</span><span>{total.toLocaleString()} DA</span></div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => { if (isInPlan(hotel.name)) { removeFromPlan(hotel.name); } else { addToPlan({ name: hotel.name, subtitle: hotel.description, region: hotel.city, type: "Hotel", rating: hotel.rating, description: hotel.description, image: hotel.image, category: "hotel", price: `${hotel.price.toLocaleString()} DA/night` }); } }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isInPlan(hotel.name) ? "bg-muted text-foreground border border-border" : "border border-border/40 text-muted-foreground hover:bg-muted"}`}>
                    {isInPlan(hotel.name) ? <><Check className="h-4 w-4" /> {t("detailInPlan")}</> : <><Plus className="h-4 w-4" /> {t("detailAddToPlan")}</>}
                  </button>
                  <button onClick={() => setShowBookingDialog(true)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90">
                    {t("detailBookNow")}<ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </aside>
          </div>

          <AnimatePresence>
            {showBookingDialog && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowBookingDialog(false)}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-border/40 bg-background p-6 shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t("detailContactToBook")}</h3>
                    <button onClick={() => setShowBookingDialog(false)} className="rounded-lg p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-2"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">{hotel.phone}</span></div>
                      <p className="text-xs text-muted-foreground">{t("detailCallReservation")}</p>
                    </div>
                    <div className="rounded-xl border border-border/40 p-4">
                      <p className="mb-2 text-sm font-semibold">{t("detailBookingSummary")}</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between"><span>{t("detailHotelLabel")}</span><span className="font-medium text-foreground">{hotel.name}</span></div>
                        <div className="flex justify-between"><span>{t("detailGuestsLabel")}</span><span className="font-medium text-foreground">{guests}</span></div>
                        <div className="flex justify-between"><span>{t("detailNightsLabel")}</span><span className="font-medium text-foreground">{nights}</span></div>
                        <div className="flex justify-between border-t border-border/40 pt-2 mt-2"><span>{t("detailTotal")}:</span><span className="font-bold text-foreground">{(hotel.price * nights).toLocaleString()} DA</span></div>
                      </div>
                    </div>
                    <button onClick={handleAddToBooking} disabled={isAddingToBooking} className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50">
                      {isAddingToBooking ? t("detailAdding") : <><Plus className="h-4 w-4" />{t("detailAddMyBooking")}</>}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {similar.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-4 text-xl font-bold tracking-tight">{t("detailMoreStaysIn")} {hotel.city}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((h) => (
                  <Link key={h.id} href={`/services/hotels/${h.id}`} className="group block overflow-hidden rounded-2xl border border-border/40 bg-background transition-shadow hover:shadow-lg">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={h.image} alt={h.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-foreground text-foreground" />{h.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold">{h.name}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{h.city}</p>
                      <div className="mt-2 flex items-end justify-between">
                        <span className="text-sm font-bold">{h.price.toLocaleString()} DA</span>
                        <span className="text-xs text-muted-foreground">/{t("hotelNight")}</span>
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
