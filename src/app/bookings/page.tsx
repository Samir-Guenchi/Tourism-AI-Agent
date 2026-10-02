"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Plane,
  Building2,
  Ticket,
  Car,
  Download,
  MoreHorizontal,
  Trash2,
  Utensils,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";

type BookingStatus = "upcoming" | "completed" | "cancelled";

type Booking = {
  id: string;
  type: "hotel" | "car" | "activity" | "restaurant";
  itemId: number;
  name: string;
  city: string;
  price?: number;
  image: string;
  phone: string;
  totalPrice?: number;
  createdAt: any;
  // Type-specific fields
  guests?: number;
  nights?: number;
  stars?: number;
  participants?: number;
  duration?: string;
  difficulty?: string;
  days?: number;
  agency?: string;
  cuisine?: string;
  priceRange?: string;
};

const typeIcons: Record<string, typeof Building2> = {
  hotel: Building2,
  car: Car,
  activity: Ticket,
  restaurant: Utensils,
};

export default function BookingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "bookings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
      setBookings(bookingsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeleteBooking = async (bookingId: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, "users", user.uid, "bookings", bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || b.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    hotel: bookings.filter((b) => b.type === "hotel").length,
    car: bookings.filter((b) => b.type === "car").length,
    activity: bookings.filter((b) => b.type === "activity").length,
    restaurant: bookings.filter((b) => b.type === "restaurant").length,
  };

  if (!user) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold">Sign in required</h1>
            <p className="text-sm text-muted-foreground">
              Please sign in to view your bookings.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Loading bookings...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="pt-24 pb-16 px-4 min-h-screen bg-white text-zinc-900">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{t("bookingsTitle")}</h1>
            <p className="mt-1 text-zinc-500 text-sm">
              {t("bookingsSubtitle")}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-4 gap-3 mb-6"
          >
            {(["hotel", "car", "activity", "restaurant"] as const).map((type) => {
              const Icon = typeIcons[type];
              return (
                <button
                  key={type}
                  onClick={() =>
                    setTypeFilter(typeFilter === type ? "all" : type)
                  }
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                    typeFilter === type
                      ? "border-zinc-900 bg-zinc-100 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700"
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-zinc-900">{stats[type]}</p>
                    <p className="text-[11px] text-zinc-500 capitalize">
                      {type === "restaurant" ? "Dining" : type + "s"}
                    </p>
                  </div>
                </button>
              );
            })}
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 focus-within:bg-white focus-within:border-zinc-900">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("bookingsSearch")}
                className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>

          {/* Bookings List */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <AlertCircle className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium">{t("bookingsEmpty")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {search
                    ? "Try a different search term"
                    : "Your bookings will appear here"}
                </p>
              </motion.div>
            )}

            {filtered.map((booking, i) => {
              const TypeIcon = typeIcons[booking.type] || Ticket;
              const isExpanded = expandedId === booking.id;

              const getBookingDetails = () => {
                const details: Record<string, string> = {
                  Phone: booking.phone,
                };

                if (booking.totalPrice) {
                  details["Total Price"] = `${booking.totalPrice.toLocaleString()} DA`;
                }

                if (booking.type === "hotel") {
                  if (booking.guests) details.Guests = `${booking.guests}`;
                  if (booking.nights) details.Nights = `${booking.nights}`;
                  if (booking.stars) details.Rating = `${"★".repeat(booking.stars)}`;
                } else if (booking.type === "car") {
                  if (booking.days) details.Days = `${booking.days}`;
                  if (booking.agency) details.Agency = booking.agency;
                } else if (booking.type === "activity") {
                  if (booking.participants) details.Participants = `${booking.participants}`;
                  if (booking.duration) details.Duration = booking.duration;
                  if (booking.difficulty) details.Difficulty = booking.difficulty;
                } else if (booking.type === "restaurant") {
                  if (booking.cuisine) details.Cuisine = booking.cuisine;
                  if (booking.guests) details.Guests = `${booking.guests}`;
                  if (booking.priceRange) details["Price Range"] = booking.priceRange;
                }

                return details;
              };

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-zinc-300"
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-4 p-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={booking.image}
                        alt={booking.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold truncate">
                            {booking.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {booking.city}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {booking.totalPrice ? (
                            <p className="text-sm font-bold">
                              {booking.totalPrice.toLocaleString()}{" "}
                              <span className="text-xs font-normal text-muted-foreground">
                                DA
                              </span>
                            </p>
                          ) : booking.priceRange ? (
                            <p className="text-sm font-bold">
                              {booking.priceRange}
                            </p>
                          ) : null}
                          <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                            <Clock className="h-2.5 w-2.5" />
                            Pending
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 capitalize">
                          <Ticket className="h-3 w-3" />
                          {booking.type}
                        </span>
                        <span className="flex items-center gap-1">
                          {booking.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <div className="flex items-center justify-between border-t border-border/30 px-4 py-2">
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : booking.id)
                      }
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </motion.div>
                      {isExpanded ? "Hide details" : "View details"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-border/30"
                      >
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 p-4 bg-muted/30">
                          {Object.entries(getBookingDetails()).map(
                            ([key, value]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-muted-foreground">
                                  {key}
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            )
                          )}
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
    </AppShell>
  );
}
