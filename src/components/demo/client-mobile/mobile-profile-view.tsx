"use client";

import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { DEMO_CLIENT } from "@/lib/demo-data";
import { DEMO_LOCALES, type DemoLocale, type DemoMsgKey } from "@/lib/demo-i18n";

export function MobileProfileView() {
  const { locale, setLocale, t } = useDemoLocale();
  const c = DEMO_CLIENT;

  const langKey: Record<DemoLocale, DemoMsgKey> = {
    en: "lang_en",
    fr: "lang_fr",
    pt: "lang_pt",
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-eco-border bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-eco-navy text-lg font-semibold text-white">
            {c.displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-eco-navy">{c.displayName}</p>
            <p className="text-xs text-eco-muted">{c.segment}</p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="text-eco-muted">{t("mob_profile_account")}</dt>
            <dd className="font-mono font-medium text-eco-ink">{c.id}</dd>
          </div>
          <div>
            <dt className="text-eco-muted">{t("mob_profile_synced")}</dt>
            <dd className="font-medium text-eco-ink">{c.crmSyncedAt}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-eco-border bg-white p-4">
        <p className="text-xs font-semibold text-eco-muted">{t("mob_profile_lang")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                locale === code
                  ? "border-eco-teal bg-eco-teal-muted text-eco-teal-dark"
                  : "border-eco-border text-eco-muted"
              }`}
            >
              {t(langKey[code])}
            </button>
          ))}
        </div>
      </div>

      <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-eco-border bg-white px-4 py-3 text-sm">
        <div>
          <span className="font-medium text-eco-ink">{t("cweb_largeType")}</span>
        </div>
        <input type="checkbox" className="h-6 w-6 shrink-0 accent-eco-teal" defaultChecked />
      </label>

      <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-eco-border bg-white px-4 py-3 text-sm">
        <div>
          <span className="font-medium text-eco-ink">{t("mob_profile_biometric")}</span>
          <p className="text-[11px] text-eco-muted">{t("mob_profile_biometric_sub")}</p>
        </div>
        <input type="checkbox" className="h-6 w-6 shrink-0 accent-eco-teal" defaultChecked />
      </label>

      <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-eco-border bg-white px-4 py-3 text-sm">
        {t("cweb_reduceMotion")}
        <input type="checkbox" className="h-6 w-6 shrink-0 accent-eco-teal" />
      </label>

      <div className="rounded-xl border border-eco-border bg-white p-4">
        <p className="text-sm font-semibold text-eco-navy">{t("mob_profile_security")}</p>
        <ul className="mt-3 space-y-2 text-xs text-eco-muted">
          <li>• {t("cweb_security1")}</li>
          <li>• {t("cweb_security2")}</li>
          <li>• {t("cweb_security3")}</li>
        </ul>
      </div>

      <p className="rounded-xl border border-dashed border-eco-border bg-eco-surface/40 px-4 py-3 text-center text-[11px] leading-relaxed text-eco-muted">
        {t("mob_profile_portal_hint")}
      </p>
    </div>
  );
}
