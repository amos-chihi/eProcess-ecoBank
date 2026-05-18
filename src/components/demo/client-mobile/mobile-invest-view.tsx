"use client";

import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { MOBILE_ALLOCATION, MOBILE_PORTFOLIO } from "@/lib/client-mobile-data";
import { HOLDINGS_MOCK } from "@/lib/demo-data";
import type { DemoMsgKey } from "@/lib/demo-i18n";
import { formatGhs } from "@/lib/format";

export function MobileInvestView({
  onOpenRebalance,
  onOpenSweep,
}: {
  onOpenRebalance: () => void;
  onOpenSweep: () => void;
}) {
  const { t } = useDemoLocale();
  const total = MOBILE_PORTFOLIO.totalValue;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-eco-border bg-white p-4 shadow-sm">
        <p className="text-[10px] font-semibold uppercase text-eco-muted">{t("mob_invest_total")}</p>
        <p className="mt-1 text-2xl font-semibold text-eco-navy">{formatGhs(total)}</p>
        <p className="mt-1 text-[11px] text-emerald-700">
          +{formatGhs(MOBILE_PORTFOLIO.dayChange)} ({MOBILE_PORTFOLIO.dayChangePct}%) {t("mob_portfolio_day")}
        </p>
      </div>

      <section>
        <p className="text-xs font-semibold text-eco-muted">{t("mob_invest_allocation")}</p>
        <div className="mt-2 rounded-xl border border-eco-border bg-white p-4">
          <div className="flex h-3 overflow-hidden rounded-full">
            {MOBILE_ALLOCATION.map((a) => (
              <div
                key={a.labelKey}
                className={`h-full ${a.color}`}
                style={{ width: `${a.pct}%` }}
                title={`${t(a.labelKey as DemoMsgKey)} ${a.pct}%`}
              />
            ))}
          </div>
          <ul className="mt-3 space-y-1.5 text-xs">
            {MOBILE_ALLOCATION.map((a) => (
              <li key={a.labelKey} className="flex justify-between text-eco-muted">
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${a.color}`} />
                  {t(a.labelKey as DemoMsgKey)}
                </span>
                <span className="font-medium text-eco-ink">{a.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold text-eco-muted">{t("mob_invest_holdings")}</p>
        <ul className="mt-2 space-y-2">
          {HOLDINGS_MOCK.map((h) => {
            const pct = Math.round((h.value / total) * 100);
            return (
              <li
                key={h.name}
                className="rounded-xl border border-eco-border bg-white p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug text-eco-ink">{h.name}</p>
                    <p className="text-[10px] text-eco-muted">{h.source} · {pct}%</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-eco-navy">
                    {formatGhs(h.value)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="rounded-xl border border-eco-teal/30 bg-eco-teal-muted/40 p-4">
        <p className="text-sm font-semibold text-eco-teal-dark">{t("mob_invest_rebal_title")}</p>
        <p className="mt-1 text-xs leading-relaxed text-eco-teal-dark/90">{t("mob_invest_rebal_sub")}</p>
        <button
          type="button"
          onClick={onOpenRebalance}
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-2.5 text-sm font-semibold text-white"
        >
          {t("mob_invest_rebal_cta")}
        </button>
      </div>

      <div className="rounded-xl border border-eco-border bg-white p-4">
        <p className="text-sm font-semibold text-eco-navy">{t("mob_invest_sweep")}</p>
        <p className="mt-1 text-xs text-eco-muted">{t("mob_invest_sweep_sub")}</p>
        <button
          type="button"
          onClick={onOpenSweep}
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl border border-eco-border py-2.5 text-sm font-medium text-eco-ink"
        >
          {t("cweb_configureSweep")}
        </button>
      </div>
    </div>
  );
}
