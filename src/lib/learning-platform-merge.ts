import type { DemoCertification } from "@/lib/demo-data";
import type {
  DemoCourseCatalogItem,
  DemoRmEnrollment,
} from "@/lib/learning-platform-data";

export function enrollmentToCert(
  course: DemoCourseCatalogItem,
  enrollment: DemoRmEnrollment,
): DemoCertification {
  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    status: enrollment.status,
    progressPct: enrollment.progressPct,
    cpdEarned: enrollment.cpdEarned,
    cpdRequired: course.cpdRequired,
    modulesDone: enrollment.modulesDone,
    modulesTotal: course.modulesTotal,
    domains: course.domains,
    dueLabel: enrollment.dueLabel,
    embeddedInApp: course.embeddedInApp,
  };
}

export function defaultEnrollment(course: DemoCourseCatalogItem): DemoRmEnrollment {
  return {
    courseId: course.id,
    status: course.mandatory ? "required" : "available",
    progressPct: 0,
    cpdEarned: 0,
    modulesDone: 0,
    dueLabel: course.mandatory ? "Assigned · complete when ready" : undefined,
  };
}

export function certToEnrollment(cert: DemoCertification): DemoRmEnrollment {
  return {
    courseId: cert.id,
    status: cert.status,
    progressPct: cert.progressPct,
    cpdEarned: cert.cpdEarned,
    modulesDone: cert.modulesDone,
    dueLabel: cert.dueLabel,
  };
}

export function mergePublishedCerts(
  catalog: DemoCourseCatalogItem[],
  enrollments: DemoRmEnrollment[],
): DemoCertification[] {
  const byCourse = new Map(enrollments.map((e) => [e.courseId, e]));
  return catalog
    .filter((c) => c.publishStatus === "published")
    .map((course) => {
      const enrollment = byCourse.get(course.id) ?? defaultEnrollment(course);
      return enrollmentToCert(course, enrollment);
    });
}
