import { Suspense } from "react";
import { MeetingModeClient } from "@/components/demo/meeting-mode-client";

function MeetingFallback() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6 p-4 sm:p-10">
      <div className="h-9 w-64 rounded-lg bg-eco-surface" />
      <div className="h-[min(70vh,520px)] rounded-xl bg-eco-surface" />
    </div>
  );
}

export default function PresentMeetingPage() {
  return (
    <Suspense fallback={<MeetingFallback />}>
      <MeetingModeClient presentMode />
    </Suspense>
  );
}
