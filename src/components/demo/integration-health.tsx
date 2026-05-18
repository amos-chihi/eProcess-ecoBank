"use client";

import { INTEGRATIONS_MOCK } from "@/lib/demo-data";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";

export function IntegrationHealth() {
  const { t } = useDemoLocale();

  return (
    <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-eco-ink">{t("int_health_title")}</p>
      <p className="mt-1 text-xs text-eco-muted">{t("int_health_sub")}</p>
      <ul className="mt-3 space-y-2">
        {INTEGRATIONS_MOCK.map((row) => (
          <li
            key={row.systemKey}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="text-eco-ink">{t(row.systemKey)}</span>
            <span className="flex items-center gap-1.5 text-eco-muted">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  row.status === "ok" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {row.detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
