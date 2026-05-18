"use client";

import Link from "next/link";
import { MarketsConsoleClient } from "@/components/demo/markets-console-client";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";

export default function MarketsPage() {
  const { t } = useDemoLocale();
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
            {t("markets_kicker")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-eco-navy">
            Markets · tax · planning flows
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-eco-muted">
            Demonstrates configurable tax posture, francophone vs anglophone vs lusophone clusters, disclosure packs, and customized planning workflows (Islamic branches, diaspora constructs, SMEs).
          </p>
        </div>
        <Link
          href="/admin/markets"
          className="rounded-lg border border-eco-border bg-eco-navy px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-eco-navy/90"
        >
          Open admin JSON console
        </Link>
      </div>
      <MarketsConsoleClient />
    </div>
  );
}
