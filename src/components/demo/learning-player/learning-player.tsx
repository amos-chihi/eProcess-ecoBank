"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import type { DemoCertification } from "@/lib/demo-data";
import {
  getModuleOutlines,
  getQuizQuestion,
  getReadingContent,
  getScenarioContent,
  type LearningUnit,
  type ReadingBlock,
  type UnitType,
} from "@/lib/learning-module-content";

function UnitIcon({ type }: { type: UnitType }) {
  const base = "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold";
  if (type === "reading") {
    return (
      <span className={`${base} bg-sky-100 text-sky-800`} aria-hidden>
        §
      </span>
    );
  }
  if (type === "scenario") {
    return (
      <span className={`${base} bg-violet-100 text-violet-800`} aria-hidden>
        ◆
      </span>
    );
  }
  return (
    <span className={`${base} bg-amber-100 text-amber-900`} aria-hidden>
      ?
    </span>
  );
}

function ReadingBody({ blocks }: { blocks: ReadingBlock[] }) {
  return (
    <div className="prose prose-sm max-w-none space-y-4 text-eco-ink">
      {blocks.map((block, i) => {
        if (block.kind === "heading") {
          return (
            <h3 key={i} className="text-base font-semibold text-eco-navy">
              {block.text}
            </h3>
          );
        }
        if (block.kind === "paragraph") {
          return (
            <p key={i} className="leading-relaxed text-eco-muted">
              {block.text}
            </p>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={i} className="list-disc space-y-2 pl-5 text-eco-muted">
              {block.text.split("|").map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        const variant =
          block.calloutVariant === "important"
            ? "border-amber-300 bg-amber-50 text-amber-950"
            : block.calloutVariant === "tip"
              ? "border-emerald-300 bg-emerald-50 text-emerald-950"
              : "border-sky-300 bg-sky-50 text-sky-950";
        return (
          <div key={i} className={`rounded-lg border-l-4 px-4 py-3 text-sm leading-relaxed ${variant}`}>
            {block.text}
          </div>
        );
      })}
    </div>
  );
}

export function LearningPlayer({
  cert,
  mode,
  onClose,
  onCompleteModule,
}: {
  cert: DemoCertification;
  mode: "play" | "review";
  onClose: () => void;
  onCompleteModule: () => void;
}) {
  const { t } = useDemoLocale();
  const isReview = mode === "review" || cert.status === "completed";
  const moduleIndex = Math.min(
    isReview ? cert.modulesTotal : cert.modulesDone + 1,
    cert.modulesTotal,
  );

  const outlines = useMemo(
    () => getModuleOutlines(cert.id, cert.modulesTotal),
    [cert.id, cert.modulesTotal],
  );
  const currentModule = outlines[moduleIndex - 1];
  const [unitIdx, setUnitIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [attestation, setAttestation] = useState(false);

  const currentUnit: LearningUnit | undefined = currentModule?.units[unitIdx];
  const reading = useMemo(
    () => getReadingContent(cert.id, moduleIndex, cert.title),
    [cert.id, moduleIndex, cert.title],
  );
  const scenario = useMemo(() => getScenarioContent(cert.id, moduleIndex), [cert.id, moduleIndex]);
  const quiz = useMemo(() => getQuizQuestion(cert.id, moduleIndex), [cert.id, moduleIndex]);

  const progressPct = Math.round(
    ((cert.modulesDone + (unitIdx + 1) / (currentModule?.units.length ?? 3)) / cert.modulesTotal) *
      100,
  );

  useEffect(() => {
    setUnitIdx(0);
    setQuizAnswer(null);
    setQuizSubmitted(false);
    setAttestation(false);
  }, [cert.id, moduleIndex, mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const unitTypeLabel = useCallback(
    (type: UnitType) => {
      if (type === "reading") return t("learn_player_unit_reading");
      if (type === "scenario") return t("learn_player_unit_scenario");
      return t("learn_player_unit_quiz");
    },
    [t],
  );

  const canGoNext = useMemo(() => {
    if (!currentUnit) return false;
    if (currentUnit.type === "quiz") {
      return quizSubmitted && quizAnswer && quiz.options.find((o) => o.id === quizAnswer)?.correct;
    }
    return true;
  }, [currentUnit, quiz, quizAnswer, quizSubmitted]);

  const isLastUnit = unitIdx >= (currentModule?.units.length ?? 1) - 1;
  const isLastModule = moduleIndex >= cert.modulesTotal;

  const goNext = useCallback(() => {
    if (!canGoNext && currentUnit?.type === "quiz") return;
    if (!isLastUnit) {
      setUnitIdx((i) => i + 1);
      setQuizAnswer(null);
      setQuizSubmitted(false);
      return;
    }
    if (currentUnit?.type === "quiz" && !attestation) return;
    onCompleteModule();
    if (!isLastModule) {
      setUnitIdx(0);
      setQuizAnswer(null);
      setQuizSubmitted(false);
      setAttestation(false);
    }
  }, [attestation, canGoNext, currentUnit?.type, isLastModule, isLastUnit, onCompleteModule]);

  const goPrev = useCallback(() => {
    if (unitIdx > 0) {
      setUnitIdx((i) => i - 1);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    }
  }, [unitIdx]);

  if (!currentModule || !currentUnit) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#f3f2f1] text-eco-ink" role="dialog" aria-modal="true">
      {/* Top bar — MS Learn style */}
      <header className="flex shrink-0 items-center gap-4 border-b border-[#e1dfdd] bg-white px-4 py-2 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-eco-navy hover:bg-eco-surface"
        >
          <span aria-hidden className="text-lg leading-none">←</span>
          {t("learn_player_exit")}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-eco-navy">{cert.title}</p>
          <p className="truncate text-xs text-eco-muted">
            {t("learn_player_moduleOf", { n: moduleIndex, total: cert.modulesTotal })} ·{" "}
            {currentModule.title}
          </p>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right text-xs text-eco-muted">
            <span className="font-semibold text-eco-navy">{progressPct}%</span>
            <span className="ml-1">{t("learn_player_progress")}</span>
          </div>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-[#edebe9]">
            <div
              className="h-full rounded-full bg-[#0078d4] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar — module & unit outline */}
        <aside className="hidden w-72 shrink-0 flex-col border-r border-[#e1dfdd] bg-white lg:flex">
          <div className="border-b border-[#e1dfdd] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-eco-muted">
              {t("learn_player_contents")}
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto p-2" aria-label={t("learn_player_contents")}>
            {outlines.map((mod) => {
              const done = mod.index <= cert.modulesDone;
              const active = mod.index === moduleIndex;
              return (
                <div key={mod.index} className="mb-1">
                  <button
                    type="button"
                    disabled={!isReview && mod.index > cert.modulesDone + 1}
                    className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                      active ? "bg-[#eff6fc] font-semibold text-[#0078d4]" : "text-eco-ink hover:bg-eco-surface"
                    } ${!isReview && mod.index > cert.modulesDone + 1 ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                        done ? "bg-emerald-600 text-white" : active ? "bg-[#0078d4] text-white" : "bg-[#edebe9] text-eco-muted"
                      }`}
                    >
                      {done ? "✓" : mod.index}
                    </span>
                    <span className="line-clamp-2 leading-snug">{mod.title}</span>
                  </button>
                  {active && (
                    <ul className="mb-2 ml-7 space-y-0.5 border-l-2 border-[#c7e0f4] pl-3">
                      {mod.units.map((unit, ui) => {
                        const unitActive = ui === unitIdx;
                        const unitDone = ui < unitIdx || (done && !active);
                        return (
                          <li key={unit.id}>
                            <button
                              type="button"
                              onClick={() => {
                                if (ui <= unitIdx || unitDone) setUnitIdx(ui);
                              }}
                              disabled={ui > unitIdx && !unitDone}
                              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs ${
                                unitActive
                                  ? "bg-[#deecf9] font-medium text-[#0078d4]"
                                  : "text-eco-muted hover:bg-eco-surface"
                              }`}
                            >
                              <UnitIcon type={unit.type} />
                              <span className="line-clamp-1">{unit.title}</span>
                              {unitDone && <span className="ml-auto text-emerald-600">✓</span>}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main lesson canvas */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-[#e1dfdd] bg-white px-4 py-3 sm:px-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-eco-muted">
              <span>{cert.title}</span>
              <span>/</span>
              <span>{currentModule.title}</span>
              <span>/</span>
              <span className="font-medium text-[#0078d4]">{currentUnit.title}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <UnitIcon type={currentUnit.type} />
              <div>
                <h1 className="text-xl font-semibold text-eco-navy sm:text-2xl">{currentUnit.title}</h1>
                <p className="text-xs text-eco-muted">
                  {unitTypeLabel(currentUnit.type)} · {currentUnit.durationMin} {t("learn_player_minutes")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-3xl">
              {isReview ? (
                <div className="space-y-6">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-5">
                    <p className="text-lg font-semibold text-emerald-900">{t("learn_modal_reviewTitle")}</p>
                    <p className="mt-2 text-sm text-emerald-800">{t("learn_modal_reviewBody")}</p>
                  </div>
                  <p className="text-sm text-eco-muted">
                    {t("learn_cpd")}: {cert.cpdEarned}/{cert.cpdRequired}h · {t("learn_modules")}:{" "}
                    {cert.modulesDone}/{cert.modulesTotal}
                  </p>
                  {cert.id.startsWith("fps") && (
                    <Link
                      href="/rm/meeting"
                      className="inline-flex min-h-11 items-center rounded-lg bg-eco-navy px-5 text-sm font-semibold text-white hover:bg-eco-navy/90"
                    >
                      {t("learn_modal_openMeeting")}
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  {currentUnit.type === "reading" && (
                    <div className="space-y-6">
                      <section className="rounded-xl border border-[#e1dfdd] bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-eco-muted">
                          {t("learn_player_objectives")}
                        </h2>
                        <ul className="mt-3 space-y-2">
                          {reading.objectives.map((obj) => (
                            <li key={obj} className="flex gap-2 text-sm text-eco-ink">
                              <span className="text-[#0078d4]">✓</span>
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section className="rounded-xl border border-[#e1dfdd] bg-white p-6 shadow-sm">
                        <ReadingBody blocks={reading.blocks} />
                      </section>
                    </div>
                  )}

                  {currentUnit.type === "scenario" && (
                    <div className="space-y-4">
                      {scenario.map((step, si) => (
                        <article
                          key={step.title}
                          className="rounded-xl border border-[#e1dfdd] bg-white p-5 shadow-sm"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wide text-[#0078d4]">
                            {t("learn_player_step", { n: si + 1 })}
                          </p>
                          <h3 className="mt-1 font-semibold text-eco-navy">{step.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-eco-muted">{step.body}</p>
                          {step.choice && (
                            <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900">
                              → {step.choice}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  )}

                  {currentUnit.type === "quiz" && (
                    <div className="space-y-6">
                      <section className="rounded-xl border border-[#e1dfdd] bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-eco-navy">{t("learn_player_knowledgeCheck")}</h2>
                        <p className="mt-3 text-sm font-medium leading-relaxed text-eco-ink">{quiz.prompt}</p>
                        <fieldset className="mt-4 space-y-2">
                          {quiz.options.map((opt) => {
                            const selected = quizAnswer === opt.id;
                            const showResult = quizSubmitted && selected;
                            return (
                              <label
                                key={opt.id}
                                className={`flex cursor-pointer gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                                  showResult
                                    ? opt.correct
                                      ? "border-emerald-400 bg-emerald-50"
                                      : "border-red-300 bg-red-50"
                                    : selected
                                      ? "border-[#0078d4] bg-[#eff6fc]"
                                      : "border-[#e1dfdd] hover:border-[#0078d4]/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="quiz"
                                  checked={selected}
                                  onChange={() => {
                                    setQuizAnswer(opt.id);
                                    setQuizSubmitted(false);
                                  }}
                                  className="mt-1 accent-[#0078d4]"
                                />
                                <span>{opt.text}</span>
                              </label>
                            );
                          })}
                        </fieldset>
                        {!quizSubmitted ? (
                          <button
                            type="button"
                            disabled={!quizAnswer}
                            onClick={() => setQuizSubmitted(true)}
                            className="mt-4 rounded-lg bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 hover:bg-[#106ebe]"
                          >
                            {t("learn_player_submitAnswer")}
                          </button>
                        ) : (
                          <p
                            className={`mt-4 text-sm ${quiz.options.find((o) => o.id === quizAnswer)?.correct ? "text-emerald-800" : "text-red-800"}`}
                          >
                            {quiz.options.find((o) => o.id === quizAnswer)?.correct
                              ? t("learn_player_correct")
                              : t("learn_player_incorrect")}{" "}
                            — {quiz.explanation}
                          </p>
                        )}
                      </section>

                      {quizSubmitted &&
                        quiz.options.find((o) => o.id === quizAnswer)?.correct && (
                          <label className="flex cursor-pointer gap-3 rounded-xl border border-[#e1dfdd] bg-white p-4 shadow-sm">
                            <input
                              type="checkbox"
                              checked={attestation}
                              onChange={(e) => setAttestation(e.target.checked)}
                              className="mt-1 accent-eco-teal"
                            />
                            <span className="text-sm text-eco-ink">{t("learn_modal_check3")}</span>
                          </label>
                        )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer nav */}
          {!isReview && (
            <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-[#e1dfdd] bg-white px-4 py-3 sm:px-8">
              <button
                type="button"
                onClick={goPrev}
                disabled={unitIdx === 0}
                className="rounded-lg border border-[#e1dfdd] px-4 py-2 text-sm font-medium text-eco-ink disabled:opacity-40 hover:bg-eco-surface"
              >
                {t("learn_player_previous")}
              </button>
              <p className="hidden text-xs text-eco-muted sm:block">
                {t("learn_player_unitOf", {
                  n: unitIdx + 1,
                  total: currentModule.units.length,
                })}
              </p>
              <button
                type="button"
                disabled={
                  currentUnit.type === "quiz"
                    ? !quizSubmitted ||
                      !quiz.options.find((o) => o.id === quizAnswer)?.correct ||
                      (isLastUnit && !attestation)
                    : false
                }
                onClick={goNext}
                className="rounded-lg bg-[#0078d4] px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#106ebe]"
              >
                {isLastUnit
                  ? isLastModule
                    ? t("learn_modal_completeModule")
                    : t("learn_modal_nextModule")
                  : t("learn_player_next")}
              </button>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}
