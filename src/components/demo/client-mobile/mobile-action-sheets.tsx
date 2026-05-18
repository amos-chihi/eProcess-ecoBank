"use client";

import { useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoGoal } from "@/lib/demo-data";
import { formatGhs } from "@/lib/format";
import { MobileContainedSheet } from "./mobile-contained-sheet";

const REBAL_BEFORE = [
  { labelKey: "mob_alloc_fixed" as const, pct: 48 },
  { labelKey: "mob_alloc_equity" as const, pct: 44 },
  { labelKey: "mob_alloc_cash" as const, pct: 8 },
];

const REBAL_AFTER = [
  { labelKey: "mob_alloc_fixed" as const, pct: 52 },
  { labelKey: "mob_alloc_equity" as const, pct: 41 },
  { labelKey: "mob_alloc_cash" as const, pct: 7 },
];

function AllocationMini({
  title,
  rows,
}: {
  title: string;
  rows: { labelKey: (typeof REBAL_BEFORE)[number]["labelKey"]; pct: number }[];
}) {
  const { t } = useDemoLocale();
  const colors = ["bg-slate-400", "bg-eco-teal", "bg-amber-300"];

  return (
    <div className="rounded-xl border border-eco-border bg-eco-surface/50 p-3">
      <p className="text-[10px] font-semibold uppercase text-eco-muted">{title}</p>
      <div className="mt-2 flex h-2.5 overflow-hidden rounded-full">
        {rows.map((r, i) => (
          <div key={r.labelKey} className={`h-full ${colors[i]}`} style={{ width: `${r.pct}%` }} />
        ))}
      </div>
      <ul className="mt-2 space-y-1 text-[11px]">
        {rows.map((r) => (
          <li key={r.labelKey} className="flex justify-between text-eco-muted">
            <span>{t(r.labelKey)}</span>
            <span className="font-medium text-eco-ink">{r.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MobileRebalanceSheet({ onClose }: { onClose: () => void }) {
  const { t } = useDemoLocale();
  const [confirmed, setConfirmed] = useState(false);

  return (
    <MobileContainedSheet title={t("mob_invest_rebal_title")} onClose={onClose}>
      <p className="text-xs leading-relaxed text-eco-muted">{t("mob_invest_rebal_sub")}</p>
      <div className="mt-4 space-y-3">
        <AllocationMini title={t("rebalance_current")} rows={REBAL_BEFORE} />
        <AllocationMini title={t("rebalance_proposed")} rows={REBAL_AFTER} />
      </div>
      <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{t("rebalance_ok")}</p>
      {!confirmed ? (
        <button
          type="button"
          onClick={() => setConfirmed(true)}
          className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-3 text-sm font-semibold text-white"
        >
          {t("mob_rebal_confirm")}
        </button>
      ) : (
        <p className="mt-4 rounded-lg border border-eco-teal/30 bg-eco-teal-muted/40 px-3 py-2 text-center text-xs font-semibold text-eco-teal-dark">
          {t("mob_rebal_confirmed")}
        </p>
      )}
    </MobileContainedSheet>
  );
}

export function MobileSweepSheet({ onClose }: { onClose: () => void }) {
  const { t } = useDemoLocale();
  const [enabled, setEnabled] = useState(true);

  return (
    <MobileContainedSheet title={t("mob_invest_sweep")} onClose={onClose}>
      <p className="text-xs text-eco-muted">{t("mob_invest_sweep_sub")}</p>
      <label className="mt-4 flex min-h-11 items-center justify-between rounded-xl border border-eco-border px-4 py-3 text-sm">
        <span className="font-medium text-eco-ink">{t("mob_sweep_enabled")}</span>
        <input
          type="checkbox"
          className="h-6 w-6 accent-eco-teal"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
      </label>
      <dl className="mt-4 space-y-3 text-xs">
        <div className="flex justify-between gap-2 rounded-lg bg-eco-surface/60 px-3 py-2">
          <dt className="text-eco-muted">{t("mob_sweep_amount")}</dt>
          <dd className="font-semibold text-eco-navy">GHS 2,500 / mo</dd>
        </div>
        <div className="flex justify-between gap-2 rounded-lg bg-eco-surface/60 px-3 py-2">
          <dt className="text-eco-muted">{t("mob_sweep_target")}</dt>
          <dd className="font-medium text-eco-ink">Education sleeve</dd>
        </div>
        <div className="flex justify-between gap-2 rounded-lg bg-eco-surface/60 px-3 py-2">
          <dt className="text-eco-muted">{t("mob_sweep_next")}</dt>
          <dd className="font-medium text-eco-ink">28 May 2026</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onClose}
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-teal py-3 text-sm font-semibold text-white"
      >
        {t("mob_sweep_save")}
      </button>
    </MobileContainedSheet>
  );
}

export function MobileWhatIfSheet({ goal, onClose }: { goal: DemoGoal; onClose: () => void }) {
  const { t } = useDemoLocale();
  const [extra, setExtra] = useState(400);
  const projected = goal.currentAmount + extra * 12;

  return (
    <MobileContainedSheet title={t("mob_whatif_title")} onClose={onClose}>
      <p className="text-xs text-eco-muted">{goal.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-eco-muted">{t("mob_whatif_sub")}</p>
      <label className="mt-4 block text-xs font-semibold text-eco-muted">
        {t("mob_whatif_monthly")}
        <input
          type="range"
          min={0}
          max={2000}
          step={100}
          value={extra}
          onChange={(e) => setExtra(Number(e.target.value))}
          className="mt-2 w-full accent-eco-teal"
        />
        <span className="mt-1 block text-lg font-semibold text-eco-navy">+{formatGhs(extra)}/mo</span>
      </label>
      <div className="mt-4 rounded-xl border border-eco-border bg-eco-surface/50 p-3 text-xs">
        <p className="text-eco-muted">{t("mob_whatif_projected")}</p>
        <p className="mt-1 text-xl font-semibold text-eco-teal-dark">{formatGhs(projected)}</p>
        <p className="mt-1 text-[11px] text-eco-muted">{t("mob_whatif_horizon")}</p>
      </div>
      <p className="mt-3 text-[11px] text-eco-muted">{t("mob_whatif_note")}</p>
    </MobileContainedSheet>
  );
}

export function MobileReplySheet({
  subject,
  onClose,
}: {
  subject: string;
  onClose: () => void;
}) {
  const { t } = useDemoLocale();
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <MobileContainedSheet title={t("mob_msg_reply")} onClose={onClose}>
      <p className="text-xs text-eco-muted">{t("mob_reply_to")}: {subject}</p>
      {sent ? (
        <p className="mt-6 rounded-lg bg-emerald-50 px-3 py-4 text-center text-sm text-emerald-800">
          {t("mob_reply_sent")}
        </p>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("mob_reply_placeholder")}
            rows={5}
            className="mt-4 w-full resize-none rounded-xl border border-eco-border px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => setSent(true)}
            disabled={!text.trim()}
            className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {t("mob_reply_send")}
          </button>
        </>
      )}
    </MobileContainedSheet>
  );
}
