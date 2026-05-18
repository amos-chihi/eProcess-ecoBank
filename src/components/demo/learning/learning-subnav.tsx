"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { LEARNING_ROUTES } from "./learning-utils";

export function LearningSubnav() {
  const pathname = usePathname();
  const { t } = useDemoLocale();

  return (
    <div className="border-b border-eco-border bg-white">
      <div className="mx-auto max-w-6xl px-1">
        <nav
          className="-mb-px flex gap-1 overflow-x-auto"
          aria-label={t("nav_learning")}
        >
          {LEARNING_ROUTES.map((item) => {
            const active =
              "exact" in item && item.exact
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "border-eco-navy text-eco-navy"
                    : "border-transparent text-eco-muted hover:border-eco-border hover:text-eco-ink"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
