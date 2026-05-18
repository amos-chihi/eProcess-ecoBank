"use client";

import { useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoMsgKey } from "@/lib/demo-i18n";
import { DEMO_CLIENT, DEMO_GOALS, type DemoGoal } from "@/lib/demo-data";
import {
  HANDOFF_RECAP_BULLETS,
  MOBILE_NOTIFICATIONS,
  MOBILE_PORTFOLIO,
  type MobileNotification,
} from "@/lib/client-mobile-data";
import { formatGhs } from "@/lib/format";

type TopSeg = "overview" | "notifications";

function goalPct(g: DemoGoal) {
  return Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
}

export function MobileGoalsView({
  top,
  showHandoffBanner,
  onDismissHandoff,
  onNavigateTab,
  onSelectGoal,
}: {
  top: TopSeg;
  showHandoffBanner: boolean;
  onDismissHandoff: () => void;
  onNavigateTab: (tab: "invest" | "messages") => void;
  onSelectGoal: (goal: DemoGoal) => void;
}) {
  const { t } = useDemoLocale();
  const [handoffExpanded, setHandoffExpanded] = useState(false);
  const [notifications, setNotifications] = useState(MOBILE_NOTIFICATIONS);

  const primary = DEMO_GOALS.find((g) => g.type === "retirement")!;
  const others = DEMO_GOALS.filter((g) => g.id !== primary.id);
  const c = DEMO_CLIENT;
  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (top === "notifications") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-eco-muted">{t("mob_notif_heading")}</p>
          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-[11px] font-semibold text-eco-teal-dark"
            >
              {t("mob_notif_mark_read")}
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              item={n}
              onOpen={() => {
                setNotifications((prev) =>
                  prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                );
                if (n.actionTab === "invest") onNavigateTab("invest");
                else if (n.actionTab === "messages") onNavigateTab("messages");
              }}
            />
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onNavigateTab("messages")}
          className="flex min-h-11 w-full items-center justify-between rounded-xl border border-eco-border bg-white px-4 py-3 text-left text-sm font-medium text-eco-navy"
        >
          <span>
            <span className="block font-semibold">{t("mob_notif_whatsapp")}</span>
            <span className="text-[11px] font-normal text-eco-muted">{t("mob_notif_whatsapp_sub")}</span>
          </span>
          <span className="text-eco-teal-dark">→</span>
        </button>
      </div>
    );
  }

  return (
  <>
      {showHandoffBanner && (
        <div className="mb-4 rounded-xl border border-eco-teal/40 bg-eco-teal-muted/60 p-3 text-xs text-eco-teal-dark">
          <strong className="block text-sm">{t("mob_handoff_title")}</strong>
          <p className="mt-1 leading-relaxed">{t("mob_handoff_body")}</p>
          {handoffExpanded && (
            <ul className="mt-3 list-disc space-y-1 pl-4 text-[11px]">
              {HANDOFF_RECAP_BULLETS.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setHandoffExpanded((v) => !v)}
              className="flex-1 rounded-lg bg-white/80 py-2 text-[11px] font-semibold text-eco-navy"
            >
              {t("mob_handoff_view")}
            </button>
            <button
              type="button"
              onClick={onDismissHandoff}
              className="flex-1 rounded-lg bg-eco-navy py-2 text-[11px] font-semibold text-white"
            >
              {t("mob_handoff_ack")}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-br from-eco-navy to-eco-navy/90 p-4 text-white shadow-md">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
          {t("mob_portfolio_total")}
        </p>
        <p className="mt-1 text-2xl font-semibold">{formatGhs(MOBILE_PORTFOLIO.totalValue)}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-100">
            {t("mob_portfolio_day")} +{formatGhs(MOBILE_PORTFOLIO.dayChange)} (
            {MOBILE_PORTFOLIO.dayChangePct}%)
          </span>
          <span className="text-white/60">
            {t("mob_portfolio_updated")} {MOBILE_PORTFOLIO.lastUpdated}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/15 pt-3">
          <div>
            <p className="text-sm font-medium">{c.displayName}</p>
            <p className="text-[10px] text-white/60">{c.householdLabel}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium">
            {t("mob_risk_label")}: {c.riskScore}
          </span>
        </div>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-eco-muted">
        {t("mob_goals_heading")}
      </p>

      <button
        type="button"
        onClick={() => onSelectGoal(primary)}
        className="mt-2 w-full rounded-2xl border border-eco-border bg-white p-4 text-left shadow-sm active:bg-eco-surface/50"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-eco-navy">{primary.title}</p>
          <span className="text-sm font-bold text-eco-teal-dark">{goalPct(primary)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-eco-surface">
          <div
            className="h-full rounded-full bg-eco-teal"
            style={{ width: `${goalPct(primary)}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-eco-muted">
          {formatGhs(primary.currentAmount)} of {formatGhs(primary.targetAmount)} · {primary.targetYear}
        </p>
        <p className="mt-2 text-[10px] font-semibold text-eco-teal-dark">{t("mob_goal_tap")} →</p>
      </button>

      <p className="mt-4 text-xs font-semibold text-eco-muted">{t("mob_goals_also")}</p>
      <ul className="mt-2 space-y-2">
        {others.map((g) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => onSelectGoal(g)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-eco-border bg-white px-3 py-3 text-left active:bg-eco-surface/50"
            >
              <div>
                <p className="text-sm font-medium text-eco-navy">{g.title}</p>
                <p className="text-[11px] text-eco-muted">
                  {formatGhs(g.currentAmount)} · {goalPct(g)}%
                </p>
              </div>
              <span className="text-eco-muted">→</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-2xl border border-dashed border-eco-border bg-eco-surface/50 p-4">
        <p className="text-xs font-semibold text-eco-ink">{t("mob_nudge_title")}</p>
        <p className="mt-2 text-xs leading-relaxed text-eco-muted">{t("mob_nudge_body")}</p>
        <button
          type="button"
          onClick={() => onNavigateTab("messages")}
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-2.5 text-sm font-medium text-white"
        >
          {t("mob_nudge_cta")}
        </button>
      </div>

    </>
  );
}

function NotificationRow({ item, onOpen }: { item: MobileNotification; onOpen: () => void }) {
  const { t } = useDemoLocale();
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className={`w-full rounded-xl border px-3 py-3 text-left text-xs ${
          item.read
            ? "border-eco-border bg-white text-eco-muted"
            : "border-eco-teal/30 bg-eco-teal-muted/30 text-eco-ink"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <strong className="text-sm text-eco-navy">{t(item.titleKey as DemoMsgKey)}</strong>
          {!item.read && (
            <span className="shrink-0 rounded-full bg-eco-teal px-1.5 py-0.5 text-[9px] font-bold text-white">
              {t("mob_unread")}
            </span>
          )}
        </div>
        <p className="mt-1 leading-relaxed">{t(item.bodyKey as DemoMsgKey)}</p>
        <p className="mt-1 text-[10px] text-eco-muted">{item.at}</p>
      </button>
    </li>
  );
}
