"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DemoLocale, DemoMsgKey } from "@/lib/demo-i18n";
import { DEMO_LOCALES, demoT, LOCALE_STORAGE_KEY } from "@/lib/demo-i18n";

function parseStoredLocale(): DemoLocale {
  if (typeof window === "undefined") return "en";
  const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (raw && (DEMO_LOCALES as readonly string[]).includes(raw)) {
    return raw as DemoLocale;
  }
  return "en";
}

type DemoLocaleContextValue = {
  locale: DemoLocale;
  setLocale: (next: DemoLocale) => void;
  t: (key: DemoMsgKey, vars?: Record<string, string | number>) => string;
};

const DemoLocaleContext = createContext<DemoLocaleContextValue | null>(null);

export function DemoLocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<DemoLocale>("en");

  useEffect(() => {
    const next = parseStoredLocale();
    startTransition(() => setLocaleState(next));
  }, []);

  const setLocale = useCallback((next: DemoLocale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore quota / privacy mode */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      locale === "en" ? "en-US" : locale === "fr" ? "fr" : "pt";
  }, [locale]);

  const t = useCallback(
    (key: DemoMsgKey, vars?: Record<string, string | number>) =>
      demoT(locale, key, vars),
    [locale],
  );

  const value = useMemo(
    (): DemoLocaleContextValue => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <DemoLocaleContext.Provider value={value}>
      {children}
    </DemoLocaleContext.Provider>
  );
}

export function useDemoLocale(): DemoLocaleContextValue {
  const ctx = useContext(DemoLocaleContext);
  if (!ctx) {
    throw new Error("useDemoLocale must be used within DemoLocaleProvider");
  }
  return ctx;
}
