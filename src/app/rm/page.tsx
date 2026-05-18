"use client";

import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoMsgKey } from "@/lib/demo-i18n";
import {
  EARLY_WARNINGS,
  RM_TASKS,
  TODAY_AGENDA,
} from "@/lib/demo-data";

const MODULE_CARDS: { titleKey: DemoMsgKey; bodyKey: DemoMsgKey; href: string }[] = [
  { titleKey: "mod_c360_t", bodyKey: "mod_c360_d", href: "/rm/client-360" },
  { titleKey: "mod_onboard_t", bodyKey: "mod_onboard_d", href: "/rm/onboarding" },
  { titleKey: "mod_goals_t", bodyKey: "mod_goals_d", href: "/rm/goals" },
  { titleKey: "mod_mtg_t", bodyKey: "mod_mtg_d", href: "/rm/meeting" },
  { titleKey: "mod_mk_t", bodyKey: "mod_mk_d", href: "/rm/markets" },
  { titleKey: "mod_comp_t", bodyKey: "mod_comp_d", href: "/rm/compliance" },
  { titleKey: "mod_robo_t", bodyKey: "mod_robo_d", href: "/rm/robo" },
  { titleKey: "mod_int_t", bodyKey: "mod_int_d", href: "/rm/integrations" },
  { titleKey: "mod_fund_t", bodyKey: "mod_fund_d", href: "/rm/integrations#fund-houses-detail" },
  { titleKey: "mod_learn_t", bodyKey: "mod_learn_d", href: "/rm/learning" },
  { titleKey: "mod_cwb_t", bodyKey: "mod_cwb_d", href: "/client" },
  { titleKey: "mod_cmob_t", bodyKey: "mod_cmob_d", href: "/client-mobile" },
  { titleKey: "mod_pres_t", bodyKey: "mod_pres_d", href: "/present/meeting" },
  { titleKey: "mod_adm_t", bodyKey: "mod_adm_d", href: "/admin/markets" },
];

export default function RmHome() {
  const { t } = useDemoLocale();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-eco-navy">{t("rm_today_title")}</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-eco-muted">{t("rm_today_subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/rm/meeting"
            className="rounded-lg bg-eco-navy px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-eco-navy/90"
          >
            {t("rm_go_meeting")}
          </Link>
          <Link
            href="/present/meeting"
            className="rounded-lg border border-eco-border bg-white px-4 py-2.5 text-sm font-medium text-eco-navy hover:bg-eco-surface"
          >
            {t("rm_go_presenter")}
          </Link>
          <Link
            href="/rm/markets"
            className="rounded-lg border border-eco-border bg-white px-4 py-2.5 text-sm font-medium text-eco-navy hover:bg-eco-surface"
          >
            {t("rm_go_markets")}
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-eco-navy">{t("rm_agenda")}</h2>
            <span className="text-[11px] text-eco-muted">{t("rm_agenda_sub")}</span>
          </div>
          <ul className="mt-4 divide-y divide-eco-border">
            {TODAY_AGENDA.map((slot) => (
              <li
                key={`${slot.time}-${slot.clientName}`}
                className={`flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 ${
                  slot.highlight ? "rounded-lg bg-eco-teal-muted/35 px-2 -mx-2" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-eco-ink">{slot.clientName}</p>
                  <p className="text-xs text-eco-muted">{t(slot.topicKey)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-eco-navy">{slot.time}</span>
                  {slot.highlight && (
                    <Link
                      href="/rm/meeting"
                      className="text-[11px] font-semibold text-eco-teal-dark hover:underline"
                    >
                      {t("rm_launchArrow")}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-eco-navy">{t("rm_followUps")}</h2>
            <ul className="mt-3 space-y-3 text-xs">
              {RM_TASKS.map((task) => (
                <li key={task.id} className="flex gap-2">
                  <span
                    className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${
                      task.urgent ? "bg-amber-500" : "bg-eco-border"
                    }`}
                  />
                  {task.id === "tk3" ? (
                    <Link
                      href="/rm/learning"
                      className={`leading-snug hover:underline ${
                        task.urgent ? "font-medium text-amber-950" : "text-eco-muted"
                      }`}
                    >
                      {t(task.labelKey)}
                    </Link>
                  ) : (
                    <span
                      className={`leading-snug ${
                        task.urgent ? "font-medium text-amber-950" : "text-eco-muted"
                      }`}
                    >
                      {t(task.labelKey)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-amber-950">{t("rm_earlyWarn")}</h2>
            <ul className="mt-3 space-y-3 text-xs leading-relaxed">
              {EARLY_WARNINGS.map((w) => (
                <li key={w.id}>
                  <span className="font-semibold text-eco-navy">{w.clientLabel}: </span>
                  <span className="text-amber-950">{t(w.summaryKey)}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/rm/client-360"
              className="mt-3 inline-block text-[11px] font-semibold text-eco-teal-dark hover:underline"
            >
              {t("rm_openHighlighted")}
            </Link>
          </section>
        </aside>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-eco-muted">{t("rm_moduleMap")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MODULE_CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-xl border border-eco-border bg-white p-4 shadow-sm transition hover:border-eco-teal/45 hover:shadow-md"
            >
              <p className="font-semibold text-eco-navy group-hover:text-eco-teal-dark">
                {t(c.titleKey)}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-eco-muted">{t(c.bodyKey)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-eco-border bg-white/60 px-5 py-4 text-xs text-eco-muted">
        <p className="font-medium text-eco-ink">{t("rm_extPath_title")}</p>
        <ol className="mt-2 list-inside list-decimal space-y-1">
          <li>{t("rm_ext_path_1")}</li>
          <li>{t("rm_ext_path_2")}</li>
          <li>{t("rm_ext_path_3")}</li>
          <li>{t("rm_ext_path_4")}</li>
          <li>{t("rm_ext_path_5")}</li>
        </ol>
      </section>
    </div>
  );
}
