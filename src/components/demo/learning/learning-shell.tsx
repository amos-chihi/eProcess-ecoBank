"use client";

import { LearningPlayer } from "@/components/demo/learning-player/learning-player";
import { LearningHrModal } from "@/components/demo/learning-hr-modal";
import { LearningProvider, useLearning } from "./learning-context";
import { LearningSubnav } from "./learning-subnav";

function LearnToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[60] flex max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-eco-border bg-eco-navy px-4 py-3 text-sm text-white shadow-lg"
    >
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-md px-2 py-1 text-xs text-white/80 hover:bg-white/10"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

function LearningModals() {
  const {
    certModal,
    activeCert,
    hrModalOpen,
    setCertModal,
    handleCompleteModule,
    launchHr,
    setHrModalOpen,
    toast,
    setToast,
  } = useLearning();

  return (
    <>
      {toast && <LearnToast message={toast} onDismiss={() => setToast(null)} />}
      {activeCert && certModal && (
        <LearningPlayer
          cert={activeCert}
          mode={certModal.mode}
          onClose={() => setCertModal(null)}
          onCompleteModule={handleCompleteModule}
        />
      )}
      {hrModalOpen && (
        <LearningHrModal onClose={() => setHrModalOpen(false)} onLaunch={launchHr} />
      )}
    </>
  );
}

export function LearningShell({ children }: { children: React.ReactNode }) {
  return (
    <LearningProvider>
      <div className="-mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
        <LearningSubnav />
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6">{children}</div>
        <LearningModals />
      </div>
    </LearningProvider>
  );
}
