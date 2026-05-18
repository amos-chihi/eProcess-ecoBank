"use client";

import Link from "next/link";
import { useLearningPlatform } from "@/contexts/learning-platform-context";
import type { CoursePublishStatus } from "@/lib/learning-platform-data";

const PIPELINE: { status: CoursePublishStatus; label: string; tone: string }[] = [
  { status: "draft", label: "Draft", tone: "bg-slate-700 text-slate-200" },
  { status: "in_review", label: "In review", tone: "bg-violet-900/60 text-violet-200" },
  { status: "scheduled", label: "Scheduled", tone: "bg-sky-900/60 text-sky-200" },
  { status: "published", label: "Live (RM)", tone: "bg-emerald-900/60 text-emerald-200" },
  { status: "archived", label: "Archived", tone: "bg-slate-800 text-slate-500" },
];

export function LearningAdminDashboard() {
  const { pipelineCounts, auditLog, catalog, resetDemoData } = useLearningPlatform();
  const live = catalog.filter((c) => c.publishStatus === "published");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90">
          L&D administration
        </p>
        <h1 className="mt-1 text-xl font-semibold text-white">
          Integrated Learning &amp; Certification
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Author courses, run compliance review, schedule go-live, and publish to the advisor
          catalogue. Only <strong className="text-emerald-300">Live</strong> programmes appear in
          the RM Learning workstation — drafts and in-review content stay hidden until published.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PIPELINE.map((p) => (
          <div
            key={p.status}
            className={`rounded-xl border border-white/10 px-4 py-4 ${p.tone}`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
              {p.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{pipelineCounts[p.status]}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-slate-900/80 p-5">
          <h2 className="text-sm font-semibold text-white">End-to-end flow</h2>
          <ol className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
                1
              </span>
              <span>
                <strong className="text-slate-200">Draft</strong> — author builds modules, CPD,
                regions, and version in the catalogue.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-800 text-xs font-bold text-white">
                2
              </span>
              <span>
                <strong className="text-slate-200">Submit for review</strong> — compliance &
                group L&amp;D sign-off before release.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-800 text-xs font-bold text-white">
                3
              </span>
              <span>
                <strong className="text-slate-200">Schedule or publish</strong> — immediate
                go-live or future date; advisors see scheduled items under Upcoming.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white">
                4
              </span>
              <span>
                <strong className="text-slate-200">Live in RM Learning</strong> — enrolments,
                progress, HR sync, and career-path gates activate for {live.length} programmes.
              </span>
            </li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/admin/learning/catalog"
              className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400"
            >
              Open catalogue
            </Link>
            <Link
              href="/admin/learning/publishing"
              className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/5"
            >
              Publishing board
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-900/80 p-5">
          <h2 className="text-sm font-semibold text-white">Recent activity</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto text-sm">
            {auditLog.slice(0, 8).map((entry) => (
              <li
                key={entry.id}
                className="border-b border-white/5 pb-3 last:border-0 last:pb-0"
              >
                <p className="font-medium text-slate-200">{entry.action}</p>
                <p className="text-xs text-slate-500">
                  {entry.courseTitle} · {entry.actor} · {entry.at}
                </p>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={resetDemoData}
            className="mt-4 text-xs text-slate-500 underline hover:text-slate-300"
          >
            Reset catalogue to default
          </button>
        </section>
      </div>
    </div>
  );
}
