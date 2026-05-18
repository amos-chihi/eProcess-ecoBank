"use client";

import { useDemoLocale } from "@/components/demo/demo-locale-provider";

const BEFORE = [
  { label: "Fixed income", pct: 48 },
  { label: "Equities", pct: 44 },
  { label: "Alternatives", pct: 8 },
];

const AFTER = [
  { label: "Fixed income", pct: 52 },
  { label: "Equities", pct: 41 },
  { label: "Alternatives", pct: 7 },
];

function AllocationBars({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; pct: number }[];
}) {
  return (
    <div className="rounded-xl border border-eco-border bg-eco-surface/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">{title}</p>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`h-full ${i === 0 ? "bg-slate-400" : i === 1 ? "bg-eco-teal" : "bg-amber-300"}`}
            style={{ width: `${r.pct}%` }}
            title={`${r.label} ${r.pct}%`}
          />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5 text-xs">
        {rows.map((r) => (
          <li key={r.label} className="flex justify-between text-eco-muted">
            <span>{r.label}</span>
            <span className="font-medium text-eco-ink">{r.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RebalancePreview() {
  const { t } = useDemoLocale();

  return (
    <section className="rounded-2xl border border-eco-border bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-eco-navy">{t("rebalance_title")}</p>
      <p className="mt-1 text-xs text-eco-muted">{t("rebalance_sub")}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <AllocationBars title={t("rebalance_current")} rows={BEFORE} />
        <AllocationBars title={t("rebalance_proposed")} rows={AFTER} />
      </div>
      <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
        {t("rebalance_ok")}
      </p>
    </section>
  );
}
