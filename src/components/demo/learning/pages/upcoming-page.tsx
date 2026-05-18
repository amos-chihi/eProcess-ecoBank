"use client";

import Link from "next/link";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { useLearningPlatform } from "@/contexts/learning-platform-context";
import { LearningPageHeader } from "../learning-page-header";

export function LearningUpcomingPage() {
  const { t } = useDemoLocale();
  const { scheduledCourses } = useLearningPlatform();

  return (
    <>
      <LearningPageHeader titleKey="learn_upcoming_title" subtitleKey="learn_upcoming_sub" />

      <div className="rounded-xl border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm text-sky-950">
        {t("learn_upcoming_banner")}
      </div>

      {scheduledCourses.length === 0 ? (
        <p className="text-sm text-eco-muted">{t("learn_upcoming_empty")}</p>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {scheduledCourses.map((course) => (
            <li
              key={course.id}
              className="rounded-xl border border-eco-border bg-white p-5 shadow-sm"
            >
              <p className="font-mono text-[10px] text-eco-muted">{course.code}</p>
              <p className="mt-1 font-semibold text-eco-navy">{course.title}</p>
              <p className="mt-1 text-xs text-eco-muted">{course.subtitle}</p>
              <p className="mt-3 text-sm font-medium text-sky-800">
                {t("learn_upcoming_golive")}: {course.scheduledFor}
              </p>
              <p className="mt-2 text-xs text-eco-muted">
                {course.modulesTotal} {t("learn_modules").toLowerCase()} · {course.cpdRequired}h{" "}
                {t("learn_cpd")}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-eco-muted">
        {t("learn_upcoming_admin_hint")}{" "}
        <Link href="/admin/learning/publishing" className="font-semibold text-eco-teal-dark hover:underline">
          {t("learn_admin_link")}
        </Link>
      </p>
    </>
  );
}
