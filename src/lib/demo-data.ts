/** Mock data for the eProcess prototype — replace with CRM / core APIs later. */

import type { DemoMsgKey } from "./demo-i18n";

export type LanguageCode = "en" | "fr" | "pt";

export interface DemoGoal {
  id: string;
  type: "retirement" | "education" | "savings" | "risk";
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetYear: number;
  priority: "high" | "medium" | "low";
  microWins: string[];
}

export interface DemoClient {
  id: string;
  displayName: string;
  segment: string;
  region: string;
  cluster: "Anglophone" | "Francophone" | "Lusophone";
  language: LanguageCode;
  currency: string;
  householdLabel: string;
  crmSyncedAt: string;
  riskScore: number;
  riskLabel: string;
}

export const DEMO_CLIENT: DemoClient = {
  id: "c-gha-8821",
  displayName: "Akosua Mensah",
  segment: "Affluent — Accra Metro",
  region: "Ghana",
  cluster: "Anglophone",
  language: "en",
  currency: "GHS",
  householdLabel: "Mensah household (joint + dependent)",
  crmSyncedAt: "Today 09:42",
  riskScore: 62,
  riskLabel: "Balanced growth",
};

export const DEMO_GOALS: DemoGoal[] = [
  {
    id: "g-ret",
    type: "retirement",
    title: "Comfortable retirement",
    targetAmount: 2_400_000,
    currentAmount: 312_000,
    targetYear: 2046,
    priority: "high",
    microWins: ["Emergency buffer met", "First 10% of goal funded"],
  },
  {
    id: "g-edu",
    type: "education",
    title: "University fund — Kofi",
    targetAmount: 420_000,
    currentAmount: 118_500,
    targetYear: 2032,
    priority: "high",
    microWins: ["RECURRING: +GHS 2,500/mo"],
  },
  {
    id: "g-save",
    type: "savings",
    title: "Home upgrade",
    targetAmount: 180_000,
    currentAmount: 45_000,
    targetYear: 2029,
    priority: "medium",
    microWins: [],
  },
];

export const HOLDINGS_MOCK = [
  { name: "Ghana Tier-1 Equity Fund", value: 128_400, source: "Core" },
  { name: "Money market — GHS", value: 52_300, source: "Core" },
  { name: "Offshore diversification sleeve", value: 64_900, source: "Wealth" },
];

export const INTEGRATIONS_MOCK: {
  systemKey: DemoMsgKey;
  status: "ok" | "warn";
  detail: string;
}[] = [
  {
    systemKey: "int_crm",
    status: "ok",
    detail: "Last sync 09:41",
  },
  {
    systemKey: "int_core",
    status: "ok",
    detail: "Positions T+1",
  },
  {
    systemKey: "int_risk",
    status: "warn",
    detail: "Stale: refresh in session",
  },
  {
    systemKey: "int_nudge",
    status: "ok",
    detail: "Push enabled",
  },
];

export type DemoComplianceRow = {
  id: "suit" | "aff" | "approp" | "disc" | "tax" | "consent";
  done: boolean;
};

export const COMPLIANCE_CHECKS: DemoComplianceRow[] = [
  { id: "suit", done: true },
  { id: "aff", done: true },
  { id: "approp", done: false },
  { id: "disc", done: true },
  { id: "tax", done: true },
  { id: "consent", done: false },
];

export const AI_INSIGHTS = [
  {
    title: "Early warning",
    body: "Education goal funding pace is 12% behind target if contributions stay flat.",
    tag: "Risk",
  },
  {
    title: "Predictive nudge",
    body: "Increasing monthly education contribution by GHS 400 closes the gap by 2030.",
    tag: "Nudge",
  },
  {
    title: "Robo-style suggestion",
    body: "Extend fixed-income sleeve by 4% for retirement glidepath given proximity to life event.",
    tag: "Allocation",
  },
];

export const EARLY_WARNINGS: {
  id: string;
  severity: "attention" | "info";
  clientLabel: string;
  summaryKey: DemoMsgKey;
}[] = [
  {
    id: "w1",
    severity: "attention",
    clientLabel: DEMO_CLIENT.displayName,
    summaryKey: "warn_edu_gap",
  },
  {
    id: "w2",
    severity: "info",
    clientLabel: "Kwame Boateng",
    summaryKey: "warn_kyc",
  },
];

export interface DemoAgendaSlot {
  time: string;
  clientName: string;
  topicKey: DemoMsgKey;
  highlight?: boolean;
}

export const TODAY_AGENDA: DemoAgendaSlot[] = [
  {
    time: "10:00",
    clientName: DEMO_CLIENT.displayName,
    topicKey: "agenda_goal_review",
    highlight: true,
  },
  {
    time: "11:30",
    clientName: "Kwame Boateng",
    topicKey: "agenda_onboard",
  },
  {
    time: "14:15",
    clientName: "SME — North Ridge Ltd",
    topicKey: "agenda_sme",
  },
];

export const RM_TASKS: { id: string; labelKey: DemoMsgKey; urgent: boolean }[] = [
  { id: "tk1", labelKey: "task_appro", urgent: true },
  { id: "tk2", labelKey: "task_pdf", urgent: false },
  { id: "tk3", labelKey: "task_hr", urgent: false },
];

export interface TaxRuleRow {
  code: string;
  label: string;
  rateOrNote: string;
}

export interface DemoMarketProfile {
  id: string;
  country: string;
  cluster: DemoClient["cluster"];
  currencies: string;
  disclosurePackId: string;
  taxRules: TaxRuleRow[];
  planningFlows: string[];
}

export const MARKET_PROFILES: DemoMarketProfile[] = [
  {
    id: "gh",
    country: "Ghana",
    cluster: "Anglophone",
    currencies: "GHS (+ USD reporting sleeve)",
    disclosurePackId: "GH-WEALTH-2026-Q2",
    taxRules: [
      { code: "INC-PIT", label: "Personal income (planning assumptions)", rateOrNote: "Graduated bands — config-driven" },
      { code: "CGT", label: "Capital gains (listed)", rateOrNote: "Market-specific exemptions" },
      { code: "RET", label: "Retirement allowances", rateOrNote: "Tier‑2/Tier‑3 interplay (stub)" },
    ],
    planningFlows: ["Standard", "Islamic banking branch", "Multi-generational household"],
  },
  {
    id: "ci",
    country: "Côte d’Ivoire",
    cluster: "Francophone",
    currencies: "XOF (+ EUR sleeve)",
    disclosurePackId: "CI-UEMOA-WEALTH-2026-Q2",
    taxRules: [
      { code: "INC-IRPP", label: "IRPP modelling", rateOrNote: "Francophone spreadsheet pack" },
      { code: "CGT", label: "Mobilier / immobilier", rateOrNote: "Regional exemptions table" },
      { code: "RET", label: "Retraite", rateOrNote: "Public + complementary pillars" },
    ],
    planningFlows: ["Standard", "UMOA cross-border worker", "Family succession emphasis"],
  },
  {
    id: "ao",
    country: "Angola",
    cluster: "Lusophone",
    currencies: "AOA (+ USD reporting sleeve)",
    disclosurePackId: "AO-WEALTH-2026-Q2",
    taxRules: [
      { code: "INC-IRPS", label: "IRPS (planning)", rateOrNote: "Progressive modelling (stub)" },
      { code: "CGT", label: "Gains mobilários", rateOrNote: "Listed vs unlisted distinctions" },
      { code: "RET", label: "Pensões complementares", rateOrNote: "Employer pillar overlays" },
    ],
    planningFlows: ["Standard", "USD earner dual-currency", "Family office lite"],
  },
];

export interface ComplianceDocumentRow {
  id: string;
  title: string;
  clientName: string;
  generatedAt: string;
  state: "sealed" | "draft";
}

export const COMPLIANCE_DOCUMENTS: ComplianceDocumentRow[] = [
  {
    id: "d1",
    title: "Suitability & affordability worksheet",
    clientName: DEMO_CLIENT.displayName,
    generatedAt: "2026-05-13 16:40",
    state: "sealed",
  },
  {
    id: "d2",
    title: "Regional disclosure pack (GH)",
    clientName: DEMO_CLIENT.displayName,
    generatedAt: "2026-05-13 16:41",
    state: "sealed",
  },
  {
    id: "d3",
    title: "Structured product appropriateness (draft)",
    clientName: DEMO_CLIENT.displayName,
    generatedAt: "2026-05-14 08:05",
    state: "draft",
  },
];

export interface DemoHouseholdMember {
  id: string;
  name: string;
  relation: string;
  kycStatus: "clear" | "review";
  notes: string;
}

export const HOUSEHOLD_MEMBERS: DemoHouseholdMember[] = [
  {
    id: "p1",
    name: "Akosua Mensah",
    relation: "Primary · joint mandates",
    kycStatus: "clear",
    notes: "Primary digital banking ID · wealth advisory signer",
  },
  {
    id: "p2",
    name: "Kwabena Mensah",
    relation: "Joint owner",
    kycStatus: "clear",
    notes: "Branch channel preference · same household tax unit",
  },
  {
    id: "p3",
    name: "Kofi Mensah",
    relation: "Dependent (minor beneficiary)",
    kycStatus: "clear",
    notes: "Education goal beneficiary · guardians attested Q1 2026",
  },
];

export interface DemoSmeRelationship {
  legalName: string;
  roleSummary: string;
  industry: string;
  crmId: string;
  activeNeeds: string;
  annualTurnoverBracket: string;
}

/** Linked SME for complex household / treasury conversations (pillar 2). */
export type CertStatus = "completed" | "in_progress" | "required" | "available";

export interface DemoCertification {
  id: string;
  title: string;
  subtitle: string;
  status: CertStatus;
  progressPct: number;
  cpdEarned: number;
  cpdRequired: number;
  modulesDone: number;
  modulesTotal: number;
  /** Maps to domain progress keys */
  domains: ("ethics" | "planning" | "risk" | "investment" | "estate")[];
  dueLabel?: string;
  embeddedInApp: boolean;
}

export const DEMO_CERTIFICATIONS: DemoCertification[] = [
  {
    id: "fps-l1",
    title: "Financial Planning Specialist — Level I",
    subtitle: "Core planning methodology · SMART goals · suitability foundations",
    status: "in_progress",
    progressPct: 68,
    cpdEarned: 24,
    cpdRequired: 35,
    modulesDone: 7,
    modulesTotal: 10,
    domains: ["planning", "ethics", "risk"],
    dueLabel: "Complete by 30 Jun 2026",
    embeddedInApp: true,
  },
  {
    id: "fps-l2",
    title: "Financial Planning Specialist — Level II",
    subtitle: "Advanced simulations · multi-goal portfolios · tax-aware planning",
    status: "available",
    progressPct: 0,
    cpdEarned: 0,
    cpdRequired: 40,
    modulesDone: 0,
    modulesTotal: 12,
    domains: ["planning", "investment", "risk"],
    embeddedInApp: true,
  },
  {
    id: "suit-master",
    title: "Suitability & appropriateness masterclass",
    subtitle: "Regulatory prompts · complex products · regional disclosure packs",
    status: "completed",
    progressPct: 100,
    cpdEarned: 12,
    cpdRequired: 12,
    modulesDone: 6,
    modulesTotal: 6,
    domains: ["ethics", "risk"],
    embeddedInApp: true,
  },
  {
    id: "estate-ess",
    title: "Estate & succession essentials — Africa",
    subtitle: "Household structures · beneficiaries · cross-border estates",
    status: "required",
    progressPct: 12,
    cpdEarned: 2,
    cpdRequired: 18,
    modulesDone: 1,
    modulesTotal: 8,
    domains: ["estate", "planning"],
    dueLabel: "Mandatory · due 15 Aug 2026",
    embeddedInApp: true,
  },
  {
    id: "invest-af",
    title: "Investment advisory — African markets",
    subtitle: "Multi-currency sleeves · UEMOA / ECOWAS product landscape",
    status: "in_progress",
    progressPct: 41,
    cpdEarned: 9,
    cpdRequired: 22,
    modulesDone: 3,
    modulesTotal: 7,
    domains: ["investment", "risk"],
    embeddedInApp: true,
  },
  {
    id: "ethics-refresh",
    title: "Ethics & conduct refresher 2026",
    subtitle: "Group code · conflicts · client data handling",
    status: "required",
    progressPct: 0,
    cpdEarned: 0,
    cpdRequired: 4,
    modulesDone: 0,
    modulesTotal: 2,
    domains: ["ethics"],
    dueLabel: "Overdue · complete this week",
    embeddedInApp: false,
  },
];

export interface DemoDomainProgress {
  id: "ethics" | "planning" | "risk" | "investment" | "estate";
  pct: number;
  targetPct: number;
  gapNote: string;
  lastActivity: string;
}

export const DOMAIN_PROGRESS: DemoDomainProgress[] = [
  {
    id: "ethics",
    pct: 92,
    targetPct: 90,
    gapNote: "On track · refresher due",
    lastActivity: "Suitability masterclass · 13 May",
  },
  {
    id: "planning",
    pct: 78,
    targetPct: 85,
    gapNote: "FPS L1 in progress closes gap",
    lastActivity: "Goal pathways workshop · 10 May",
  },
  {
    id: "risk",
    pct: 64,
    targetPct: 80,
    gapNote: "Below target for Senior RM path",
    lastActivity: "Risk scenarios lab · 02 May",
  },
  {
    id: "investment",
    pct: 71,
    targetPct: 75,
    gapNote: "Near target · 1 module remaining",
    lastActivity: "African markets sleeve · 28 Apr",
  },
  {
    id: "estate",
    pct: 45,
    targetPct: 70,
    gapNote: "Priority uplift · required cert open",
    lastActivity: "Intro module · 15 Apr",
  },
];

export interface DemoCareerPath {
  id: string;
  cluster: "Anglophone" | "Francophone" | "Lusophone";
  title: string;
  level: string;
  isCurrent: boolean;
  nextMilestone: string;
  completionPct: number;
  requirements: string[];
}

export const CAREER_PATHS: DemoCareerPath[] = [
  {
    id: "gh-senior",
    cluster: "Anglophone",
    title: "Senior Relationship Manager · Wealth",
    level: "L2 → L3",
    isCurrent: true,
    nextMilestone: "FPS Level I + Risk ≥ 80%",
    completionPct: 72,
    requirements: [
      "FPS Level I certification",
      "Domain risk score ≥ 80%",
      "12 client planning sessions (YTD)",
    ],
  },
  {
    id: "gh-lead",
    cluster: "Anglophone",
    title: "Team Lead · Affluent & HNW",
    level: "L3 → L4",
    isCurrent: false,
    nextMilestone: "FPS Level II + Estate ≥ 70%",
    completionPct: 38,
    requirements: [
      "FPS Level II",
      "Estate planning cert complete",
      "Regional mentor assignment",
    ],
  },
  {
    id: "ci-regional",
    cluster: "Francophone",
    title: "Conseiller patrimonial · UEMOA",
    level: "Regional mobility",
    isCurrent: false,
    nextMilestone: "IRPP planning pack + FR disclosures",
    completionPct: 15,
    requirements: [
      "Francophone disclosure certification",
      "IRPP modelling module",
      "Minimum B2 French client-facing",
    ],
  },
  {
    id: "ao-diaspora",
    cluster: "Lusophone",
    title: "Wealth · dual-currency specialist",
    level: "Cross-border",
    isCurrent: false,
    nextMilestone: "USD earner planning flow",
    completionPct: 8,
    requirements: [
      "Lusophone product catalogue",
      "Dual-currency planning branch",
      "AOA / USD compliance pack",
    ],
  },
];

export const HR_LD_INTEGRATION = {
  platform: "Ecobank HR · Workday Learning",
  employeeId: "EMP-GH-44821",
  lastSync: "2026-05-14 07:15",
  syncStatus: "ok" as const,
  assignedPlan: "Wealth RM uplift 2026 — Ghana cluster",
  openItems: 3,
  careerFramework: "Group Wealth Advisory Framework v3.2",
  ssoEnabled: true,
};

export const LINKED_SME: DemoSmeRelationship = {
  legalName: "North Ridge Logistics Ltd",
  roleSummary: "Akosua Mensah beneficial owner · 42% shareholding (CRM verified)",
  industry: "Regional logistics & cold chain",
  crmId: "CRM-SME-7741",
  activeNeeds:
    "FX posture, revolving WC line, segregation of household vs SME cash",
  annualTurnoverBracket: "USD 2.8M–4.5M (planning bracket)",
};
