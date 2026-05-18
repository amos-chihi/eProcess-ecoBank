import { Suspense } from "react";
import { MeetingModeClient } from "@/components/demo/meeting-mode-client";

function MeetingFallback() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 p-4 sm:p-6">
      <div className="h-7 w-48 rounded bg-eco-surface" />
      <div className="h-72 rounded-xl bg-eco-surface" />
    </div>
  );
}

export default function MeetingPage() {
  return (
    <Suspense fallback={<MeetingFallback />}>
      <MeetingModeClient />
    </Suspense>
  );
}
