"use client";

import Link from "next/link";
import { useEffect, useMemo, startTransition, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ComplianceRail } from "@/components/demo/compliance-rail";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { DEMO_CLIENT, DEMO_GOALS } from "@/lib/demo-data";
import { MEET_STEP_KEYS } from "@/lib/demo-i18n";
import { formatGhs } from "@/lib/format";

export function MeetingModeClient({ presentMode = false }: { presentMode?: boolean }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const retirementGoal = DEMO_GOALS.find((g) => g.type === "retirement")!;
  const [retireYear, setRetireYear] = useState(retirementGoal.targetYear);
  const [monthlyTopUp, setMonthlyTopUp] = useState(2500);

  const simulation = useMemo(() => {
    const yearsEarly = Math.max(0, retirementGoal.targetYear - retireYear);
    const stress = yearsEarly * 0.06 + (monthlyTopUp < 2000 ? 0.04 : -0.02);
    const fundedPct = Math.min(
      95,
      Math.round(
        (retirementGoal.currentAmount / retirementGoal.targetAmount) * 100 +
          monthlyTopUp * 0.002 -
          stress * 100,
      ),
    );
    const onTrack = fundedPct >= 22 && monthlyTopUp >= 2000;
    return { fundedPct, yearsEarly, onTrack, stress };
  }, [retireYear, monthlyTopUp, retirementGoal]);

  useEffect(() => {
    const raw = searchParams.get("step");
    if (raw === null || raw === "") return;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return;
    if (n >= 1 && n <= MEET_STEP_KEYS.length) {
      startTransition(() => setStep(n - 1));
      return;
    }
    if (n >= 0 && n < MEET_STEP_KEYS.length) {
      startTransition(() => setStep(n));
    }
  }, [searchParams]);

  const next = () => setStep((s) => Math.min(s + 1, MEET_STEP_KEYS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const c = DEMO_CLIENT;
  const { t } = useDemoLocale();

  const stepCount = MEET_STEP_KEYS.length;

  return (
    <div
      className={
        presentMode
          ? "mx-auto max-w-6xl space-y-8"
          : "mx-auto flex max-w-7xl gap-6"
      }
    >
      <div className={`min-w-0 flex-1 space-y-6 ${presentMode ? "space-y-8" : ""}`}>
        <div className={`flex flex-wrap items-center justify-between gap-4 ${presentMode ? "gap-6" : ""}`}>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-eco-muted">
              {t("meet_kicker")}
              {presentMode && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-amber-900">
                  {t("meet_presentBadge")}
                </span>
              )}
            </p>
            <h1
              className={`mt-1 font-semibold tracking-tight text-eco-navy ${
                presentMode ? "text-3xl" : "text-2xl"
              }`}
            >
              {t("meet_session_prefix")} {t("meet_suffix_name")} {c.displayName.split(" ")[0]}
            </h1>
            {!presentMode && (
              <Link
                href="/present/meeting"
                className="mt-2 inline-block text-xs font-semibold text-eco-teal-dark hover:underline"
              >
                {t("meet_openPresent")}
              </Link>
            )}
          </div>
          <div className={`flex flex-wrap gap-2 ${presentMode ? "text-sm" : "text-xs"}`}>
            {MEET_STEP_KEYS.map((key, i) => (
              <button
                key={key}
                type="button"
                aria-label={t(key)}
                onClick={() => setStep(i)}
                className={`flex min-h-10 min-w-10 items-center justify-center rounded-full font-medium transition ${
                  presentMode ? "px-3.5 py-2" : "px-2.5 py-1"
                } ${
                  i === step
                    ? "bg-eco-navy text-white"
                    : "bg-eco-surface text-eco-muted hover:text-eco-ink"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`rounded-xl border border-eco-border bg-white shadow-sm ${presentMode ? "min-h-[min(70vh,520px)] p-8 sm:p-10" : "min-h-[360px] p-6"}`}
        >
          {step === 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-eco-navy">{t(MEET_STEP_KEYS[0])}</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-eco-muted">
                {t("meet_discover_body")}
              </p>
              <ul className="list-inside list-disc text-sm text-eco-muted">
                <li>{t("meet_discover_li1")}</li>
                <li>{t("meet_discover_li2", { region: c.region })}</li>
                <li>
                  {presentMode ? t("meet_discover_li3_present") : t("meet_discover_li3_rm")}
                </li>
              </ul>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-eco-navy">{t(MEET_STEP_KEYS[1])}</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-eco-ink">{retirementGoal.title}</p>
                  <p className="mt-2 text-xs text-eco-muted">
                    {t("meet_goals_target", {
                      amount: formatGhs(retirementGoal.targetAmount),
                      year: retirementGoal.targetYear,
                    })}
                  </p>
                  <div className="mt-6 space-y-5">
                    <div>
                      <label className="flex justify-between text-xs font-medium text-eco-muted">
                        <span>{t("meet_goals_retireYear")}</span>
                        <span className="text-eco-navy">{retireYear}</span>
                      </label>
                      <input
                        type="range"
                        min={2036}
                        max={2056}
                        value={retireYear}
                        onChange={(e) => setRetireYear(Number(e.target.value))}
                        className="mt-2 w-full accent-eco-teal"
                      />
                      <p className="mt-1 text-[11px] text-eco-muted">
                        {simulation.yearsEarly > 0
                          ? t("meet_goals_earlyYears", { n: simulation.yearsEarly })
                          : t("meet_goals_aligned")}
                      </p>
                    </div>
                    <div>
                      <label className="flex justify-between text-xs font-medium text-eco-muted">
                        <span>{t("meet_goals_monthly")}</span>
                        <span className="text-eco-navy">{monthlyTopUp}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={8000}
                        step={100}
                        value={monthlyTopUp}
                        onChange={(e) => setMonthlyTopUp(Number(e.target.value))}
                        className="mt-2 w-full accent-eco-teal"
                      />
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-eco-border bg-eco-surface/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
                    {t("meet_pathway")}
                  </p>
                  <div className="mt-8 flex h-36 items-end gap-2">
                    {[35, 42, 48, 54, simulation.fundedPct].map((h, idx) => (
                      <div
                        key={`${step}-${idx}`}
                        className="flex flex-1 flex-col items-center justify-end gap-2"
                      >
                        <div
                          className="w-full rounded-t-md bg-eco-teal/90 transition-all duration-300"
                          style={{ height: `${Math.min(h, 100)}%`, minHeight: "12%" }}
                        />
                        <span className="text-[10px] text-eco-muted">
                          Q{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm font-medium text-eco-ink">
                    {t("meet_modelled")}{" "}
                    <span className="text-eco-teal-dark">{simulation.fundedPct}%</span>{" "}
                    {t("meet_funded")}
                  </p>
                  <div
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      simulation.onTrack
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-900"
                    }`}
                  >
                    {simulation.onTrack ? t("meet_onTrack") : t("meet_belowPace")}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {retirementGoal.microWins.map((w) => (
                      <span
                        key={w}
                        className="rounded-full bg-white px-2 py-1 text-[11px] text-eco-muted shadow-sm ring-1 ring-eco-border"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-eco-navy">{t(MEET_STEP_KEYS[2])}</h2>
              <p className="text-sm text-eco-muted">
                {t("meet_risk_body", { label: c.riskLabel, score: c.riskScore })}
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {(
                  ["meet_risk_card1", "meet_risk_card2", "meet_risk_card3"] as const
                ).map((cardKey) => (
                  <div
                    key={cardKey}
                    className="rounded-lg border border-eco-border bg-eco-surface px-4 py-3 text-sm text-eco-ink"
                  >
                    {t(cardKey)}
                    <span className="mt-2 block text-xs font-medium text-eco-teal-dark">
                      {t("meet_risk_confirmed")}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-eco-navy">{t(MEET_STEP_KEYS[3])}</h2>
              <p className="text-sm text-eco-muted">{t("meet_plan_body")}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-eco-border p-4">
                  <p className="text-sm font-medium text-eco-ink">{t("meet_ret_sleeve")}</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="grow rounded bg-slate-200 py-3 text-center">FI 52%</span>
                    <span className="grow rounded bg-eco-teal/30 py-3 text-center">EQ 41%</span>
                    <span className="grow rounded bg-amber-100 py-3 text-center">ALT 7%</span>
                  </div>
                </div>
                <div className="rounded-lg border border-eco-border p-4">
                  <p className="text-sm font-medium text-eco-ink">{t("meet_edu_sleeve")}</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="grow rounded bg-slate-200 py-3 text-center">FI 68%</span>
                    <span className="grow rounded bg-eco-teal/30 py-3 text-center">EQ 28%</span>
                    <span className="grow rounded bg-amber-100 py-3 text-center">ALT 4%</span>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-eco-muted">
                <input
                  type="checkbox"
                  defaultChecked
                  className="pointer-events-none accent-eco-teal"
                  tabIndex={-1}
                  aria-readonly="true"
                />{" "}
                {t("meet_auto_rebal")} (
                <abbr title="Demonstration — not live">stub</abbr>)
              </label>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-eco-navy">{t(MEET_STEP_KEYS[4])}</h2>
              <p className="text-sm text-eco-muted">{t("meet_prod_body")}</p>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    name: "Target Date 2046 Fund",
                    why: "Closes glidepath drift for retirement after early-retirement sim.",
                  },
                  {
                    name: "Education accumulator — GHS",
                    why: "Matches 2032 liquidity need; lowers equity beta vs retirement sleeve.",
                  },
                  {
                    name: "UMB / diversified credit sleeve",
                    why: "Improves income stability for nearer-term milestones.",
                  },
                ].map((p) => (
                  <article
                    key={p.name}
                    className="flex flex-col rounded-xl border border-eco-border bg-white p-4 shadow-sm"
                  >
                    <p className="font-medium text-eco-navy">{p.name}</p>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-eco-muted">
                      {t("meet_prod_why")} {p.why}
                    </p>
                    <Link
                      href="/rm/compliance"
                      className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-eco-border px-3 py-2 text-center text-xs font-medium text-eco-teal-dark transition hover:bg-eco-surface"
                    >
                      {t("meet_add_pack")}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-eco-navy">{t(MEET_STEP_KEYS[5])}</h2>
              <p className="text-sm text-eco-muted">{t("meet_recap_body")}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/client-mobile?handoff=1"
                  className="rounded-lg bg-eco-teal px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 min-h-11 inline-flex items-center justify-center"
                >
                  {t("meet_push_recap")}
                </Link>
                <Link
                  href="/rm/compliance"
                  className="min-h-11 inline-flex items-center justify-center rounded-lg border border-eco-border bg-white px-4 py-2.5 text-sm font-medium text-eco-navy hover:bg-eco-surface"
                >
                  {t("meet_gen_pdf")}
                </Link>
              </div>
              <ComplianceRail variant="compact" />
              {presentMode && (
                <p className="text-[11px] text-eco-muted">
                  Opens full checklist + vault in Compliance center (
                  <Link href="/rm/compliance" className="font-semibold text-eco-teal-dark hover:underline">
                    /rm/compliance
                  </Link>
                  ).
                </p>
              )}
            </section>
          )}
        </div>

        <div className={`flex items-center justify-between gap-4 ${presentMode ? "pt-2" : ""}`}>
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="min-h-11 rounded-lg border border-eco-border bg-white px-4 py-2 text-sm font-medium text-eco-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("meet_back")}
          </button>
          <div className="text-xs text-eco-muted">
            {t("meet_progress", {
              c: step + 1,
              t: stepCount,
              l: t(MEET_STEP_KEYS[step]!),
            })}
          </div>
          <button
            type="button"
            onClick={next}
            disabled={step === MEET_STEP_KEYS.length - 1}
            className="min-h-11 rounded-lg bg-eco-navy px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-eco-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("meet_continue")}
          </button>
        </div>
      </div>
      {!presentMode && (
        <div className="hidden xl:block">
          <ComplianceRail />
        </div>
      )}
    </div>
  );
}
