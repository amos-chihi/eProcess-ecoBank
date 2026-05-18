"use client";

import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { HOUSEHOLD_MEMBERS, LINKED_SME } from "@/lib/demo-data";

export function HouseholdSmePanel() {
  const { t } = useDemoLocale();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-eco-ink">{t("hh_title")}</p>
            <p className="mt-1 text-xs text-eco-muted">{t("hh_subtitle")}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800">
            {t("hh_teamBadge")}
          </span>
        </div>
        <ul className="mt-4 space-y-4">
          {HOUSEHOLD_MEMBERS.map((m) => (
            <li key={m.id} className="rounded-lg border border-eco-border bg-eco-surface/60 px-3 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-eco-navy">{m.name}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                    m.kycStatus === "clear"
                      ? "bg-white text-emerald-800 ring-1 ring-emerald-200"
                      : "bg-amber-50 text-amber-900 ring-1 ring-amber-200"
                  }`}
                >
                  {t("hh_kyc")} · {m.kycStatus}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-eco-teal-dark">{m.relation}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-eco-muted">{m.notes}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-eco-ink">{t("hh_relatedSme")}</p>
            <p className="mt-1 text-xs text-eco-muted">{t("hh_relatedSme_sub")}</p>
          </div>
          <Link
            href="/rm/meeting"
            className="shrink-0 text-[11px] font-semibold text-eco-teal-dark hover:underline"
          >
            {t("hh_goMeeting")}
          </Link>
        </div>
        <div className="mt-4 rounded-lg border border-dashed border-eco-border bg-eco-surface/50 p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-eco-muted">
            {LINKED_SME.crmId}
          </p>
          <p className="mt-2 text-lg font-semibold text-eco-navy">{LINKED_SME.legalName}</p>
          <p className="mt-2 text-xs text-eco-muted">{LINKED_SME.roleSummary}</p>
          <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
            <div>
              <p className="text-eco-muted">Industry</p>
              <p className="font-medium text-eco-ink">{LINKED_SME.industry}</p>
            </div>
            <div>
              <p className="text-eco-muted">Turnover bracket</p>
              <p className="font-medium text-eco-ink">{LINKED_SME.annualTurnoverBracket}</p>
            </div>
          </div>
          <div className="mt-4 border-t border-eco-border pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-eco-muted">
              {t("hh_sme_active_heading")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-eco-ink">{LINKED_SME.activeNeeds}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-eco-muted">
          <span className="rounded-full bg-eco-surface px-2 py-1 ring-1 ring-eco-border">
            {t("hh_tag_rm")}
          </span>
          <span className="rounded-full bg-eco-surface px-2 py-1 ring-1 ring-eco-border">
            {t("hh_tag_joint")}
          </span>
        </div>
      </section>
    </div>
  );
}
