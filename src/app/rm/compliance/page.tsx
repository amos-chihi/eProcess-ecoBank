"use client";

import Link from "next/link";
import { ComplianceConsoleClient } from "@/components/demo/compliance-console-client";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { COMPLIANCE_DOCUMENTS, COMPLIANCE_CHECKS, DEMO_CLIENT } from "@/lib/demo-data";

export default function CompliancePage() {
  const { t } = useDemoLocale();
  const total = COMPLIANCE_CHECKS.filter((c) => c.done).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-eco-muted">
            {t("compliance_kicker")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-eco-navy">
            Compliance center
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-eco-muted">
            Embedded prompts, automated summaries, regional adjustments, and auditable artefact storage — visualised here for stakeholder walkthrough.
          </p>
        </div>
        <div className="rounded-xl border border-eco-border bg-white px-4 py-3 text-center shadow-sm">
          <p className="text-2xl font-semibold text-eco-teal-dark">
            {total}/{COMPLIANCE_CHECKS.length}
          </p>
          <p className="text-[11px] text-eco-muted">Session checklist (global demo)</p>
        </div>
      </div>

      <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-eco-ink">Interactive prompt runner</p>
            <p className="mt-1 text-xs text-eco-muted">
              Opens in-modal suitability / affordability / appropriateness attestation stub.
            </p>
          </div>
          <ComplianceConsoleClient />
        </div>
      </section>

      <section className="rounded-xl border border-eco-border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-eco-ink">Document vault (mock)</p>
          <span className="rounded-full bg-eco-surface px-2 py-1 text-[11px] font-medium text-eco-muted">
            Encrypted at rest · WORM-compatible (architecture story)
          </span>
        </div>
        <ul className="mt-4 divide-y divide-eco-border text-xs">
          {COMPLIANCE_DOCUMENTS.map((doc) => (
            <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
              <div>
                <p className="font-medium text-eco-navy">{doc.title}</p>
                <p className="mt-1 text-eco-muted">
                  {doc.clientName} · {doc.generatedAt}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                  doc.state === "sealed"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-amber-50 text-amber-900"
                }`}
              >
                {doc.state}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href={`/rm/client-360`}
          className="mt-4 inline-flex text-xs font-semibold text-eco-teal-dark hover:underline"
        >
          Open {DEMO_CLIENT.displayName}&apos;s 360 →
        </Link>
      </section>

      <section className="rounded-xl border border-dashed border-eco-border bg-eco-surface/60 px-5 py-4 text-xs leading-relaxed text-eco-muted">
        <strong className="text-eco-ink">SOC2 / ISO narrative hook:</strong> every transition in the prompt
        flow emits immutable events keyed by advisory session UUID; RBAC restricts seal operations to
        licensed advisor roles (design placeholder).
      </section>
    </div>
  );
}
