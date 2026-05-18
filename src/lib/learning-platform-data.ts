import type { CertStatus } from "@/lib/demo-data";

export type CoursePublishStatus =
  | "draft"
  | "in_review"
  | "scheduled"
  | "published"
  | "archived";

export type LearningDomain =
  | "ethics"
  | "planning"
  | "risk"
  | "investment"
  | "estate";

export interface DemoCourseCatalogItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  domains: LearningDomain[];
  cpdRequired: number;
  modulesTotal: number;
  embeddedInApp: boolean;
  mandatory: boolean;
  regions: string[];
  version: string;
  author: string;
  lastEdited: string;
  publishStatus: CoursePublishStatus;
  scheduledFor?: string;
  publishedAt?: string;
  publishedBy?: string;
  reviewNotes?: string;
}

export interface DemoRmEnrollment {
  courseId: string;
  status: CertStatus;
  progressPct: number;
  cpdEarned: number;
  modulesDone: number;
  dueLabel?: string;
}

export interface LearningAuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  courseId: string;
  courseTitle: string;
}

export const DEMO_COURSE_CATALOG: DemoCourseCatalogItem[] = [
  {
    id: "fps-l1",
    code: "FPS-L1",
    title: "Financial Planning Specialist — Level I",
    subtitle: "Core planning methodology · SMART goals · suitability foundations",
    domains: ["planning", "ethics", "risk"],
    cpdRequired: 35,
    modulesTotal: 10,
    embeddedInApp: true,
    mandatory: true,
    regions: ["GH", "NG", "KE"],
    version: "3.1",
    author: "Group L&D · Wealth",
    lastEdited: "12 May 2026",
    publishStatus: "published",
    publishedAt: "1 Jan 2026",
    publishedBy: "Fatima Okonkwo",
  },
  {
    id: "fps-l2",
    code: "FPS-L2",
    title: "Financial Planning Specialist — Level II",
    subtitle: "Advanced simulations · multi-goal portfolios · tax-aware planning",
    domains: ["planning", "investment", "risk"],
    cpdRequired: 40,
    modulesTotal: 12,
    embeddedInApp: true,
    mandatory: false,
    regions: ["Group"],
    version: "2.0",
    author: "Group L&D · Wealth",
    lastEdited: "8 May 2026",
    publishStatus: "published",
    publishedAt: "15 Mar 2026",
    publishedBy: "Fatima Okonkwo",
  },
  {
    id: "suit-master",
    code: "SUIT-MC",
    title: "Suitability & appropriateness masterclass",
    subtitle: "Regulatory prompts · complex products · regional disclosure packs",
    domains: ["ethics", "risk"],
    cpdRequired: 12,
    modulesTotal: 6,
    embeddedInApp: true,
    mandatory: true,
    regions: ["Group"],
    version: "4.2",
    author: "Compliance Academy",
    lastEdited: "20 Apr 2026",
    publishStatus: "published",
    publishedAt: "1 Feb 2026",
    publishedBy: "Compliance Academy",
  },
  {
    id: "estate-ess",
    code: "EST-AF",
    title: "Estate & succession essentials — Africa",
    subtitle: "Household structures · beneficiaries · cross-border estates",
    domains: ["estate", "planning"],
    cpdRequired: 18,
    modulesTotal: 8,
    embeddedInApp: true,
    mandatory: true,
    regions: ["GH", "CI", "SN"],
    version: "1.4",
    author: "Group L&D · Wealth",
    lastEdited: "5 May 2026",
    publishStatus: "published",
    publishedAt: "10 Feb 2026",
    publishedBy: "Fatima Okonkwo",
  },
  {
    id: "invest-af",
    code: "INV-AF",
    title: "Investment advisory — African markets",
    subtitle: "Multi-currency sleeves · UEMOA / ECOWAS product landscape",
    domains: ["investment", "risk"],
    cpdRequired: 22,
    modulesTotal: 7,
    embeddedInApp: true,
    mandatory: false,
    regions: ["Group"],
    version: "2.3",
    author: "Markets Academy",
    lastEdited: "28 Apr 2026",
    publishStatus: "published",
    publishedAt: "1 Mar 2026",
    publishedBy: "Markets Academy",
  },
  {
    id: "ethics-refresh",
    code: "ETH-26",
    title: "Ethics & conduct refresher 2026",
    subtitle: "Group code · conflicts · client data handling",
    domains: ["ethics"],
    cpdRequired: 4,
    modulesTotal: 2,
    embeddedInApp: false,
    mandatory: true,
    regions: ["Group"],
    version: "1.0",
    author: "Compliance Academy",
    lastEdited: "1 May 2026",
    publishStatus: "published",
    publishedAt: "1 Apr 2026",
    publishedBy: "Compliance Academy",
  },
  {
    id: "islamic-plan",
    code: "ISL-PLN",
    title: "Islamic finance planning foundations",
    subtitle: "Sharia-compliant goals · profit-sharing constructs · disclosure variants",
    domains: ["planning", "ethics"],
    cpdRequired: 16,
    modulesTotal: 5,
    embeddedInApp: true,
    mandatory: false,
    regions: ["NG", "SN", "CI"],
    version: "0.9",
    author: "Regional L&D · West Africa",
    lastEdited: "14 May 2026",
    publishStatus: "draft",
    reviewNotes: "Awaiting Sharia board sign-off on module 3 scenarios.",
  },
  {
    id: "uemoa-tax",
    code: "UEM-TAX",
    title: "UEMOA tax-aware planning pack",
    subtitle: "IRPP modelling · francophone disclosure alignment · cross-border flows",
    domains: ["planning", "risk"],
    cpdRequired: 14,
    modulesTotal: 6,
    embeddedInApp: true,
    mandatory: false,
    regions: ["CI", "SN", "BF"],
    version: "1.0-rc",
    author: "Regional L&D · Francophone",
    lastEdited: "13 May 2026",
    publishStatus: "in_review",
    reviewNotes: "Submitted for group compliance review · due 20 May.",
  },
  {
    id: "sr-leadership",
    code: "SRM-LEAD",
    title: "Senior RM leadership & coaching",
    subtitle: "Team supervision · quality assurance · client escalation protocols",
    domains: ["ethics", "planning"],
    cpdRequired: 20,
    modulesTotal: 8,
    embeddedInApp: true,
    mandatory: false,
    regions: ["Group"],
    version: "1.0",
    author: "Group L&D · Leadership",
    lastEdited: "10 May 2026",
    publishStatus: "scheduled",
    scheduledFor: "1 Jul 2026",
    reviewNotes: "Approved · auto-publish on go-live date.",
  },
  {
    id: "legacy-2024",
    code: "LEG-24",
    title: "Legacy product suite certification 2024",
    subtitle: "Superseded product catalogue · archival reference only",
    domains: ["investment"],
    cpdRequired: 8,
    modulesTotal: 4,
    embeddedInApp: false,
    mandatory: false,
    regions: ["Group"],
    version: "1.0",
    author: "Group L&D",
    lastEdited: "1 Jan 2025",
    publishStatus: "archived",
    publishedAt: "1 Jun 2024",
    publishedBy: "System migration",
  },
];

export const DEMO_RM_ENROLLMENTS: DemoRmEnrollment[] = [
  {
    courseId: "fps-l1",
    status: "in_progress",
    progressPct: 68,
    cpdEarned: 24,
    modulesDone: 7,
    dueLabel: "Complete by 30 Jun 2026",
  },
  {
    courseId: "fps-l2",
    status: "available",
    progressPct: 0,
    cpdEarned: 0,
    modulesDone: 0,
  },
  {
    courseId: "suit-master",
    status: "completed",
    progressPct: 100,
    cpdEarned: 12,
    modulesDone: 6,
  },
  {
    courseId: "estate-ess",
    status: "required",
    progressPct: 12,
    cpdEarned: 2,
    modulesDone: 1,
    dueLabel: "Mandatory · due 15 Aug 2026",
  },
  {
    courseId: "invest-af",
    status: "in_progress",
    progressPct: 41,
    cpdEarned: 9,
    modulesDone: 3,
  },
  {
    courseId: "ethics-refresh",
    status: "required",
    progressPct: 0,
    cpdEarned: 0,
    modulesDone: 0,
    dueLabel: "Overdue · complete this week",
  },
];

export const DEMO_LEARNING_AUDIT: LearningAuditEntry[] = [
  {
    id: "a1",
    at: "14 May 2026 · 09:12",
    actor: "Fatima Okonkwo",
    action: "Published",
    courseId: "ethics-refresh",
    courseTitle: "Ethics & conduct refresher 2026",
  },
  {
    id: "a2",
    at: "13 May 2026 · 16:40",
    actor: "Regional L&D · Francophone",
    action: "Submitted for review",
    courseId: "uemoa-tax",
    courseTitle: "UEMOA tax-aware planning pack",
  },
  {
    id: "a3",
    at: "10 May 2026 · 11:05",
    actor: "Group L&D · Leadership",
    action: "Scheduled publish",
    courseId: "sr-leadership",
    courseTitle: "Senior RM leadership & coaching",
  },
];
