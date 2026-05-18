"use client";

import { AI_INSIGHTS } from "@/lib/demo-data";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";

export function InsightsPanel() {
  const { t } = useDemoLocale();

  return (
    <div className="rounded-xl border border-eco-border bg-gradient-to-br from-eco-navy/[0.04] to-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-eco-ink">{t("insights_title")}</p>
        <span className="rounded bg-eco-teal-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-eco-teal-dark">
          {t("insights_expl")}
        </span>
      </div>
      <ul className="mt-3 space-y-3">
        {AI_INSIGHTS.map((ins) => (
          <li
            key={ins.title}
            className="rounded-lg border border-eco-border/80 bg-white/80 px-3 py-2 text-xs"
          >
            <span className="font-medium text-eco-ink">{ins.title}</span>
            <span className="mx-2 text-eco-muted">·</span>
            <span className="rounded bg-eco-surface px-1.5 py-0 text-[10px] text-eco-muted">
              {ins.tag}
            </span>
            <p className="mt-1 leading-relaxed text-eco-muted">{ins.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
