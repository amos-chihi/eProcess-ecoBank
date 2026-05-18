import { Suspense } from "react";
import { LearningProgrammesPage } from "@/components/demo/learning/pages/programmes-page";

export default function LearningProgrammesRoute() {
  return (
    <Suspense
      fallback={
        <div className="h-32 animate-pulse rounded-xl bg-eco-surface" aria-hidden />
      }
    >
      <LearningProgrammesPage />
    </Suspense>
  );
}
