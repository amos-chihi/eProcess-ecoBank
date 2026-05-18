"use client";

import { useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoGoal } from "@/lib/demo-data";
import { formatGhs } from "@/lib/format";
import { MobileContainedSheet } from "./mobile-contained-sheet";
import {
  CROSS_SELL_PRODUCTS,
  FUND_HOUSES,
  ROBO_PROPOSAL,
  type FundHouse,
} from "@/lib/ecobank-capabilities-data";
import type { DemoMsgKey } from "@/lib/demo-i18n";

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

const XS_CATEGORY: Record<string, DemoMsgKey> = {
  savings: "xs_cat_savings",
  insurance: "xs_cat_insurance",
  lending: "xs_cat_lending",
  wealth: "xs_cat_wealth",
};

export function MobileRoboSheet({ onClose }: { onClose: () => void }) {
  const { t } = useDemoLocale();
  const [status, setStatus] = useState<"pending" | "accepted" | "deferred">("pending");
  const p = ROBO_PROPOSAL;

  return (
    <MobileContainedSheet title={t("robo_title")} onClose={onClose}>
      <p className="text-xs text-eco-muted">{p.createdAt}</p>
      <p className="mt-3 text-sm leading-relaxed text-eco-ink">{t(p.summaryKey as DemoMsgKey)}</p>
      <p className="mt-2 text-xs text-eco-muted">
        {t("robo_confidence")}: {Math.round(p.confidence * 100)}%
      </p>
      <ul className="mt-4 space-y-2 text-xs">
        {p.shifts.map((s, i) => (
          <li key={`${s.sleeve}-${i}`} className="flex justify-between rounded-lg border border-eco-border px-3 py-2">
            <span className="text-eco-ink">{s.sleeve}</span>
            <span className="text-eco-muted">
              {s.fromPct}% → <span className="font-semibold text-eco-teal-dark">{s.toPct}%</span>
            </span>
          </li>
        ))}
      </ul>
      {status === "pending" ? (
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setStatus("accepted")}
            className="min-h-11 rounded-xl bg-eco-navy py-3 text-sm font-semibold text-white"
          >
            {t("robo_accept")}
          </button>
          <button
            type="button"
            onClick={() => setStatus("deferred")}
            className="min-h-11 rounded-xl border border-eco-border py-3 text-sm font-medium text-eco-navy"
          >
            {t("robo_defer")}
          </button>
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-800">
          {status === "accepted" ? t("robo_status_accepted") : t("robo_status_deferred")}
        </p>
      )}
      <p className="mt-3 text-[10px] leading-relaxed text-eco-muted">{t("robo_disclaimer")}</p>
    </MobileContainedSheet>
  );
}

type FundSheetView = "list" | "factsheet" | "order";

function MobileFundOrderForm({
  fund,
  onSubmitted,
}: {
  fund: FundHouse;
  onSubmitted: (reference: string) => void;
}) {
  const { t } = useDemoLocale();
  const [amount, setAmount] = useState(5_000);
  const [sleeve, setSleeve] = useState<"education" | "retirement">("education");

  return (
    <>
      <p className="text-sm font-semibold text-eco-navy">{fund.name}</p>
      <p className="mt-1 text-xs text-eco-muted">
        {fund.region} · {t("fund_cutoff")}: {fund.cutOff}
      </p>
      <label className="mt-4 block text-xs font-semibold text-eco-muted">
        {t("mob_fund_order_amount")}
        <input
          type="range"
          min={1000}
          max={50_000}
          step={500}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-2 w-full accent-eco-teal"
        />
        <span className="mt-1 block text-lg font-semibold text-eco-navy">{formatGhs(amount)}</span>
      </label>
      <p className="mt-4 text-xs font-semibold text-eco-muted">{t("mob_fund_order_sleeve")}</p>
      <div className="mt-2 flex gap-2">
        {(["education", "retirement"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setSleeve(id)}
            className={`min-h-10 flex-1 rounded-lg border px-2 py-2 text-[11px] font-semibold ${
              sleeve === id
                ? "border-eco-teal bg-eco-teal-muted text-eco-teal-dark"
                : "border-eco-border text-eco-muted"
            }`}
          >
            {t(id === "education" ? "mob_fund_order_sleeve_edu" : "mob_fund_order_sleeve_ret")}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onSubmitted(
            `ORD-${fund.id.toUpperCase()}-${Date.now().toString(36).slice(-6).toUpperCase()}`,
          )
        }
        className="mt-5 flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-3 text-sm font-semibold text-white"
      >
        {t("mob_fund_order_confirm")}
      </button>
    </>
  );
}

export function MobileFundHousesSheet({ onClose }: { onClose: () => void }) {
  const { t } = useDemoLocale();
  const [view, setView] = useState<FundSheetView>("list");
  const [fund, setFund] = useState<FundHouse | null>(null);
  const [orderRef, setOrderRef] = useState<string | null>(null);

  const goList = () => {
    setView("list");
    setFund(null);
    setOrderRef(null);
  };

  const openOrder = (fh: FundHouse) => {
    setFund(fh);
    setOrderRef(null);
    setView("order");
  };

  const title =
    view === "list"
      ? t("fund_title")
      : view === "factsheet"
        ? (fund?.name ?? t("fund_factsheet"))
        : t("mob_fund_order_title");

  const footerBack = view !== "list";

  return (
    <MobileContainedSheet
      title={title}
      onClose={onClose}
      footerLabel={footerBack ? t("mob_fund_order_back") : undefined}
      onFooterClick={footerBack ? goList : undefined}
    >
      {view === "list" && (
        <>
          <p className="text-xs text-eco-muted">{t("fund_sub")}</p>
          <ul className="mt-4 space-y-3">
            {FUND_HOUSES.map((fh) => (
              <li key={fh.id} className="rounded-lg border border-eco-border bg-eco-surface/40 p-3 text-xs">
                <p className="font-semibold text-eco-navy">{fh.name}</p>
                <p className="mt-1 text-eco-muted">
                  {fh.region} · {t("fund_cutoff")}: {fh.cutOff}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFund(fh);
                      setView("factsheet");
                    }}
                    className="rounded-lg border border-eco-border px-2 py-1 text-[11px] font-medium"
                  >
                    {t("fund_factsheet")}
                  </button>
                  <button
                    type="button"
                    onClick={() => openOrder(fh)}
                    className="rounded-lg bg-eco-navy px-2 py-1 text-[11px] font-semibold text-white"
                  >
                    {t("fund_place_order")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {view === "factsheet" && fund && (
        <>
          <p className="text-xs leading-relaxed text-eco-muted">{t("fund_factsheet_body")}</p>
          <dl className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between rounded-lg bg-eco-surface/60 px-3 py-2">
              <dt className="text-eco-muted">{t("fund_cutoff")}</dt>
              <dd className="font-medium text-eco-ink">{fund.cutOff}</dd>
            </div>
            <div className="flex justify-between rounded-lg bg-eco-surface/60 px-3 py-2">
              <dt className="text-eco-muted">{t("fund_nav")}</dt>
              <dd className="font-medium text-eco-ink">{fund.navLag}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => openOrder(fund)}
            className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-3 text-sm font-semibold text-white"
          >
            {t("mob_fund_order_from_factsheet")}
          </button>
        </>
      )}

      {view === "order" && fund && (
        <>
          {orderRef ? (
            <div className="space-y-3">
              <p className="rounded-lg bg-emerald-50 px-3 py-3 text-center text-sm font-medium text-emerald-800">
                {t("fund_order_toast")}
              </p>
              <dl className="rounded-lg border border-eco-border bg-eco-surface/50 p-3 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-eco-muted">{t("mob_fund_order_reference")}</dt>
                  <dd className="font-mono font-semibold text-eco-navy">{orderRef}</dd>
                </div>
                <div className="mt-2 flex justify-between gap-2">
                  <dt className="text-eco-muted">{t("fund_cutoff")}</dt>
                  <dd className="font-medium text-eco-ink">{fund.cutOff}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={goList}
                className="flex min-h-11 w-full items-center justify-center rounded-xl border border-eco-border py-3 text-sm font-medium text-eco-navy"
              >
                {t("mob_fund_order_back")}
              </button>
            </div>
          ) : (
            <MobileFundOrderForm fund={fund} onSubmitted={setOrderRef} />
          )}
        </>
      )}
    </MobileContainedSheet>
  );
}

export function MobileCrossSellSheet({ onClose }: { onClose: () => void }) {
  const { t } = useDemoLocale();
  const [added, setAdded] = useState<string[]>([]);

  return (
    <MobileContainedSheet title={t("xs_title")} onClose={onClose}>
      <p className="text-xs text-eco-muted">{t("xs_sub")}</p>
      <ul className="mt-4 space-y-2">
        {CROSS_SELL_PRODUCTS.map((p) => (
          <li
            key={p.id}
            className={`rounded-lg border p-3 text-xs ${
              added.includes(p.id) ? "border-eco-teal bg-eco-teal-muted/30" : "border-eco-border"
            }`}
          >
            <span className="text-[9px] font-semibold uppercase text-eco-muted">
              {t(XS_CATEGORY[p.category])}
            </span>
            <p className="mt-1 font-medium text-eco-navy">{p.name}</p>
            <p className="mt-1 text-eco-muted">{t(p.fitReasonKey as DemoMsgKey)}</p>
            <button
              type="button"
              onClick={() =>
                setAdded((prev) =>
                  prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id],
                )
              }
              className="mt-2 w-full rounded-lg bg-eco-navy py-2 text-[11px] font-semibold text-white"
            >
              {added.includes(p.id) ? t("xs_added") : t("xs_add_pack")}
            </button>
            {p.suitabilityRequired && (
              <p className="mt-1 text-center text-[10px] text-amber-800">{t("xs_suit_required")}</p>
            )}
          </li>
        ))}
      </ul>
      {added.length > 0 && (
        <p className="mt-3 text-[11px] text-eco-teal-dark">{t("xs_meeting_note")}</p>
      )}
    </MobileContainedSheet>
  );
}

export function MobileInsightsSheet({ onClose }: { onClose: () => void }) {
  const { t } = useDemoLocale();
  const items = [
    { title: "mob_insight_1_title", body: "mob_insight_1_body", tag: "mob_insight_tag_risk" },
    { title: "mob_insight_2_title", body: "mob_insight_2_body", tag: "mob_insight_tag_nudge" },
    { title: "mob_insight_3_title", body: "mob_insight_3_body", tag: "mob_insight_tag_alloc" },
  ] as const;

  return (
    <MobileContainedSheet title={t("mob_insights_title")} onClose={onClose}>
      <p className="text-xs text-eco-muted">{t("mob_insights_sub")}</p>
      <ul className="mt-4 space-y-3">
        {items.map((ins) => (
          <li key={ins.title} className="rounded-lg border border-eco-border bg-white p-3 text-xs">
            <span className="rounded bg-eco-surface px-1.5 py-0.5 text-[10px] font-semibold text-eco-muted">
              {t(ins.tag as DemoMsgKey)}
            </span>
            <p className="mt-2 font-semibold text-eco-navy">{t(ins.title as DemoMsgKey)}</p>
            <p className="mt-1 leading-relaxed text-eco-muted">{t(ins.body as DemoMsgKey)}</p>
          </li>
        ))}
      </ul>
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
