"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ClientMobileDemo,
  CLIENT_MOBILE_TABS,
  type BottomNav,
} from "@/components/demo/client-mobile-demo";

function coerceTab(raw: string | null): BottomNav | null {
  if (!raw || !(CLIENT_MOBILE_TABS as readonly string[]).includes(raw)) return null;
  return raw as BottomNav;
}

function ClientMobileInner() {
  const searchParams = useSearchParams();
  const handoffRaw = searchParams.get("handoff");
  const showHandoff = handoffRaw === "1" || handoffRaw === "true";
  const initialTab = coerceTab(searchParams.get("tab"));

  return <ClientMobileDemo initialHandoff={showHandoff} initialTab={initialTab} />;
}

export default function ClientMobilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-eco-surface" />}>
      <ClientMobileInner />
    </Suspense>
  );
}
