"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoMsgKey } from "@/lib/demo-i18n";
import { MobileGoalsView } from "./client-mobile/mobile-goals-view";
import { MobileInvestView } from "./client-mobile/mobile-invest-view";
import { MobileMessagesView } from "./client-mobile/mobile-messages-view";
import { MobileProfileView } from "./client-mobile/mobile-profile-view";
import { GoalDetailSheet } from "./client-mobile/goal-detail-sheet";
import {
  MobileRebalanceSheet,
  MobileReplySheet,
  MobileSweepSheet,
  MobileWhatIfSheet,
} from "./client-mobile/mobile-action-sheets";
import type { DemoGoal } from "@/lib/demo-data";

type MobileOverlay =
  | { kind: "goal"; goal: DemoGoal }
  | { kind: "rebalance" }
  | { kind: "sweep" }
  | { kind: "whatif"; goal: DemoGoal }
  | { kind: "reply"; subject: string };

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

const NAV_ICONS: Record<BottomNav, string> = {
  goals: "◎",
  invest: "◈",
  messages: "✉",
  profile: "◇",
};

export function ClientMobileDemo({
  initialHandoff,
  initialTab,
}: {
  initialHandoff: boolean;
  initialTab?: BottomNav | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useDemoLocale();

  const [top, setTop] = useState<TopSeg>("overview");
  const [bottom, setBottom] = useState<BottomNav>(() => initialBottom(initialTab));
  const [handoffDismissed, setHandoffDismissed] = useState(false);
  const [overlay, setOverlay] = useState<MobileOverlay | null>(null);
  const showHandoffBanner = initialHandoff && !handoffDismissed;
  const sheetOpen = overlay !== null;

  useEffect(() => {
    const raw = searchParams.get("tab");
    if (raw === "investments") {
      setBottom("invest");
      return;
    }
    const next = initialBottom(raw as BottomNav | null);
    setBottom(next);
  }, [searchParams]);

  const selectBottom = useCallback(
    (id: BottomNav) => {
      setBottom(id);
      setOverlay(null);
      if (id !== "goals") setTop("overview");
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", id);
      if (initialHandoff && !handoffDismissed) params.set("handoff", "1");
      else params.delete("handoff");
      router.replace(`/client-mobile?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, initialHandoff, handoffDismissed],
  );

  const showGoalsTop = bottom === "goals";

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
        <div className="relative flex max-h-[min(88vh,860px)] min-h-[min(680px,85svh)] flex-col overflow-hidden rounded-[2rem] bg-white shadow-inner ring-[6px] ring-eco-navy sm:ring-8">
          <div className="shrink-0 px-5 pb-2 pt-10 text-center sm:pt-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-eco-muted">
              {t("cm_brand")}
            </p>
            <h1 className="mt-1 text-lg font-semibold text-eco-navy">
              {t(bottomNavLabel(bottom))}
            </h1>
          </div>

          {showGoalsTop && (
            <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-eco-border px-4 pb-2 text-xs [-webkit-overflow-scrolling:touch]">
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
          )}

          <div
            className={`min-h-0 flex-1 overscroll-contain px-4 pb-[5rem] pt-4 ${sheetOpen ? "overflow-hidden" : "overflow-y-auto"}`}
          >
            {bottom === "goals" && (
              <MobileGoalsView
                top={top}
                showHandoffBanner={showHandoffBanner}
                onDismissHandoff={() => setHandoffDismissed(true)}
                onNavigateTab={(tab) => selectBottom(tab)}
                onSelectGoal={(goal) => setOverlay({ kind: "goal", goal })}
              />
            )}
            {bottom === "invest" && (
              <MobileInvestView
                onOpenRebalance={() => setOverlay({ kind: "rebalance" })}
                onOpenSweep={() => setOverlay({ kind: "sweep" })}
              />
            )}
            {bottom === "messages" && (
              <MobileMessagesView onOpenReply={(subject) => setOverlay({ kind: "reply", subject })} />
            )}
            {bottom === "profile" && <MobileProfileView />}
          </div>

          {overlay?.kind === "goal" && (
            <GoalDetailSheet
              goal={overlay.goal}
              onClose={() => setOverlay(null)}
              onWhatIf={() => setOverlay({ kind: "whatif", goal: overlay.goal })}
            />
          )}
          {overlay?.kind === "rebalance" && (
            <MobileRebalanceSheet onClose={() => setOverlay(null)} />
          )}
          {overlay?.kind === "sweep" && <MobileSweepSheet onClose={() => setOverlay(null)} />}
          {overlay?.kind === "whatif" && (
            <MobileWhatIfSheet goal={overlay.goal} onClose={() => setOverlay(null)} />
          )}
          {overlay?.kind === "reply" && (
            <MobileReplySheet subject={overlay.subject} onClose={() => setOverlay(null)} />
          )}

          <nav
            aria-label="Primary"
            className={`absolute bottom-0 left-0 right-0 flex justify-around gap-1 border-t border-eco-border bg-white/95 px-1 py-2 text-[10px] text-eco-muted backdrop-blur supports-[padding:env(safe-area-inset-bottom)]:pb-[max(10px,env(safe-area-inset-bottom))] ${sheetOpen ? "pointer-events-none opacity-0" : ""}`}
          >
            {(CLIENT_MOBILE_TABS as readonly BottomNav[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => selectBottom(id)}
                className={`flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 transition active:scale-95 ${
                  bottom === id ? "font-semibold text-eco-navy" : "hover:text-eco-ink"
                }`}
              >
                <span
                  className={`text-base leading-none ${bottom === id ? "text-eco-teal" : "opacity-40"}`}
                  aria-hidden
                >
                  {NAV_ICONS[id]}
                </span>
                {t(bottomNavLabel(id))}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
