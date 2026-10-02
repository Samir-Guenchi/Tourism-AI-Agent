"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type PlanCategory = "wilaya" | "hotel" | "car" | "dining" | "activity" | "transport";

export type PlanItem = {
  name: string;
  subtitle: string;
  region: string;
  type: string;
  rating: number;
  description: string;
  image: string;
  category: PlanCategory;
  price?: string;
};

type PlanContextType = {
  items: PlanItem[];
  addToPlan: (item: PlanItem) => void;
  removeFromPlan: (name: string) => void;
  isInPlan: (name: string) => boolean;
  clearPlan: () => void;
  budget: number;
  setBudget: (v: number) => void;
  luxury: number;
  setLuxury: (v: number) => void;
  days: number;
  setDays: (v: number) => void;
};

const PlanContext = createContext<PlanContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PlanItem[]>(() => loadFromStorage("plan-items", []));
  const [budget, setBudget] = useState(() => loadFromStorage("plan-budget", 50));
  const [luxury, setLuxury] = useState(() => loadFromStorage("plan-luxury", 50));
  const [days, setDays] = useState(() => loadFromStorage("plan-days", 5));

  useEffect(() => { localStorage.setItem("plan-items", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("plan-budget", JSON.stringify(budget)); }, [budget]);
  useEffect(() => { localStorage.setItem("plan-luxury", JSON.stringify(luxury)); }, [luxury]);
  useEffect(() => { localStorage.setItem("plan-days", JSON.stringify(days)); }, [days]);

  const setBudgetWithLuxury = useCallback((v: number) => {
    setBudget(v);
  }, []);

  const setLuxuryWithBudget = useCallback((v: number) => {
    setLuxury(v);
  }, []);

  const addToPlan = useCallback((item: PlanItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.name === item.name && i.category === item.category)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromPlan = useCallback((name: string) => {
    setItems((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const isInPlan = useCallback(
    (name: string) => items.some((i) => i.name === name),
    [items]
  );

  const clearPlan = useCallback(() => setItems([]), []);

  return (
    <PlanContext.Provider value={{
      items, addToPlan, removeFromPlan, isInPlan, clearPlan,
      budget, setBudget: setBudgetWithLuxury,
      luxury, setLuxury: setLuxuryWithBudget,
      days, setDays,
    }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}
