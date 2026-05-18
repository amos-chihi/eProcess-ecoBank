"use client";

import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { useLearning } from "../learning-context";
import { LearningPageHeader } from "../learning-page-header";
import { statusKey, statusStyles } from "../learning-utils";

export function LearningAssignmentsPage() {
  const { t } = useDemoLocale();
  const { certs, handleCertPrimary } = useLearning();

  const assignments = certs.filter((c) => c.status === "required" || c.status === "in_progress");

  return (
    <>
      <LearningPageHeader titleKey="learn_assignments_title" subtitleKey="learn_assignments_sub" />

      <ul className="space-y-3">
        {assignments.length === 0 ? (
          <li className="rounded-xl border border-eco-border bg-eco-surface/50 px-4 py-8 text-center text-sm text-eco-muted">
            {t("learn_assignments_empty")}
          </li>
        ) : (
          assignments.map((cert) => (
            <li
              key={cert.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-eco-border bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-eco-navy">{cert.title}</p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles(cert.status)}`}
                  >
                    {t(statusKey(cert.status))}
                  </span>
                </div>
                {cert.dueLabel && (
                  <p className="mt-1 text-xs font-medium text-amber-800">{cert.dueLabel}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleCertPrimary(cert)}
                className="shrink-0 rounded-lg bg-eco-navy px-4 py-2 text-xs font-semibold text-white hover:bg-eco-navy/90"
              >
                {cert.status === "in_progress" ? t("learn_continue") : t("learn_start")}
              </button>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
