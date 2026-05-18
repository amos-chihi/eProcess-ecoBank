"use client";

import { useMemo, useState } from "react";
import { FundHousesPanel } from "@/components/demo/fund-houses-panel";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { INTEGRATION_MODULES } from "@/lib/ecobank-capabilities-data";
import type { DemoMsgKey } from "@/lib/demo-i18n";

export function IntegrationCatalogClient() {
  const { t } = useDemoLocale();
  const [domain, setDomain] = useState<string>("all");

  const filtered = useMemo(() => {
    if (domain === "all") return INTEGRATION_MODULES;
    return INTEGRATION_MODULES.filter((m) => m.domain === domain);
  }, [domain]);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
          {t("int_cat_kicker")}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-eco-navy">{t("int_cat_title")}</h1>
        <p className="mt-2 max-w-3xl text-sm text-eco-muted">{t("int_cat_sub")}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["all", "crm", "core", "risk", "wealth", "hr", "nudge"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDomain(d)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              domain === d ? "bg-eco-navy text-white" : "bg-white text-eco-muted ring-1 ring-eco-border"
            }`}
          >
            {d === "all" ? t("int_cat_filter_all") : d.toUpperCase()}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-eco-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-eco-surface text-[10px] font-semibold uppercase text-eco-muted">
            <tr>
              <th className="px-4 py-3">{t("int_cat_col_module")}</th>
              <th className="px-4 py-3">{t("int_cat_col_protocol")}</th>
              <th className="px-4 py-3">{t("int_cat_col_events")}</th>
              <th className="px-4 py-3">{t("int_cat_col_status")}</th>
              <th className="px-4 py-3">{t("int_cat_col_version")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-eco-border">
            {filtered.map((mod) => (
              <tr key={mod.id} id={mod.id === "mod-fund" ? "fund-houses" : mod.id === "mod-robo" ? "robo" : undefined} className="hover:bg-eco-surface/40">
                <td className="px-4 py-3 font-medium text-eco-navy">{t(mod.nameKey as DemoMsgKey)}</td>
                <td className="px-4 py-3 font-mono text-xs text-eco-muted">{mod.protocol}</td>
                <td className="px-4 py-3">
                  <ul className="flex flex-wrap gap-1">
                    {mod.events.map((ev) => (
                      <li
                        key={ev}
                        className="rounded bg-eco-surface px-1.5 py-0.5 font-mono text-[10px] text-eco-ink"
                      >
                        {ev}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      mod.status === "live"
                        ? "bg-emerald-100 text-emerald-800"
                        : mod.status === "beta"
                          ? "bg-sky-100 text-sky-900"
                          : "bg-eco-surface text-eco-muted"
                    }`}
                  >
                    {mod.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{mod.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="fund-houses-detail">
        <FundHousesPanel compact />
      </section>
    </div>
  );
}
