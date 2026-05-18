"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { useLearningPlatform } from "@/contexts/learning-platform-context";
import { HR_LD_INTEGRATION } from "@/lib/demo-data";
import { DEMO_HR_SYNC_EVENTS, type HrSyncEvent } from "@/lib/hr-portal-data";
import { useLearning } from "../learning-context";
import { LearningPageHeader } from "../learning-page-header";

type HrTab = "overview" | "assignments" | "transcript" | "sync";

const TABS: { id: HrTab; labelKey: "learn_hr_tab_overview" | "learn_hr_tab_assignments" | "learn_hr_tab_transcript" | "learn_hr_tab_sync" }[] = [
  { id: "overview", labelKey: "learn_hr_tab_overview" },
  { id: "assignments", labelKey: "learn_hr_tab_assignments" },
  { id: "transcript", labelKey: "learn_hr_tab_transcript" },
  { id: "sync", labelKey: "learn_hr_tab_sync" },
];

function SyncDirectionBadge({ event }: { event: HrSyncEvent }) {
  const isInbound = event.direction === "from_hr";
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
        isInbound ? "bg-violet-100 text-violet-900" : "bg-sky-100 text-sky-900"
      }`}
    >
      {isInbound ? "HR → eProcess" : "eProcess → HR"}
    </span>
  );
}

export function HrPortalClient() {
  const { t } = useDemoLocale();
  const [tab, setTab] = useState<HrTab>("overview");
  const { syncFlash, lastSync, hrOpenItems, handleSync, setHrModalOpen, certs, openCert } =
    useLearning();
  const { catalog, enrollments, auditLog } = useLearningPlatform();

  const hrOnlyCourses = useMemo(
    () => catalog.filter((c) => c.publishStatus === "published" && !c.embeddedInApp),
    [catalog],
  );

  const assignments = useMemo(() => {
    const rows: {
      id: string;
      title: string;
      due: string;
      state: "urgent" | "open" | "progress";
      source: "hr" | "eprocess";
      certId?: string;
    }[] = [];

    for (const course of hrOnlyCourses) {
      const enr = enrollments.find((e) => e.courseId === course.id);
      const urgent = enr?.dueLabel?.toLowerCase().includes("overdue");
      rows.push({
        id: course.id,
        title: course.title,
        due: enr?.dueLabel ?? "Assigned by HR",
        state: urgent ? "urgent" : enr?.status === "in_progress" ? "progress" : "open",
        source: "hr",
        certId: course.id,
      });
    }

    for (const cert of certs.filter((c) => c.status === "required" || c.status === "in_progress")) {
      if (rows.some((r) => r.certId === cert.id)) continue;
      rows.push({
        id: cert.id,
        title: cert.title,
        due: cert.dueLabel ?? "In eProcess catalogue",
        state: cert.dueLabel?.toLowerCase().includes("overdue")
          ? "urgent"
          : cert.status === "in_progress"
            ? "progress"
            : "open",
        source: "eprocess",
        certId: cert.id,
      });
    }

    return rows.sort((a, b) => (a.state === "urgent" ? -1 : b.state === "urgent" ? 1 : 0));
  }, [hrOnlyCourses, enrollments, certs]);

  const transcriptRows = useMemo(() => {
    const completed = certs.filter((c) => c.status === "completed");
    return completed.map((c, i) => ({
      id: c.id,
      title: c.title,
      completedAt: ["13 May 2026", "28 Apr 2026", "15 Mar 2026"][i] ?? "2026",
      cpdHours: c.cpdEarned,
      source: c.embeddedInApp ? ("eProcess" as const) : ("Workday" as const),
      certificateId: `CERT-${c.id.toUpperCase()}-2026`,
    }));
  }, [certs]);

  const syncEvents = useMemo(() => {
    const fromAudit: HrSyncEvent[] = auditLog.slice(0, 3).map((a) => ({
      id: a.id,
      at: a.at,
      direction: a.action.includes("Published") ? ("from_hr" as const) : ("to_hr" as const),
      summary: a.action + " · " + a.courseTitle,
      status: "ok" as const,
    }));
    return [...fromAudit, ...DEMO_HR_SYNC_EVENTS].slice(0, 8);
  }, [auditLog]);

  const completedCount = certs.filter((c) => c.status === "completed").length;
  const cpdTotal = certs.reduce((s, c) => s + c.cpdEarned, 0);

  return (
    <>
      <LearningPageHeader titleKey="learn_hrTitle" subtitleKey="learn_hrSub" />

      {/* Workday connection banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-[#c7e0f4] bg-gradient-to-r from-[#eff6fc] to-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0078d4] text-lg font-bold text-white shadow-md">
            W
          </div>
          <div>
            <p className="text-sm font-semibold text-[#323130]">{HR_LD_INTEGRATION.platform}</p>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#605e5c]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {t("learn_hrSso")}
              </span>
              <span className="font-mono">{HR_LD_INTEGRATION.employeeId}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSync}
              title={t("learn_hrSyncNow_desc")}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
                syncFlash ? "bg-emerald-600" : "bg-[#0078d4] hover:bg-[#106ebe]"
              }`}
            >
              {syncFlash ? t("learn_hr_synced") : t("learn_hrSyncNow")}
            </button>
            <button
              type="button"
              onClick={() => setHrModalOpen(true)}
              className="rounded-lg border border-[#0078d4]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#0078d4] hover:bg-[#eff6fc]"
            >
              {t("learn_openHr")}
            </button>
          </div>
          <p className="max-w-xs text-[11px] leading-snug text-[#605e5c] sm:text-right">
            {t("learn_hrSyncNow_desc")}
          </p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-eco-border">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label={t("learn_hrTitle")}>
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${
                tab === item.id
                  ? "border-[#0078d4] text-[#0078d4]"
                  : "border-transparent text-eco-muted hover:border-eco-border hover:text-eco-ink"
              }`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </nav>
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t("learn_hrSync"), value: syncFlash ? t("learn_hr_synced_short") : lastSync },
              { label: t("learn_hrOpenItems"), value: String(hrOpenItems) },
              { label: t("learn_hr_stat_completed"), value: String(completedCount) },
              { label: t("learn_hr_stat_cpd"), value: `${cpdTotal}h` },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border bg-white p-4 shadow-sm transition ${
                  syncFlash && stat.label === t("learn_hrSync")
                    ? "border-emerald-300 ring-2 ring-emerald-100"
                    : "border-eco-border"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase text-eco-muted">{stat.label}</p>
                <p className="mt-1 text-xl font-semibold text-eco-navy">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-eco-navy">{t("learn_hr_profile")}</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-eco-border pb-3">
                  <dt className="text-eco-muted">{t("learn_hrPlan")}</dt>
                  <dd className="text-right font-medium text-eco-ink">
                    {HR_LD_INTEGRATION.assignedPlan}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-eco-border pb-3">
                  <dt className="text-eco-muted">{t("learn_hrFramework")}</dt>
                  <dd className="text-right font-medium text-eco-ink">
                    {HR_LD_INTEGRATION.careerFramework}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-eco-muted">{t("learn_hrTranscript")}</dt>
                  <dd className="text-right font-medium text-eco-ink">{t("learn_hrTranscriptVal")}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-eco-navy">{t("learn_hr_integration")}</h2>
              <p className="mt-2 text-xs leading-relaxed text-eco-muted">{t("learn_hrWire")}</p>
              <ul className="mt-4 space-y-2 text-xs text-eco-ink">
                <li className="flex gap-2 rounded-lg bg-eco-surface/60 px-3 py-2">
                  <span className="text-[#0078d4]">↔</span>
                  {t("learn_hr_flow_embedded")}
                </li>
                <li className="flex gap-2 rounded-lg bg-eco-surface/60 px-3 py-2">
                  <span className="text-violet-600">→</span>
                  {t("learn_hr_flow_hr_only")}
                </li>
                <li className="flex gap-2 rounded-lg bg-eco-surface/60 px-3 py-2">
                  <span className="text-emerald-600">✓</span>
                  {t("learn_hr_flow_career")}
                </li>
              </ul>
              <Link
                href="/rm/learning/programmes"
                className="mt-4 inline-block text-xs font-semibold text-eco-teal-dark hover:underline"
              >
                {t("nav_learn_programmes")} →
              </Link>
            </section>
          </div>

          <section className="rounded-xl border border-eco-border bg-[#faf9f8] p-5">
            <h2 className="text-sm font-semibold text-eco-navy">{t("learn_hr_recent_sync")}</h2>
            <ul className="mt-3 space-y-2">
              {syncEvents.slice(0, 4).map((ev) => (
                <li
                  key={ev.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#e1dfdd] bg-white px-3 py-2 text-xs"
                >
                  <span className="text-eco-ink">{ev.summary}</span>
                  <SyncDirectionBadge event={ev} />
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setTab("sync")}
              className="mt-3 text-xs font-semibold text-[#0078d4] hover:underline"
            >
              {t("learn_hr_view_all_sync")} →
            </button>
          </section>
        </div>
      )}

      {tab === "assignments" && (
        <section className="rounded-xl border border-eco-border bg-white shadow-sm">
          <header className="border-b border-eco-border px-5 py-4">
            <h2 className="text-sm font-semibold text-eco-navy">{t("learn_hrAssignments")}</h2>
            <p className="mt-1 text-xs text-eco-muted">{t("learn_hr_assignments_sub")}</p>
          </header>
          <ul className="divide-y divide-eco-border">
            {assignments.length === 0 ? (
              <li className="px-5 py-10 text-center text-sm text-eco-muted">
                {t("learn_assignments_empty")}
              </li>
            ) : (
              assignments.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-eco-navy">{row.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          row.source === "hr"
                            ? "bg-[#deecf9] text-[#0078d4]"
                            : "bg-eco-teal-muted text-eco-teal-dark"
                        }`}
                      >
                        {row.source === "hr" ? "Workday" : "eProcess"}
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-xs ${
                        row.state === "urgent" ? "font-medium text-amber-800" : "text-eco-muted"
                      }`}
                    >
                      {row.due}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {row.source === "hr" ? (
                      <button
                        type="button"
                        onClick={() => setHrModalOpen(true)}
                        className="rounded-lg bg-[#0078d4] px-3 py-2 text-xs font-semibold text-white hover:bg-[#106ebe]"
                      >
                        {t("learn_openHr")}
                      </button>
                    ) : row.certId ? (
                      <button
                        type="button"
                        onClick={() => {
                          const cert = certs.find((c) => c.id === row.certId);
                          if (cert) openCert(cert, cert.status === "completed" ? "review" : "play");
                        }}
                        className="rounded-lg bg-eco-navy px-3 py-2 text-xs font-semibold text-white hover:bg-eco-navy/90"
                      >
                        {row.state === "progress" ? t("learn_continue") : t("learn_start")}
                      </button>
                    ) : null}
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      )}

      {tab === "transcript" && (
        <section className="rounded-xl border border-eco-border bg-white shadow-sm">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-eco-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-eco-navy">{t("learn_hr_transcript_title")}</h2>
              <p className="mt-1 text-xs text-eco-muted">{t("learn_hr_transcript_sub")}</p>
            </div>
            <button
              type="button"
              onClick={() => setHrModalOpen(true)}
              className="rounded-lg border border-eco-border px-3 py-2 text-xs font-medium text-eco-navy hover:bg-eco-surface"
            >
              {t("learn_hr_export")}
            </button>
          </header>
          {transcriptRows.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-eco-muted">{t("learn_hr_transcript_empty")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-eco-surface text-[10px] font-semibold uppercase text-eco-muted">
                  <tr>
                    <th className="px-5 py-3">{t("learn_transcript_programme")}</th>
                    <th className="px-5 py-3">{t("learn_hr_transcript_completed")}</th>
                    <th className="px-5 py-3">{t("learn_cpd")}</th>
                    <th className="px-5 py-3">{t("learn_hr_transcript_source")}</th>
                    <th className="px-5 py-3">{t("learn_hr_certificate")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-eco-border">
                  {transcriptRows.map((row) => (
                    <tr key={row.id} className="hover:bg-eco-surface/40">
                      <td className="px-5 py-3 font-medium text-eco-navy">{row.title}</td>
                      <td className="px-5 py-3 text-eco-muted">{row.completedAt}</td>
                      <td className="px-5 py-3 text-eco-muted">{row.cpdHours}h</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            row.source === "eProcess"
                              ? "bg-eco-teal-muted text-eco-teal-dark"
                              : "bg-[#deecf9] text-[#0078d4]"
                          }`}
                        >
                          {row.source}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-eco-muted">{row.certificateId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="border-t border-eco-border px-5 py-3 text-xs text-eco-muted">
            {t("learn_transcript_hr_note")}
          </p>
        </section>
      )}

      {tab === "sync" && (
        <section className="rounded-xl border border-eco-border bg-white shadow-sm">
          <header className="border-b border-eco-border px-5 py-4">
            <h2 className="text-sm font-semibold text-eco-navy">{t("learn_hr_tab_sync")}</h2>
            <p className="mt-1 text-xs text-eco-muted">{t("learn_hr_sync_sub")}</p>
          </header>
          <ul className="divide-y divide-eco-border">
            {syncEvents.map((ev) => (
              <li key={ev.id} className="flex flex-wrap items-start gap-3 px-5 py-4">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                    ev.status === "ok" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {ev.direction === "to_hr" ? "↑" : "↓"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-eco-ink">{ev.summary}</p>
                  <p className="mt-0.5 text-xs text-eco-muted">{ev.at}</p>
                </div>
                <SyncDirectionBadge event={ev} />
              </li>
            ))}
          </ul>
          <div className="border-t border-eco-border bg-eco-surface/30 px-5 py-4">
            <button
              type="button"
              onClick={handleSync}
              className="text-sm font-semibold text-[#0078d4] hover:underline"
            >
              {t("learn_hrSyncNow")}
            </button>
          </div>
        </section>
      )}
    </>
  );
}
