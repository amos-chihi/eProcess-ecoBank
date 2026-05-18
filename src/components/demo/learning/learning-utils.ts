import type { DemoMsgKey } from "@/lib/demo-i18n";
import type { CertStatus, DemoCareerPath, DemoCertification, DemoDomainProgress } from "@/lib/demo-data";

export function recalcCert(cert: DemoCertification): DemoCertification {
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

export function advanceCert(cert: DemoCertification): DemoCertification {
  if (cert.status === "completed") return cert;
  const modulesDone = Math.min(cert.modulesDone + 1, cert.modulesTotal);
  return recalcCert({ ...cert, modulesDone });
}

export function domainKey(id: DemoDomainProgress["id"]): DemoMsgKey {
  const map: Record<DemoDomainProgress["id"], DemoMsgKey> = {
    ethics: "learn_dom_ethics",
    planning: "learn_dom_planning",
    risk: "learn_dom_risk",
    investment: "learn_dom_invest",
    estate: "learn_dom_estate",
  };
  return map[id];
}

export function statusKey(status: CertStatus): DemoMsgKey {
  const map: Record<CertStatus, DemoMsgKey> = {
    completed: "learn_status_completed",
    in_progress: "learn_status_in_progress",
    required: "learn_status_required",
    available: "learn_status_available",
  };
  return map[status];
}

export function statusStyles(status: CertStatus) {
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

export function clusterKey(cluster: DemoCareerPath["cluster"]): DemoMsgKey {
  const map: Record<DemoCareerPath["cluster"], DemoMsgKey> = {
    Anglophone: "learn_cluster_anglo",
    Francophone: "learn_cluster_franco",
    Lusophone: "learn_cluster_luso",
  };
  return map[cluster];
}

export const LEARNING_ROUTES = [
  { href: "/rm/learning", key: "nav_learn_overview" as const, exact: true },
  { href: "/rm/learning/programmes", key: "nav_learn_programmes" as const },
  { href: "/rm/learning/assignments", key: "nav_learn_assignments" as const },
  { href: "/rm/learning/upcoming", key: "nav_learn_upcoming" as const },
  { href: "/rm/learning/competencies", key: "nav_learn_competencies" as const },
  { href: "/rm/learning/career-paths", key: "nav_learn_career" as const },
  { href: "/rm/learning/transcript", key: "nav_learn_transcript" as const },
  { href: "/rm/learning/hr-portal", key: "nav_learn_hr" as const },
] as const;

export function isLearningPath(pathname: string | null) {
  return pathname === "/rm/learn" || (pathname?.startsWith("/rm/learning") ?? false);
}
