"use client";

import type { ReactNode } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";

export function MobileContainedSheet({
  title,
  onClose,
  children,
  footerLabel,
  onFooterClick,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footerLabel?: string;
  onFooterClick?: () => void;
}) {
  const { t } = useDemoLocale();

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end rounded-[2rem] bg-eco-navy/40"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(82%,540px)] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-eco-border px-4 pb-3 pt-4">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-eco-border" />
          <h2 className="text-base font-semibold text-eco-navy">{title}</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
        <div className="shrink-0 border-t border-eco-border p-4">
          <button
            type="button"
            onClick={onFooterClick ?? onClose}
            className="w-full min-h-11 rounded-xl border border-eco-border py-3 text-sm font-medium text-eco-muted"
          >
            {footerLabel ?? t("mob_goal_sheet_close")}
          </button>
        </div>
      </div>
    </div>
  );
}
