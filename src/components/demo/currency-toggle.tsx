"use client";

import { useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";

const CURRENCIES = [
  { code: "GHS", label: "Ghana cedi" },
  { code: "USD", label: "US dollar (reporting)" },
  { code: "EUR", label: "Euro sleeve" },
] as const;

export function CurrencyToggle() {
  const { t } = useDemoLocale();
  const [code, setCode] = useState<(typeof CURRENCIES)[number]["code"]>("GHS");

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-eco-border bg-white px-4 py-3 text-xs shadow-sm">
      <span className="font-medium text-eco-muted">{t("cweb_reportingCurrency")}:</span>
      <div className="flex flex-wrap gap-2">
        {CURRENCIES.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => setCode(c.code)}
            className={`rounded-full border px-3 py-1.5 font-medium transition ${
              code === c.code
                ? "border-eco-teal-dark bg-eco-teal-muted text-eco-navy"
                : "border-eco-border bg-eco-surface text-eco-muted hover:text-eco-ink"
            }`}
            title={c.label}
          >
            {c.code}
          </button>
        ))}
      </div>
      <span className="text-eco-muted">
        {t("cweb_displayCurrency")}: <strong className="text-eco-ink">{code}</strong> (demo)
      </span>
    </div>
  );
}
