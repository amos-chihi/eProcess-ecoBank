"use client";

import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { DOMAIN_PROGRESS } from "@/lib/demo-data";
import { useLearningPlatform } from "@/contexts/learning-platform-context";
import { useLearning } from "../learning-context";
import { LearningPageHeader } from "../learning-page-header";
import { LEARNING_ROUTES } from "../learning-utils";

export function LearningOverviewPage() {
  const { t } = useDemoLocale();
  const { overallPct, cpdYtd, certs, hrOpenItems, scheduledCount } = useLearning();
  const { pipelineCounts } = useLearningPlatform();

  const inProgress = certs.filter((c) => c.status === "in_progress").length;
  const required = certs.filter((c) => c.status === "required").length;
  const completed = certs.filter((c) => c.status === "completed").length;

  const quickLinks = LEARNING_ROUTES.filter((r) => r.href !== "/rm/learning");

  return (
    <>
      <LearningPageHeader titleKey="learn_overview_title" subtitleKey="learn_overview_sub" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t("learn_overall"), value: `${overallPct}%`, hint: t("learn_overall_hint") },
          { label: t("learn_cpdYtd"), value: String(cpdYtd), hint: `${inProgress} ${t("learn_activeProgrammes")}` },
          { label: t("learn_stat_completed"), value: String(completed), hint: t("learn_stat_completed_hint") },
          { label: t("learn_hrOpenItems"), value: String(hrOpenItems), hint: t("learn_hrOpen_hint") },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-eco-border bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-eco-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-eco-navy">{stat.value}</p>
            <p className="mt-2 text-[11px] text-eco-muted">{stat.hint}</p>
          </div>
        ))}
      </div>

      {scheduledCount > 0 && (
        <div className="rounded-xl border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm text-sky-950">
          {scheduledCount} {t("learn_upcoming_scheduled_count")}.{" "}
          <Link href="/rm/learning/upcoming" className="font-semibold underline">
            {t("nav_learn_upcoming")} →
          </Link>
        </div>
      )}

      <div className="rounded-xl border border-eco-border bg-eco-surface/40 px-4 py-3 text-xs text-eco-muted">
        {t("learn_catalog_admin_note")}{" "}
        <Link href="/admin/learning" className="font-semibold text-eco-teal-dark hover:underline">
          {t("learn_admin_link")}
        </Link>
        {" · "}
        {pipelineCounts.published} {t("learn_live_programmes")},{" "}
        {pipelineCounts.draft + pipelineCounts.in_review} {t("learn_in_pipeline")}
      </div>

      {required > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
          <strong>{t("learn_attention")}:</strong> {required} {t("learn_requiredProgrammes")}.{" "}
          <Link href="/rm/learning/programmes" className="font-semibold underline">
            {t("nav_learn_programmes")} →
          </Link>
        </div>
      )}

      <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-eco-navy">{t("learn_quickAccess")}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex min-h-14 items-center justify-between rounded-lg border border-eco-border bg-eco-surface/40 px-4 py-3 text-sm font-medium text-eco-navy transition hover:border-eco-teal/40 hover:bg-eco-teal-muted/30"
              >
                {t(link.key)}
                <span className="text-eco-muted">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-eco-navy">{t("learn_recentActivity")}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {DOMAIN_PROGRESS.slice(0, 3).map((d) => (
            <li key={d.id} className="flex justify-between gap-4 border-b border-eco-border pb-3 last:border-0">
              <span className="text-eco-ink">{d.lastActivity}</span>
              <span className="shrink-0 text-eco-muted">{d.pct}%</span>
            </li>
          ))}
        </ul>
        <Link
          href="/rm/learning/competencies"
          className="mt-4 inline-block text-xs font-semibold text-eco-teal-dark hover:underline"
        >
          {t("learn_viewAllCompetencies")} →
        </Link>
      </section>
    </>
  );
}
