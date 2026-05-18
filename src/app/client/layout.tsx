"use client";

import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { DEMO_LOCALES, type DemoLocale, type DemoMsgKey } from "@/lib/demo-i18n";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t } = useDemoLocale();

  const langKey: Record<DemoLocale, DemoMsgKey> = {
    en: "lang_en",
    fr: "lang_fr",
    pt: "lang_pt",
  };

  return (
    <div className="min-h-screen bg-eco-surface text-eco-ink">
      <header className="border-b border-eco-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-eco-muted">
              {t("cweb_kicker")}
            </p>
            <p className="text-sm font-semibold text-eco-navy">{t("cweb_heading")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {DEMO_LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-full border border-eco-border px-2 py-1 transition ${
                  locale === code
                    ? "font-semibold text-eco-navy ring-2 ring-eco-teal-muted"
                    : "text-eco-muted hover:border-eco-border hover:text-eco-ink"
                }`}
              >
                {t(langKey[code])}
              </button>
            ))}
            <span className="rounded-full bg-eco-teal-muted px-2 py-1 font-medium text-eco-teal-dark">
              {t("shell_regionGh")} GH · GHS
            </span>
            <Link
              href="/client-mobile"
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-dashed border-eco-teal/50 px-3 py-2 font-medium text-eco-teal-dark hover:bg-eco-teal-muted/40"
            >
              {t("cweb_openMobileParity")}
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 pb-10 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
