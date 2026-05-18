"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoDomainProgress } from "@/lib/demo-data";
import { useLearning } from "../learning-context";
import { LearningPageHeader } from "../learning-page-header";
import { domainKey, statusKey, statusStyles } from "../learning-utils";

const DOMAIN_IDS: DemoDomainProgress["id"][] = [
  "ethics",
  "planning",
  "risk",
  "investment",
  "estate",
];

export function LearningProgrammesPage() {
  const { t } = useDemoLocale();
  const searchParams = useSearchParams();
  const {
    visibleCerts,
    domainFilter,
    highlightCertId,
    clearDomainFilter,
    handleCertPrimary,
    openCert,
    setDomainFilter,
    setHighlightCertId,
    certs,
    scheduledCount,
  } = useLearning();

  useEffect(() => {
    const raw = searchParams.get("domain");
    if (!raw || !DOMAIN_IDS.includes(raw as DemoDomainProgress["id"])) return;
    const domainId = raw as DemoDomainProgress["id"];
    setDomainFilter(domainId);
    const first = certs.find((c) => c.domains.includes(domainId));
    if (first) setHighlightCertId(first.id);
  }, [searchParams, certs, setDomainFilter, setHighlightCertId]);

  return (
    <>
      <LearningPageHeader titleKey="learn_programmes_title" subtitleKey="learn_programmesSub" />

      <p className="text-xs text-eco-muted">
        {t("learn_programmes_live_only")}{" "}
        {scheduledCount > 0 && (
          <>
            {t("learn_programmes_upcoming_hint")}{" "}
            <Link href="/rm/learning/upcoming" className="font-semibold text-eco-teal-dark hover:underline">
              {t("nav_learn_upcoming")} ({scheduledCount})
            </Link>
          </>
        )}
      </p>

      {domainFilter && (
        <div className="flex items-center justify-between rounded-lg border border-eco-teal/30 bg-eco-teal-muted/40 px-4 py-2 text-xs">
          <span className="text-eco-teal-dark">
            {t("learn_domainFocus")}: {t(domainKey(domainFilter))}
          </span>
          <button
            type="button"
            onClick={clearDomainFilter}
            className="font-semibold text-eco-navy hover:underline"
          >
            {t("learn_clearFilter")}
          </button>
        </div>
      )}

      <ul className="grid gap-4 lg:grid-cols-2">
        {visibleCerts.map((cert) => (
          <li
            key={cert.id}
            className={`flex flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:border-eco-teal/40 hover:shadow-md ${
              highlightCertId === cert.id
                ? "border-eco-teal ring-2 ring-eco-teal/30"
                : "border-eco-border"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug text-eco-navy">{cert.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-eco-muted">{cert.subtitle}</p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyles(cert.status)}`}
              >
                {t(statusKey(cert.status))}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-eco-surface">
              <div
                className={`h-full rounded-full transition-all ${
                  cert.status === "completed" ? "bg-emerald-600" : "bg-eco-teal"
                }`}
                style={{ width: `${cert.progressPct}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-eco-muted">
              <span>
                {t("learn_modules")}: {cert.modulesDone}/{cert.modulesTotal}
              </span>
              <span>
                {t("learn_cpd")}: {cert.cpdEarned}/{cert.cpdRequired}h
              </span>
              {cert.dueLabel && (
                <span className="font-medium text-amber-800">
                  {t("learn_due")}: {cert.dueLabel}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {cert.domains.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-eco-surface px-2 py-0.5 text-[10px] text-eco-muted ring-1 ring-eco-border"
                >
                  {t(domainKey(d))}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCertPrimary(cert)}
                className="rounded-lg bg-eco-navy px-3 py-2 text-xs font-semibold text-white hover:bg-eco-navy/90 active:scale-[0.98]"
              >
                {cert.status === "completed"
                  ? t("learn_review")
                  : cert.status === "available"
                    ? t("learn_start")
                    : t("learn_continue")}
              </button>
              {cert.embeddedInApp ? (
                <button
                  type="button"
                  onClick={() => openCert(cert, cert.status === "completed" ? "review" : "play")}
                  className="rounded-full bg-eco-teal-muted px-2 py-1 text-[10px] font-medium text-eco-teal-dark hover:bg-eco-teal-muted/80"
                >
                  {t("learn_embedded")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openCert(cert, "play")}
                  className="rounded-full bg-eco-surface px-2 py-1 text-[10px] font-medium text-eco-muted hover:text-eco-navy"
                >
                  {t("learn_hrOnly")}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
