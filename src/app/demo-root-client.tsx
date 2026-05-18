"use client";

import { DemoLocaleProvider } from "@/components/demo/demo-locale-provider";
import { LearningPlatformProvider } from "@/contexts/learning-platform-context";

/** Wraps routing tree so navigator / shell can react to persisted locale choice. */
export function DemoRootClient({ children }: { children: React.ReactNode }) {
  return (
    <DemoLocaleProvider>
      <LearningPlatformProvider>{children}</LearningPlatformProvider>
    </DemoLocaleProvider>
  );
}
