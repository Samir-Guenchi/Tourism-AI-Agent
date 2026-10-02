"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { usePlan } from "@/contexts/plan-context";
import { languages, type Language } from "@/lib/translations";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Settings,
  Bell,
  Globe,
  ShieldCheck,
  Camera,
  LogOut,
  ChevronRight,
  Bookmark,
  Check,
  Loader2,
  Map,
  Trash2,
  Sliders,
  FileText,
  Compass,
  Building2,
  CalendarCheck,
  Palette,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const planColors = [
  { name: "Vert Algérie", value: "#008C61" },
  { name: "Bleu Méditerranée", value: "#3B82F6" },
  { name: "Ocre Sahara", value: "#F97316" },
  { name: "Pourpre Royal", value: "#8B5CF6" },
  { name: "Rouge Rubis", value: "#EF4444" },
  { name: "Anthracite", value: "#171717" },
];

export default function ProfilePage() {
  const { user, userProfile, refreshProfile } = useAuth();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { items: planItems, removeFromPlan } = usePlan();

  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);

  const [editData, setEditData] = useState({ fullName: "", phone: "", location: "" });
  const [saving, setSaving] = useState(false);

  const [planColor, setPlanColor] = useState("#008C61");
  const [hidePlanButton, setHidePlanButton] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const storedColor = localStorage.getItem("plan-btn-color");
    const storedHide = localStorage.getItem("plan-btn-hidden");
    if (storedColor) setPlanColor(storedColor);
    if (storedHide === "true") setHidePlanButton(true);
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("plan-btn-style-change", {
        detail: { color: planColor, hidden: hidePlanButton },
      })
    );
    localStorage.setItem("plan-btn-color", planColor);
    localStorage.setItem("plan-btn-hidden", String(hidePlanButton));
  }, [planColor, hidePlanButton]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const openAccountSettings = () => {
    setEditData({
      fullName: userProfile?.displayName || "",
      phone: userProfile?.phone || "",
      location: userProfile?.location || "",
    });
    setShowAccountSettings(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: editData.fullName });
      await updateDoc(doc(db, "users", user.uid), {
        displayName: editData.fullName,
        phone: editData.phone,
        location: editData.location,
      });
      await refreshProfile();
      setShowAccountSettings(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const openCamera = async () => {
    setCapturedPhoto(null);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      setCapturedPhoto(canvas.toDataURL("image/jpeg"));
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((trk) => trk.stop());
      streamRef.current = null;
    }
  };

  const closeCamera = () => {
    stopCamera();
    setCapturedPhoto(null);
    setShowCamera(false);
  };

  const langNames: Record<Language, string> = {
    fr: "Français",
    en: "English",
    ar: "العربية",
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-white text-zinc-900">
        <div className="pt-24 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">

              {/* Profile Card Header */}
              <motion.div
                variants={fadeUp}
                className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-2 border-zinc-200 shadow-sm">
                      <AvatarImage
                        src={user?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"}
                        alt={userProfile?.displayName || "Utilisateur"}
                      />
                      <AvatarFallback className="text-2xl font-bold bg-muted text-foreground">
                        {(userProfile?.displayName || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={openCamera}
                      title="Prendre une photo"
                      className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background shadow-md transition-transform hover:scale-105"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Info & Stats */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                          {userProfile?.displayName || user?.displayName || "Voyageur Texa"}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {userProfile?.email || user?.email || "compte.authentifie@texa.dz"}
                        </p>
                      </div>

                      <button
                        onClick={openAccountSettings}
                        className="inline-flex items-center justify-center gap-1.5 self-center sm:self-start rounded-xl border border-border/60 bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-muted/40"
                      >
                        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Modifier le profil</span>
                      </button>
                    </div>

                    {/* Status Badges */}
                    <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <Badge variant="secondary" className="gap-1.5 text-[11px] font-medium py-0.5">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        <span>Voyageur Certifié</span>
                      </Badge>
                      <Badge variant="outline" className="gap-1.5 text-[11px] font-medium py-0.5">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{userProfile?.location || "Algérie"}</span>
                      </Badge>
                      <Badge variant="outline" className="gap-1.5 text-[11px] font-medium py-0.5">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span>{langNames[language]}</span>
                      </Badge>
                    </div>

                    {/* Stats pills */}
                    <div className="mt-5 grid grid-cols-3 gap-2.5 pt-4 border-t border-border/40">
                      <div className="text-center sm:text-left">
                        <p className="text-lg font-bold text-foreground">{planItems.length}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Au carnet</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <Link href="/bookings" className="group">
                          <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Réservations</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Accès direct</p>
                        </Link>
                      </div>
                      <div className="text-center sm:text-left">
                        <Link href="/destinations" className="group">
                          <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">58</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Wilayas</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Information Personnelle Detail */}
              <motion.div variants={fadeUp} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-zinc-500" />
                    <span>Informations Personnelles</span>
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-zinc-500">Nom complet</p>
                        <p className="text-xs font-semibold truncate text-zinc-900">
                          {userProfile?.displayName || user?.displayName || "Non renseigné"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-zinc-500">Adresse email</p>
                        <p className="text-xs font-semibold truncate text-zinc-900">
                          {userProfile?.email || user?.email || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-zinc-500">Téléphone de contact</p>
                        <p className="text-xs font-semibold truncate text-zinc-900">
                          {userProfile?.phone || "Non renseigné"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-zinc-500">Wilaya / Ville de résidence</p>
                        <p className="text-xs font-semibold truncate text-zinc-900">
                          {userProfile?.location || "Algérie"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mon Carnet de Voyage (usePlan) */}
              <motion.div variants={fadeUp} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-zinc-500" />
                      <span>Mon Carnet de Voyage</span>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                        {planItems.length}
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Vos étapes, hébergements et activités sauvegardés.
                    </p>
                  </div>

                  <Link
                    href="/map"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800 transition-all hover:bg-zinc-100 hover:border-zinc-300 shadow-sm"
                  >
                    <Map className="h-3.5 w-3.5" />
                    <span>Carte du séjour</span>
                  </Link>
                </div>

                {planItems.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/60 p-8 text-center bg-muted/20">
                    <Compass className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs font-medium text-foreground">Votre carnet est vide pour le moment</p>
                    <p className="text-[11px] text-muted-foreground mt-1 max-w-sm mx-auto">
                      Explorez nos hôtels, activités, restaurants ou transports et ajoutez-les d&apos;un simple clic.
                    </p>
                    <Link
                      href="/destinations"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-foreground underline underline-offset-4"
                    >
                      <span>Découvrir les destinations</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {planItems.slice(0, 4).map((item) => (
                      <div
                        key={item.name}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/70 p-3 transition-colors hover:border-foreground/20"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {item.category}
                          </span>
                          <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{item.region}</p>
                        </div>
                        <button
                          onClick={() => removeFromPlan(item.name)}
                          title="Retirer du plan"
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {planItems.length > 4 && (
                  <div className="mt-3 text-center">
                    <Link href="/map" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                      Voir l&apos;intégralité des {planItems.length} éléments sur la carte →
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Paramètres & Préférences */}
              <motion.div variants={fadeUp} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-zinc-500" />
                  <span>Préférences & Configuration</span>
                </h2>

                <div className="space-y-1">
                  {/* Language Setting */}
                  <button
                    onClick={() => setShowLanguageDialog(true)}
                    className="flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-zinc-50 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900">Langue d&apos;affichage</p>
                        <p className="text-[11px] text-zinc-500">Choisir la langue de navigation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold uppercase text-zinc-700">
                        {language}
                      </span>
                      <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>

                  <Separator className="my-1 bg-zinc-100" />

                  {/* Plan Button Preferences */}
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-zinc-50 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                        <Palette className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900">Bouton de navigation rapide</p>
                        <p className="text-[11px] text-zinc-500">Personnaliser l&apos;accès au plan</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border border-zinc-300"
                        style={{ backgroundColor: planColor }}
                      />
                      <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>

                  <Separator className="my-1 bg-zinc-100" />

                  {/* Terms */}
                  <button
                    onClick={() => setShowTerms(true)}
                    className="flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-zinc-50 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900">Conditions d&apos;utilisation & Confidentialité</p>
                        <p className="text-[11px] text-zinc-500">Mentions légales et engagement de service</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>

              {/* Actions & Sign Out */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={openCamera}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-800 transition-all hover:bg-zinc-50 shadow-sm"
                >
                  <Camera className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Partager un instant voyage</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100/70"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Déconnexion</span>
                </button>
              </motion.div>

            </motion.div>
          </div>
        </div>

        {/* Account Settings Dialog */}
        <Dialog open={showAccountSettings} onOpenChange={setShowAccountSettings}>
          <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-900">Modifier mes informations</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Mettez à jour vos coordonnées personnelles pour faciliter vos réservations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3.5 py-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={editData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                  placeholder="Ex: Samir Benali"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={userProfile?.email || user?.email || ""}
                  disabled
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-100/70 px-3.5 py-2 text-xs text-zinc-400 outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="+213 555 123 456"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Wilaya / Ville de résidence
                </label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  placeholder="Ex: Alger, Oran, Constantine"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <button
                onClick={() => setShowAccountSettings(false)}
                className="rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 shadow-sm"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                <span>Enregistrer</span>
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preferences Dialog */}
        <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
          <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-900">Bouton de navigation rapide</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Personnalisez la couleur et la visibilité du raccourci vers votre carnet de voyage.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2.5">
                  Couleur d&apos;accentuation
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {planColors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setPlanColor(c.value)}
                      className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                        planColor === c.value
                          ? "border-zinc-900 bg-zinc-100 font-semibold"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div
                        className="h-5 w-5 rounded-full shrink-0 border border-zinc-300"
                        style={{ backgroundColor: c.value }}
                      />
                      <span className="text-[11px] truncate text-zinc-800">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-zinc-100" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-900">Afficher le bouton flottant</p>
                  <p className="text-[11px] text-zinc-500">Accès direct au plan en bas de l&apos;écran</p>
                </div>
                <button
                  onClick={() => setHidePlanButton(!hidePlanButton)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    hidePlanButton ? "bg-zinc-200" : "bg-zinc-900"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      hidePlanButton ? "left-0.5" : "left-[22px]"
                    }`}
                  />
                </button>
              </div>
            </div>
            <DialogFooter>
              <button
                onClick={() => setShowPreferences(false)}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
              >
                Fermer
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Language Dialog — ZERO EMOJIS, Clean ISO badges */}
        <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
          <DialogContent className="sm:max-w-sm bg-white border-zinc-200 text-zinc-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-900">Sélectionner la langue</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Choisissez votre langue préférée pour l&apos;ensemble de la plateforme Texa.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageDialog(false);
                    }}
                    className={`flex w-full items-center gap-3.5 rounded-xl p-3 text-left transition-all ${
                      isSelected
                        ? "border border-zinc-900 bg-zinc-900 text-white"
                        : "border border-zinc-200 hover:bg-zinc-50 text-zinc-800"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                        isSelected ? "bg-white text-zinc-900" : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {lang.code.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold">{lang.nativeName}</p>
                      <p className={`text-[10px] ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}>
                        {lang.label}
                      </p>
                    </div>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Terms Dialog */}
        <Dialog open={showTerms} onOpenChange={setShowTerms}>
          <DialogContent className="sm:max-w-lg max-h-[75vh] overflow-y-auto bg-white border-zinc-200 text-zinc-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-900">Conditions Générales d&apos;Utilisation</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">Texa Algérie • Version 2026</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">1. Présentation de la Plateforme</h3>
                <p>
                  Texa est une plateforme dédiée à la mise en valeur du patrimoine touristique algérien, facilitant la découverte des wilayas, la consultation d&apos;itinéraires et la réservation d&apos;hébergements et d&apos;expériences.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">2. Réservations et Partenaires</h3>
                <p>
                  Les réservations hôtelières, locations de véhicules et activités sont opérées en partenariat direct avec des prestataires locaux accrédités garantissant les tarifs en Dinars Algériens (DA).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">3. Protection des Données Personnelles</h3>
                <p>
                  Vos données de compte sont protégées et ne font l&apos;objet d&apos;aucune revente à des tiers. Vous disposez d&apos;un droit de modification et de suppression direct depuis votre espace profil.
                </p>
              </div>
            </div>
            <DialogFooter>
              <button
                onClick={() => setShowTerms(false)}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shadow-sm"
              >
                J&apos;ai compris
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Camera Modal */}
        <Dialog open={showCamera} onOpenChange={(open) => { if (!open) closeCamera(); }}>
          <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-900">Partager un instant voyage</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Capturez un moment de votre escapade en Algérie.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {capturedPhoto ? (
                <div className="rounded-xl overflow-hidden border border-zinc-200 aspect-[4/3]">
                  <img src={capturedPhoto} alt="Capture" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-zinc-200 bg-black aspect-[4/3]">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              {capturedPhoto ? (
                <>
                  <button
                    onClick={() => { setCapturedPhoto(null); openCamera(); }}
                    className="rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    Reprendre
                  </button>
                  <button
                    onClick={closeCamera}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shadow-sm"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Valider</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={closeCamera}
                    className="rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shadow-sm"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Capturer</span>
                  </button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AppShell>
  );
}
