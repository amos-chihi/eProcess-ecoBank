/** Fund houses, cross-sell, robo proposals, integration catalog — capability gap fillers. */

export interface FundHouse {
  id: string;
  name: string;
  region: string;
  cutOff: string;
  navLag: string;
  fundsListed: number;
}

export interface CrossSellProduct {
  id: string;
  category: "savings" | "insurance" | "lending" | "wealth";
  name: string;
  fitReasonKey: string;
  suitabilityRequired: boolean;
}

export interface RoboProposal {
  id: string;
  clientId: string;
  createdAt: string;
  status: "pending" | "accepted" | "deferred";
  summaryKey: string;
  shifts: { sleeve: string; fromPct: number; toPct: number }[];
  confidence: number;
  ruleId: string;
}

export interface RoboAuditEntry {
  id: string;
  at: string;
  actionKey: string;
  actor: string;
}

export interface IntegrationModule {
  id: string;
  nameKey: string;
  domain: "crm" | "core" | "risk" | "wealth" | "hr" | "nudge";
  protocol: string;
  events: string[];
  status: "live" | "beta" | "planned";
  version: string;
}

export const FUND_HOUSES: FundHouse[] = [
  {
    id: "fh-eco-am",
    name: "Ecobank Asset Management",
    region: "Pan-Africa",
    cutOff: "14:00 GMT · T+1",
    navLag: "NAV T+1",
    fundsListed: 24,
  },
  {
    id: "fh-databank",
    name: "Databank · ARM",
    region: "Ghana",
    cutOff: "13:30 GMT · same day",
    navLag: "NAV T+0",
    fundsListed: 12,
  },
  {
    id: "fh-umb",
    name: "UMB Investment Holdings",
    region: "Ghana · UEMOA",
    cutOff: "15:00 GMT · T+1",
    navLag: "NAV T+1",
    fundsListed: 8,
  },
  {
    id: "fh-offshore",
    name: "Offshore partner · Luxembourg feeder",
    region: "International",
    cutOff: "11:00 CET · T+2",
    navLag: "NAV T+2",
    fundsListed: 6,
  },
];

export const CROSS_SELL_PRODUCTS: CrossSellProduct[] = [
  {
    id: "xs-save-plus",
    category: "savings",
    name: "Ecobank SavePlus — goal-linked",
    fitReasonKey: "xs_fit_save",
    suitabilityRequired: false,
  },
  {
    id: "xs-life-edu",
    category: "insurance",
    name: "Ecobank Life — education rider",
    fitReasonKey: "xs_fit_insurance",
    suitabilityRequired: true,
  },
  {
    id: "xs-mortgage-top",
    category: "lending",
    name: "Mortgage top-up — diaspora channel",
    fitReasonKey: "xs_fit_lending",
    suitabilityRequired: true,
  },
  {
    id: "xs-structured",
    category: "wealth",
    name: "Structured note — income series",
    fitReasonKey: "xs_fit_structured",
    suitabilityRequired: true,
  },
];

export const ROBO_PROPOSAL: RoboProposal = {
  id: "robo-2026-05-001",
  clientId: "c-gha-8821",
  createdAt: "15 May 2026 · 09:15",
  status: "pending",
  summaryKey: "robo_summary_main",
  shifts: [
    { sleeve: "Retirement", fromPct: 44, toPct: 41 },
    { sleeve: "Retirement", fromPct: 48, toPct: 52 },
    { sleeve: "Education", fromPct: 28, toPct: 30 },
  ],
  confidence: 0.87,
  ruleId: "GLIDEPATH-DRIFT-v3",
};

export const ROBO_AUDIT_LOG: RoboAuditEntry[] = [
  { id: "a1", at: "15 May 09:15", actionKey: "robo_audit_generated", actor: "Rules engine" },
  { id: "a2", at: "14 May 16:40", actionKey: "robo_audit_deferred", actor: "Amos Chihi (RM)" },
  { id: "a3", at: "10 May 11:02", actionKey: "robo_audit_accepted", actor: "Amos Chihi (RM)" },
];

export const INTEGRATION_MODULES: IntegrationModule[] = [
  {
    id: "mod-crm",
    nameKey: "int_mod_crm",
    domain: "crm",
    protocol: "REST · OAuth2",
    events: ["client.updated", "goal.created", "meeting.logged"],
    status: "live",
    version: "v2.4",
  },
  {
    id: "mod-core",
    nameKey: "int_mod_core",
    domain: "core",
    protocol: "ISO 20022 · REST",
    events: ["position.sync", "payment.settled"],
    status: "live",
    version: "v1.8",
  },
  {
    id: "mod-risk",
    nameKey: "int_mod_risk",
    domain: "risk",
    protocol: "REST · gRPC",
    events: ["risk.score", "limit.breach"],
    status: "live",
    version: "v3.1",
  },
  {
    id: "mod-wealth",
    nameKey: "int_mod_wealth",
    domain: "wealth",
    protocol: "REST",
    events: ["order.placed", "nav.published", "rebalance.proposed"],
    status: "live",
    version: "v2.0",
  },
  {
    id: "mod-fund",
    nameKey: "int_mod_fund",
    domain: "wealth",
    protocol: "REST · SFTP (NAV)",
    events: ["fundhouse.cutoff", "factsheet.published"],
    status: "beta",
    version: "v0.9",
  },
  {
    id: "mod-hr",
    nameKey: "int_mod_hr",
    domain: "hr",
    protocol: "REST · Workday",
    events: ["cert.completed", "assignment.due"],
    status: "live",
    version: "v1.2",
  },
  {
    id: "mod-nudge",
    nameKey: "int_mod_nudge",
    domain: "nudge",
    protocol: "REST · push gateway",
    events: ["nudge.sent", "handoff.delivered"],
    status: "live",
    version: "v1.5",
  },
  {
    id: "mod-robo",
    nameKey: "int_mod_robo",
    domain: "risk",
    protocol: "Event bus",
    events: ["robo.proposal", "robo.accepted", "robo.deferred"],
    status: "beta",
    version: "v0.4",
  },
];
