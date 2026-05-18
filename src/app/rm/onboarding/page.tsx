"use client";

import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { DEMO_CLIENT } from "@/lib/demo-data";

const PROFILE_FIELDS = [
  { id: "name", label: "Legal name", value: "Akosua Mensah", source: "crm" as const },
  { id: "dob", label: "Date of birth", value: "14 Mar 1982", source: "crm" as const },
  { id: "id", label: "National ID", value: "GHA-•••••4821", source: "crm" as const },
  { id: "income", label: "Declared annual income", value: "", source: "missing" as const },
  { id: "dependents", label: "Dependents", value: "1 (Kofi Mensah)", source: "crm" as const },
  { id: "pep", label: "PEP declaration", value: "", source: "missing" as const },
];

const RISK_FIELDS = [
  { label: "Investment experience", value: "5+ years listed equities", ok: true },
  { label: "Loss tolerance", value: "Moderate — can absorb 15% drawdown", ok: true },
  { label: "Liquidity need (12m)", value: "Not captured", ok: false },
];

const GOAL_INTENTS = [
  "Comfortable retirement by 2046",
  "University fund for dependent",
  "FX diversification sleeve",
];

export default function OnboardingPage() {
  const { t } = useDemoLocale();
  const c = DEMO_CLIENT;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
            {t("onboard_kicker")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-eco-navy">{t("onboard_title")}</h1>
          <p className="mt-2 max-w-xl text-sm text-eco-muted">{t("onboard_sub")}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          {t("onboard_crmBadge")} · {c.crmSyncedAt}
        </span>
      </header>

      <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-eco-navy">{t("onboard_section_profile")}</h2>
        <ul className="mt-4 divide-y divide-eco-border">
          {PROFILE_FIELDS.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium text-eco-ink">{f.label}</p>
                <p className="text-xs text-eco-muted">
                  {f.source === "crm" ? t("onboard_prefill") : t("onboard_missing")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {f.value ? (
                  <span className="text-sm text-eco-navy">{f.value}</span>
                ) : (
                  <span className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-900">
                    Required
                  </span>
                )}
                <span
                  className={`h-2 w-2 rounded-full ${f.source === "crm" ? "bg-emerald-500" : "bg-amber-500"}`}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-eco-navy">{t("onboard_section_risk")}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {RISK_FIELDS.map((f) => (
            <li
              key={f.label}
              className="flex items-start justify-between gap-3 rounded-lg border border-eco-border bg-eco-surface/50 px-3 py-2"
            >
              <span className="text-eco-ink">{f.label}</span>
              <span className={`text-right text-xs ${f.ok ? "text-eco-muted" : "font-medium text-amber-900"}`}>
                {f.value}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-eco-navy">{t("onboard_section_goals")}</h2>
        <ul className="mt-3 list-inside list-disc text-sm text-eco-muted">
          {GOAL_INTENTS.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/rm/client-360"
          className="rounded-lg bg-eco-navy px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-eco-navy/90"
        >
          {t("onboard_continue360")}
        </Link>
        <Link
          href="/rm/meeting"
          className="rounded-lg border border-eco-border bg-white px-4 py-2.5 text-sm font-medium text-eco-navy hover:bg-eco-surface"
        >
          {t("onboard_startMeeting")}
        </Link>
        <Link
          href="/rm/goals"
          className="rounded-lg border border-eco-border bg-white px-4 py-2.5 text-sm font-medium text-eco-teal-dark hover:bg-eco-surface"
        >
          {t("nav_goals")} →
        </Link>
      </div>
    </div>
  );
}
