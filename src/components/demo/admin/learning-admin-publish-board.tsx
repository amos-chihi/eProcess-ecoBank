"use client";

import { useLearningPlatform } from "@/contexts/learning-platform-context";
import type { CoursePublishStatus, DemoCourseCatalogItem } from "@/lib/learning-platform-data";
import { LearningAdminCoursePanel } from "./learning-admin-course-panel";

const COLUMNS: { status: CoursePublishStatus; title: string; hint: string }[] = [
  { status: "draft", title: "Draft", hint: "Authoring · not visible to RMs" },
  { status: "in_review", title: "In review", hint: "Compliance & L&D sign-off" },
  { status: "scheduled", title: "Scheduled", hint: "Advisors see under Upcoming" },
  { status: "published", title: "Live", hint: "RM Programmes catalogue" },
];

function CourseCard({
  course,
  onSelect,
}: {
  course: DemoCourseCatalogItem;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-lg border border-white/10 bg-slate-950/80 p-3 text-left transition hover:border-amber-500/40 hover:bg-slate-900"
    >
      <p className="font-mono text-[10px] text-amber-400/80">{course.code}</p>
      <p className="mt-1 text-sm font-medium text-slate-200">{course.title}</p>
      {course.scheduledFor && (
        <p className="mt-2 text-[10px] text-sky-300">Go-live {course.scheduledFor}</p>
      )}
      {course.mandatory && (
        <span className="mt-2 inline-block rounded bg-amber-900/50 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-amber-200">
          Mandatory
        </span>
      )}
    </button>
  );
}

export function LearningAdminPublishBoard() {
  const { catalog, selectedCourseId, setSelectedCourseId } = useLearningPlatform();
  const selected = catalog.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-white">Publishing workflow</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Kanban view of the content lifecycle. Move programmes from draft through review to live
          — only published courses sync to advisor enrolments and HR Learning.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = catalog.filter((c) => c.publishStatus === col.status);
          return (
            <section
              key={col.status}
              className="flex flex-col rounded-xl border border-white/10 bg-slate-900/50"
            >
              <header className="border-b border-white/10 px-4 py-3">
                <h2 className="text-sm font-semibold text-white">
                  {col.title} <span className="text-slate-500">({items.length})</span>
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-500">{col.hint}</p>
              </header>
              <ul className="flex flex-1 flex-col gap-2 p-3">
                {items.length === 0 ? (
                  <li className="py-8 text-center text-xs text-slate-600">Empty</li>
                ) : (
                  items.map((course) => (
                    <li key={course.id}>
                      <CourseCard
                        course={course}
                        onSelect={() => setSelectedCourseId(course.id)}
                      />
                    </li>
                  ))
                )}
              </ul>
            </section>
          );
        })}
      </div>

      {selected ? <LearningAdminCoursePanel course={selected} /> : null}

      <p className="text-xs text-slate-500">
        Archived programmes are managed from the catalogue. Click any card then use the panel
        actions.
      </p>
    </div>
  );
}
