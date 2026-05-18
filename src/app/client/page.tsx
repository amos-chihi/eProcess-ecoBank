"use client";

import { Suspense, useCallback, useEffect, startTransition, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CurrencyToggle } from "@/components/demo/currency-toggle";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { RebalancePreview } from "@/components/demo/rebalance-preview";
import { DEMO_GOALS, DEMO_CLIENT, HOLDINGS_MOCK } from "@/lib/demo-data";
import { formatGhs } from "@/lib/format";

type TabKey = "goals" | "investments" | "messages" | "profile";

const VALID_TABS: readonly TabKey[] = [
  "goals",
  "investments",
  "messages",
  "profile",
] as const;

function parseTab(raw: string | null): TabKey | null {
  if (!raw) return null;
  return VALID_TABS.includes(raw as TabKey) ? (raw as TabKey) : null;
}

function ClientWebContent() {
  const { t } = useDemoLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabKey>("goals");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "goals", label: t("cweb_tabGoals") },
    { key: "investments", label: t("cweb_tabInv") },
    { key: "messages", label: t("cweb_tabMsg") },
    { key: "profile", label: t("cweb_tabProf") },
  ];

  useEffect(() => {
    const next = parseTab(searchParams.get("tab"));
    if (next) startTransition(() => setTab(next));
  }, [searchParams]);

  const selectTab = useCallback(
    (key: TabKey) => {
      setTab(key);
      router.replace(`/client?tab=${key}`, { scroll: false });
    },
    [router],
  );

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-eco-border bg-gradient-to-br from-eco-navy/[0.03] via-white to-eco-teal-muted/80 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-eco-navy">{DEMO_CLIENT.displayName}</h1>
            <p className="mt-2 text-sm text-eco-muted">{DEMO_CLIENT.householdLabel}</p>
          </div>
          <Link
            href="/rm/client-360"
            className="text-xs font-semibold uppercase tracking-wide text-eco-muted hover:text-eco-navy"
          >
            {t("cweb_rm")} ↔
          </Link>
        </div>
      </div>

      <nav className="sticky top-0 z-10 -mx-4 flex gap-2 overflow-x-auto border-b border-eco-border bg-eco-surface/95 px-4 pb-3 pt-1 text-sm backdrop-blur sm:static sm:mx-0 sm:flex-wrap sm:overflow-visible sm:bg-transparent sm:px-0 sm:pt-0 [-webkit-overflow-scrolling:touch]">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => selectTab(key)}
            className={`min-h-11 shrink-0 rounded-full px-4 py-2 font-medium transition ${
              tab === key ? "bg-eco-navy text-white" : "bg-white text-eco-muted ring-1 ring-eco-border"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "goals" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {DEMO_GOALS.map((g) => {
            const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            return (
              <article
                key={g.id}
                className="rounded-2xl border border-eco-border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
                      {g.type}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-eco-navy">{g.title}</h2>
                  </div>
                  <span className="text-sm font-semibold text-eco-teal-dark">{pct}%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-eco-surface">
                  <div className="h-full rounded-full bg-eco-teal" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-3 text-sm text-eco-muted">
                  {formatGhs(g.currentAmount)} of {formatGhs(g.targetAmount)} · target{" "}
                  {g.targetYear}
                </p>
                {g.microWins.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.microWins.map((w) => (
                      <span
                        key={w}
                        className="rounded-full bg-eco-surface px-2.5 py-1 text-[11px] text-eco-muted ring-1 ring-eco-border"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href="/rm/meeting?step=2"
                  className="mt-5 flex min-h-11 w-full items-center justify-center rounded-xl border border-eco-border py-3 text-center text-sm font-medium text-eco-navy hover:bg-eco-surface"
                >
                  {t("cweb_whatIf")}
                </Link>
              </article>
            );
          })}
        </div>
      )}

      {tab === "investments" && (
        <div className="space-y-6">
        <CurrencyToggle />
        <RebalancePreview />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-eco-border bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-eco-navy">{t("cweb_holdingsTitle")}</h2>
            <p className="mt-1 text-xs text-eco-muted">{t("cweb_holdingsSub")}</p>
            <ul className="mt-4 divide-y divide-eco-border text-sm">
              {HOLDINGS_MOCK.map((h) => (
                <li key={h.name} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-eco-ink">{h.name}</p>
                    <p className="text-xs text-eco-muted">{t("cweb_feedsGoals")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-eco-navy">{formatGhs(h.value)}</p>
                    <p className="text-[11px] text-eco-muted">{h.source}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-eco-border bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-eco-navy">{t("cweb_automation")}</h2>
            <p className="mt-2 text-xs leading-relaxed text-eco-muted">{t("cweb_automationSub")}</p>
            <Link
              href="/rm/markets"
              className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-2.5 text-sm font-semibold text-white hover:bg-eco-navy/90"
            >
              {t("cweb_configureSweep")}
            </Link>
          </div>
        </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-eco-teal/30 bg-eco-teal-muted/40 p-5">
            <p className="text-sm font-semibold text-eco-teal-dark">{t("cweb_nudgeTitle")}</p>
            <p className="mt-2 text-sm text-eco-ink">{t("cweb_nudgeBody")}</p>
            <Link
              href="/rm/meeting"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-eco-navy shadow-sm hover:bg-eco-surface"
            >
              {t("cweb_discussAdvisor")}
            </Link>
          </div>
          <div className="rounded-2xl border border-eco-border bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-eco-navy">{t("cweb_branchMsgTitle")}</p>
            <p className="mt-2 text-sm text-eco-muted">{t("cweb_branchMsgBody")}</p>
          </div>
        </div>
      )}

      {tab === "profile" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-eco-border bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-eco-navy">{t("cweb_a11yTitle")}</h2>
            <p className="mt-2 text-xs text-eco-muted">{t("cweb_a11ySub")}</p>
            <label className="mt-4 flex items-center justify-between gap-3 text-sm">
              {t("cweb_largeType")}
              <input type="checkbox" className="accent-eco-teal" defaultChecked />
            </label>
            <label className="mt-3 flex items-center justify-between gap-3 text-sm">
              {t("cweb_reduceMotion")}
              <input type="checkbox" className="accent-eco-teal" />
            </label>
          </div>
          <div className="rounded-2xl border border-eco-border bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-eco-navy">{t("cweb_securityTitle")}</h2>
            <ul className="mt-3 space-y-2 text-xs text-eco-muted">
              <li>• {t("cweb_security1")}</li>
              <li>• {t("cweb_security2")}</li>
              <li>• {t("cweb_security3")}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientSkeleton() {
  return <div className="h-[min(60vh,28rem)] animate-pulse rounded-2xl bg-eco-surface" />;
}

export default function ClientWebPage() {
  return (
    <Suspense fallback={<ClientSkeleton />}>
      <ClientWebContent />
    </Suspense>
  );
}
