"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Hotel,
  Car,
  Train,
  Mountain,
  ArrowRight,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import { useLanguage } from "@/contexts/language-context";

const serviceConfigs = [
  { id: "restaurants", icon: UtensilsCrossed, color: "from-orange-500 to-red-500", href: "/services/restaurants", nameKey: "servicesRestaurantsName" as const, descKey: "servicesRestaurantsDesc" as const, countKey: "servicesRestaurantsCount" as const },
  { id: "hotels", icon: Hotel, color: "from-blue-500 to-cyan-500", href: "/services/hotels", nameKey: "servicesHotelsName" as const, descKey: "servicesHotelsDesc" as const, countKey: "servicesHotelsCount" as const },
  { id: "cars", icon: Car, color: "from-purple-500 to-pink-500", href: "/services/cars", nameKey: "servicesCarsName" as const, descKey: "servicesCarsDesc" as const, countKey: "servicesCarsCount" as const },
  { id: "transport", icon: Train, color: "from-green-500 to-emerald-500", href: "/services/transport", nameKey: "servicesTransportName" as const, descKey: "servicesTransportDesc" as const, countKey: "servicesTransportCount" as const },
  { id: "activities", icon: Mountain, color: "from-amber-500 to-yellow-500", href: "/services/activities", nameKey: "servicesActivitiesName" as const, descKey: "servicesActivitiesDesc" as const, countKey: "servicesActivitiesCount" as const },
];

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              {t("servicesTitle")}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {t("servicesSubtitle")}
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceConfigs.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link
                    href={service.href}
                    className="group block h-full"
                  >
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-background transition-all hover:-translate-y-1 hover:shadow-xl">
                      {/* Gradient Header */}
                      <div className={`relative h-32 bg-gradient-to-br ${service.color} p-6`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative flex h-full items-center justify-between">
                          <Icon className="h-12 w-12 text-white drop-shadow-lg" />
                          <ArrowRight className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          {t(service.nameKey)}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-1">
                          {t(service.descKey)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">
                            {t(service.countKey)}
                          </span>
                          <span className="text-xs font-medium text-foreground group-hover:underline">
                            {t("servicesExplore")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-16 rounded-2xl border border-border/40 bg-muted/30 p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">{t("servicesNeedHelp")}</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t("servicesHelpDesc")}
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <Mountain className="h-4 w-4" />
              {t("servicesAskAI")}
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
