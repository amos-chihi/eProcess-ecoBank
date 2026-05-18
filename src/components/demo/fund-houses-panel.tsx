"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { FUND_HOUSES } from "@/lib/ecobank-capabilities-data";
import type { DemoMsgKey } from "@/lib/demo-i18n";

export function FundHousesPanel({ compact }: { compact?: boolean }) {
  const { t } = useDemoLocale();
  const [toast, setToast] = useState<string | null>(null);
  const [factsheet, setFactsheet] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-eco-ink">{t("fund_title")}</p>
          <p className="mt-1 text-xs text-eco-muted">{t("fund_sub")}</p>
        </div>
        {!compact && (
          <Link
            href="/rm/integrations#fund-houses"
            className="text-[11px] font-semibold text-eco-teal-dark hover:underline"
          >
            {t("fund_catalog_link")} →
          </Link>
        )}
      </div>

      <ul className={`mt-4 space-y-3 ${compact ? "text-xs" : "text-sm"}`}>
        {FUND_HOUSES.map((fh) => (
          <li
            key={fh.id}
            className="rounded-lg border border-eco-border bg-eco-surface/30 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-eco-navy">{fh.name}</p>
                <p className="mt-0.5 text-[11px] text-eco-muted">
                  {fh.region} · {fh.fundsListed} {t("fund_listed")}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                {t("fund_connected")}
              </span>
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <dt className="text-eco-muted">{t("fund_cutoff")}</dt>
                <dd className="font-medium text-eco-ink">{fh.cutOff}</dd>
              </div>
              <div>
                <dt className="text-eco-muted">{t("fund_nav")}</dt>
                <dd className="font-medium text-eco-ink">{fh.navLag}</dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFactsheet(fh.name)}
                className="rounded-lg border border-eco-border px-2.5 py-1.5 text-[11px] font-medium text-eco-navy hover:bg-white"
              >
                {t("fund_factsheet")}
              </button>
              <button
                type="button"
                onClick={() => showToast(t("fund_order_toast"))}
                className="rounded-lg bg-eco-navy px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-eco-navy/90"
              >
                {t("fund_place_order")}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {factsheet && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-eco-navy/40 p-4"
          role="dialog"
          onClick={() => setFactsheet(null)}
        >
          <div
            className="max-w-sm rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-semibold text-eco-navy">{factsheet}</p>
            <p className="mt-2 text-xs leading-relaxed text-eco-muted">{t("fund_factsheet_body")}</p>
            <button
              type="button"
              onClick={() => setFactsheet(null)}
              className="mt-4 w-full rounded-lg bg-eco-navy py-2.5 text-sm font-medium text-white"
            >
              {t("mob_goal_sheet_close")}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <p className="mt-3 rounded-lg bg-eco-teal-muted px-3 py-2 text-center text-xs font-medium text-eco-teal-dark">
          {toast}
        </p>
      )}
    </div>
  );
}
