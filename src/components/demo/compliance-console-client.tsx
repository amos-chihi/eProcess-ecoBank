"use client";

import { useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoMsgKey } from "@/lib/demo-i18n";

const PROMPT_CONFIG: {
  id: string;
  titleKey: DemoMsgKey;
  itemKeys: DemoMsgKey[];
}[] = [
  {
    id: "suitability",
    titleKey: "comp_prompt_suit_title",
    itemKeys: ["comp_prompt_suit_0", "comp_prompt_suit_1"],
  },
  {
    id: "affordability",
    titleKey: "comp_prompt_aff_title",
    itemKeys: ["comp_prompt_aff_0", "comp_prompt_aff_1"],
  },
  {
    id: "appropriateness",
    titleKey: "comp_prompt_approp_title",
    itemKeys: ["comp_prompt_approp_0", "comp_prompt_approp_1"],
  },
];

export function ComplianceConsoleClient() {
  const { t } = useDemoLocale();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setChecked((c) => ({ ...c, [key]: !c[key] }));

  const current = PROMPT_CONFIG[step];
  const allCheckedForStep =
    current?.itemKeys.every((_, i) => checked[`${current.id}-${i}`]) ?? false;

  const closeModal = () => {
    setOpen(false);
    setStep(0);
    setChecked({});
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-eco-navy px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-eco-navy/90"
      >
        {t("comp_runFlow")}
      </button>

      {open && current && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-eco-navy/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="compliance-flow-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-eco-border bg-white shadow-2xl">
            <div className="border-b border-eco-border px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
                {t("comp_modalKicker")}
              </p>
              <h2 id="compliance-flow-title" className="mt-1 text-lg font-semibold text-eco-navy">
                {t(current.titleKey)}
              </h2>
              <p className="mt-1 text-xs text-eco-muted">
                {t("comp_modalStep", { c: step + 1, t: PROMPT_CONFIG.length })}
              </p>
            </div>
            <div className="max-h-[50vh] space-y-3 overflow-y-auto px-5 py-4">
              {current.itemKeys.map((lineKey, idx) => {
                const key = `${current.id}-${idx}`;
                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                      checked[key]
                        ? "border-eco-teal-dark bg-eco-teal-muted/40"
                        : "border-eco-border bg-eco-surface/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(checked[key])}
                      onChange={() => toggle(key)}
                      className="mt-0.5 accent-eco-teal"
                    />
                    <span className="leading-snug text-eco-ink">{t(lineKey)}</span>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-between gap-3 border-t border-eco-border px-5 py-4">
              <button
                type="button"
                onClick={() => (step === 0 ? closeModal() : setStep((s) => s - 1))}
                className="rounded-lg border border-eco-border px-4 py-2 text-sm font-medium text-eco-ink"
              >
                {step === 0 ? t("comp_cancel") : t("meet_back")}
              </button>
              <div className="flex gap-2">
                {step < PROMPT_CONFIG.length - 1 ? (
                  <button
                    type="button"
                    disabled={!allCheckedForStep}
                    onClick={() => setStep((s) => s + 1)}
                    className="rounded-lg bg-eco-navy px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("meet_continue")}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!allCheckedForStep}
                    onClick={closeModal}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("comp_seal")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
