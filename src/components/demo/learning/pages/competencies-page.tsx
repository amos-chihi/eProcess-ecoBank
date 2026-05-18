"use client";

import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { DOMAIN_PROGRESS } from "@/lib/demo-data";
import { CompetencyRadar } from "../competency-radar";
import { useLearning } from "../learning-context";
import { LearningPageHeader } from "../learning-page-header";
import { domainKey } from "../learning-utils";

export function LearningCompetenciesPage() {
  const { t } = useDemoLocale();
  const { focusDomain } = useLearning();

  return (
    <>
      <LearningPageHeader titleKey="learn_competencies_title" subtitleKey="learn_progressSub" />

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm lg:col-span-3">
          <ul className="space-y-4">
            {DOMAIN_PROGRESS.map((d) => {
              const onTarget = d.pct >= d.targetPct;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => focusDomain(d.id)}
                    className="w-full rounded-lg border border-eco-border bg-eco-surface/40 p-4 text-left transition hover:border-eco-teal/50 hover:bg-eco-teal-muted/20"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-eco-ink">{t(domainKey(d.id))}</span>
                      <span className="text-xs text-eco-muted">
                        {d.pct}% · {t("learn_target")} {d.targetPct}%
                      </span>
                    </div>
                    <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-eco-surface">
                      <div
                        className="absolute inset-y-0 w-px bg-slate-400"
                        style={{ left: `${d.targetPct}%` }}
                      />
                      <div
                        className={`h-full rounded-full ${onTarget ? "bg-emerald-600" : "bg-eco-teal"}`}
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-eco-muted">
                      <span className="font-medium text-eco-ink">{t("learn_gap")}:</span> {d.gapNote}
                    </p>
                    <p className="mt-1 text-[11px] text-eco-muted">
                      {t("learn_lastActivity")}: {d.lastActivity}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
          <Link
            href="/rm/learning/programmes"
            className="mt-4 inline-block text-xs font-semibold text-eco-teal-dark hover:underline"
          >
            {t("learn_findProgrammes")} →
          </Link>
        </section>

        <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm lg:col-span-2">
          <CompetencyRadar />
        </section>
      </div>
    </>
  );
}
