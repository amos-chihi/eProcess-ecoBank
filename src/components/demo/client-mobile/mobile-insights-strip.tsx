"use client";

import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { MOBILE_INSIGHTS } from "@/lib/client-mobile-data";
import type { DemoMsgKey } from "@/lib/demo-i18n";

export function MobileInsightsStrip({ onViewAll }: { onViewAll: () => void }) {
  const { t } = useDemoLocale();
  const preview = MOBILE_INSIGHTS.slice(0, 2);

  return (
    <section className="rounded-xl border border-eco-border bg-gradient-to-br from-eco-navy/[0.04] to-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-eco-navy">{t("mob_insights_title")}</p>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[10px] font-semibold text-eco-teal-dark"
        >
          {t("mob_insights_view")} →
        </button>
      </div>
      <ul className="mt-2 space-y-2">
        {preview.map((ins) => (
          <li key={ins.titleKey} className="rounded-lg border border-eco-border/80 bg-white/90 px-2.5 py-2 text-[11px]">
            <span className="font-medium text-eco-ink">{t(ins.titleKey as DemoMsgKey)}</span>
            <p className="mt-0.5 line-clamp-2 text-eco-muted">{t(ins.bodyKey as DemoMsgKey)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
