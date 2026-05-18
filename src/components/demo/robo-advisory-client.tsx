"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import {
  ROBO_AUDIT_LOG,
  ROBO_PROPOSAL,
  type RoboProposal,
} from "@/lib/ecobank-capabilities-data";
import { DEMO_CLIENT } from "@/lib/demo-data";
import type { DemoMsgKey } from "@/lib/demo-i18n";

export function RoboAdvisoryClient() {
  const { t } = useDemoLocale();
  const [proposal, setProposal] = useState<RoboProposal>(ROBO_PROPOSAL);
  const [audit, setAudit] = useState(ROBO_AUDIT_LOG);

  const accept = () => {
    setProposal((p) => ({ ...p, status: "accepted" }));
    setAudit((prev) => [
      {
        id: `a-${Date.now()}`,
        at: "Just now",
        actionKey: "robo_audit_accepted",
        actor: "Amos Chihi (RM)",
      },
      ...prev,
    ]);
  };

  const defer = () => {
    setProposal((p) => ({ ...p, status: "deferred" }));
    setAudit((prev) => [
      {
        id: `a-${Date.now()}`,
        at: "Just now",
        actionKey: "robo_audit_deferred",
        actor: "Amos Chihi (RM)",
      },
      ...prev,
    ]);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
            {t("robo_kicker")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-eco-navy">{t("robo_title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-eco-muted">{t("robo_sub")}</p>
        </div>
        <Link
          href="/rm/client-360"
          className="rounded-lg border border-eco-border bg-white px-4 py-2 text-sm font-medium text-eco-navy hover:bg-eco-surface"
        >
          {DEMO_CLIENT.displayName} · 360 →
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <article className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-eco-navy">{t("robo_proposal_title")}</p>
                <p className="mt-1 text-xs text-eco-muted">
                  {proposal.createdAt} · {t("robo_rule")}: {proposal.ruleId}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                  proposal.status === "pending"
                    ? "bg-amber-100 text-amber-900"
                    : proposal.status === "accepted"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-eco-surface text-eco-muted"
                }`}
              >
                {t(
                  proposal.status === "pending"
                    ? "robo_status_pending"
                    : proposal.status === "accepted"
                      ? "robo_status_accepted"
                      : "robo_status_deferred",
                )}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-eco-ink">
              {t(proposal.summaryKey as DemoMsgKey)}
            </p>
            <p className="mt-2 text-xs text-eco-muted">
              {t("robo_confidence")}: {Math.round(proposal.confidence * 100)}%
            </p>
            <table className="mt-4 w-full text-left text-xs">
              <thead className="text-[10px] uppercase text-eco-muted">
                <tr>
                  <th className="pb-2">{t("robo_col_sleeve")}</th>
                  <th className="pb-2">{t("robo_col_from")}</th>
                  <th className="pb-2">{t("robo_col_to")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-eco-border">
                {proposal.shifts.map((s, i) => (
                  <tr key={`${s.sleeve}-${i}`}>
                    <td className="py-2 font-medium text-eco-ink">{s.sleeve}</td>
                    <td className="py-2 text-eco-muted">{s.fromPct}%</td>
                    <td className="py-2 font-semibold text-eco-teal-dark">{s.toPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {proposal.status === "pending" && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={accept}
                  className="rounded-lg bg-eco-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-eco-navy/90"
                >
                  {t("robo_accept")}
                </button>
                <button
                  type="button"
                  onClick={defer}
                  className="rounded-lg border border-eco-border px-4 py-2.5 text-sm font-medium text-eco-navy hover:bg-eco-surface"
                >
                  {t("robo_defer")}
                </button>
                <Link
                  href="/rm/compliance"
                  className="rounded-lg border border-eco-teal/40 px-4 py-2.5 text-sm font-medium text-eco-teal-dark hover:bg-eco-teal-muted/40"
                >
                  {t("robo_compliance")}
                </Link>
              </div>
            )}
          </article>

          <article className="rounded-xl border border-dashed border-eco-border bg-eco-surface/40 p-4 text-xs text-eco-muted">
            {t("robo_disclaimer")}
          </article>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-eco-ink">{t("robo_audit_title")}</p>
            <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-xs">
              {audit.map((entry) => (
                <li key={entry.id} className="rounded-lg border border-eco-border px-3 py-2">
                  <p className="font-medium text-eco-navy">{t(entry.actionKey as DemoMsgKey)}</p>
                  <p className="mt-0.5 text-eco-muted">
                    {entry.at} · {entry.actor}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/rm/integrations#robo"
            className="block rounded-xl border border-eco-border bg-white p-4 text-center text-xs font-semibold text-eco-teal-dark hover:bg-eco-surface"
          >
            {t("robo_api_link")} →
          </Link>
        </aside>
      </div>
    </div>
  );
}
