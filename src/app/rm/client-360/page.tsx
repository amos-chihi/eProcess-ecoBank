"use client";

import Link from "next/link";
import { ComplianceRail } from "@/components/demo/compliance-rail";
import { HouseholdSmePanel } from "@/components/demo/household-sme-panel";
import { CrossSellPanel } from "@/components/demo/cross-sell-panel";
import { FundHousesPanel } from "@/components/demo/fund-houses-panel";
import { InsightsPanel } from "@/components/demo/insights-panel";
import { IntegrationHealth } from "@/components/demo/integration-health";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoMsgKey } from "@/lib/demo-i18n";
import { DEMO_CLIENT, DEMO_GOALS, HOLDINGS_MOCK, type DemoGoal } from "@/lib/demo-data";
import { formatGhs } from "@/lib/format";

function goalTypeKey(type: DemoGoal["type"]): DemoMsgKey {
  switch (type) {
    case "retirement":
      return "goalType_retirement";
    case "education":
      return "goalType_education";
    case "savings":
      return "goalType_savings";
    case "risk":
      return "goalType_risk";
    default:
      return "goalType_savings";
  }
}

export default function Client360Page() {
  const { t } = useDemoLocale();
  const c = DEMO_CLIENT;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
      <div className="min-w-0 flex-1 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-eco-muted">
              {t("c360_crumb")}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-eco-navy">
              {c.displayName}
            </h1>
            <p className="mt-2 text-sm text-eco-muted">
              {c.segment} · {c.householdLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-eco-surface px-2.5 py-1 font-medium">
                {t("c360_cluster")} {c.cluster}
              </span>
              <span className="rounded-full bg-eco-surface px-2.5 py-1">
                {t("c360_reporting")} {c.currency}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800">
                {t("c360_lastCRM")} {c.crmSyncedAt}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/rm/meeting"
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-lg bg-eco-navy px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-eco-navy/90 sm:w-auto"
            >
              {t("c360_startMeeting")}
            </Link>
            <Link
              href="/client-mobile"
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-lg border border-eco-border bg-white px-4 py-2 text-sm font-medium text-eco-navy transition hover:bg-eco-surface sm:w-auto"
            >
              {t("c360_previewMobile")}
            </Link>
            <Link
              href="/rm/robo"
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-lg border border-eco-teal/40 bg-eco-teal-muted/40 px-4 py-2 text-sm font-medium text-eco-teal-dark transition hover:bg-eco-teal-muted sm:w-auto"
            >
              {t("nav_robo")} →
            </Link>
          </div>
        </div>

        <HouseholdSmePanel />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm lg:col-span-2">
            <p className="text-sm font-semibold text-eco-ink">{t("c360_riskBlock")}</p>
            <div className="mt-4 flex flex-wrap items-end gap-6">
              <div>
                <p className="text-xs text-eco-muted">{t("c360_riskScore")}</p>
                <p className="text-3xl font-semibold text-eco-navy">{c.riskScore}</p>
              </div>
              <div>
                <p className="text-xs text-eco-muted">{t("c360_persona")}</p>
                <p className="text-lg font-medium text-eco-ink">{t("persona_balancedGrowth")}</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-eco-muted">{t("c360_risk_hint")}</p>
          </div>
          <IntegrationHealth />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-eco-ink">{t("c360_goals_title")}</p>
            <ul className="mt-3 divide-y divide-eco-border">
              {DEMO_GOALS.map((g) => {
                const pct = Math.min(
                  100,
                  Math.round((g.currentAmount / g.targetAmount) * 100),
                );
                return (
                  <li key={g.id} className="flex flex-col gap-2 py-3 first:pt-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-eco-ink">{g.title}</p>
                        <p className="text-xs text-eco-muted">
                          {t(goalTypeKey(g.type))} · {t("c360_goal_target")} {g.targetYear} ·{" "}
                          {t("c360_goal_priority")} {g.priority}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-eco-teal-dark">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-eco-surface">
                      <div
                        className="h-full rounded-full bg-eco-teal transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-eco-muted">
                      {formatGhs(g.currentAmount)} of {formatGhs(g.targetAmount)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-eco-ink">{t("c360_holdings_t")}</p>
              <p className="mt-1 text-xs text-eco-muted">{t("c360_holdings_sub")}</p>
              <ul className="mt-3 space-y-2 text-xs">
                {HOLDINGS_MOCK.map((h) => (
                  <li
                    key={h.name}
                    className="flex items-center justify-between gap-2 border-b border-eco-border pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-eco-ink">{h.name}</span>
                    <span className="flex items-center gap-2 shrink-0 text-eco-muted">
                      <span className="rounded bg-eco-surface px-1.5 py-0.5 text-[10px]">
                        {h.source}
                      </span>
                      {formatGhs(h.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <InsightsPanel />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FundHousesPanel />
          <CrossSellPanel />
        </div>
      </div>
      <ComplianceRail />
    </div>
  );
}
