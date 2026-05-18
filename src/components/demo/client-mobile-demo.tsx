"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoMsgKey } from "@/lib/demo-i18n";
import { DEMO_CLIENT, DEMO_GOALS, HOLDINGS_MOCK } from "@/lib/demo-data";
import { formatGhs } from "@/lib/format";

export type BottomNav = "goals" | "invest" | "messages" | "profile";

export const CLIENT_MOBILE_TABS = ["goals", "invest", "messages", "profile"] as const satisfies readonly BottomNav[];

type TopSeg = "overview" | "notifications";

function bottomNavLabel(tab: BottomNav): DemoMsgKey {
  switch (tab) {
    case "goals":
      return "cm_nav_goals";
    case "invest":
      return "cm_nav_invest";
    case "messages":
      return "cm_nav_messages";
    case "profile":
      return "cm_nav_profile";
    default:
      return "cm_nav_goals";
  }
}

function initialBottom(tab: BottomNav | null | undefined): BottomNav {
  return tab && (CLIENT_MOBILE_TABS as readonly string[]).includes(tab) ? tab : "goals";
}

export function ClientMobileDemo({
  initialHandoff,
  initialTab,
}: {
  initialHandoff: boolean;
  initialTab?: BottomNav | null;
}) {
  const [top, setTop] = useState<TopSeg>("overview");
  const [bottom, setBottom] = useState<BottomNav>(() => initialBottom(initialTab));
  const [handoffDismissed, setHandoffDismissed] = useState(false);
  const showHandoffBanner = initialHandoff && !handoffDismissed;

  const { t } = useDemoLocale();

  const retirementGoal = DEMO_GOALS.find((g) => g.type === "retirement")!;
  const educationGoal = DEMO_GOALS.find((g) => g.type === "education")!;
  const pct = Math.min(
    100,
    Math.round((retirementGoal.currentAmount / retirementGoal.targetAmount) * 100),
  );
  const c = DEMO_CLIENT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-navy/[0.12] via-eco-surface to-eco-teal-muted/60 px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto mb-4 flex max-w-sm flex-wrap items-center justify-center gap-3 px-2 text-center sm:mb-6 sm:gap-4">
        <Link
          href="/"
          className="min-h-11 min-w-11 shrink-0 content-center px-2 text-xs font-medium leading-none text-eco-muted hover:text-eco-navy"
        >
          {t("mob_demo_entry")}
        </Link>
        <Link
          href="/client"
          className="min-h-11 shrink-0 content-center rounded-full border border-eco-border bg-white px-4 text-xs font-semibold leading-none text-eco-teal-dark shadow-sm hover:bg-eco-surface"
        >
          {t("mob_full_web")}
        </Link>
        <Link
          href="/rm/client-360"
          className="min-h-11 shrink-0 content-center px-3 text-[11px] font-semibold text-eco-muted hover:text-eco-navy"
        >
          {t("mob_rm360")}
        </Link>
      </div>

      <div className="relative mx-auto w-full max-w-sm">
        <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-b from-eco-navy to-slate-800 shadow-2xl" />
        <div className="relative flex max-h-[min(85vh,820px)] min-h-[min(640px,80svh)] flex-col overflow-hidden rounded-[2rem] bg-white shadow-inner ring-[6px] ring-eco-navy sm:ring-8">
          <div className="shrink-0 px-6 pb-2 pt-10 text-center sm:pt-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-eco-muted">
              {t("cm_brand")}
            </p>
            <h1 className="mt-1 text-lg font-semibold text-eco-navy">
              {t(bottomNavLabel(bottom))}
            </h1>
          </div>

          <div className="flex shrink-0 gap-3 overflow-x-auto border-b border-eco-border px-4 pb-2 text-xs [-webkit-overflow-scrolling:touch]">
            <button
              type="button"
              onClick={() => setTop("overview")}
              className={`shrink-0 rounded-full px-3 py-2 font-medium ${
                top === "overview"
                  ? "bg-eco-navy text-white"
                  : "bg-eco-surface text-eco-muted hover:text-eco-ink"
              }`}
            >
              {t("cm_top_overview")}
            </button>
            <button
              type="button"
              onClick={() => setTop("notifications")}
              className={`shrink-0 rounded-full px-3 py-2 font-medium ${
                top === "notifications"
                  ? "bg-eco-navy text-white"
                  : "bg-eco-surface text-eco-muted hover:text-eco-ink"
              }`}
            >
              {t("cm_top_notifications")}
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[4.75rem] pt-4">
            {bottom === "goals" && top === "overview" && (
              <>
                {showHandoffBanner && (
                  <button
                    type="button"
                    onClick={() => setHandoffDismissed(true)}
                    className="mb-4 w-full rounded-xl border border-eco-teal/40 bg-eco-teal-muted/60 px-3 py-3 text-left text-xs text-eco-teal-dark hover:bg-eco-teal-muted"
                  >
                    <strong className="block">Meeting recap received.</strong>
                    Your advisor updated the retirement pathway — tap to acknowledge.
                  </button>
                )}

                <div className="rounded-2xl border border-eco-border bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-eco-ink">{c.displayName}</p>
                      <p className="text-[11px] text-eco-muted">{c.householdLabel}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-eco-surface px-2 py-0.5 text-[10px] font-medium text-eco-muted">
                      {c.currency}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-eco-muted">{retirementGoal.title}</p>
                    <p className="mt-1 text-2xl font-semibold text-eco-navy">{pct}% funded</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-eco-surface">
                      <div className="h-full rounded-full bg-eco-teal" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] text-eco-muted">
                      {formatGhs(retirementGoal.currentAmount)} of{" "}
                      {formatGhs(retirementGoal.targetAmount)} · target{" "}
                      {retirementGoal.targetYear}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-eco-border bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-eco-muted">Also tracking</p>
                  <p className="mt-2 text-sm font-medium text-eco-navy">{educationGoal.title}</p>
                  <p className="text-[11px] text-eco-muted">
                    {formatGhs(educationGoal.currentAmount)} of{" "}
                    {formatGhs(educationGoal.targetAmount)}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-dashed border-eco-border bg-eco-surface/50 p-4">
                  <p className="text-xs font-semibold text-eco-ink">Nudge</p>
                  <p className="mt-2 text-xs leading-relaxed text-eco-muted">
                    Small top-up this month keeps education on track — see Messages for your
                    RM&apos;s note.
                  </p>
                  <Link
                    href="/client-mobile?tab=messages"
                    className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-2.5 text-sm font-medium text-white hover:bg-eco-navy/90"
                  >
                    Review action
                  </Link>
                </div>
              </>
            )}

            {bottom === "goals" && top === "notifications" && (
              <div className="space-y-3">
                <p className="text-xs text-eco-muted">Push & inbox (demo)</p>
                <Link
                  href="/client?tab=messages"
                  className="flex min-h-11 w-full items-center rounded-xl border border-eco-border bg-white px-4 py-3 text-left text-sm font-medium text-eco-navy hover:bg-eco-surface"
                >
                  Turn on WhatsApp summaries
                </Link>
              </div>
            )}

            {bottom === "invest" && (
              <div className="space-y-3">
                <p className="text-xs text-eco-muted">Goal-tagged sleeves</p>
                <ul className="space-y-2 text-xs">
                  {HOLDINGS_MOCK.map((h) => (
                    <li
                      key={h.name}
                      className="flex items-start justify-between gap-2 rounded-xl border border-eco-border bg-white p-3"
                    >
                      <span className="font-medium leading-snug text-eco-ink">{h.name}</span>
                      <span className="shrink-0 font-semibold text-eco-navy">
                        {formatGhs(h.value)}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/client?tab=investments"
                  className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl border border-eco-border py-2.5 text-center text-sm font-medium text-eco-ink hover:bg-eco-surface"
                >
                  Manage recurring debit
                </Link>
              </div>
            )}

            {bottom === "messages" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-eco-teal/30 bg-eco-teal-muted/40 p-3 text-xs text-eco-teal-dark">
                  <strong>RM note</strong> — consider increasing education contribution by GHS
                  400/mo.
                </div>
                <Link
                  href="/rm/meeting"
                  className="flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-3 text-sm font-medium text-white hover:bg-eco-navy/90"
                >
                  Reply in thread
                </Link>
              </div>
            )}

            {bottom === "profile" && (
              <div className="space-y-4 text-sm">
                <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-eco-border bg-white px-4 py-3">
                  Large type mode
                  <input type="checkbox" className="h-6 w-6 shrink-0 accent-eco-teal" defaultChecked />
                </label>
                <Link
                  href="/client"
                  className="flex min-h-11 items-center justify-center rounded-xl border border-eco-border px-4 py-3 text-center font-medium text-eco-teal-dark hover:bg-eco-surface"
                >
                  {t("mob_profile_desktopPortal")}
                </Link>
              </div>
            )}
          </div>

          <nav
            aria-label="Primary"
            className="absolute bottom-0 left-0 right-0 flex justify-around gap-1 border-t border-eco-border bg-white/95 px-1 py-3 text-[10px] text-eco-muted backdrop-blur supports-[padding:env(safe-area-inset-bottom)]:pb-[max(12px,env(safe-area-inset-bottom))]"
          >
            {(CLIENT_MOBILE_TABS as readonly BottomNav[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setBottom(id)}
                className={`flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 transition active:opacity-75 ${
                  bottom === id ? "font-semibold text-eco-navy" : "hover:text-eco-ink"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${bottom === id ? "bg-eco-teal opacity-90" : "bg-current opacity-30"}`}
                />
                {t(bottomNavLabel(id))}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
