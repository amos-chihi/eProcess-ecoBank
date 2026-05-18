"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isLearningPath } from "@/components/demo/learning/learning-utils";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { DEMO_LOCALES, type DemoLocale, type DemoMsgKey } from "@/lib/demo-i18n";

const NAV_ITEMS: { href: string; key: DemoMsgKey }[] = [
  { href: "/rm", key: "nav_home" },
  { href: "/rm/client-360", key: "nav_client360" },
  { href: "/rm/onboarding", key: "nav_onboarding" },
  { href: "/rm/goals", key: "nav_goals" },
  { href: "/rm/meeting", key: "nav_meeting" },
  { href: "/rm/markets", key: "nav_markets" },
  { href: "/admin/markets", key: "nav_admin" },
  { href: "/rm/compliance", key: "nav_compliance" },
  { href: "/client", key: "nav_clientWeb" },
  { href: "/client-mobile", key: "nav_clientMobile" },
];

const LEARNING_NAV: { href: string; key: DemoMsgKey; exact?: boolean }[] = [
  { href: "/rm/learning", key: "nav_learn_overview", exact: true },
  { href: "/rm/learning/programmes", key: "nav_learn_programmes" },
  { href: "/rm/learning/assignments", key: "nav_learn_assignments" },
  { href: "/rm/learning/upcoming", key: "nav_learn_upcoming" },
  { href: "/rm/learning/competencies", key: "nav_learn_competencies" },
  { href: "/rm/learning/career-paths", key: "nav_learn_career" },
  { href: "/rm/learning/transcript", key: "nav_learn_transcript" },
  { href: "/rm/learning/hr-portal", key: "nav_learn_hr" },
];

function pathMatchesNav(href: string, pathname: string | null) {
  if (!pathname) return false;
  if (href === "/rm") return pathname === "/rm";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function learningChildActive(
  item: (typeof LEARNING_NAV)[number],
  pathname: string | null,
) {
  if (!pathname) return false;
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function ShellRM({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const { locale, setLocale, t } = useDemoLocale();
  const learningActive = isLearningPath(pathname);

  useEffect(() => {
    if (learningActive) setLearningOpen(true);
  }, [learningActive, pathname]);

  const langLabels = useMemo(
    (): Record<DemoLocale, DemoMsgKey> => ({
      en: "lang_en",
      fr: "lang_fr",
      pt: "lang_pt",
    }),
    [],
  );

  return (
    <div className="flex min-h-screen bg-eco-surface text-eco-ink">
      {menuOpen ? (
        <button
          type="button"
          aria-label={t("shell_closeMenu")}
          className="fixed inset-0 z-[60] bg-eco-navy/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside
        id="rm-nav-drawer"
        className={`fixed inset-y-0 left-0 z-[70] flex w-[min(16rem,88vw)] max-w-[16rem] flex-col border-r border-eco-border bg-eco-navy text-white shadow-xl transition-transform duration-200 lg:static lg:z-0 lg:w-56 lg:max-w-none lg:shrink-0 lg:shadow-none ${
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="border-b border-white/10 px-4 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-white/60">
            eProcess
          </p>
          <p className="mt-1 text-sm font-semibold">{t("shell_rmWorkstation")}</p>
        </div>
        <nav
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2"
          aria-label={t("shell_navAria")}
        >
          {NAV_ITEMS.slice(0, 8).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`rounded-lg px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 active:bg-white/15 min-h-11 content-center ${
                pathMatchesNav(item.href, pathname)
                  ? "bg-white/10 font-semibold text-white"
                  : ""
              }`}
            >
              {t(item.key)}
            </Link>
          ))}

          <div className="flex flex-col gap-0.5">
            <div className="flex min-h-11 items-stretch gap-0.5">
              <Link
                href="/rm/learning"
                onClick={closeMenu}
                className={`flex flex-1 items-center rounded-lg px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 active:bg-white/15 ${
                  learningActive ? "bg-white/10 font-semibold text-white" : ""
                }`}
              >
                {t("nav_learning")}
              </Link>
              <button
                type="button"
                aria-expanded={learningOpen}
                aria-label={learningOpen ? t("nav_learning_collapse") : t("nav_learning_expand")}
                onClick={() => setLearningOpen((o) => !o)}
                className="inline-flex w-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10"
              >
                <svg
                  aria-hidden
                  className={`h-4 w-4 transition-transform ${learningOpen ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            {learningOpen
              ? LEARNING_NAV.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={closeMenu}
                    className={`ml-3 rounded-lg border-l border-white/15 py-2 pl-4 pr-3 text-[13px] text-white/75 transition hover:bg-white/10 hover:text-white min-h-10 content-center ${
                      learningChildActive(child, pathname)
                        ? "border-white/40 bg-white/10 font-semibold text-white"
                        : ""
                    }`}
                  >
                    {t(child.key)}
                  </Link>
                ))
              : null}
          </div>

          {NAV_ITEMS.slice(8).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`rounded-lg px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 active:bg-white/15 min-h-11 content-center ${
                pathMatchesNav(item.href, pathname)
                  ? "bg-white/10 font-semibold text-white"
                  : ""
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 space-y-2 p-3">
          <Link
            href="/"
            onClick={closeMenu}
            className="block rounded-md px-1 py-2 text-xs text-white/70 transition hover:bg-white/5 hover:text-white min-h-11 leading-snug content-center"
          >
            ← {t("shell_demoLanding")}
          </Link>
          <Link
            href="/present/meeting"
            onClick={closeMenu}
            className="block rounded-md px-1 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white min-h-11 leading-snug content-center"
          >
            {t("shell_presenterMode")}
          </Link>
          <p className="text-xs leading-relaxed text-white/50 px-1">{t("shell_protoNote")}</p>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-eco-border bg-white px-3 py-3 sm:flex-nowrap sm:px-6 sm:py-0">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:flex-nowrap">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="rm-nav-drawer"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-eco-border text-eco-navy lg:hidden hover:bg-eco-surface"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="sr-only">
                {menuOpen ? t("shell_closeMenu") : t("shell_openMenu")}
              </span>
              <svg
                aria-hidden
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
            <div className="min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="truncate text-xs font-medium text-eco-muted sm:text-sm">
                {t("shell_ecobank")}
              </span>
              <span className="shrink-0 rounded-full bg-eco-teal-muted px-2 py-0.5 text-[11px] font-medium text-eco-teal-dark sm:text-xs">
                {t("shell_advisorBadge")}
              </span>
              <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 lg:inline">
                {t("shell_sso")}
              </span>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-end gap-x-2 gap-y-1 text-[11px] text-eco-muted sm:w-auto sm:justify-normal sm:text-xs">
            {DEMO_LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded border border-eco-border px-2 py-1 min-h-8 content-center shrink-0 transition ${
                  locale === code
                    ? "border-eco-teal-dark bg-eco-teal-muted/50 font-semibold text-eco-navy"
                    : "bg-white text-eco-muted hover:border-eco-border hover:text-eco-ink"
                }`}
              >
                {t(langLabels[code])}
              </button>
            ))}
            <span className="ml-1 shrink-0 truncate rounded-full bg-eco-surface px-2 py-1 font-medium text-eco-ink max-[360px]:text-[10px]">
              {t("shell_regionGh")} GH
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-x-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
