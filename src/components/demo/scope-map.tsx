"use client";

import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";

type ScopeItem = {
  id: string;
  title: string;
  bullets: string[];
  href: string;
  label: string;
};

const PRODUCT_PILLARS: ScopeItem[] = [
  {
    id: "1",
    title: "Dynamic goal planning & simulations",
    bullets: ["SMART goals", "What-if pathways", "Micro-success tracking"],
    href: "/rm/goals",
    label: "Goal library",
  },
  {
    id: "2",
    title: "Client lifecycle & CRM",
    bullets: ["Onboarding wizard", "Client 360", "Household / SME"],
    href: "/rm/onboarding",
    label: "Onboarding",
  },
  {
    id: "3",
    title: "Investment & wealth",
    bullets: ["Goal sleeves", "Recommendations", "Multi-currency"],
    href: "/client?tab=investments",
    label: "Client investments",
  },
  {
    id: "3b",
    title: "Fund house connectivity",
    bullets: ["AMC partners", "Cut-offs & NAV", "Factsheet · order stub"],
    href: "/rm/integrations#fund-houses-detail",
    label: "Fund houses",
  },
  {
    id: "4",
    title: "Multi-country deployment",
    bullets: ["Market clusters", "Tax config", "Disclosure packs"],
    href: "/rm/markets",
    label: "Markets",
  },
];

const FUNCTIONAL_MODULES: ScopeItem[] = [
  {
    id: "5",
    title: "Localized financial planning",
    bullets: ["Tax rules", "EN / FR / PT", "Ecobank cross-sell"],
    href: "/rm/markets",
    label: "Markets",
  },
  {
    id: "6",
    title: "Compliance & suitability",
    bullets: ["Embedded prompts", "Document vault", "Audit narrative"],
    href: "/rm/compliance",
    label: "Compliance",
  },
  {
    id: "7",
    title: "Advisor enablement",
    bullets: ["Meeting stepper", "Goal-based sales", "Co-planning"],
    href: "/rm/meeting",
    label: "Meeting mode",
  },
  {
    id: "7b",
    title: "Robo advisory",
    bullets: ["Rule proposals", "Accept / defer", "Audit trail"],
    href: "/rm/robo",
    label: "Robo desk",
  },
  {
    id: "8",
    title: "Learning & RM uplift",
    bullets: [
      "L&D publish workflow",
      "FPS programmes in-app",
      "Assignments · transcript · HR sync",
    ],
    href: "/rm/learning",
    label: "Learning",
  },
];

const ARCHITECTURE: ScopeItem[] = [
  {
    id: "9",
    title: "Omnichannel experience",
    bullets: ["RM ↔ client continuity", "Handoff banner", "Mobile-first"],
    href: "/client-mobile?handoff=1",
    label: "Mobile handoff",
  },
  {
    id: "10",
    title: "API-first architecture",
    bullets: ["Integration health", "CRM / core / risk", "Event-ready story"],
    href: "/rm/integrations",
    label: "Integrations",
  },
  {
    id: "11",
    title: "AI personalization",
    bullets: ["Early warnings", "Predictive nudges", "Explainable insights"],
    href: "/rm/client-360",
    label: "Insights",
  },
  {
    id: "12",
    title: "Security & compliance",
    bullets: ["SSO / MFA", "RBAC badge", "Encrypted vault"],
    href: "/login",
    label: "Login · MFA",
  },
];

function ScopeColumn({
  heading,
  items,
}: {
  heading: string;
  items: ScopeItem[];
}) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-eco-muted">
        {heading}
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-eco-border bg-white p-4 shadow-sm transition hover:border-eco-teal/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="shrink-0 rounded-full bg-eco-navy/10 px-2 py-0.5 text-[10px] font-bold text-eco-navy">
                {item.id}
              </span>
              <Link
                href={item.href}
                className="shrink-0 text-[11px] font-semibold text-eco-teal-dark hover:underline"
              >
                {item.label} →
              </Link>
            </div>
            <p className="mt-2 text-sm font-semibold leading-snug text-eco-navy">
              {item.title}
            </p>
            <ul className="mt-2 space-y-0.5 text-[11px] text-eco-muted">
              {item.bullets.map((b) => (
                <li key={b}>· {b}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ScopeMap() {
  const { t } = useDemoLocale();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 pb-16">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-eco-navy">{t("land_scopeTitle")}</h2>
        <p className="mt-2 text-sm text-eco-muted">{t("land_scopeSub")}</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <ScopeColumn heading="Product capabilities (§2.2)" items={PRODUCT_PILLARS} />
        <ScopeColumn heading="Functional modules (5–8)" items={FUNCTIONAL_MODULES} />
        <ScopeColumn heading="Architecture (9–12)" items={ARCHITECTURE} />
      </div>
    </div>
  );
}
