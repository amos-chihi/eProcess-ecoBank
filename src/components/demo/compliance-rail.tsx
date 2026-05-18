"use client";

import type { DemoMsgKey } from "@/lib/demo-i18n";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import {
  COMPLIANCE_CHECKS,
  type DemoComplianceRow,
} from "@/lib/demo-data";

const CMP_ROW_LABEL: Record<DemoComplianceRow["id"], DemoMsgKey> = {
  suit: "cmp_suitability",
  aff: "cmp_afford",
  approp: "cmp_approp",
  disc: "cmp_disc_reg",
  tax: "cmp_tax_confirm",
  consent: "cmp_consent",
};

export function ComplianceRail({
  variant = "sidebar",
}: {
  variant?: "sidebar" | "compact";
}) {
  const { t } = useDemoLocale();
  const total = COMPLIANCE_CHECKS.length;
  const done = COMPLIANCE_CHECKS.filter((c) => c.done).length;

  const inner = (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-eco-ink">{t("cmp_rail_title")}</p>
        <span className="text-xs font-medium text-eco-teal-dark">
          {done}/{total}
        </span>
      </div>
      <ul className="space-y-2">
        {COMPLIANCE_CHECKS.map((c) => (
          <li
            key={c.id}
            className={`flex items-start gap-2 text-xs ${
              c.done ? "text-eco-muted" : "font-medium text-amber-900"
            }`}
          >
            <span
              className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                c.done
                  ? "border-eco-teal-dark bg-eco-teal-muted text-eco-teal-dark"
                  : "border-amber-300 bg-amber-50"
              }`}
            >
              {c.done ? "✓" : "!"}
            </span>
            {t(CMP_ROW_LABEL[c.id])}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] leading-relaxed text-eco-muted">
        {t("cmp_rail_footnote")}
      </p>
    </>
  );

  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-eco-border bg-white p-4 shadow-sm">{inner}</div>
    );
  }

  return (
    <div className="sticky top-20 w-full shrink-0 rounded-xl border border-eco-border bg-white p-4 shadow-sm lg:top-24 lg:w-72">
      {inner}
    </div>
  );
}
