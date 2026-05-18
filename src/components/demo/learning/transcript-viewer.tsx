"use client";

import { useEffect } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import {
  TRANSCRIPT_PROFILE,
  type TranscriptEntry,
} from "@/lib/learning-transcript-data";

type ViewMode = "full" | "entry";

export function TranscriptViewer({
  mode,
  entry,
  entries,
  onClose,
  onDownload,
}: {
  mode: ViewMode;
  entry: TranscriptEntry | null;
  entries: TranscriptEntry[];
  onClose: () => void;
  onDownload: () => void;
}) {
  const { t } = useDemoLocale();
  const profile = TRANSCRIPT_PROFILE;
  const completedEntries = entries.filter((e) => e.status === "completed");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const totalCpd = entries.reduce((s, e) => s + e.cpdEarned, 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-eco-navy/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transcript-viewer-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-eco-border bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-eco-border bg-eco-surface/60 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-eco-muted">
              {t("learn_transcript_view_label")}
            </p>
            <h2 id="transcript-viewer-title" className="text-lg font-semibold text-eco-navy">
              {mode === "full" ? t("learn_transcript_full_title") : entry?.programmeTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-eco-border px-3 py-1.5 text-sm text-eco-muted hover:bg-white"
          >
            {t("learn_modal_close")}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#faf9f8] p-5 sm:p-8">
          <article className="mx-auto max-w-2xl rounded-lg border border-[#e1dfdd] bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b-2 border-eco-navy pb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-eco-muted">
                Ecobank Group
              </p>
              <h3 className="mt-1 text-xl font-semibold text-eco-navy">
                {t("learn_transcript_doc_title")}
              </h3>
              <p className="mt-1 text-xs text-eco-muted">
                {t("learn_transcript_ref")}: {profile.transcriptRef}
              </p>
            </div>

            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-semibold uppercase text-eco-muted">
                  {t("learn_transcript_employee")}
                </dt>
                <dd className="mt-0.5 font-medium text-eco-navy">{profile.employeeName}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase text-eco-muted">
                  {t("learn_transcript_employee_id")}
                </dt>
                <dd className="mt-0.5 font-mono text-eco-ink">{profile.employeeId}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[10px] font-semibold uppercase text-eco-muted">
                  {t("learn_hrPlan")}
                </dt>
                <dd className="mt-0.5 text-eco-ink">{profile.assignedPlan}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase text-eco-muted">
                  {t("learn_transcript_generated")}
                </dt>
                <dd className="mt-0.5 text-eco-muted">{profile.generatedAt}</dd>
              </div>
              {mode === "full" && (
                <div>
                  <dt className="text-[10px] font-semibold uppercase text-eco-muted">
                    {t("learn_transcript_total_cpd")}
                  </dt>
                  <dd className="mt-0.5 text-lg font-semibold text-eco-teal-dark">{totalCpd}h</dd>
                </div>
              )}
            </dl>

            {mode === "entry" && entry ? (
              <section className="mt-8">
                <h4 className="text-sm font-semibold text-eco-navy">{entry.programmeTitle}</h4>
                <p className="mt-1 text-xs text-eco-muted">{entry.subtitle}</p>
                <dl className="mt-4 grid gap-2 rounded-lg border border-eco-border bg-eco-surface/40 p-4 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-eco-muted">{t("learn_hr_certificate")}</dt>
                    <dd className="font-mono font-medium text-eco-ink">{entry.certificateId}</dd>
                  </div>
                  <div>
                    <dt className="text-eco-muted">{t("learn_hr_transcript_completed")}</dt>
                    <dd className="font-medium text-eco-ink">{entry.issuedAt}</dd>
                  </div>
                  <div>
                    <dt className="text-eco-muted">{t("learn_transcript_result")}</dt>
                    <dd className="font-semibold text-emerald-700">{entry.result}</dd>
                  </div>
                  <div>
                    <dt className="text-eco-muted">{t("learn_cpd")}</dt>
                    <dd className="font-medium text-eco-ink">
                      {entry.cpdEarned}/{entry.cpdRequired}h
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-eco-muted">{t("learn_hr_transcript_source")}</dt>
                    <dd className="font-medium text-eco-ink">{entry.source}</dd>
                  </div>
                </dl>
                <h5 className="mt-6 text-xs font-semibold uppercase tracking-wide text-eco-muted">
                  {t("learn_transcript_modules")}
                </h5>
                <ul className="mt-2 divide-y divide-eco-border rounded-lg border border-eco-border">
                  {entry.modules.map((mod) => (
                    <li
                      key={mod.index}
                      className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
                    >
                      <span className="text-eco-ink">
                        <span className="font-mono text-eco-muted">{mod.index}.</span> {mod.title}
                      </span>
                      <span className={mod.completedAt ? "text-emerald-700" : "text-eco-muted"}>
                        {mod.completedAt ?? "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <section className="mt-8">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
                  {t("learn_transcript_completed_section")}
                </h4>
                <ul className="mt-3 space-y-4">
                  {completedEntries.map((e) => (
                    <li
                      key={e.id}
                      className="rounded-lg border border-eco-border bg-eco-surface/30 p-4"
                    >
                      <p className="font-semibold text-eco-navy">{e.programmeTitle}</p>
                      <p className="mt-2 grid gap-1 text-xs text-eco-muted sm:grid-cols-2">
                        <span>
                          {t("learn_hr_certificate")}:{" "}
                          <span className="font-mono text-eco-ink">{e.certificateId}</span>
                        </span>
                        <span>
                          {t("learn_hr_transcript_completed")}: {e.issuedAt}
                        </span>
                        <span>
                          {t("learn_cpd")}: {e.cpdEarned}h · {t("learn_transcript_result")}:{" "}
                          {e.result}
                        </span>
                        <span>
                          {t("learn_hr_transcript_source")}: {e.source}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
                {entries.some((e) => e.status === "in_progress") && (
                  <>
                    <h4 className="mt-8 text-xs font-semibold uppercase tracking-wide text-eco-muted">
                      {t("learn_transcript_inprogress_section")}
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm">
                      {entries
                        .filter((e) => e.status === "in_progress")
                        .map((e) => (
                          <li
                            key={e.id}
                            className="flex justify-between gap-2 rounded-lg border border-dashed border-eco-border px-3 py-2"
                          >
                            <span className="text-eco-ink">{e.programmeTitle}</span>
                            <span className="shrink-0 text-xs text-eco-muted">
                              {e.modulesDone}/{e.modulesTotal} · {e.cpdEarned}h
                            </span>
                          </li>
                        ))}
                    </ul>
                  </>
                )}
              </section>
            )}

            <footer className="mt-8 border-t border-eco-border pt-4">
              <p className="text-[10px] leading-relaxed text-eco-muted">
                {t("learn_transcript_verification")}
              </p>
              <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-widest text-eco-navy/40">
                {t("learn_transcript_seal")}
              </p>
            </footer>
          </article>
        </div>

        <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-eco-border bg-white px-5 py-4">
          <button
            type="button"
            onClick={onDownload}
            className="rounded-lg border border-eco-border px-4 py-2 text-sm font-medium text-eco-ink hover:bg-eco-surface"
          >
            {t("learn_transcript_download")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-eco-navy px-4 py-2 text-sm font-semibold text-white hover:bg-eco-navy/90"
          >
            {t("learn_modal_close")}
          </button>
        </footer>
      </div>
    </div>
  );
}
