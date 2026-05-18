import {
  DEMO_COURSE_CATALOG,
  DEMO_LEARNING_AUDIT,
  DEMO_RM_ENROLLMENTS,
  type DemoCourseCatalogItem,
  type DemoRmEnrollment,
  type LearningAuditEntry,
} from "@/lib/learning-platform-data";

export const LEARNING_PLATFORM_STORAGE_KEY = "eprocess-learning-platform-v1";

export type LearningPlatformSnapshot = {
  catalog: DemoCourseCatalogItem[];
  enrollments: DemoRmEnrollment[];
  auditLog: LearningAuditEntry[];
};

export function defaultPlatformSnapshot(): LearningPlatformSnapshot {
  return {
    catalog: DEMO_COURSE_CATALOG.map((c) => ({ ...c })),
    enrollments: DEMO_RM_ENROLLMENTS.map((e) => ({ ...e })),
    auditLog: [...DEMO_LEARNING_AUDIT],
  };
}

export function loadPlatformSnapshot(): LearningPlatformSnapshot {
  if (typeof window === "undefined") return defaultPlatformSnapshot();
  try {
    const raw = localStorage.getItem(LEARNING_PLATFORM_STORAGE_KEY);
    if (!raw) return defaultPlatformSnapshot();
    const parsed = JSON.parse(raw) as LearningPlatformSnapshot;
    if (!parsed.catalog?.length) return defaultPlatformSnapshot();
    return parsed;
  } catch {
    return defaultPlatformSnapshot();
  }
}

export function savePlatformSnapshot(snapshot: LearningPlatformSnapshot) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LEARNING_PLATFORM_STORAGE_KEY, JSON.stringify(snapshot));
  window.dispatchEvent(new CustomEvent("learning-platform-updated"));
}

export function resetPlatformSnapshot() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEARNING_PLATFORM_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("learning-platform-updated"));
}
