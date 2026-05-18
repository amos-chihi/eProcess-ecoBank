"use client";

import { useLearningPlatform } from "@/contexts/learning-platform-context";
import type { CoursePublishStatus } from "@/lib/learning-platform-data";
import { LearningAdminCoursePanel } from "./learning-admin-course-panel";

const STATUS_LABEL: Record<CoursePublishStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  scheduled: "Scheduled",
  published: "Live",
  archived: "Archived",
};

export function LearningAdminCatalog() {
  const { catalog, selectedCourseId, setSelectedCourseId } = useLearningPlatform();
  const selected = catalog.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Course catalogue</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Master list of certification programmes. Select a row to review metadata, run the
          publish workflow, and control RM visibility.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(18rem,22rem)]">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Programme</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden px-4 py-3 sm:table-cell">Version</th>
                <th className="hidden px-4 py-3 md:table-cell">Regions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/50">
              {catalog.map((course) => (
                <tr
                  key={course.id}
                  className={`cursor-pointer transition hover:bg-white/5 ${
                    selectedCourseId === course.id ? "bg-amber-500/10" : ""
                  }`}
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-amber-400/90">{course.code}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-200">{course.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{course.subtitle}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-300">
                      {STATUS_LABEL[course.publishStatus]}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">v{course.version}</td>
                  <td className="hidden px-4 py-3 text-xs text-slate-500 md:table-cell">
                    {course.regions.join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected ? (
          <LearningAdminCoursePanel course={selected} />
        ) : (
          <div className="flex min-h-[12rem] items-center justify-center rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
            Select a course to manage publishing and metadata.
          </div>
        )}
      </div>
    </div>
  );
}
