"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { buildTranscriptEntries, type TranscriptEntry } from "@/lib/learning-transcript-data";
import { TranscriptViewer } from "../transcript-viewer";
import { useLearning } from "../learning-context";
import { LearningPageHeader } from "../learning-page-header";
import { domainKey, statusKey, statusStyles } from "../learning-utils";

type FilterTab = "all" | "completed" | "in_progress";

export function LearningTranscriptPage() {
  const { t } = useDemoLocale();
  const { certs, openCert, showToast } = useLearning();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  const [viewer, setViewer] = useState<{ mode: "full" | "entry"; entry: TranscriptEntry | null } | null>(
    null,
  );

  const entries = useMemo(() => buildTranscriptEntries(certs), [certs]);

  const filtered = useMemo(() => {
    let list = entries;
    if (filter === "completed") list = list.filter((e) => e.status === "completed");
    if (filter === "in_progress") list = list.filter((e) => e.status === "in_progress");
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.programmeTitle.toLowerCase().includes(q) ||
          e.certificateId?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [entries, filter, query]);

  const completedCount = entries.filter((e) => e.status === "completed").length;
  const inProgressCount = entries.filter((e) => e.status === "in_progress").length;
  const totalCpd = entries.reduce((s, e) => s + e.cpdEarned, 0);

  const handleDownload = () => {
    showToast(t("learn_transcript_download_toast"));
  };

  return (
    <>
      <LearningPageHeader titleKey="learn_transcript_title" subtitleKey="learn_transcript_sub" />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: t("learn_transcript_stat_completed"), value: String(completedCount) },
          { label: t("learn_transcript_stat_inprogress"), value: String(inProgressCount) },
          { label: t("learn_transcript_stat_cpd"), value: `${totalCpd}h` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-eco-border bg-white p-4 shadow-sm"
          >
            <p className="text-[10px] font-semibold uppercase text-eco-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-eco-navy">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-eco-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all" as const, label: t("learn_transcript_filter_all") },
              { id: "completed" as const, label: t("learn_transcript_filter_completed") },
              { id: "in_progress" as const, label: t("learn_transcript_filter_inprogress") },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === tab.id
                  ? "bg-eco-navy text-white"
                  : "bg-eco-surface text-eco-muted hover:text-eco-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("learn_transcript_search")}
            className="min-w-[12rem] flex-1 rounded-lg border border-eco-border px-3 py-2 text-sm sm:max-w-xs"
          />
          <button
            type="button"
            onClick={() => setViewer({ mode: "full", entry: null })}
            className="rounded-lg bg-eco-teal px-4 py-2 text-xs font-semibold text-white hover:bg-eco-teal-dark"
          >
            {t("learn_transcript_view_full")}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg border border-eco-border px-4 py-2 text-xs font-medium text-eco-navy hover:bg-eco-surface"
          >
            {t("learn_transcript_download")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-eco-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-eco-surface text-[10px] font-semibold uppercase tracking-wide text-eco-muted">
            <tr>
              <th className="px-4 py-3">{t("learn_transcript_programme")}</th>
              <th className="px-4 py-3">{t("learn_transcript_status")}</th>
              <th className="hidden px-4 py-3 md:table-cell">{t("learn_hr_certificate")}</th>
              <th className="px-4 py-3">{t("learn_cpd")}</th>
              <th className="hidden px-4 py-3 sm:table-cell">{t("learn_modules")}</th>
              <th className="px-4 py-3 text-right">{t("learn_transcript_actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-eco-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-eco-muted">
                  {t("learn_hr_transcript_empty")}
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const cert = certs.find((c) => c.id === row.id);
                return (
                  <tr key={row.id} className="hover:bg-eco-surface/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-eco-navy">{row.programmeTitle}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-eco-muted">{row.subtitle}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {row.domains.map((d) => (
                          <span
                            key={d}
                            className="rounded-full bg-eco-surface px-1.5 py-0.5 text-[9px] text-eco-muted ring-1 ring-eco-border"
                          >
                            {t(domainKey(d))}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles(row.status)}`}
                      >
                        {t(statusKey(row.status))}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-eco-muted md:table-cell">
                      {row.certificateId ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-eco-muted">
                      {row.cpdEarned}/{row.cpdRequired}h
                    </td>
                    <td className="hidden px-4 py-3 text-eco-muted sm:table-cell">
                      {row.modulesDone}/{row.modulesTotal}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {row.status === "completed" && (
                          <button
                            type="button"
                            onClick={() => setViewer({ mode: "entry", entry: row })}
                            className="rounded-lg bg-eco-navy px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-eco-navy/90"
                          >
                            {t("learn_transcript_view")}
                          </button>
                        )}
                        {row.status === "completed" && cert && (
                          <button
                            type="button"
                            onClick={() => openCert(cert, "review")}
                            className="rounded-lg border border-eco-border px-2.5 py-1.5 text-[11px] font-medium text-eco-navy hover:bg-eco-surface"
                          >
                            {t("learn_review")}
                          </button>
                        )}
                        {row.status === "in_progress" && cert && (
                          <button
                            type="button"
                            onClick={() => openCert(cert, "play")}
                            className="rounded-lg bg-eco-teal px-2.5 py-1.5 text-[11px] font-semibold text-white"
                          >
                            {t("learn_continue")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-eco-muted">
        {t("learn_transcript_hr_note")}{" "}
        <Link href="/rm/learning/hr-portal" className="font-semibold text-eco-teal-dark hover:underline">
          {t("nav_learn_hr")} →
        </Link>
      </p>

      {viewer && (
        <TranscriptViewer
          mode={viewer.mode}
          entry={viewer.entry}
          entries={entries}
          onClose={() => setViewer(null)}
          onDownload={handleDownload}
        />
      )}
    </>
  );
}
