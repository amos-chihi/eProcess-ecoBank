"use client";

import { useLearningPlatform } from "@/contexts/learning-platform-context";
import type { CoursePublishStatus, DemoCourseCatalogItem } from "@/lib/learning-platform-data";

const STATUS_LABEL: Record<CoursePublishStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  scheduled: "Scheduled",
  published: "Live",
  archived: "Archived",
};

const STATUS_CLASS: Record<CoursePublishStatus, string> = {
  draft: "bg-slate-700 text-slate-200",
  in_review: "bg-violet-900/80 text-violet-100",
  scheduled: "bg-sky-900/80 text-sky-100",
  published: "bg-emerald-900/80 text-emerald-100",
  archived: "bg-slate-800 text-slate-500",
};

export function LearningAdminCoursePanel({ course }: { course: DemoCourseCatalogItem }) {
  const {
    setSelectedCourseId,
    submitForReview,
    approveAndPublish,
    scheduleCourse,
    revertToDraft,
    archiveCourse,
    updateCourse,
  } = useLearningPlatform();

  return (
    <aside className="rounded-xl border border-amber-500/30 bg-slate-900 p-5 ring-1 ring-amber-500/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] text-amber-400/90">{course.code}</p>
          <h3 className="mt-1 text-base font-semibold text-white">{course.title}</h3>
          <p className="mt-1 text-xs text-slate-400">{course.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedCourseId(null)}
          className="shrink-0 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
        >
          Close
        </button>
      </div>

      <span
        className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${STATUS_CLASS[course.publishStatus]}`}
      >
        {STATUS_LABEL[course.publishStatus]}
      </span>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-slate-500">Version</dt>
          <dd className="text-slate-200">{course.version}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Modules</dt>
          <dd className="text-slate-200">{course.modulesTotal}</dd>
        </div>
        <div>
          <dt className="text-slate-500">CPD hours</dt>
          <dd className="text-slate-200">{course.cpdRequired}h</dd>
        </div>
        <div>
          <dt className="text-slate-500">Regions</dt>
          <dd className="text-slate-200">{course.regions.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Author</dt>
          <dd className="text-slate-200">{course.author}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Last edited</dt>
          <dd className="text-slate-200">{course.lastEdited}</dd>
        </div>
        {course.publishedAt && (
          <div>
            <dt className="text-slate-500">Published</dt>
            <dd className="text-slate-200">
              {course.publishedAt} · {course.publishedBy}
            </dd>
          </div>
        )}
        {course.scheduledFor && (
          <div className="col-span-2">
            <dt className="text-slate-500">Go-live</dt>
            <dd className="text-sky-200">{course.scheduledFor}</dd>
          </div>
        )}
      </dl>

      {course.reviewNotes && (
        <p className="mt-4 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Review notes: </span>
          {course.reviewNotes}
        </p>
      )}

      <label className="mt-4 block text-xs text-slate-500">
        Review / author notes
        <textarea
          defaultValue={course.reviewNotes ?? ""}
          rows={2}
          className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
          onBlur={(e) => updateCourse(course.id, { reviewNotes: e.target.value })}
        />
      </label>

      <div className="mt-5 flex flex-wrap gap-2">
        {course.publishStatus === "draft" && (
          <button
            type="button"
            onClick={() => submitForReview(course.id)}
            className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500"
          >
            Submit for review
          </button>
        )}
        {course.publishStatus === "in_review" && (
          <>
            <button
              type="button"
              onClick={() => approveAndPublish(course.id)}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              Approve &amp; publish now
            </button>
            <button
              type="button"
              onClick={() => scheduleCourse(course.id, "1 Aug 2026")}
              className="rounded-lg border border-sky-500/50 px-3 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-950"
            >
              Schedule go-live
            </button>
            <button
              type="button"
              onClick={() => revertToDraft(course.id)}
              className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
            >
              Return to draft
            </button>
          </>
        )}
        {course.publishStatus === "scheduled" && (
          <>
            <button
              type="button"
              onClick={() => approveAndPublish(course.id)}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              Publish early
            </button>
            <button
              type="button"
              onClick={() => revertToDraft(course.id)}
              className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-300"
            >
              Cancel schedule
            </button>
          </>
        )}
        {course.publishStatus === "published" && (
          <button
            type="button"
            onClick={() => archiveCourse(course.id)}
            className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
          >
            Archive course
          </button>
        )}
        {course.publishStatus === "archived" && (
          <button
            type="button"
            onClick={() => revertToDraft(course.id)}
            className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-300"
          >
            Restore as draft
          </button>
        )}
      </div>

      {course.publishStatus === "published" && (
        <p className="mt-4 text-[11px] text-emerald-400/90">
          Visible to advisors under RM → Learning → Programmes. Progress syncs to HR Learning on
          completion.
        </p>
      )}
      {(course.publishStatus === "draft" || course.publishStatus === "in_review") && (
        <p className="mt-4 text-[11px] text-slate-500">
          Hidden from advisors until published. Use Publishing workflow to track sign-off.
        </p>
      )}
    </aside>
  );
}
