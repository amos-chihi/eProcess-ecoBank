"use client";

import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoMsgKey } from "@/lib/demo-i18n";

export function LearningPageHeader({
  titleKey,
  subtitleKey,
}: {
  titleKey: DemoMsgKey;
  subtitleKey: DemoMsgKey;
}) {
  const { t } = useDemoLocale();

  return (
    <header className="border-b border-eco-border bg-white px-0 pb-6">
      <p className="text-xs font-medium uppercase tracking-wide text-eco-muted">
        {t("learn_section_label")}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-eco-navy">
        {t(titleKey)}
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-eco-muted">{t(subtitleKey)}</p>
    </header>
  );
}
