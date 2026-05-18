"use client";

import { useMemo, useState } from "react";
import { MARKET_PROFILES } from "@/lib/demo-data";

export function MarketsConsoleClient() {
  const [marketId, setMarketId] = useState(MARKET_PROFILES[0]!.id);
  const market = useMemo(
    () => MARKET_PROFILES.find((m) => m.id === marketId)!,
    [marketId],
  );
  const [flowVariant, setFlowVariant] = useState(market.planningFlows[0] ?? "Standard");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-xs font-medium text-eco-muted" htmlFor="market">
            Deployed market profile
          </label>
          <select
            id="market"
            value={marketId}
            onChange={(e) => {
              const id = e.target.value;
              setMarketId(id);
              const m = MARKET_PROFILES.find((x) => x.id === id);
              if (m?.planningFlows[0]) setFlowVariant(m.planningFlows[0]);
            }}
            className="mt-1 block rounded-lg border border-eco-border bg-white px-3 py-2 text-sm text-eco-ink shadow-sm focus:border-eco-teal focus:outline-none focus:ring-1 focus:ring-eco-teal"
          >
            {MARKET_PROFILES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.country} · {m.cluster}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-eco-muted" htmlFor="flow">
            Planning flow variant
          </label>
          <select
            id="flow"
            value={flowVariant}
            onChange={(e) => setFlowVariant(e.target.value)}
            className="mt-1 block min-w-[14rem] rounded-lg border border-eco-border bg-white px-3 py-2 text-sm text-eco-ink shadow-sm focus:border-eco-teal focus:outline-none focus:ring-1 focus:ring-eco-teal"
          >
            {market.planningFlows.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-eco-ink">Localization snapshot</p>
          <dl className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between gap-4 border-b border-eco-border pb-3">
              <dt className="text-eco-muted">Language cluster</dt>
              <dd className="font-medium text-eco-navy">{market.cluster}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-eco-border pb-3">
              <dt className="text-eco-muted">Currencies surfaced</dt>
              <dd className="text-right font-medium text-eco-ink">{market.currencies}</dd>
            </div>
            <div className="flex justify-between gap-4 pb-1">
              <dt className="text-eco-muted">Disclosure bundle</dt>
              <dd className="font-mono text-[11px] text-eco-teal-dark">
                {market.disclosurePackId}
              </dd>
            </div>
          </dl>
          <p className="mt-4 rounded-lg bg-eco-teal-muted/50 px-3 py-2 text-[11px] leading-relaxed text-eco-teal-dark">
            Active flow variant <strong>{flowVariant}</strong> adjusts branching in goal
            capture, permissible product universe, and Sharia disclosure text where
            applicable (configuration stub in demo).
          </p>
        </div>

        <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-eco-ink">Configurable tax & retirement rules</p>
          <p className="mt-1 text-xs text-eco-muted">
            Per-market engine inputs — illustrative rows only.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-eco-border text-left text-eco-muted">
                  <th className="py-2 pr-3 font-medium">Code</th>
                  <th className="py-2 pr-3 font-medium">Band</th>
                  <th className="py-2 font-medium">Planner note</th>
                </tr>
              </thead>
              <tbody>
                {market.taxRules.map((row) => (
                  <tr key={row.code} className="border-b border-eco-border/80">
                    <td className="py-2.5 pr-3 font-mono text-eco-teal-dark">{row.code}</td>
                    <td className="py-2.5 pr-3 text-eco-ink">{row.label}</td>
                    <td className="py-2.5 text-eco-muted">{row.rateOrNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
