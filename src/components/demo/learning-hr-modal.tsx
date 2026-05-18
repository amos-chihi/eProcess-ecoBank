"use client";

import { useEffect, useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { HR_LD_INTEGRATION } from "@/lib/demo-data";

type SsoStep = "confirm" | "redirect" | "authenticated" | "ready";

export function LearningHrModal({
  onClose,
  onLaunch,
}: {
  onClose: () => void;
  onLaunch: () => void;
}) {
  const { t } = useDemoLocale();
  const [step, setStep] = useState<SsoStep>("confirm");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step === "confirm") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, step]);

  useEffect(() => {
    if (step !== "redirect") return;
    const t1 = window.setTimeout(() => setStep("authenticated"), 900);
    const t2 = window.setTimeout(() => setStep("ready"), 1800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [step]);

  const startSso = () => {
    setStep("redirect");
  };

  const finish = () => {
    onLaunch();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#201f1e]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={step === "confirm" ? onClose : undefined}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#e1dfdd] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-[#e1dfdd] bg-[#f3f2f1] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0078d4] text-sm font-bold text-white">
              W
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#605e5c]">
                Workday Learning
              </p>
              <p className="text-sm font-semibold text-[#323130]">Ecobank Group SSO</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          {step === "confirm" && (
            <>
              <h2 className="text-lg font-semibold text-eco-navy">{t("learn_hrModalTitle")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-eco-muted">{t("learn_hrModalBody")}</p>
              <dl className="mt-4 space-y-2 rounded-xl border border-[#e1dfdd] bg-[#faf9f8] px-4 py-3 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#605e5c]">{t("learn_hrModal_platform")}</dt>
                  <dd className="font-medium text-[#323130]">{HR_LD_INTEGRATION.platform}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#605e5c]">Employee ID</dt>
                  <dd className="font-mono font-medium text-[#323130]">
                    {HR_LD_INTEGRATION.employeeId}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#605e5c]">{t("learn_hrPlan")}</dt>
                  <dd className="max-w-[14rem] text-right font-medium text-[#323130]">
                    {HR_LD_INTEGRATION.assignedPlan}
                  </dd>
                </div>
              </dl>
              <ul className="mt-4 space-y-2 text-xs text-eco-muted">
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  {t("learn_hrModal_bullet1")}
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  {t("learn_hrModal_bullet2")}
                </li>
              </ul>
            </>
          )}

          {step !== "confirm" && (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#deecf9]">
                {step === "ready" ? (
                  <span className="text-2xl text-[#0078d4]">✓</span>
                ) : (
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#0078d4] border-t-transparent" />
                )}
              </div>
              <p className="mt-4 text-sm font-semibold text-[#323130]">
                {step === "redirect" && t("learn_hrModal_step_redirect")}
                {step === "authenticated" && t("learn_hrModal_step_auth")}
                {step === "ready" && t("learn_hrModal_step_ready")}
              </p>
              <p className="mt-2 text-xs text-[#605e5c]">{t("learn_hrModal_ssoHint")}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#e1dfdd] bg-[#faf9f8] px-6 py-4">
          {step === "confirm" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#e1dfdd] px-4 py-2 text-sm font-medium text-[#323130] hover:bg-white"
              >
                {t("learn_hrModalCancel")}
              </button>
              <button
                type="button"
                onClick={startSso}
                className="rounded-lg bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#106ebe]"
              >
                {t("learn_hrModalLaunch")}
              </button>
            </>
          ) : step === "ready" ? (
            <button
              type="button"
              onClick={finish}
              className="rounded-lg bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#106ebe]"
            >
              {t("learn_hrModal_done")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
