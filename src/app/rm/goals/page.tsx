"use client";

import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoMsgKey } from "@/lib/demo-i18n";
import { DEMO_GOALS, type DemoGoal } from "@/lib/demo-data";
import { formatGhs } from "@/lib/format";

const SMART_KEYS: DemoMsgKey[] = [
  "goals_smart_specific",
  "goals_smart_measurable",
  "goals_smart_achievable",
  "goals_smart_relevant",
  "goals_smart_timed",
];

const TEMPLATES: {
  type: DemoGoal["type"];
  titleKey: DemoMsgKey;
  desc: string;
  exampleTarget: number;
  exampleYear: number;
}[] = [
  {
    type: "retirement",
    titleKey: "goalType_retirement",
    desc: "Income replacement, glidepath, early retirement what-if.",
    exampleTarget: 2_400_000,
    exampleYear: 2046,
  },
  {
    type: "education",
    titleKey: "goalType_education",
    desc: "Beneficiary-linked funding, inflation for tuition, recurring top-ups.",
    exampleTarget: 420_000,
    exampleYear: 2032,
  },
  {
    type: "savings",
    titleKey: "goalType_savings",
    desc: "Near-term milestones — property, travel, liquidity buffers.",
    exampleTarget: 180_000,
    exampleYear: 2029,
  },
  {
    type: "risk",
    titleKey: "goalType_risk",
    desc: "Protection gaps — life, health, income shock coverage.",
    exampleTarget: 500_000,
    exampleYear: 2028,
  },
];

function goalTypeKey(type: DemoGoal["type"]): DemoMsgKey {
  switch (type) {
    case "retirement":
      return "goalType_retirement";
    case "education":
      return "goalType_education";
    case "savings":
      return "goalType_savings";
    case "risk":
      return "goalType_risk";
    default:
      return "goalType_savings";
  }
}

export default function GoalsLibraryPage() {
  const { t } = useDemoLocale();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
          {t("goals_kicker")}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-eco-navy">{t("goals_title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-eco-muted">{t("goals_sub")}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {TEMPLATES.map((tpl) => {
          const active = DEMO_GOALS.find((g) => g.type === tpl.type);
          return (
            <article
              key={tpl.type}
              className="flex flex-col rounded-xl border border-eco-border bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-eco-teal-dark">
                {t(tpl.titleKey)}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-eco-navy">
                {active?.title ?? t(tpl.titleKey)}
              </h2>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-eco-muted">{tpl.desc}</p>
              <p className="mt-3 text-sm text-eco-ink">
                Example: {formatGhs(tpl.exampleTarget)} · {tpl.exampleYear}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {SMART_KEYS.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-eco-surface px-2 py-0.5 text-[10px] font-medium text-eco-muted"
                  >
                    {t(k).charAt(0)}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-eco-border px-3 py-2 text-xs font-medium text-eco-navy hover:bg-eco-surface"
                >
                  {t("goals_create")}
                </button>
                <Link
                  href="/rm/meeting?step=2"
                  className="rounded-lg bg-eco-teal px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
                >
                  {t("goals_simulate")}
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-xl border border-dashed border-eco-border bg-eco-surface/60 px-5 py-4 text-xs text-eco-muted">
        Active client goals:{" "}
        {DEMO_GOALS.map((g) => (
          <span key={g.id} className="mr-2 inline-flex items-center gap-1">
            <strong className="text-eco-ink">{g.title}</strong>
            <span>({t(goalTypeKey(g.type))})</span>
          </span>
        ))}
        — open{" "}
        <Link href="/rm/client-360" className="font-semibold text-eco-teal-dark hover:underline">
          Client 360
        </Link>
      </section>
    </div>
  );
}
