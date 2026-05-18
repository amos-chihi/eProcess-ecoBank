"use client";

import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { useLearning } from "../learning-context";
import { LearningPageHeader } from "../learning-page-header";
import { statusKey, statusStyles } from "../learning-utils";

export function LearningTranscriptPage() {
  const { t } = useDemoLocale();
  const { certs } = useLearning();

  const completed = certs.filter((c) => c.status === "completed");
  const inProgress = certs.filter((c) => c.status === "in_progress");
  const rows = [...completed, ...inProgress].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <LearningPageHeader titleKey="learn_transcript_title" subtitleKey="learn_transcript_sub" />

      <div className="overflow-hidden rounded-xl border border-eco-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-eco-surface text-[10px] font-semibold uppercase tracking-wide text-eco-muted">
            <tr>
              <th className="px-4 py-3">{t("learn_transcript_programme")}</th>
              <th className="px-4 py-3">{t("learn_transcript_status")}</th>
              <th className="px-4 py-3">{t("learn_cpd")}</th>
              <th className="hidden px-4 py-3 sm:table-cell">{t("learn_modules")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-eco-border">
            {rows.map((cert) => (
              <tr key={cert.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-eco-navy">{cert.title}</p>
                  <p className="text-xs text-eco-muted">{cert.subtitle}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles(cert.status)}`}
                  >
                    {t(statusKey(cert.status))}
                  </span>
                </td>
                <td className="px-4 py-3 text-eco-muted">
                  {cert.cpdEarned}/{cert.cpdRequired}h
                </td>
                <td className="hidden px-4 py-3 text-eco-muted sm:table-cell">
                  {cert.modulesDone}/{cert.modulesTotal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-eco-muted">{t("learn_transcript_hr_note")}</p>
    </>
  );
}
