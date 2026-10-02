"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Building2,
  UtensilsCrossed,
  Car,
  Compass,
  Train,
  Users,
  CalendarCheck,
  Trash2,
  Edit3,
  Search,
  X,
  LogOut,
  ShieldCheck,
  Lock,
  MapPin,
  Loader2,
  Star,
  Plus,
  Save,
  ArrowLeft,
  RefreshCw,
  Database,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";
import { hotels as baseHotels } from "@/lib/hotels-data";
import { vehicles as baseVehicles } from "@/lib/cars-data";
import { restaurants as baseRestaurants } from "@/lib/restaurants-data";
import { activities as baseActivities } from "@/lib/activities-data";
import { officialWilayas as baseDestinations } from "@/lib/destinations-data";
import { transportRoutes as baseTransport } from "@/lib/transport-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import AdminAssistant from "@/components/admin-assistant";

type TabType =
  | "overview"
  | "users"
  | "bookings"
  | "hotels"
  | "cars"
  | "activities"
  | "restaurants"
  | "transport"
  | "wilayas";

type CatalogKey = Exclude<TabType, "overview" | "users" | "bookings">;

const defaultCatalogImages: Record<CatalogKey, string> = {
  hotels: "/images/hotels/hotels_1_alger_s_george_img_9622_jpg.webp",
  cars: "/images/cars/cars_8_toyota_land_cruser_39730462701_jpg.webp",
  activities: "/images/activities/activities_1_ski_sur_sur_sable_taghit_059_jpg.webp",
  restaurants: "/images/restaurants/restaurants_1_alger-restaurant-etoile_1940_jpg.webp",
  transport: "/home-page-pic/constantine.jpg",
  wilayas: "/home-page-pic/alger.jpg",
};

interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phone?: string;
  location?: string;
  createdAt?: unknown;
  lastLoginAt?: unknown;
  bookingsCount?: number;
}

interface AdminBooking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: string;
  name: string;
  city?: string;
  price?: number;
  totalPrice?: number;
  createdAt?: unknown;
  phone?: string;
  days?: number;
  nights?: number;
  guests?: number;
  participants?: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [search, setSearch] = useState("");

  // Live database data
  const [usersList, setUsersList] = useState<FirebaseUser[]>([]);
  const [bookingsList, setBookingsList] = useState<AdminBooking[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Catalog data
  const [hotels, setHotels] = useState(baseHotels);
  const [cars, setCars] = useState(baseVehicles);
  const [restaurants, setRestaurants] = useState(baseRestaurants);
  const [activities, setActivities] = useState(baseActivities);
  const [wilayas, setWilayas] = useState(baseDestinations);
  const [transportRoutes, setTransportRoutes] = useState(baseTransport);

  // Selected User Modal Detail
  const [selectedUser, setSelectedUser] = useState<FirebaseUser | null>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [savingItem, setSavingItem] = useState(false);

  // Check Session Auth on load
  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuth");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const loadCatalogFromDatabase = useCallback(async <T extends { id?: number; code?: number; name?: string }>(
    catalogKey: CatalogKey,
    seedItems: T[],
  ): Promise<T[]> => {
    const catalogRef = collection(db, `admin_catalog_${catalogKey}`);
    let snapshot = await getDocs(catalogRef);
    const legacySnapshot = await getDocs(collection(db, `custom_${catalogKey}`));
    const currentById = new Map(snapshot.docs.map((item) => [item.id, item.data()]));
    const batch = writeBatch(db);
    let writes = 0;

    const syncItem = (item: T, source: string) => {
      const itemId = String(item.id ?? item.code);
      const existing = currentById.get(itemId);
      const merged: Record<string, unknown> = { ...item, ...(existing || {}) };

      if (existing) {
        Object.entries(item).forEach(([key, value]) => {
          if (existing[key] === undefined || existing[key] === null || existing[key] === "") {
            merged[key] = value;
          }
        });
      }

      const needsSeed = !existing || Object.entries(item).some(([key]) =>
        existing[key] === undefined || existing[key] === null || existing[key] === ""
      );
      if (needsSeed) {
        batch.set(doc(db, `admin_catalog_${catalogKey}`, itemId), {
          ...merged,
          source: existing?.source || source,
          updatedAt: serverTimestamp(),
        });
        writes += 1;
      }
    };

    seedItems.forEach((item) => syncItem(item, "seed"));
    legacySnapshot.docs.forEach((item) => syncItem(item.data() as T, "custom"));
    if (writes > 0) {
      await batch.commit();
      snapshot = await getDocs(catalogRef);
    }

    const records = snapshot.docs.map((item) => ({
      ...item.data(),
      id: Number(item.data().id ?? item.data().code ?? item.id),
    })) as T[];

    if (catalogKey === "wilayas") {
      const uniqueWilayas = new Map<string, T>();
      records.forEach((item) => {
        const name = typeof item.name === "string" ? item.name.trim().toLowerCase() : String(item.code ?? item.id);
        if (!uniqueWilayas.has(name)) uniqueWilayas.set(name, item);
      });
      return Array.from(uniqueWilayas.values());
    }

    return records;
  }, []);

  // Fetch live database data whenever admin is authenticated
  const loadDatabaseData = useCallback(async () => {
    setLoadingData(true);
    try {
      // 1. Fetch all normal users from Firestore without modifying or deleting them
      const usersSnap = await getDocs(collection(db, "users"));
      const users: FirebaseUser[] = [];
      const bookings: AdminBooking[] = [];

      for (const uDoc of usersSnap.docs) {
        const uData = uDoc.data();
        const userObj: FirebaseUser = {
          uid: uDoc.id,
          email: uData.email || null,
          displayName: uData.displayName || "Voyageur",
          photoURL: uData.photoURL || null,
          phone: uData.phone || undefined,
          location: uData.location || undefined,
          createdAt: uData.createdAt,
          lastLoginAt: uData.lastLoginAt,
          bookingsCount: 0,
        };

        // 2. Fetch bookings for this user to aggregate live bookings
        try {
          const bSnap = await getDocs(collection(db, "users", uDoc.id, "bookings"));
          userObj.bookingsCount = bSnap.size;
          bSnap.forEach((bDoc) => {
            const bData = bDoc.data();
            bookings.push({
              id: bDoc.id,
              userId: uDoc.id,
              userName: userObj.displayName || "Voyageur",
              userEmail: userObj.email || "Non renseigné",
              type: bData.type || "Réservation",
              name: bData.name || "Prestation",
              city: bData.city || bData.region || "Algérie",
              price: bData.price || bData.totalPrice || 0,
              totalPrice: bData.totalPrice || bData.price || 0,
              createdAt: bData.createdAt,
              phone: bData.phone || userObj.phone,
              days: bData.days,
              nights: bData.nights,
              guests: bData.guests,
              participants: bData.participants,
            });
          });
        } catch {
          // Subcollection might not exist or empty
        }

        users.push(userObj);
      }

      setUsersList(users);
      setBookingsList(bookings);

      // Catalogs are seeded once, then always read from Firestore for admin operations.
      const [databaseHotels, databaseCars, databaseActivities, databaseRestaurants, databaseWilayas, databaseTransport] = await Promise.all([
        loadCatalogFromDatabase("hotels", baseHotels),
        loadCatalogFromDatabase("cars", baseVehicles),
        loadCatalogFromDatabase("activities", baseActivities),
        loadCatalogFromDatabase("restaurants", baseRestaurants),
        loadCatalogFromDatabase("wilayas", baseDestinations),
        loadCatalogFromDatabase("transport", baseTransport),
      ]);
      setHotels(databaseHotels);
      setCars(databaseCars);
      setActivities(databaseActivities);
      setRestaurants(databaseRestaurants);
      setWilayas(databaseWilayas);
      setTransportRoutes(databaseTransport);
    } catch (err) {
      console.error("Firebase admin sync error:", err);
    } finally {
      setLoadingData(false);
    }
  }, [loadCatalogFromDatabase]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDatabaseData();
    }
  }, [isAuthenticated, loadDatabaseData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (email === "admin@email.com" || email === "admin@texa.dz") &&
      (password === "Admin@TouristHack2026!" || password === "123456789!")
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setError("");
    } else {
      setError("Identifiants administrateur incorrects.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    router.push("/");
  };

  const formatTimestamp = (ts: unknown) => {
    if (!ts) return "Récent";
    if (ts && typeof ts === "object" && "toDate" in ts) {
      return (ts as { toDate: () => Date }).toDate().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    if (typeof ts === "string") return ts;
    return "Enregistré";
  };

  // Safe user delete (only explicit with double-check)
  const handleDeleteUser = async (uid: string, name: string) => {
    if (
      !confirm(
        `Êtes-vous absolument sûr de vouloir supprimer le compte de ${name} ? Cette action est irréversible.`
      )
    ) {
      return;
    }
    try {
      await deleteDoc(doc(db, "users", uid));
      setUsersList((prev) => prev.filter((u) => u.uid !== uid));
    } catch (err) {
      console.error("Erreur suppression utilisateur:", err);
      alert("Impossible de supprimer cet utilisateur.");
    }
  };

  // Filtering
  const q = search.toLowerCase().trim();

  const filteredUsers = usersList.filter(
    (u) =>
      (u.displayName || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.location || "").toLowerCase().includes(q)
  );

  const filteredBookings = bookingsList.filter(
    (b) =>
      (b.name || "").toLowerCase().includes(q) ||
      (b.userName || "").toLowerCase().includes(q) ||
      (b.userEmail || "").toLowerCase().includes(q) ||
      (b.city || "").toLowerCase().includes(q)
  );

  const filteredHotels = hotels.filter(
    (h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)
  );

  const filteredCars = cars.filter(
    (c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.agency.toLowerCase().includes(q)
  );

  const filteredActivities = activities.filter(
    (a) => a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q)
  );

  const filteredRestaurants = restaurants.filter(
    (r) => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q)
  );

  const filteredWilayas = wilayas.filter(
    (w) => w.name.toLowerCase().includes(q) || w.region.toLowerCase().includes(q)
  );

  const filteredTransport = transportRoutes.filter(
    (route) =>
      route.operator.toLowerCase().includes(q) ||
      route.from.toLowerCase().includes(q) ||
      route.to.toLowerCase().includes(q) ||
      route.type.toLowerCase().includes(q)
  );

  // Calculations for real DB Metrics
  const totalRevenue = bookingsList.reduce((acc, b) => acc + (b.totalPrice || b.price || 0), 0);
  const totalCatalogItems =
    hotels.length + cars.length + activities.length + restaurants.length + transportRoutes.length + wilayas.length;
  const latestBooking = bookingsList[0];
  const bookingTypeSummary = [
    { label: "Hôtels", count: bookingsList.filter((b) => b.type === "hotel").length },
    { label: "Activités", count: bookingsList.filter((b) => b.type === "activity").length },
    { label: "Restaurants", count: bookingsList.filter((b) => b.type === "restaurant").length },
    { label: "Véhicules", count: bookingsList.filter((b) => b.type === "car").length },
  ];
  const highestBookingTypeCount = Math.max(...bookingTypeSummary.map((item) => item.count), 1);
  const adminAiContext = [
    `Metrics: ${usersList.length} users, ${bookingsList.length} bookings, ${hotels.length} hotels, ${cars.length} cars, ${activities.length} activities, ${restaurants.length} restaurants, ${wilayas.length} wilayas, ${transportRoutes.length} transport routes, estimated booking volume ${totalRevenue} DA.`,
    "User records:",
    usersList
      .map((user) => `- ${user.displayName || "Voyageur"} | email: ${user.email || "none"} | location: ${user.location || "none"} | bookings: ${user.bookingsCount || 0}`)
      .join("\n"),
    "Booking records:",
    bookingsList
      .map((booking) => `- ${booking.name} | type: ${booking.type} | city: ${booking.city || "Algeria"} | user: ${booking.userName} | price: ${booking.totalPrice || booking.price || 0} DA`)
      .join("\n"),
    "Hotel catalog:",
    hotels.map((hotel) => `- ${hotel.name} | city: ${hotel.city} | stars: ${hotel.stars} | rating: ${hotel.rating} | price: ${hotel.price} DA`).join("\n"),
    "Car catalog:",
    cars.map((car) => `- ${car.name} | city: ${car.city} | type: ${car.type} | price: ${car.price} DA/day | listed in catalog: true`).join("\n"),
    "Transport routes:",
    transportRoutes.map((route) => `- ${route.type} ${route.operator}: ${route.from} -> ${route.to} | ${route.departure}-${route.arrival} | ${route.price} DA | available: ${route.available}`).join("\n"),
    "Important limitation: individual user trip plans are stored in browser localStorage, not in a central Firestore collection, so no reliable admin-wide plan query is available.",
  ].join("\n\n");

  // Add / Edit Handlers
  const openAddForm = () => {
    setEditingItem(null);
    if (activeTab === "hotels") {
      setFormData({
        name: "",
        city: "Alger",
        stars: "4",
        price: "12000",
        rating: "4.5",
        phone: "+213 21 00 00 00",
        address: "",
        description: "",
        image: "",
      });
    } else if (activeTab === "cars") {
      setFormData({
        name: "",
        agency: "Texa Drive",
        city: "Alger",
        type: "4x4",
        price: "9000",
        phone: "+213 550 00 00 00",
        transmission: "Automatique",
        fuel: "Diesel",
        seats: "5",
        description: "",
        image: "",
      });
    } else if (activeTab === "activities") {
      setFormData({
        name: "",
        city: "Djanet",
        type: "desert",
        duration: "Journée complète",
        price: "7500",
        difficulty: "Modéré",
        phone: "+213 29 00 00 00",
        description: "",
        image: "",
      });
    } else if (activeTab === "restaurants") {
      setFormData({
        name: "",
        city: "Alger",
        cuisine: "Algérienne Traditionnelle",
        priceRange: "Modéré",
        phone: "+213 21 00 00 00",
        description: "",
        image: "",
      });
    }
    setShowForm(true);
  };

  const handleSaveItem = async () => {
    setSavingItem(true);
    try {
      if (!["hotels", "cars", "activities", "restaurants"].includes(activeTab)) return;
      const collectionName = `admin_catalog_${activeTab}`;
      const newItem = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price || 0),
        rating: 4.8,
        image: formData.image || defaultCatalogImages[activeTab as CatalogKey],
        createdAt: serverTimestamp(),
      };

      // Save to Firebase Firestore
      await setDoc(doc(db, collectionName, String(newItem.id)), newItem);

      // Local state update
      if (activeTab === "hotels") setHotels((prev) => [newItem as any, ...prev]);
      if (activeTab === "cars") setCars((prev) => [newItem as any, ...prev]);
      if (activeTab === "activities") setActivities((prev) => [newItem as any, ...prev]);
      if (activeTab === "restaurants") setRestaurants((prev) => [newItem as any, ...prev]);

      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Erreur enregistrement Firestore:", err);
      alert("Erreur lors de l'enregistrement dans la base de données.");
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteCatalogItem = async (catalogKey: CatalogKey, id: number, name: string) => {
    if (!confirm(`Supprimer ${name} de la base de données ?`)) return;
    try {
      await deleteDoc(doc(db, `admin_catalog_${catalogKey}`, String(id)));
      if (catalogKey === "hotels") setHotels((items) => items.filter((item) => item.id !== id));
      if (catalogKey === "cars") setCars((items) => items.filter((item) => item.id !== id));
      if (catalogKey === "activities") setActivities((items) => items.filter((item) => item.id !== id));
      if (catalogKey === "restaurants") setRestaurants((items) => items.filter((item) => item.id !== id));
      if (catalogKey === "wilayas") setWilayas((items) => items.filter((item) => item.code !== id));
      if (catalogKey === "transport") setTransportRoutes((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Erreur suppression catalogue:", err);
      alert("Impossible de supprimer cette entrée de la base de données.");
    }
  };

  // If unauthenticated: clean, white, elegant login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6 text-zinc-900">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Texa Logo" className="h-9 w-9 rounded-xl shadow-sm" />
              <span className="text-xl font-bold tracking-tight text-zinc-900">Texa</span>
            </Link>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200/80 px-3 py-1 text-[11px] font-semibold text-zinc-700">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Console Administrateur</span>
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Accès réservé à la gestion de la plateforme et des données.
            </p>
          </div>

          <form onSubmit={handleLogin} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Email Administrateur
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3.5 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3.5 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 shadow-sm transition-all"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Ouvrir la session</span>
            </button>

            <div className="pt-2 text-center">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Retour au site public</span>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-zinc-900">
      {/* Top Header Bar — Pure White with Border */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Texa Logo" className="h-8 w-8 rounded-lg" />
              <span className="font-bold text-base text-zinc-950 tracking-tight">Texa</span>
            </Link>
            <div className="hidden h-4 w-px bg-zinc-200 sm:block" />
            <span className="hidden rounded-lg bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 sm:inline-flex">
              Console Admin
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={loadDatabaseData}
              disabled={loadingData}
              title="Actualiser les données"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 sm:px-3"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 sm:px-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Voir le site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 sm:px-3"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Quitter</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Pilotage</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">Vue d&apos;ensemble</h1>
          <p className="mt-1 text-sm text-zinc-500">Les indicateurs essentiels de Texa, en un coup d&apos;œil.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
          <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Réservations</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1f5c53] text-white">
                <CalendarCheck className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">{bookingsList.length}</p>
            <p className="mt-1 text-[11px] text-zinc-600">Demandes enregistrées</p>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Volume estimé</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#9b4d3c] text-white">
                <Building2 className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 truncate text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">{totalRevenue.toLocaleString()} <span className="text-sm font-normal text-zinc-600">DA</span></p>
            <p className="mt-1 text-[11px] text-zinc-600">Cumul des réservations</p>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Catalogue</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#b07a2b] text-white">
                <Compass className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">{totalCatalogItems}</p>
            <p className="mt-1 text-[11px] text-zinc-600">Offres et wilayas actives</p>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Dernière activité</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#46505a] text-white">
                <MapPin className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 truncate text-lg font-bold tracking-tight text-zinc-950 sm:text-xl">{latestBooking?.name || "Aucune activité"}</p>
            <p className="mt-1 truncate text-[11px] text-zinc-600">{latestBooking?.city || "En attente de données"}</p>
          </article>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex w-full flex-nowrap items-center justify-between gap-1 overflow-hidden border-b border-zinc-200 pb-3 sm:justify-start sm:gap-2">
          {[
            { id: "overview" as const, label: "Overview", count: undefined, icon: Compass },
            { id: "users" as const, label: "Utilisateurs", count: usersList.length, icon: Users },
            { id: "bookings" as const, label: "Réservations", count: bookingsList.length, icon: CalendarCheck },
            { id: "hotels" as const, label: "Hôtels", count: hotels.length, icon: Building2 },
            { id: "cars" as const, label: "Véhicules", count: cars.length, icon: Car },
            { id: "activities" as const, label: "Activités", count: activities.length, icon: Compass },
            { id: "restaurants" as const, label: "Dining", count: restaurants.length, icon: UtensilsCrossed },
            { id: "transport" as const, label: "Transport", count: transportRoutes.length, icon: Train },
            { id: "wilayas" as const, label: "Wilayas", count: wilayas.length, icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                title={tab.label}
                aria-label={tab.count !== undefined ? `${tab.label} (${tab.count})` : tab.label}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearch("");
                }}
                className={`flex h-8 w-8 shrink-0 items-center justify-center gap-2 rounded-xl p-0 text-xs font-semibold transition-all sm:h-auto sm:w-auto sm:flex-1 sm:justify-center sm:whitespace-nowrap sm:px-2 sm:py-2 ${
                  isSelected
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`hidden rounded-full px-1.5 py-0.2 text-[10px] sm:inline-flex ${
                      isSelected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Actions Bar */}
        {activeTab !== "overview" && <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Rechercher dans ${activeTab}...`}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-8 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:self-auto">
            {activeTab !== "users" && activeTab !== "bookings" && activeTab !== "wilayas" && activeTab !== "transport" && (
              <button
                onClick={openAddForm}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 sm:w-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Ajouter à la base</span>
              </button>
            )}
          </div>
        </div>}

        {/* Content Table / Cards */}
        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5" aria-labelledby="activity-title">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Réservations</p>
                  <h2 id="activity-title" className="mt-1 text-lg font-bold tracking-tight text-zinc-950">Répartition des demandes</h2>
                </div>
                <CalendarCheck className="h-5 w-5 text-[#35635e]" />
              </div>
              <div className="mt-5 space-y-3">
                {bookingTypeSummary.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-600">{item.label}</span>
                      <span className="font-bold text-zinc-900">{item.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-[#35635e] transition-all"
                        style={{ width: `${(item.count / highestBookingTypeCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5" aria-labelledby="inventory-title">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Inventaire</p>
                  <h2 id="inventory-title" className="mt-1 text-lg font-bold tracking-tight text-zinc-950">Offre disponible</h2>
                </div>
                <Compass className="h-5 w-5 text-[#a67837]" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#f3eee3] p-3">
                  <p className="text-xs text-zinc-500">Catalogue total</p>
                  <p className="mt-1 text-xl font-bold text-zinc-950">{totalCatalogItems}</p>
                </div>
                <div className="rounded-xl bg-[#e8f0ee] p-3">
                  <p className="text-xs text-zinc-500">Volume estimé</p>
                  <p className="mt-1 truncate text-xl font-bold text-zinc-950">{totalRevenue.toLocaleString()} DA</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  ["Hôtels", hotels.length],
                  ["Véhicules", cars.length],
                  ["Activités", activities.length],
                  ["Restaurants", restaurants.length],
                ].map(([label, count]) => (
                  <div key={label} className="rounded-xl bg-[#faf8f3] p-3">
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="mt-1 text-xl font-bold text-zinc-950">{count}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-[#fbfaf8] p-4 sm:p-5 lg:col-span-2" aria-labelledby="latest-title">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dernière activité</p>
                  <h2 id="latest-title" className="mt-1 text-lg font-bold tracking-tight text-zinc-950">
                    {latestBooking?.name || "Aucune réservation récente"}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <MapPin className="h-4 w-4 text-[#9a5b43]" />
                  <span>{latestBooking?.city || "Les nouvelles activités apparaîtront ici"}</span>
                </div>
              </div>
            </section>
          </div>
        ) : loadingData ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-zinc-200 bg-white">
            <Loader2 className="h-7 w-7 animate-spin text-zinc-400 mb-2" />
            <p className="text-xs text-zinc-500 font-medium">Chargement des données en direct depuis Firebase...</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            {/* USERS TAB */}
            {activeTab === "users" && (
              <div className="divide-y divide-zinc-200">
                <div className="bg-zinc-50 px-5 py-3 grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  <div className="col-span-5 sm:col-span-4">Utilisateur</div>
                  <div className="col-span-4 sm:col-span-3">Email & Téléphone</div>
                  <div className="hidden sm:block sm:col-span-2">Wilaya</div>
                  <div className="col-span-3 sm:col-span-3 text-right">Actions & Statut</div>
                </div>

                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-500">
                    Aucun utilisateur trouvé.
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u.uid}
                      className="px-5 py-3.5 grid grid-cols-12 items-center hover:bg-zinc-50/80 transition-colors text-xs"
                    >
                      <div className="col-span-5 sm:col-span-4 flex items-center gap-3 min-w-0 pr-2">
                        <div className="h-9 w-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 shrink-0">
                          {(u.displayName || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 truncate">
                            {u.displayName || "Voyageur sans nom"}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate">
                            Inscrit: {formatTimestamp(u.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-4 sm:col-span-3 min-w-0 pr-2">
                        <p className="font-medium text-zinc-700 truncate">{u.email || "Non renseigné"}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{u.phone || "Sans téléphone"}</p>
                      </div>

                      <div className="hidden sm:block sm:col-span-2 text-zinc-600 truncate">
                        {u.location || "Algérie"}
                      </div>

                      <div className="col-span-3 sm:col-span-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50"
                        >
                          <Eye className="h-3 w-3" />
                          <span className="hidden sm:inline">Détails</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.uid, u.displayName || u.email || "cet utilisateur")}
                          title="Supprimer l'utilisateur"
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div className="divide-y divide-zinc-200">
                <div className="bg-zinc-50 px-5 py-3 grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  <div className="col-span-4 sm:col-span-3">Prestation</div>
                  <div className="col-span-4 sm:col-span-3">Client</div>
                  <div className="hidden sm:block sm:col-span-3">Type & Ville</div>
                  <div className="col-span-4 sm:col-span-3 text-right">Montant</div>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-500">
                    Aucune réservation enregistrée pour le moment.
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="px-5 py-3.5 grid grid-cols-12 items-center hover:bg-zinc-50/80 transition-colors text-xs"
                    >
                      <div className="col-span-4 sm:col-span-3 min-w-0 pr-2">
                        <p className="font-bold text-zinc-900 truncate">{b.name}</p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {formatTimestamp(b.createdAt)}
                        </p>
                      </div>

                      <div className="col-span-4 sm:col-span-3 min-w-0 pr-2">
                        <p className="font-semibold text-zinc-800 truncate">{b.userName}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{b.userEmail}</p>
                      </div>

                      <div className="hidden sm:block sm:col-span-3 text-zinc-600">
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 mr-2">
                          {b.type}
                        </span>
                        <span>{b.city}</span>
                      </div>

                      <div className="col-span-4 sm:col-span-3 text-right">
                        <span className="font-bold text-zinc-900">
                          {(b.totalPrice || b.price || 0).toLocaleString()} DA
                        </span>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Confirmée</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* HOTELS TAB */}
            {activeTab === "hotels" && (
              <div className="divide-y divide-zinc-200">
                {filteredHotels.map((h) => (
                  <div key={h.name} className="flex items-center gap-4 p-4 hover:bg-zinc-50/80 transition-colors text-xs">
                    <img
                      src={h.image || defaultCatalogImages.hotels}
                      alt={h.name}
                      className="h-12 w-16 rounded-xl object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-zinc-900 truncate">{h.name}</h4>
                        <span className="rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.2 text-[10px] font-bold text-amber-700">
                          {h.stars}★
                        </span>
                      </div>
                      <p className="text-zinc-500 text-[11px] truncate mt-0.5">
                        {h.city} • {h.address || "Adresse centre-ville"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-zinc-900">{h.price.toLocaleString()} DA</p>
                      <span className="text-[10px] text-zinc-400">par nuit</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCatalogItem("hotels", h.id, h.name)}
                      title="Supprimer de la base"
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* CARS TAB */}
            {activeTab === "cars" && (
              <div className="divide-y divide-zinc-200">
                {filteredCars.map((c) => (
                  <div key={c.name} className="flex items-center gap-4 p-4 hover:bg-zinc-50/80 transition-colors text-xs">
                    <img
                      src={c.image || defaultCatalogImages.cars}
                      alt={c.name}
                      className="h-12 w-16 rounded-xl object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-zinc-900 truncate">{c.name}</h4>
                      <p className="text-zinc-500 text-[11px] truncate mt-0.5">
                        {c.agency} • {c.city} • {c.transmission} • {c.fuel}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-zinc-900">{c.price.toLocaleString()} DA</p>
                      <span className="text-[10px] text-zinc-400">par jour</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCatalogItem("cars", c.id, c.name)}
                      title="Supprimer de la base"
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ACTIVITIES TAB */}
            {activeTab === "activities" && (
              <div className="divide-y divide-zinc-200">
                {filteredActivities.map((a) => (
                  <div key={a.name} className="flex items-center gap-4 p-4 hover:bg-zinc-50/80 transition-colors text-xs">
                    <img
                      src={a.image || defaultCatalogImages.activities}
                      alt={a.name}
                      className="h-12 w-16 rounded-xl object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-zinc-900 truncate">{a.name}</h4>
                      <p className="text-zinc-500 text-[11px] truncate mt-0.5">
                        {a.city} • {a.duration} • {a.type}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-zinc-900">{a.price.toLocaleString()} DA</p>
                      <span className="text-[10px] text-zinc-400">par personne</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCatalogItem("activities", a.id, a.name)}
                      title="Supprimer de la base"
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* RESTAURANTS TAB */}
            {activeTab === "restaurants" && (
              <div className="divide-y divide-zinc-200">
                {filteredRestaurants.map((r) => (
                  <div key={r.name} className="flex items-center gap-4 p-4 hover:bg-zinc-50/80 transition-colors text-xs">
                    <img
                      src={r.image || defaultCatalogImages.restaurants}
                      alt={r.name}
                      className="h-12 w-16 rounded-xl object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-zinc-900 truncate">{r.name}</h4>
                      <p className="text-zinc-500 text-[11px] truncate mt-0.5">
                        {r.city} • {r.cuisine} • Gamme {r.priceRange}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span>{r.rating}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{r.reviews} avis</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCatalogItem("restaurants", r.id, r.name)}
                      title="Supprimer de la base"
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TRANSPORT TAB */}
            {activeTab === "transport" && (
              <div className="divide-y divide-zinc-200">
                {filteredTransport.map((route) => (
                  <div key={route.id} className="flex items-center gap-4 p-4 text-xs transition-colors hover:bg-zinc-50/80">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                      <Train className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-bold text-zinc-900">{route.operator}</h4>
                      <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                        {route.type} · {route.from} → {route.to} · {route.departure}–{route.arrival}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-zinc-900">{route.price.toLocaleString()} DA</p>
                      <span className={route.available ? "text-[10px] text-emerald-600" : "text-[10px] text-red-600"}>
                        {route.available ? "Disponible" : "Indisponible"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCatalogItem("transport", route.id, `${route.operator} ${route.from}-${route.to}`)}
                      title="Supprimer de la base"
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* WILAYAS TAB */}
            {activeTab === "wilayas" && (
              <div className="divide-y divide-zinc-200">
                {filteredWilayas.map((w, index) => {
                  const slug = w.name.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <div key={`wilaya-${w.code ?? w.name}-${index}`} className="flex items-center gap-4 p-4 hover:bg-zinc-50/80 transition-colors text-xs">
                      <img
                        src={w.image || defaultCatalogImages.wilayas}
                        alt={w.name}
                        className="h-12 w-16 rounded-xl object-cover border border-zinc-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-zinc-900 truncate">{w.name}</h4>
                        <p className="text-zinc-500 text-[11px] truncate mt-0.5">
                          {w.subtitle} • Région {w.region}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/destinations/${slug}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-800 hover:bg-zinc-50"
                          >
                            <span>Fiche</span>
                            <Eye className="h-3 w-3" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteCatalogItem("wilayas", w.code || 0, w.name)}
                            title="Supprimer de la base"
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* User Detail Modal (Never modifies or deletes info) */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900">
              Détails du Compte Voyageur
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Informations réelles stockées dans Firebase Firestore.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2 text-xs">
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="h-12 w-12 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-lg text-zinc-700">
                  {(selectedUser.displayName || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">{selectedUser.displayName || "Non renseigné"}</h4>
                  <p className="text-zinc-500">{selectedUser.email || "Aucun email"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Téléphone</p>
                  <p className="font-semibold text-zinc-900 mt-0.5">{selectedUser.phone || "Non renseigné"}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Wilaya</p>
                  <p className="font-semibold text-zinc-900 mt-0.5">{selectedUser.location || "Algérie"}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Date d&apos;inscription</p>
                  <p className="font-semibold text-zinc-900 mt-0.5">{formatTimestamp(selectedUser.createdAt)}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Réservations</p>
                  <p className="font-semibold text-emerald-600 mt-0.5">{selectedUser.bookingsCount || 0} séjour(s)</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-100 text-[10px] text-zinc-500 font-mono truncate">
                UID: {selectedUser.uid}
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={() => setSelectedUser(null)}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              Fermer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Entry Dialog (Persists to Firestore) */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900">
              Ajouter une entrée ({activeTab})
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Cette prestation sera directement enregistrée dans la base de données Firebase.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="mb-1 block font-semibold text-zinc-700">Nom de la prestation</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Hôtel Les Zianides, Randonnée Assekrem..."
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block font-semibold text-zinc-700">Ville / Wilaya</label>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ex: Alger, Oran, Djanet"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-zinc-700">Prix unitaire (DA)</label>
                <input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="12000"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-zinc-700">Téléphone de contact</label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+213 ..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-zinc-700">URL Photo</label>
              <input
                type="url"
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-zinc-700">Description courte</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Détails sur l'établissement ou l'excursion..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveItem}
              disabled={savingItem}
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {savingItem ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>Enregistrer en base</span>
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminAssistant context={adminAiContext} />
    </div>
  );
}
