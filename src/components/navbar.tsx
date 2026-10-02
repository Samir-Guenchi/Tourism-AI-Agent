"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon,
  MapPin,
  Map,
  MessageSquare,
  Building2,
  Car,
  UtensilsCrossed,
  Ticket,
  Bus,
  User,
  Moon,
  Sun,
  ClipboardList,
} from "lucide-react";
import { usePlan } from "@/contexts/plan-context";
import { useLanguage } from "@/contexts/language-context";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const { items, removeFromPlan } = usePlan();
  const { t } = useLanguage();
  const [showPlan, setShowPlan] = useState(false);
  const [planBtnColor, setPlanBtnColor] = useState("#008C61");
  const [planBtnHidden, setPlanBtnHidden] = useState(false);

  const links = [
    { label: t("navHome"), href: "/destinations", icon: HomeIcon },
    { label: t("navMap"), href: "/map", icon: Map },
    { label: t("navChat"), href: "/chat", icon: MessageSquare },
    { label: t("navHotels"), href: "/services/hotels", icon: Building2 },
    { label: t("navCars"), href: "/services/cars", icon: Car },
    { label: t("navDining"), href: "/services/restaurants", icon: UtensilsCrossed },
    { label: t("navActivities"), href: "/services/activities", icon: Ticket },
    { label: t("navTransport"), href: "/services/transport", icon: Bus },
    { label: t("navProfile"), href: "/profile", icon: User },
  ];

  useEffect(() => {
    const storedColor = localStorage.getItem("plan-btn-color");
    const storedHide = localStorage.getItem("plan-btn-hidden");
    if (storedColor) setPlanBtnColor(storedColor);
    if (storedHide === "true") setPlanBtnHidden(true);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setPlanBtnColor(detail.color);
      setPlanBtnHidden(detail.hidden);
    };
    window.addEventListener("plan-btn-style-change", handler);
    return () => window.removeEventListener("plan-btn-style-change", handler);
  }, []);

  const active = links.find((link) =>
    link.href === "/destinations" ? pathname === "/destinations" : pathname.startsWith(link.href)
  )?.label ?? "Home";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
    <nav className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1.5 sm:gap-2 max-w-[calc(100vw-1rem)] px-1">
      <div className="flex items-center gap-0.5 rounded-full bg-muted/80 backdrop-blur-xl px-1.5 py-1.5 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] border border-border/40 overflow-x-auto no-scrollbar max-w-full shrink">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = active === link.label;
          return (
            <div key={link.label} className="relative shrink-0">
              <Link
                href={link.href}
                onMouseEnter={() => setHovered(link.label)}
                onMouseLeave={() => setHovered(null)}
                className={`relative z-10 flex items-center justify-center h-6 w-7 rounded-full transition-all duration-300 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={isActive ? 2.2 : 1.8} />
              </Link>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-full bg-background shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <AnimatePresence>
                {hovered === link.label && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background shadow-md pointer-events-none"
                  >
                    {link.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setDark(!dark)}
        onMouseEnter={() => setHovered("theme")}
        onMouseLeave={() => setHovered(null)}
        className="relative flex h-6 w-7 shrink-0 items-center justify-center rounded-full bg-muted/80 backdrop-blur-xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] border border-border/40 transition-colors hover:bg-muted"
      >
        <AnimatePresence mode="wait">
          {dark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.8} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.8} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {hovered === "theme" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background shadow-md pointer-events-none"
            >
              {dark ? t("navLight") : t("navDark")}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </nav>

    {/* Plan Cart Button — top right */}
    {!planBtnHidden && (
    <div className="fixed top-3 sm:top-5 right-3 sm:right-5 z-[100]">
      <button
        onClick={() => setShowPlan(!showPlan)}
        onMouseEnter={() => setHovered("plan")}
        onMouseLeave={() => setHovered(null)}
        className="relative flex h-6 w-7 shrink-0 items-center justify-center rounded-full bg-muted/80 backdrop-blur-xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] border border-border/40 transition-colors hover:bg-muted"
      >
        <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.8} />
        {items.length > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
            style={{ backgroundColor: planBtnColor }}
          >
            {items.length}
          </span>
        )}
        <AnimatePresence>
          {hovered === "plan" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background shadow-md pointer-events-none"
            >
              {t("navMyPlan")}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Plan Dropdown */}
      <AnimatePresence>
        {showPlan && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-8 right-0 w-[300px] rounded-2xl border border-border/40 bg-white shadow-xl shadow-black/10 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border/30">
              <h3 className="text-sm font-bold text-foreground">{t("navMyPlan")}</h3>
              <p className="text-[11px] text-muted-foreground">
                {items.length === 0 ? t("navPlanEmpty") : `${items.length} ${t("navPlanDescription")}`}
              </p>
            </div>
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Click &quot;Add to Plan&quot; on any wilaya to start building your trip.
              </div>
            ) : (
              <div className="max-h-[320px] overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 px-4 py-3 border-b border-border/20 last:border-b-0"
                  >
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{item.type} · {item.region}</p>
                    </div>
                    <button
                      onClick={() => removeFromPlan(item.name)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {items.length > 0 && (
              <div className="px-4 py-3 border-t border-border/30">
                <button
                  onClick={() => {
                    setShowPlan(false);
                    router.push("/map");
                  }}
                  className="w-full rounded-xl bg-foreground text-background py-2 text-xs font-semibold transition-opacity hover:opacity-90"
                >
                  {t("navViewFullPlan")}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    )}
    </>
  );
}
