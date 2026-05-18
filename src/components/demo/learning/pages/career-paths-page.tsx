"use client";

import { CAREER_PATHS } from "@/lib/demo-data";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { useLearning } from "../learning-context";
import { LearningPageHeader } from "../learning-page-header";
import { clusterKey } from "../learning-utils";

export function LearningCareerPathsPage() {
  const { t } = useDemoLocale();
  const { selectedPath, setSelectedPath, showToast } = useLearning();
  const activePath = CAREER_PATHS.find((p) => p.id === selectedPath) ?? CAREER_PATHS[0]!;

  return (
    <>
      <LearningPageHeader titleKey="learn_careerTitle" subtitleKey="learn_careerSub" />

      <div className="flex flex-wrap gap-2">
        {CAREER_PATHS.map((path) => (
          <button
            key={path.id}
            type="button"
            onClick={() => setSelectedPath(path.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              selectedPath === path.id
                ? "border-eco-navy bg-eco-navy text-white"
                : "border-eco-border bg-white text-eco-muted hover:border-eco-teal/50"
            }`}
          >
            {t(clusterKey(path.cluster))}
            {path.isCurrent ? ` · ${t("learn_currentPath")}` : ""}
          </button>
        ))}
      </div>

      <article className="rounded-xl border border-eco-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-eco-teal-dark">
              {t(clusterKey(activePath.cluster))}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-eco-navy">{activePath.title}</h2>
            <p className="mt-1 text-sm text-eco-muted">{activePath.level}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-semibold text-eco-navy">{activePath.completionPct}%</p>
            <p className="text-xs text-eco-muted">{t("learn_pathProgress")}</p>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-eco-ink">
          {t("learn_nextMilestone")}: {activePath.nextMilestone}
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-eco-surface">
          <div
            className="h-full rounded-full bg-eco-navy transition-all"
            style={{ width: `${activePath.completionPct}%` }}
          />
        </div>
        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-eco-muted">
          {t("learn_viewPath")}
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-eco-muted">
          {activePath.requirements.map((req) => (
            <li key={req} className="flex gap-2 rounded-lg border border-eco-border bg-eco-surface/50 px-3 py-2">
              <span className="text-eco-teal">✓</span>
              {req}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => showToast(t("learn_toast_path"))}
          className="mt-6 rounded-lg bg-eco-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-eco-navy/90"
        >
          {t("learn_enrolPath")}
        </button>
      </article>

      <ul className="grid gap-4 md:grid-cols-2">
        {CAREER_PATHS.filter((p) => p.id !== selectedPath).map((path) => (
          <li
            key={path.id}
            className="rounded-xl border border-eco-border bg-eco-surface/30 p-4 text-sm"
          >
            <p className="font-medium text-eco-navy">{path.title}</p>
            <p className="mt-1 text-xs text-eco-muted">{path.level}</p>
            <button
              type="button"
              onClick={() => setSelectedPath(path.id)}
              className="mt-3 text-xs font-semibold text-eco-teal-dark hover:underline"
            >
              {t("learn_explorePath")} →
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
