"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface PlanContextValue {
  isPro: boolean;
  upgrade: () => void;
}

const PlanContext = createContext<PlanContextValue>({
  isPro: false,
  upgrade: () => {},
});

const STORAGE_KEY = "thinkboard-plan";

export function PlanProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsPro(localStorage.getItem(STORAGE_KEY) === "pro");
    setMounted(true);
  }, []);

  const upgrade = useCallback(() => {
    setIsPro(true);
    localStorage.setItem(STORAGE_KEY, "pro");
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <PlanContext.Provider value={{ isPro, upgrade }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
