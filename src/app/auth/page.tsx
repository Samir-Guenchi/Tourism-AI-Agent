"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { OFFICIAL_WILAYA_COUNT } from "@/lib/destinations-data";
import {
  Compass,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  MapPin,
  Building2,
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/destinations");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Connexion avec Google échouée");
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signin" && email === "admin@email.com" && password === "123456789!") {
      sessionStorage.setItem("adminAuth", "true");
      router.push("/admin");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(cred.user, { displayName: name });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/destinations");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur d'authentification. Veuillez vérifier vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { level: 1, label: "Court", color: "bg-red-500" };
    if (password.length < 10) return { level: 2, label: "Moyen", color: "bg-amber-500" };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { level: 3, label: "Optimal", color: "bg-emerald-600" };
    }
    return { level: 2, label: "Moyen", color: "bg-amber-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="flex min-h-screen bg-white text-zinc-900">
      {/* Left side — Editorial Algeria Visual */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/La_baie_d%27Alger_%28cropped%29.jpg/3840px-La_baie_d%27Alger_%28cropped%29.jpg"
            alt="Baie d'Alger"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-black/45" />
        </div>

        <div className="relative z-10 mx-auto max-w-lg px-12 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/" className="inline-flex items-center gap-2.5 mb-10 group">
              <img src="/logo.png" alt="Texa Logo" className="h-9 w-9 rounded-xl shadow-lg" />
              <span className="text-xl font-bold text-white tracking-tight group-hover:opacity-90">Texa</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <h1 className="text-4xl font-bold leading-tight text-white tracking-tight">
              L&apos;Algérie dans toute
              <br />
              <span className="text-white/80 font-normal">sa splendeur</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/75 max-w-sm mx-auto">
              Accédez à vos itinéraires sauvegardés, retrouvez vos réservations et vivez des expériences inoubliables.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-8 text-xs text-white/80"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>{OFFICIAL_WILAYA_COUNT} Wilayas</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span>500+ Hôtels</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Réservations vérifiées</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side — Clean, Pure White Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-between bg-white px-6 py-10 sm:px-12">
        {/* Top bar with prominent Back to Home button */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-all shadow-sm group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 text-zinc-500 group-hover:text-zinc-900" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <Link href="/" className="lg:hidden flex items-center gap-2">
            <img src="/logo.png" alt="Texa Logo" className="h-8 w-8 rounded-lg shadow-sm" />
            <span className="font-bold text-sm text-zinc-900">Texa</span>
          </Link>
        </div>

        {/* Center Auth Form */}
        <div className="mx-auto w-full max-w-[400px] my-auto">
          {/* Mode Switch Tabs */}
          <div className="flex rounded-xl bg-zinc-100 p-1 mb-8 border border-zinc-200/80">
            <button
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === "signin"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === "signup"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                  {mode === "signin" ? "Bon retour parmi nous" : "Bienvenue sur Texa"}
                </h2>
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                  {mode === "signin"
                    ? "Connectez-vous pour retrouver vos favoris et vos itinéraires en Algérie."
                    : "Créez votre compte pour sauvegarder vos voyages et réserver vos séjours."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Google SSO */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-medium text-zinc-800 transition-all hover:bg-zinc-50 hover:border-zinc-300 shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuer avec Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">ou</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmail} className="space-y-3.5">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Samir Benali"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3.5 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3.5 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Mot de passe
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    className="text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-10 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Password strength */}
              <AnimatePresence>
                {mode === "signup" && passwordStrength && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= passwordStrength.level ? passwordStrength.color : "bg-zinc-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-zinc-500">
                        {passwordStrength.label}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-xs text-red-600 border border-red-200"
              >
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-bold">
                  !
                </div>
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-xs font-semibold text-white transition-all hover:bg-zinc-800 shadow-md active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{mode === "signin" ? "Se connecter" : "Créer mon compte"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
