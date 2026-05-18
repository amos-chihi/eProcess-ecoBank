"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { CROSS_SELL_PRODUCTS } from "@/lib/ecobank-capabilities-data";
import type { DemoMsgKey } from "@/lib/demo-i18n";

const CATEGORY_KEYS: Record<string, DemoMsgKey> = {
  savings: "xs_cat_savings",
  insurance: "xs_cat_insurance",
  lending: "xs_cat_lending",
  wealth: "xs_cat_wealth",
};

export function CrossSellPanel({ meetingMode }: { meetingMode?: boolean }) {
  const { t } = useDemoLocale();
  const [added, setAdded] = useState<string[]>([]);

  const toggle = (id: string, needsSuit: boolean) => {
    if (added.includes(id)) {
      setAdded((prev) => prev.filter((x) => x !== id));
      return;
    }
    setAdded((prev) => [...prev, id]);
    if (needsSuit) {
      window.open("/rm/compliance", "_blank", "noopener");
    }
  };

  return (
    <div className="rounded-xl border border-eco-border bg-gradient-to-br from-eco-teal-muted/30 to-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-eco-navy">{t("xs_title")}</p>
      <p className="mt-1 text-xs text-eco-muted">{t("xs_sub")}</p>
      <ul className="mt-4 space-y-2">
        {CROSS_SELL_PRODUCTS.map((p) => {
          const isAdded = added.includes(p.id);
          return (
            <li
              key={p.id}
              className={`rounded-lg border p-3 text-xs transition ${
                isAdded ? "border-eco-teal bg-eco-teal-muted/40" : "border-eco-border bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded-full bg-eco-surface px-1.5 py-0.5 text-[9px] font-semibold uppercase text-eco-muted">
                    {t(CATEGORY_KEYS[p.category])}
                  </span>
                  <p className="mt-1 font-medium text-eco-navy">{p.name}</p>
                  <p className="mt-1 text-eco-muted">{t(p.fitReasonKey as DemoMsgKey)}</p>
                </div>
                {p.suitabilityRequired && (
                  <span className="shrink-0 text-[10px] font-semibold text-amber-800">
                    {t("xs_suit_required")}
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggle(p.id, p.suitabilityRequired)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
                    isAdded
                      ? "bg-eco-teal text-white"
                      : "bg-eco-navy text-white hover:bg-eco-navy/90"
                  }`}
                >
                  {isAdded ? t("xs_added") : t("xs_add_pack")}
                </button>
                {p.suitabilityRequired && (
                  <Link
                    href="/rm/compliance"
                    className="rounded-lg border border-eco-border px-2.5 py-1.5 text-[11px] font-medium text-eco-teal-dark hover:bg-eco-surface"
                  >
                    {t("xs_open_compliance")}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {meetingMode && added.length > 0 && (
        <p className="mt-3 text-[11px] text-eco-teal-dark">{t("xs_meeting_note")}</p>
      )}
    </div>
  );
}
