export type HrSyncDirection = "to_hr" | "from_hr";

export interface HrSyncEvent {
  id: string;
  at: string;
  direction: HrSyncDirection;
  summary: string;
  status: "ok" | "pending" | "error";
}

export interface HrTranscriptRow {
  id: string;
  title: string;
  completedAt: string;
  cpdHours: number;
  source: "eProcess" | "Workday";
  certificateId: string;
}

export const DEMO_HR_SYNC_EVENTS: HrSyncEvent[] = [
  {
    id: "s1",
    at: "14 May 2026 · 07:15",
    direction: "from_hr",
    summary: "Assigned plan updated — Wealth RM uplift 2026",
    status: "ok",
  },
  {
    id: "s2",
    at: "13 May 2026 · 16:42",
    direction: "to_hr",
    summary: "Module complete · Suitability masterclass → transcript",
    status: "ok",
  },
  {
    id: "s3",
    at: "12 May 2026 · 09:08",
    direction: "to_hr",
    summary: "FPS Level I progress · 7/10 modules",
    status: "ok",
  },
  {
    id: "s4",
    at: "10 May 2026 · 14:20",
    direction: "from_hr",
    summary: "Mandatory assignment · Ethics refresher 2026",
    status: "ok",
  },
  {
    id: "s5",
    at: "08 May 2026 · 11:00",
    direction: "to_hr",
    summary: "Career framework v3.2 competency snapshot",
    status: "ok",
  },
];
