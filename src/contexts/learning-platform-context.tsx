"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DemoCertification } from "@/lib/demo-data";
import { recalcCert, advanceCert } from "@/components/demo/learning/learning-utils";
import type {
  CoursePublishStatus,
  DemoCourseCatalogItem,
  DemoRmEnrollment,
  LearningAuditEntry,
} from "@/lib/learning-platform-data";
import {
  defaultEnrollment,
  mergePublishedCerts,
} from "@/lib/learning-platform-merge";
import {
  defaultPlatformSnapshot,
  loadPlatformSnapshot,
  resetPlatformSnapshot,
  savePlatformSnapshot,
  type LearningPlatformSnapshot,
} from "@/lib/learning-platform-storage";

type LearningPlatformContextValue = {
  catalog: DemoCourseCatalogItem[];
  enrollments: DemoRmEnrollment[];
  auditLog: LearningAuditEntry[];
  publishedCerts: DemoCertification[];
  scheduledCourses: DemoCourseCatalogItem[];
  pipelineCounts: Record<CoursePublishStatus, number>;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  adminToast: string | null;
  setAdminToast: (msg: string | null) => void;
  showAdminToast: (msg: string) => void;
  updateCourse: (id: string, patch: Partial<DemoCourseCatalogItem>) => void;
  submitForReview: (id: string) => void;
  approveAndPublish: (id: string) => void;
  scheduleCourse: (id: string, scheduledFor: string) => void;
  revertToDraft: (id: string) => void;
  archiveCourse: (id: string) => void;
  updateEnrollment: (courseId: string, patch: Partial<DemoRmEnrollment>) => void;
  advanceEnrollment: (courseId: string) => void;
  resetDemoData: () => void;
};

const LearningPlatformContext = createContext<LearningPlatformContextValue | null>(null);

function nextAuditId() {
  return `a-${Date.now()}`;
}

function appendAudit(
  log: LearningAuditEntry[],
  entry: Omit<LearningAuditEntry, "id">,
): LearningAuditEntry[] {
  return [{ id: nextAuditId(), ...entry }, ...log].slice(0, 40);
}

export function LearningPlatformProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<LearningPlatformSnapshot>(defaultPlatformSnapshot);
  const [hydrated, setHydrated] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const persist = useCallback((next: LearningPlatformSnapshot) => {
    setSnapshot(next);
    savePlatformSnapshot(next);
  }, []);

  useEffect(() => {
    setSnapshot(loadPlatformSnapshot());
    setHydrated(true);
    const onUpdate = () => setSnapshot(loadPlatformSnapshot());
    window.addEventListener("learning-platform-updated", onUpdate);
    return () => window.removeEventListener("learning-platform-updated", onUpdate);
  }, []);

  const showAdminToast = useCallback((msg: string) => {
    setAdminToast(msg);
    window.setTimeout(() => setAdminToast(null), 3200);
  }, []);

  const patchCourse = useCallback(
    (
      id: string,
      mutator: (course: DemoCourseCatalogItem) => DemoCourseCatalogItem,
      audit: { action: string; actor?: string },
    ) => {
      const course = snapshot.catalog.find((c) => c.id === id);
      if (!course) return;
      const updated = mutator({ ...course, lastEdited: "Just now" });
      let enrollments = snapshot.enrollments;
      if (updated.publishStatus === "published") {
        const exists = enrollments.some((e) => e.courseId === id);
        if (!exists) {
          enrollments = [...enrollments, defaultEnrollment(updated)];
        }
      }
      persist({
        catalog: snapshot.catalog.map((c) => (c.id === id ? updated : c)),
        enrollments,
        auditLog: appendAudit(snapshot.auditLog, {
          action: audit.action,
          actor: audit.actor ?? "L&D Administrator",
          courseId: id,
          courseTitle: updated.title,
          at: new Date().toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
      });
    },
    [persist, snapshot],
  );

  const updateCourse = useCallback(
    (id: string, patch: Partial<DemoCourseCatalogItem>) => {
      patchCourse(id, (c) => ({ ...c, ...patch }), { action: "Updated draft" });
      showAdminToast("Course saved.");
    },
    [patchCourse, showAdminToast],
  );

  const submitForReview = useCallback(
    (id: string) => {
      patchCourse(
        id,
        (c) => ({ ...c, publishStatus: "in_review" }),
        { action: "Submitted for review" },
      );
      showAdminToast("Submitted for compliance & L&D review.");
    },
    [patchCourse, showAdminToast],
  );

  const approveAndPublish = useCallback(
    (id: string) => {
      patchCourse(
        id,
        (c) => ({
          ...c,
          publishStatus: "published",
          scheduledFor: undefined,
          publishedAt: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          publishedBy: "L&D Administrator",
        }),
        { action: "Published to RM catalogue" },
      );
      showAdminToast("Published — now visible to advisors in Learning.");
    },
    [patchCourse, showAdminToast],
  );

  const scheduleCourse = useCallback(
    (id: string, scheduledFor: string) => {
      patchCourse(
        id,
        (c) => ({ ...c, publishStatus: "scheduled", scheduledFor }),
        { action: `Scheduled for ${scheduledFor}` },
      );
      showAdminToast(`Scheduled — advisors will see it under Upcoming.`);
    },
    [patchCourse, showAdminToast],
  );

  const revertToDraft = useCallback(
    (id: string) => {
      patchCourse(
        id,
        (c) => ({
          ...c,
          publishStatus: "draft",
          scheduledFor: undefined,
        }),
        { action: "Reverted to draft" },
      );
      showAdminToast("Reverted to draft — hidden from advisors.");
    },
    [patchCourse, showAdminToast],
  );

  const archiveCourse = useCallback(
    (id: string) => {
      patchCourse(
        id,
        (c) => ({ ...c, publishStatus: "archived" }),
        { action: "Archived" },
      );
      showAdminToast("Course archived.");
    },
    [patchCourse, showAdminToast],
  );

  const updateEnrollment = useCallback(
    (courseId: string, patch: Partial<DemoRmEnrollment>) => {
      persist({
        ...snapshot,
        enrollments: snapshot.enrollments.map((e) =>
          e.courseId === courseId ? { ...e, ...patch } : e,
        ),
      });
    },
    [persist, snapshot],
  );

  const advanceEnrollment = useCallback(
    (courseId: string) => {
      const course = snapshot.catalog.find((c) => c.id === courseId);
      if (!course) return;
      const enrollment = snapshot.enrollments.find((e) => e.courseId === courseId);
      const cert = mergePublishedCerts(snapshot.catalog, snapshot.enrollments).find(
        (c) => c.id === courseId,
      );
      if (!cert) return;
      const advanced = advanceCert(cert);
      const next: DemoRmEnrollment = {
        courseId,
        status: advanced.status,
        progressPct: advanced.progressPct,
        cpdEarned: advanced.cpdEarned,
        modulesDone: advanced.modulesDone,
        dueLabel: enrollment?.dueLabel,
      };
      const exists = snapshot.enrollments.some((e) => e.courseId === courseId);
      persist({
        ...snapshot,
        enrollments: exists
          ? snapshot.enrollments.map((e) => (e.courseId === courseId ? next : e))
          : [...snapshot.enrollments, next],
      });
    },
    [persist, snapshot],
  );

  const resetDemoData = useCallback(() => {
    resetPlatformSnapshot();
    setSnapshot(defaultPlatformSnapshot());
    showAdminToast("Learning catalogue reset to default.");
  }, [showAdminToast]);

  const publishedCerts = useMemo(
    () => mergePublishedCerts(snapshot.catalog, snapshot.enrollments),
    [snapshot.catalog, snapshot.enrollments],
  );

  const scheduledCourses = useMemo(
    () => snapshot.catalog.filter((c) => c.publishStatus === "scheduled"),
    [snapshot.catalog],
  );

  const pipelineCounts = useMemo(() => {
    const counts: Record<CoursePublishStatus, number> = {
      draft: 0,
      in_review: 0,
      scheduled: 0,
      published: 0,
      archived: 0,
    };
    for (const c of snapshot.catalog) counts[c.publishStatus] += 1;
    return counts;
  }, [snapshot.catalog]);

  const value = useMemo(
    (): LearningPlatformContextValue => ({
      catalog: snapshot.catalog,
      enrollments: snapshot.enrollments,
      auditLog: snapshot.auditLog,
      publishedCerts,
      scheduledCourses,
      pipelineCounts,
      selectedCourseId,
      setSelectedCourseId,
      adminToast,
      setAdminToast,
      showAdminToast,
      updateCourse,
      submitForReview,
      approveAndPublish,
      scheduleCourse,
      revertToDraft,
      archiveCourse,
      updateEnrollment,
      advanceEnrollment,
      resetDemoData,
    }),
    [
      snapshot,
      publishedCerts,
      scheduledCourses,
      pipelineCounts,
      selectedCourseId,
      adminToast,
      showAdminToast,
      updateCourse,
      submitForReview,
      approveAndPublish,
      scheduleCourse,
      revertToDraft,
      archiveCourse,
      updateEnrollment,
      advanceEnrollment,
      resetDemoData,
    ],
  );

  if (!hydrated) {
    return (
      <LearningPlatformContext.Provider value={value}>
        {children}
      </LearningPlatformContext.Provider>
    );
  }

  return (
    <LearningPlatformContext.Provider value={value}>{children}</LearningPlatformContext.Provider>
  );
}

export function useLearningPlatform() {
  const ctx = useContext(LearningPlatformContext);
  if (!ctx) throw new Error("useLearningPlatform must be used within LearningPlatformProvider");
  return ctx;
}
