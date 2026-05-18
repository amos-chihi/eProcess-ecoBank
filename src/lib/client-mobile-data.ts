/** Mobile client channel — notifications, inbox, portfolio summary. */

export type MobileNotificationKind = "handoff" | "nudge" | "market" | "security" | "branch";

export interface MobileNotification {
  id: string;
  kind: MobileNotificationKind;
  titleKey: string;
  bodyKey: string;
  at: string;
  read: boolean;
  actionTab?: "goals" | "invest" | "messages";
  actionSheet?: "robo" | "funds" | "crosssell" | "insights";
}

export interface MobileMessageThread {
  id: string;
  from: "rm" | "branch" | "system";
  subjectKey: string;
  previewKey: string;
  at: string;
  unread: boolean;
  bodyKey: string;
}

export const MOBILE_PORTFOLIO = {
  totalValue: 245_600,
  dayChange: 1_240,
  dayChangePct: 0.51,
  lastUpdated: "Today 14:18",
};

export const MOBILE_ALLOCATION = [
  { labelKey: "mob_alloc_equity", pct: 52, color: "bg-eco-teal" },
  { labelKey: "mob_alloc_fixed", pct: 35, color: "bg-slate-400" },
  { labelKey: "mob_alloc_cash", pct: 13, color: "bg-amber-300" },
] as const;

export const MOBILE_NOTIFICATIONS: MobileNotification[] = [
  {
    id: "n-handoff",
    kind: "handoff",
    titleKey: "mob_notif_handoff_title",
    bodyKey: "mob_notif_handoff_body",
    at: "2 min ago",
    read: false,
    actionTab: "goals",
  },
  {
    id: "n-edu",
    kind: "nudge",
    titleKey: "mob_notif_nudge_title",
    bodyKey: "mob_notif_nudge_body",
    at: "1 hr ago",
    read: false,
    actionTab: "messages",
  },
  {
    id: "n-robo",
    kind: "market",
    titleKey: "mob_notif_robo_title",
    bodyKey: "mob_notif_robo_body",
    at: "Today 09:15",
    read: false,
    actionTab: "invest",
    actionSheet: "robo",
  },
  {
    id: "n-rebal",
    kind: "market",
    titleKey: "mob_notif_rebal_title",
    bodyKey: "mob_notif_rebal_body",
    at: "Yesterday",
    read: true,
    actionTab: "invest",
  },
  {
    id: "n-xs",
    kind: "nudge",
    titleKey: "mob_notif_xs_title",
    bodyKey: "mob_notif_xs_body",
    at: "Yesterday",
    read: false,
    actionSheet: "crosssell",
  },
  {
    id: "n-branch",
    kind: "branch",
    titleKey: "mob_notif_branch_title",
    bodyKey: "mob_notif_branch_body",
    at: "12 May",
    read: true,
    actionTab: "messages",
  },
  {
    id: "n-device",
    kind: "security",
    titleKey: "mob_notif_security_title",
    bodyKey: "mob_notif_security_body",
    at: "10 May",
    read: true,
  },
];

export const MOBILE_MESSAGE_THREADS: MobileMessageThread[] = [
  {
    id: "t-rm",
    from: "rm",
    subjectKey: "mob_msg_rm_subject",
    previewKey: "mob_msg_rm_preview",
    at: "Today 11:20",
    unread: true,
    bodyKey: "mob_msg_rm_body",
  },
  {
    id: "t-branch",
    from: "branch",
    subjectKey: "mob_msg_branch_subject",
    previewKey: "mob_msg_branch_preview",
    at: "11 May",
    unread: false,
    bodyKey: "mob_msg_branch_body",
  },
  {
    id: "t-system",
    from: "system",
    subjectKey: "mob_msg_system_subject",
    previewKey: "mob_msg_system_preview",
    at: "8 May",
    unread: false,
    bodyKey: "mob_msg_system_body",
  },
];

export const MOBILE_INSIGHTS = [
  { titleKey: "mob_insight_1_title", bodyKey: "mob_insight_1_body", tagKey: "mob_insight_tag_risk" },
  { titleKey: "mob_insight_2_title", bodyKey: "mob_insight_2_body", tagKey: "mob_insight_tag_nudge" },
  { titleKey: "mob_insight_3_title", bodyKey: "mob_insight_3_body", tagKey: "mob_insight_tag_alloc" },
] as const;

export const HANDOFF_RECAP_BULLETS = [
  "mob_handoff_b1",
  "mob_handoff_b2",
  "mob_handoff_b3",
] as const;
