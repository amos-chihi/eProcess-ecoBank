"use client";

import type { DemoGoal } from "@/lib/demo-data";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { formatGhs } from "@/lib/format";

export function GoalDetailSheet({
  goal,
  onClose,
  onWhatIf,
}: {
  goal: DemoGoal;
  onClose: () => void;
  onWhatIf: () => void;
}) {
  const { t } = useDemoLocale();
  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end rounded-[2rem] bg-eco-navy/40"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[min(78%,520px)] overflow-y-auto rounded-t-2xl bg-white px-4 pb-8 pt-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-eco-border" />
        <p className="text-[10px] font-semibold uppercase tracking-wide text-eco-muted">{goal.type}</p>
        <h2 className="mt-1 text-lg font-semibold text-eco-navy">{goal.title}</h2>
        <p className="mt-3 text-3xl font-semibold text-eco-teal-dark">{pct}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-eco-surface">
          <div className="h-full rounded-full bg-eco-teal" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-eco-muted">
          {formatGhs(goal.currentAmount)} of {formatGhs(goal.targetAmount)}
        </p>
        <p className="mt-1 text-xs text-eco-muted">
          {t("mob_goal_target")}: {goal.targetYear}
        </p>
        {goal.microWins.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-eco-muted">{t("mob_goal_micro")}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {goal.microWins.map((w) => (
                <li
                  key={w}
                  className="rounded-full bg-eco-surface px-2.5 py-1 text-[11px] text-eco-ink ring-1 ring-eco-border"
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="button"
          onClick={onWhatIf}
          className="mt-6 flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-3 text-sm font-semibold text-white"
        >
          {t("cweb_whatIf")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full min-h-11 rounded-xl border border-eco-border py-3 text-sm font-medium text-eco-muted"
        >
          {t("mob_goal_sheet_close")}
        </button>
      </div>
    </div>
  );
}
