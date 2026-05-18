"use client";

import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";

export default function PresentLayout({ children }: { children: React.ReactNode }) {
  const { t } = useDemoLocale();

  return (
    <div className="min-h-screen bg-eco-navy pb-16 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-eco-navy/90 px-4 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
              {t("present_kicker")}
            </p>
            <p className="text-sm font-semibold">{t("present_title_bar")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link
              href="/rm/meeting"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-3 py-2 font-semibold text-white transition hover:bg-white/10"
            >
              {t("present_exit_rm")}
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center text-white/70 hover:text-white"
            >
              {t("present_home_demo")}
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl rounded-b-2xl bg-eco-surface px-4 py-8 text-eco-ink shadow-2xl sm:px-8">
        {children}
      </div>
    </div>
  );
}
