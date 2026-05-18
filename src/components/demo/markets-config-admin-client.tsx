"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MARKET_PROFILES } from "@/lib/demo-data";

const DEFAULT_JSON = JSON.stringify(MARKET_PROFILES, null, 2);

export function MarketsConfigAdminClient() {
  const router = useRouter();
  const [text, setText] = useState(DEFAULT_JSON);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const parsedOk = useMemo(() => {
    try {
      const v = JSON.parse(text) as unknown;
      return Array.isArray(v);
    } catch {
      return false;
    }
  }, [text]);

  function validate() {
    try {
      const v = JSON.parse(text);
      setFeedback(Array.isArray(v) ? "Valid JSON array — schema check passed." : "JSON must be an array of markets.");
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  function saveStub() {
    if (!parsedOk) {
      validate();
      return;
    }
    setSavedAt(new Date().toISOString());
    setFeedback(null);
    router.push("/rm/markets");
  }

  function reset() {
    setText(DEFAULT_JSON);
    setFeedback(null);
    setSavedAt(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={validate}
          className="rounded-lg bg-eco-navy px-4 py-2 text-sm font-medium text-white hover:bg-eco-navy/90"
        >
          Validate JSON
        </button>
        <button
          type="button"
          onClick={saveStub}
          disabled={!parsedOk}
          className="rounded-lg border border-eco-border bg-white px-4 py-2 text-sm font-medium text-eco-navy hover:bg-eco-surface disabled:opacity-40"
        >
          Save & open Markets demo
        </button>
        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium text-slate-400 hover:text-white"
        >
          Reset fixture
        </button>
      </div>
      {feedback && (
        <p className={`text-sm ${parsedOk ? "text-emerald-300" : "text-red-300"}`}>{feedback}</p>
      )}
      {savedAt && (
        <p className="text-xs text-slate-500">Last stub save timestamp: {savedAt}</p>
      )}
      <label className="block text-xs font-medium text-slate-400" htmlFor="cfg">
        Market profile payload (tax rows, clusters, flows)
      </label>
      <textarea
        id="cfg"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="h-[min(28rem,55vh)] w-full rounded-xl border border-eco-border bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-100 shadow-inner focus:border-eco-teal focus:outline-none focus:ring-1 focus:ring-eco-teal"
      />
      <p className="text-[11px] leading-relaxed text-slate-500">
        Production path: store versioned config in parameter store, validate with JSON Schema, deploy via
        controlled pipeline — never allow ad-hoc edits without dual control.
      </p>
    </div>
  );
}
