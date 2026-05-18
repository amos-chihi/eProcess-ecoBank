"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ScopeMap } from "@/components/demo/scope-map";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { DEMO_LOCALES, type DemoLocale, type DemoMsgKey } from "@/lib/demo-i18n";

type Capability = {
  titleKey: DemoMsgKey;
  descKey: DemoMsgKey;
  href: string;
  ctaKey: DemoMsgKey;
};

type CapabilityGroup = {
  headingKey: DemoMsgKey;
  items: Capability[];
};

const ROLE_CARDS: {
  href: string;
  titleKey: DemoMsgKey;
  descKey: DemoMsgKey;
  ctaKey: DemoMsgKey;
  accent: string;
}[] = [
  {
    href: "/login",
    titleKey: "land_role_rm_title",
    descKey: "land_role_rm_desc",
    ctaKey: "land_role_rm_cta",
    accent: "from-eco-navy to-[#0a3d6e]",
  },
  {
    href: "/client",
    titleKey: "land_role_client_title",
    descKey: "land_role_client_desc",
    ctaKey: "land_role_client_cta",
    accent: "from-eco-teal-dark to-eco-teal",
  },
  {
    href: "/client-mobile",
    titleKey: "land_role_mobile_title",
    descKey: "land_role_mobile_desc",
    ctaKey: "land_role_mobile_cta",
    accent: "from-slate-700 to-slate-900",
  },
];

const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    headingKey: "land_group_planning",
    items: [
      {
        titleKey: "land_cap_goals_title",
        descKey: "land_cap_goals_desc",
        href: "/rm/goals",
        ctaKey: "land_cap_goals_cta",
      },
      {
        titleKey: "land_cap_markets_title",
        descKey: "land_cap_markets_desc",
        href: "/rm/markets",
        ctaKey: "land_cap_markets_cta",
      },
      {
        titleKey: "land_cap_invest_title",
        descKey: "land_cap_invest_desc",
        href: "/client?tab=investments",
        ctaKey: "land_cap_invest_cta",
      },
    ],
  },
  {
    headingKey: "land_group_advisory",
    items: [
      {
        titleKey: "land_cap_onboard_title",
        descKey: "land_cap_onboard_desc",
        href: "/rm/onboarding",
        ctaKey: "land_cap_onboard_cta",
      },
      {
        titleKey: "land_cap_c360_title",
        descKey: "land_cap_c360_desc",
        href: "/rm/client-360",
        ctaKey: "land_cap_c360_cta",
      },
      {
        titleKey: "land_cap_meeting_title",
        descKey: "land_cap_meeting_desc",
        href: "/rm/meeting",
        ctaKey: "land_cap_meeting_cta",
      },
    ],
  },
  {
    headingKey: "land_group_governance",
    items: [
      {
        titleKey: "land_cap_compliance_title",
        descKey: "land_cap_compliance_desc",
        href: "/rm/compliance",
        ctaKey: "land_cap_compliance_cta",
      },
      {
        titleKey: "land_cap_learning_title",
        descKey: "land_cap_learning_desc",
        href: "/rm/learning",
        ctaKey: "land_cap_learning_cta",
      },
      {
        titleKey: "land_cap_security_title",
        descKey: "land_cap_security_desc",
        href: "/login",
        ctaKey: "land_cap_security_cta",
      },
      {
        titleKey: "land_cap_robo_title",
        descKey: "land_cap_robo_desc",
        href: "/rm/robo",
        ctaKey: "land_cap_robo_cta",
      },
      {
        titleKey: "land_cap_integrations_title",
        descKey: "land_cap_integrations_desc",
        href: "/rm/integrations",
        ctaKey: "land_cap_integrations_cta",
      },
    ],
  },
  {
    headingKey: "land_group_wealth",
    items: [
      {
        titleKey: "land_cap_fund_title",
        descKey: "land_cap_fund_desc",
        href: "/rm/integrations#fund-houses-detail",
        ctaKey: "land_cap_fund_cta",
      },
    ],
  },
];

const INTEGRATIONS: DemoMsgKey[] = [
  "land_int_crm",
  "land_int_core",
  "land_int_hr",
  "land_int_risk",
];

export function HomePortal() {
  const { locale, setLocale, t } = useDemoLocale();

  const langLabels = useMemo(
    (): Record<DemoLocale, DemoMsgKey> => ({
      en: "lang_en",
      fr: "lang_fr",
      pt: "lang_pt",
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9]">
      {/* App chrome */}
      <header className="sticky top-0 z-50 border-b border-eco-border/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-eco-navy text-sm font-bold text-white">
              eP
            </div>
            <div>
              <p className="text-sm font-semibold text-eco-navy">eProcess</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-eco-muted">
                {t("land_kicker")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-1 sm:flex">
              {DEMO_LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`rounded border px-2 py-1 text-xs font-medium transition ${
                    locale === code
                      ? "border-eco-teal-dark bg-eco-teal-muted/50 text-eco-navy"
                      : "border-transparent text-eco-muted hover:border-eco-border"
                  }`}
                >
                  {t(langLabels[code])}
                </button>
              ))}
            </div>
            <Link
              href="/login"
              className="rounded-lg bg-eco-navy px-4 py-2 text-sm font-semibold text-white hover:bg-eco-navy/90"
            >
              {t("land_signIn")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-eco-navy via-[#0f3460] to-eco-navy text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #2dd4bf 0%, transparent 50%), radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {t("land_kicker")}
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {t("land_title")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {t("land_body")}
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {[
              { label: t("land_stat_markets"), icon: "🌍" },
              { label: t("land_stat_channels"), icon: "↔" },
              { label: t("land_stat_security"), icon: "🔐" },
            ].map((stat) => (
              <li
                key={stat.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm"
              >
                <span aria-hidden>{stat.icon}</span>
                {stat.label}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-eco-teal px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-eco-teal-dark"
            >
              {t("land_signIn")}
            </Link>
            <Link
              href="/rm"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {t("land_openRm")}
            </Link>
          </div>
        </div>
      </section>

      {/* Role entry */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-eco-navy">{t("land_roles_title")}</h2>
          <p className="mt-2 text-sm text-eco-muted">{t("land_roles_sub")}</p>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {ROLE_CARDS.map((role) => (
            <li key={role.href}>
              <Link
                href={role.href}
                className={`group flex h-full flex-col rounded-2xl bg-gradient-to-br ${role.accent} p-6 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl`}
              >
                <h3 className="text-lg font-semibold">{t(role.titleKey)}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/85">
                  {t(role.descKey)}
                </p>
                <span className="mt-6 inline-flex items-center text-sm font-semibold">
                  {t(role.ctaKey)}
                  <span className="ml-1 transition group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Capabilities */}
      <section className="border-t border-eco-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-eco-navy">{t("land_platform_title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-eco-muted">{t("land_platform_sub")}</p>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            {CAPABILITY_GROUPS.map((group) => (
              <div key={group.headingKey}>
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-eco-teal-dark">
                  {t(group.headingKey)}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-xl border border-eco-border bg-eco-surface/30 p-4 transition hover:border-eco-teal/40 hover:bg-white hover:shadow-md"
                      >
                        <p className="font-semibold text-eco-navy">{t(item.titleKey)}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-eco-muted">
                          {t(item.descKey)}
                        </p>
                        <span className="mt-3 inline-block text-xs font-semibold text-eco-teal-dark">
                          {t(item.ctaKey)} →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope map — 12 pillars */}
      <section className="border-t border-eco-border bg-eco-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <h2 className="text-center text-xl font-semibold text-eco-navy">{t("land_scope_section")}</h2>
        </div>
        <ScopeMap />
      </section>

      {/* Integrations */}
      <section className="border-t border-eco-border bg-eco-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-eco-muted">
            {t("land_integrations_label")}
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {INTEGRATIONS.map((key) => (
              <li
                key={key}
                className="rounded-lg border border-eco-border bg-white px-4 py-2.5 text-sm font-medium text-eco-navy shadow-sm"
              >
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-eco-border bg-eco-navy text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <p className="text-xs">{t("land_footer_copy")}</p>
          <nav className="flex flex-wrap justify-center gap-4 text-xs">
            <Link href="/present/meeting" className="hover:text-white">
              {t("land_presenter")}
            </Link>
            <Link href="/admin/learning" className="hover:text-white">
              {t("land_admin")}
            </Link>
            <Link href="/admin/markets" className="hover:text-white">
              {t("land_admin_markets")}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
