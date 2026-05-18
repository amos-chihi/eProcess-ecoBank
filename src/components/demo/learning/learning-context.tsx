"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { useLearningPlatform } from "@/contexts/learning-platform-context";
import { DOMAIN_PROGRESS, HR_LD_INTEGRATION, type DemoCertification, type DemoDomainProgress } from "@/lib/demo-data";
import { certToEnrollment } from "@/lib/learning-platform-merge";
import { advanceCert, domainKey, recalcCert } from "./learning-utils";

type CertModalState = { certId: string; mode: "play" | "review" } | null;

type LearningContextValue = {
  certs: DemoCertification[];
  overallPct: number;
  cpdYtd: number;
  visibleCerts: DemoCertification[];
  scheduledCount: number;
  domainFilter: DemoDomainProgress["id"] | null;
  highlightCertId: string | null;
  selectedPath: string;
  setSelectedPath: (id: string) => void;
  syncFlash: boolean;
  lastSync: string;
  hrOpenItems: number;
  certModal: CertModalState;
  hrModalOpen: boolean;
  toast: string | null;
  setToast: (msg: string | null) => void;
  showToast: (msg: string) => void;
  openCert: (cert: DemoCertification, mode: "play" | "review") => void;
  handleCertPrimary: (cert: DemoCertification) => void;
  handleCompleteModule: () => void;
  handleSync: () => void;
  launchHr: () => void;
  setHrModalOpen: (open: boolean) => void;
  setCertModal: (state: CertModalState) => void;
  focusDomain: (domainId: DemoDomainProgress["id"]) => void;
  setDomainFilter: (domainId: DemoDomainProgress["id"] | null) => void;
  clearDomainFilter: () => void;
  setHighlightCertId: (id: string | null) => void;
  activeCert: DemoCertification | undefined;
};

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: ReactNode }) {
  const { t } = useDemoLocale();
  const router = useRouter();
  const { publishedCerts, scheduledCourses, updateEnrollment } = useLearningPlatform();

  const certs = publishedCerts;
  const [selectedPath, setSelectedPath] = useState("gh-senior");
  const [syncFlash, setSyncFlash] = useState(false);
  const [lastSync, setLastSync] = useState(HR_LD_INTEGRATION.lastSync);
  const [hrOpenItems, setHrOpenItems] = useState(HR_LD_INTEGRATION.openItems);
  const [certModal, setCertModal] = useState<CertModalState>(null);
  const [hrModalOpen, setHrModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [highlightCertId, setHighlightCertId] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<DemoDomainProgress["id"] | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const overallPct = useMemo(
    () => Math.round(DOMAIN_PROGRESS.reduce((s, d) => s + d.pct, 0) / DOMAIN_PROGRESS.length),
    [],
  );
  const cpdYtd = useMemo(() => certs.reduce((s, c) => s + c.cpdEarned, 0), [certs]);
  const visibleCerts = useMemo(
    () => (domainFilter ? certs.filter((c) => c.domains.includes(domainFilter)) : certs),
    [certs, domainFilter],
  );
  const activeCert = certModal ? certs.find((c) => c.id === certModal.certId) : undefined;

  const handleSync = useCallback(() => {
    setSyncFlash(true);
    setLastSync("Just now ✓");
    setHrOpenItems((n) => Math.max(0, n - 1));
    showToast(t("learn_toast_sync"));
    window.setTimeout(() => setSyncFlash(false), 1800);
  }, [showToast, t]);

  const openCert = useCallback(
    (cert: DemoCertification, mode: "play" | "review") => {
      if (!cert.embeddedInApp) {
        setHrModalOpen(true);
        return;
      }
      if (mode === "play" && cert.status === "available") {
        const started = recalcCert({ ...cert, status: "in_progress", modulesDone: 0 });
        updateEnrollment(cert.id, certToEnrollment(started));
        showToast(t("learn_toast_started"));
      }
      setCertModal({ certId: cert.id, mode });
    },
    [showToast, t, updateEnrollment],
  );

  const handleCertPrimary = useCallback(
    (cert: DemoCertification) => {
      if (cert.status === "completed") openCert(cert, "review");
      else openCert(cert, "play");
    },
    [openCert],
  );

  const handleCompleteModule = useCallback(() => {
    if (!certModal) return;
    const cert = certs.find((c) => c.id === certModal.certId);
    if (!cert) return;
    const next = advanceCert(cert);
    updateEnrollment(cert.id, certToEnrollment(next));
    if (next.status === "completed") {
      setCertModal({ certId: certModal.certId, mode: "review" });
    }
    showToast(t("learn_toast_module"));
  }, [certModal, certs, showToast, t, updateEnrollment]);

  const focusDomain = useCallback(
    (domainId: DemoDomainProgress["id"]) => {
      setDomainFilter(domainId);
      setHighlightCertId(null);
      showToast(`${t("learn_domainFocus")}: ${t(domainKey(domainId))}`);
      const first = certs.find((c) => c.domains.includes(domainId));
      if (first) setHighlightCertId(first.id);
      router.push(`/rm/learning/programmes?domain=${domainId}`);
    },
    [certs, router, showToast, t],
  );

  const clearDomainFilter = useCallback(() => {
    setDomainFilter(null);
    setHighlightCertId(null);
  }, []);

  const launchHr = useCallback(() => {
    setHrModalOpen(false);
    showToast(t("learn_toast_hr"));
  }, [showToast, t]);

  const value = useMemo(
    (): LearningContextValue => ({
      certs,
      overallPct,
      cpdYtd,
      visibleCerts,
      scheduledCount: scheduledCourses.length,
      domainFilter,
      highlightCertId,
      selectedPath,
      setSelectedPath,
      syncFlash,
      lastSync,
      hrOpenItems,
      certModal,
      hrModalOpen,
      toast,
      setToast,
      showToast,
      openCert,
      handleCertPrimary,
      handleCompleteModule,
      handleSync,
      launchHr,
      setHrModalOpen,
      setCertModal,
      focusDomain,
      setDomainFilter,
      clearDomainFilter,
      setHighlightCertId,
      activeCert,
    }),
    [
      certs,
      overallPct,
      cpdYtd,
      visibleCerts,
      scheduledCourses.length,
      domainFilter,
      highlightCertId,
      selectedPath,
      syncFlash,
      lastSync,
      hrOpenItems,
      certModal,
      hrModalOpen,
      toast,
      showToast,
      openCert,
      handleCertPrimary,
      handleCompleteModule,
      handleSync,
      launchHr,
      focusDomain,
      clearDomainFilter,
      activeCert,
    ],
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error("useLearning must be used within LearningProvider");
  return ctx;
}
