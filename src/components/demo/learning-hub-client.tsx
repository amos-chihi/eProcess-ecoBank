"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { LearningCertModal } from "@/components/demo/learning-cert-modal";
import { LearningHrModal } from "@/components/demo/learning-hr-modal";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoMsgKey } from "@/lib/demo-i18n";
import {
  CAREER_PATHS,
  DEMO_CERTIFICATIONS,
  DOMAIN_PROGRESS,
  HR_LD_INTEGRATION,
  type CertStatus,
  type DemoCareerPath,
  type DemoCertification,
  type DemoDomainProgress,
} from "@/lib/demo-data";

function recalcCert(cert: DemoCertification): DemoCertification {
  const modulesDone = cert.modulesDone;
  const progressPct =
    cert.modulesTotal > 0 ? Math.round((modulesDone / cert.modulesTotal) * 100) : 0;
  const cpdEarned = Math.min(
    cert.cpdRequired,
    Math.round((modulesDone / cert.modulesTotal) * cert.cpdRequired),
  );
  let status: CertStatus = cert.status;
  if (modulesDone >= cert.modulesTotal) status = "completed";
  else if (modulesDone > 0 || status === "available") status = "in_progress";
  return { ...cert, progressPct, cpdEarned, status };
}

function advanceCert(cert: DemoCertification): DemoCertification {
  if (cert.status === "completed") return cert;
  const modulesDone = Math.min(cert.modulesDone + 1, cert.modulesTotal);
  return recalcCert({ ...cert, modulesDone });
}

function domainKey(id: DemoDomainProgress["id"]): DemoMsgKey {
  const map: Record<DemoDomainProgress["id"], DemoMsgKey> = {
    ethics: "learn_dom_ethics",
    planning: "learn_dom_planning",
    risk: "learn_dom_risk",
    investment: "learn_dom_invest",
    estate: "learn_dom_estate",
  };
  return map[id];
}

function statusKey(status: CertStatus): DemoMsgKey {
  const map: Record<CertStatus, DemoMsgKey> = {
    completed: "learn_status_completed",
    in_progress: "learn_status_in_progress",
    required: "learn_status_required",
    available: "learn_status_available",
  };
  return map[status];
}

function statusStyles(status: CertStatus) {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "in_progress":
      return "bg-eco-teal-muted text-eco-teal-dark border-eco-teal/30";
    case "required":
      return "bg-amber-50 text-amber-900 border-amber-200";
    default:
      return "bg-eco-surface text-eco-muted border-eco-border";
  }
}

function clusterKey(cluster: DemoCareerPath["cluster"]): DemoMsgKey {
  const map: Record<DemoCareerPath["cluster"], DemoMsgKey> = {
    Anglophone: "learn_cluster_anglo",
    Francophone: "learn_cluster_franco",
    Lusophone: "learn_cluster_luso",
  };
  return map[cluster];
}

function CompetencyRadar({
  domains,
  t,
}: {
  domains: DemoDomainProgress[];
  t: (key: DemoMsgKey) => string;
}) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 72;
  const angles = domains.map((_, i) => (i * 2 * Math.PI) / domains.length - Math.PI / 2);

  const point = (pct: number, i: number) => {
    const r = (pct / 100) * maxR;
    return { x: cx + r * Math.cos(angles[i]!), y: cy + r * Math.sin(angles[i]!) };
  };

  const actual = domains.map((d, i) => point(d.pct, i));
  const target = domains.map((d, i) => point(d.targetPct, i));

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
    " Z";

  return (
    <div className="flex flex-col items-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-eco-muted">
        {t("learn_radarTitle")}
      </p>
      <svg width={size} height={size} className="text-eco-border" aria-hidden>
        {[25, 50, 75, 100].map((ring) => (
          <circle
            key={ring}
            cx={cx}
            cy={cy}
            r={(ring / 100) * maxR}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.35}
          />
        ))}
        {angles.map((a, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + maxR * Math.cos(a)}
            y2={cy + maxR * Math.sin(a)}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.35}
          />
        ))}
        <path d={toPath(target)} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" />
        <path d={toPath(actual)} fill="rgba(15, 118, 110, 0.2)" stroke="#0f766e" strokeWidth={2} />
      </svg>
      <ul className="mt-2 grid w-full grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-eco-muted">
        {domains.map((d) => (
          <li key={d.id} className="flex justify-between gap-2">
            <span>{t(domainKey(d.id))}</span>
            <span className="font-medium text-eco-navy">{d.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LearnToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[60] flex max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-eco-border bg-eco-navy px-4 py-3 text-sm text-white shadow-lg"
    >
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-md px-2 py-1 text-xs text-white/80 hover:bg-white/10"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export function LearningHubClient() {
  const { t } = useDemoLocale();
  const programmesRef = useRef<HTMLElement>(null);
  const [certs, setCerts] = useState<DemoCertification[]>(() =>
    DEMO_CERTIFICATIONS.map((c) => ({ ...c })),
  );
  const [selectedPath, setSelectedPath] = useState(
    CAREER_PATHS.find((p) => p.isCurrent)?.id ?? CAREER_PATHS[0]!.id,
  );
  const [syncFlash, setSyncFlash] = useState(false);
  const [lastSync, setLastSync] = useState(HR_LD_INTEGRATION.lastSync);
  const [hrOpenItems, setHrOpenItems] = useState(HR_LD_INTEGRATION.openItems);
  const [certModal, setCertModal] = useState<{ certId: string; mode: "play" | "review" } | null>(
    null,
  );
  const [hrModalOpen, setHrModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [highlightCertId, setHighlightCertId] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<DemoDomainProgress["id"] | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const overallPct = useMemo(
    () => Math.round(DOMAIN_PROGRESS.reduce((s, d) => s + d.pct, 0) / DOMAIN_PROGRESS.length),
    [],
  );
  const cpdYtd = useMemo(() => certs.reduce((s, c) => s + c.cpdEarned, 0), [certs]);

  const visibleCerts = useMemo(
    () =>
      domainFilter ? certs.filter((c) => c.domains.includes(domainFilter)) : certs,
    [certs, domainFilter],
  );

  const activePath = CAREER_PATHS.find((p) => p.id === selectedPath) ?? CAREER_PATHS[0]!;
  const activeCert = certModal ? certs.find((c) => c.id === certModal.certId) : null;

  const handleSync = () => {
    setSyncFlash(true);
    setLastSync("Just now ✓");
    setHrOpenItems((n) => Math.max(0, n - 1));
    showToast(t("learn_toast_sync"));
    window.setTimeout(() => setSyncFlash(false), 1800);
  };

  const openCert = useCallback(
    (cert: DemoCertification, mode: "play" | "review") => {
      if (!cert.embeddedInApp) {
        setHrModalOpen(true);
        return;
      }
      if (mode === "play" && cert.status === "available") {
        setCerts((list) =>
          list.map((c) =>
            c.id === cert.id ? recalcCert({ ...c, status: "in_progress", modulesDone: 0 }) : c,
          ),
        );
        showToast(t("learn_toast_started"));
      }
      setCertModal({ certId: cert.id, mode });
    },
    [showToast, t],
  );

  const handleCertPrimary = (cert: DemoCertification) => {
    if (cert.status === "completed") openCert(cert, "review");
    else openCert(cert, "play");
  };

  const handleCompleteModule = useCallback(() => {
    if (!certModal) return;
    setCerts((list) => {
      const next = list.map((c) => (c.id === certModal.certId ? advanceCert(c) : c));
      const updated = next.find((c) => c.id === certModal.certId)!;
      if (updated.status === "completed") {
        setCertModal({ certId: certModal.certId, mode: "review" });
        showToast(t("learn_toast_module"));
      } else {
        showToast(t("learn_toast_module"));
      }
      return next;
    });
  }, [certModal, showToast, t]);

  const focusDomain = (domainId: DemoDomainProgress["id"]) => {
    setDomainFilter(domainId);
    setHighlightCertId(null);
    showToast(`${t("learn_domainFocus")}: ${t(domainKey(domainId))}`);
    programmesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const first = certs.find((c) => c.domains.includes(domainId));
    if (first) setHighlightCertId(first.id);
  };

  const launchHr = () => {
    setHrModalOpen(false);
    showToast(t("learn_toast_hr"));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
            {t("learn_kicker")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-eco-navy">
            {t("learn_title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-eco-muted">{t("learn_sub")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-eco-surface px-3 py-1 text-xs font-medium text-eco-navy">
            {t("learn_rmBadge")}
          </span>
          <Link
            href="/rm"
            className="text-sm font-medium text-eco-teal-dark hover:underline"
          >
            {t("learn_hub")}
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-eco-muted">{t("learn_overall")}</p>
          <p className="mt-1 text-3xl font-semibold text-eco-navy">{overallPct}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-eco-surface">
            <div className="h-full rounded-full bg-eco-teal" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-eco-muted">{t("learn_cpdYtd")}</p>
          <p className="mt-1 text-3xl font-semibold text-eco-navy">{cpdYtd}</p>
          <p className="mt-2 text-[11px] text-eco-muted">
            {DEMO_CERTIFICATIONS.filter((c) => c.status === "in_progress").length} programmes
            active
          </p>
        </div>
        <div className="rounded-xl border border-eco-teal/30 bg-eco-teal-muted/40 p-4 shadow-sm">
          <p className="text-xs font-medium text-eco-teal-dark">{t("learn_hrOpenItems")}</p>
          <p className="mt-1 text-3xl font-semibold text-eco-navy">{hrOpenItems}</p>
          <Link
            href="#hr-ld"
            className="mt-2 inline-block text-[11px] font-semibold text-eco-teal-dark hover:underline"
          >
            {t("learn_openHr")} ↓
          </Link>
        </div>
      </div>

      <section
        id="learn-programmes"
        ref={programmesRef}
        className="rounded-xl border border-eco-border bg-white p-5 shadow-sm"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-eco-navy">{t("learn_programmes")}</h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-eco-muted">
              {t("learn_programmesSub")}
            </p>
          </div>
          {domainFilter && (
            <button
              type="button"
              onClick={() => {
                setDomainFilter(null);
                setHighlightCertId(null);
              }}
              className="rounded-full border border-eco-border px-3 py-1 text-xs font-medium text-eco-teal-dark hover:bg-eco-surface"
            >
              Clear filter · {t(domainKey(domainFilter))}
            </button>
          )}
        </div>
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {visibleCerts.map((cert) => (
            <li
              key={cert.id}
              className={`flex flex-col rounded-xl border bg-eco-surface/30 p-4 transition hover:border-eco-teal/40 hover:shadow-md ${
                highlightCertId === cert.id
                  ? "border-eco-teal ring-2 ring-eco-teal/30"
                  : "border-eco-border"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug text-eco-navy">{cert.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-eco-muted">{cert.subtitle}</p>
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
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-eco-muted">
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
                    className="rounded-full bg-white px-2 py-0.5 text-[10px] text-eco-muted ring-1 ring-eco-border"
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
                    onClick={() => setHrModalOpen(true)}
                    className="rounded-full bg-eco-surface px-2 py-1 text-[10px] font-medium text-eco-muted hover:text-eco-navy"
                  >
                    {t("learn_hrOnly")}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm lg:col-span-3">
          <h2 className="text-sm font-semibold text-eco-navy">{t("learn_progress")}</h2>
          <p className="mt-1 text-xs text-eco-muted">{t("learn_progressSub")}</p>
          <ul className="mt-5 space-y-4">
            {DOMAIN_PROGRESS.map((d) => {
              const onTarget = d.pct >= d.targetPct;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => focusDomain(d.id)}
                    className="w-full rounded-lg border border-eco-border bg-eco-surface/40 p-3 text-left transition hover:border-eco-teal/50 hover:bg-eco-teal-muted/20"
                  >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-eco-ink">{t(domainKey(d.id))}</span>
                    <span className="text-xs text-eco-muted">
                      {d.pct}% · {t("learn_target")} {d.targetPct}%
                    </span>
                  </div>
                  <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-eco-surface">
                    <div
                      className="absolute inset-y-0 left-0 w-px bg-slate-400"
                      style={{ left: `${d.targetPct}%` }}
                      title={`${t("learn_target")} ${d.targetPct}%`}
                    />
                    <div
                      className={`h-full rounded-full ${onTarget ? "bg-emerald-600" : "bg-eco-teal"}`}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-eco-muted">
                    <span className="font-medium text-eco-ink">{t("learn_gap")}:</span> {d.gapNote}
                  </p>
                  <p className="mt-0.5 text-[10px] text-eco-muted">
                    {t("learn_lastActivity")}: {d.lastActivity}
                  </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm lg:col-span-2">
          <CompetencyRadar domains={DOMAIN_PROGRESS} t={t} />
        </section>
      </div>

      <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-eco-navy">{t("learn_careerTitle")}</h2>
        <p className="mt-1 text-xs text-eco-muted">{t("learn_careerSub")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CAREER_PATHS.map((path) => (
            <button
              key={path.id}
              type="button"
              onClick={() => setSelectedPath(path.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selectedPath === path.id
                  ? "border-eco-navy bg-eco-navy text-white"
                  : "border-eco-border bg-white text-eco-muted hover:border-eco-teal/50"
              }`}
            >
              {t(clusterKey(path.cluster))}
              {path.isCurrent ? ` · ${t("learn_currentPath")}` : ""}
            </button>
          ))}
        </div>
        <article className="mt-5 rounded-xl border border-eco-border bg-gradient-to-br from-eco-surface to-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-eco-teal-dark">
                {t(clusterKey(activePath.cluster))}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-eco-navy">{activePath.title}</h3>
              <p className="mt-1 text-sm text-eco-muted">{activePath.level}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-eco-navy">{activePath.completionPct}%</p>
              <p className="text-[11px] text-eco-muted">{t("learn_viewPath")}</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-eco-ink">
            {t("learn_nextMilestone")}: {activePath.nextMilestone}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-eco-surface">
            <div
              className="h-full rounded-full bg-eco-navy"
              style={{ width: `${activePath.completionPct}%` }}
            />
          </div>
          <ul className="mt-4 space-y-2 text-xs text-eco-muted">
            {activePath.requirements.map((req) => (
              <li key={req} className="flex gap-2">
                <span className="text-eco-teal">✓</span>
                {req}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => showToast(t("learn_toast_path"))}
            className="mt-4 rounded-lg border border-eco-navy bg-white px-4 py-2 text-xs font-semibold text-eco-navy hover:bg-eco-surface"
          >
            {t("learn_enrolPath")}
          </button>
        </article>
      </section>

      <section
        id="hr-ld"
        className={`rounded-xl border bg-white p-5 shadow-sm transition ${
          syncFlash ? "border-emerald-400 ring-2 ring-emerald-100" : "border-eco-border"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-eco-navy">{t("learn_hrTitle")}</h2>
            <p className="mt-1 max-w-2xl text-xs text-eco-muted">{t("learn_hrSub")}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {t("learn_hrSso")}
          </span>
        </div>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-eco-border bg-eco-surface/50 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase text-eco-muted">{t("learn_hrSync")}</dt>
            <dd className="mt-1 text-sm font-medium text-eco-navy">
              {syncFlash ? "Just now ✓" : lastSync}
            </dd>
          </div>
          <div className="rounded-lg border border-eco-border bg-eco-surface/50 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase text-eco-muted">{t("learn_hrPlan")}</dt>
            <dd className="mt-1 text-sm font-medium text-eco-ink">{HR_LD_INTEGRATION.assignedPlan}</dd>
          </div>
          <div className="rounded-lg border border-eco-border bg-eco-surface/50 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase text-eco-muted">
              {t("learn_hrFramework")}
            </dt>
            <dd className="mt-1 text-sm font-medium text-eco-ink">
              {HR_LD_INTEGRATION.careerFramework}
            </dd>
          </div>
          <div className="rounded-lg border border-eco-border bg-eco-surface/50 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase text-eco-muted">Employee ID</dt>
            <dd className="mt-1 text-sm font-medium text-eco-ink">{HR_LD_INTEGRATION.employeeId}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSync}
            className="rounded-lg bg-eco-teal px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
          >
            {t("learn_hrSyncNow")}
          </button>
          <button
            type="button"
            onClick={() => setHrModalOpen(true)}
            className="rounded-lg border border-eco-border bg-white px-4 py-2.5 text-sm font-medium text-eco-navy hover:bg-eco-surface"
          >
            {t("learn_openHr")} — {HR_LD_INTEGRATION.platform}
          </button>
          <Link
            href="/rm/meeting"
            className="inline-flex items-center rounded-lg border border-dashed border-eco-border px-4 py-2.5 text-sm text-eco-teal-dark hover:bg-eco-surface"
          >
            {t("learn_launch")} → meeting mode
          </Link>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-eco-muted">{t("learn_hrWire")}</p>
      </section>

      {toast && <LearnToast message={toast} onDismiss={() => setToast(null)} />}

      {activeCert && certModal && (
        <LearningCertModal
          cert={activeCert}
          mode={certModal.mode}
          onClose={() => setCertModal(null)}
          onCompleteModule={handleCompleteModule}
        />
      )}

      {hrModalOpen && (
        <LearningHrModal onClose={() => setHrModalOpen(false)} onLaunch={launchHr} />
      )}
    </div>
  );
}
