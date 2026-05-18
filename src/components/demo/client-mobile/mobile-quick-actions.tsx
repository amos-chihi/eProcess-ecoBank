"use client";

import { useDemoLocale } from "@/components/demo/demo-locale-provider";

export function MobileQuickActions({
  onOpenFunds,
  onOpenRobo,
  onOpenCrossSell,
  onOpenInsights,
}: {
  onOpenFunds: () => void;
  onOpenRobo: () => void;
  onOpenCrossSell: () => void;
  onOpenInsights: () => void;
}) {
  const { t } = useDemoLocale();
  const actions = [
    { label: t("mob_open_funds"), onClick: onOpenFunds },
    { label: t("mob_open_robo"), onClick: onOpenRobo },
    { label: t("mob_open_crosssell"), onClick: onOpenCrossSell },
    { label: t("mob_insights_title"), onClick: onOpenInsights },
  ];

  return (
    <section>
      <p className="text-xs font-semibold text-eco-muted">{t("mob_quick_actions")}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={a.onClick}
            className="min-h-11 rounded-xl border border-eco-border bg-white px-2 py-2.5 text-[11px] font-semibold leading-snug text-eco-navy active:bg-eco-surface"
          >
            {a.label}
          </button>
        ))}
      </div>
    </section>
  );
}
