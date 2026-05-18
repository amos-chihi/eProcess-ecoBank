import type { CertStatus, DemoCertification, DemoDomainProgress } from "@/lib/demo-data";
import { HR_LD_INTEGRATION } from "@/lib/demo-data";

export type TranscriptSource = "eProcess" | "Workday";

export interface TranscriptModuleLine {
  index: number;
  title: string;
  completedAt: string | null;
}

export interface TranscriptEntry {
  id: string;
  programmeTitle: string;
  subtitle: string;
  status: CertStatus;
  certificateId: string | null;
  issuedAt: string | null;
  startedAt: string;
  cpdEarned: number;
  cpdRequired: number;
  modulesDone: number;
  modulesTotal: number;
  source: TranscriptSource;
  domains: DemoDomainProgress["id"][];
  result: string;
  modules: TranscriptModuleLine[];
}

const COMPLETION_DATES: Record<string, string> = {
  "suit-master": "13 May 2026",
  "fps-l1": "—",
  "fps-l2": "—",
  "estate-ess": "—",
  "invest-af": "—",
  "ethics-refresh": "—",
};

const START_DATES: Record<string, string> = {
  "fps-l1": "3 Jan 2026",
  "fps-l2": "—",
  "suit-master": "12 Feb 2026",
  "estate-ess": "15 Apr 2026",
  "invest-af": "28 Apr 2026",
  "ethics-refresh": "—",
};

const MODULE_TITLES: Record<string, string[]> = {
  "fps-l1": [
    "Welcome & programme overview",
    "Ecobank advisory standards",
    "SMART goals — specific & measurable",
    "SMART goals — achievable & relevant",
    "Suitability foundations",
    "Risk profiling in practice",
    "Household & joint mandates",
    "Goal pathways & simulations",
    "Regional policy addendum",
    "FPS Level I assessment prep",
  ],
  "suit-master": [
    "Regulatory landscape",
    "Complex products",
    "Regional disclosure packs",
    "Appropriateness workflows",
    "Case study assessment",
    "Attestation & sign-off",
  ],
  default: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"],
};

function moduleLines(cert: DemoCertification): TranscriptModuleLine[] {
  const titles = MODULE_TITLES[cert.id] ?? MODULE_TITLES.default;
  return titles.slice(0, cert.modulesTotal).map((title, i) => ({
    index: i + 1,
    title,
    completedAt:
      i < cert.modulesDone
        ? cert.status === "completed"
          ? COMPLETION_DATES[cert.id] ?? "2026"
          : "May 2026"
        : null,
  }));
}

export function buildTranscriptEntries(certs: DemoCertification[]): TranscriptEntry[] {
  return certs.map((cert) => {
    const completed = cert.status === "completed";
    return {
      id: cert.id,
      programmeTitle: cert.title,
      subtitle: cert.subtitle,
      status: cert.status,
      certificateId: completed ? `CERT-${cert.id.toUpperCase()}-2026` : null,
      issuedAt: completed ? COMPLETION_DATES[cert.id] ?? "2026" : null,
      startedAt: START_DATES[cert.id] ?? "2026",
      cpdEarned: cert.cpdEarned,
      cpdRequired: cert.cpdRequired,
      modulesDone: cert.modulesDone,
      modulesTotal: cert.modulesTotal,
      source: cert.embeddedInApp ? "eProcess" : "Workday",
      domains: cert.domains,
      result: completed ? "Pass" : cert.status === "in_progress" ? "In progress" : "Not started",
      modules: moduleLines(cert),
    };
  });
}

export const TRANSCRIPT_PROFILE = {
  employeeName: "Amos Chihi",
  employeeId: HR_LD_INTEGRATION.employeeId,
  assignedPlan: HR_LD_INTEGRATION.assignedPlan,
  framework: HR_LD_INTEGRATION.careerFramework,
  generatedAt: "18 May 2026 · 14:32 GMT",
  transcriptRef: "TR-GH-44821-2026",
};
