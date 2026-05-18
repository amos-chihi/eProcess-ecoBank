"use client";

import { useState } from "react";
import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { MOBILE_MESSAGE_THREADS, type MobileMessageThread } from "@/lib/client-mobile-data";
import type { DemoMsgKey } from "@/lib/demo-i18n";

function fromLabel(from: MobileMessageThread["from"], t: (k: DemoMsgKey) => string) {
  if (from === "rm") return t("mob_msg_from_rm");
  if (from === "branch") return t("mob_msg_from_branch");
  return t("mob_msg_from_system");
}

export function MobileMessagesView({ onOpenReply }: { onOpenReply: (subject: string) => void }) {
  const { t } = useDemoLocale();
  const [threads, setThreads] = useState(MOBILE_MESSAGE_THREADS);
  const [active, setActive] = useState<MobileMessageThread | null>(null);

  if (active) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setActive(null)}
          className="text-sm font-semibold text-eco-teal-dark"
        >
          ← {t("mob_msg_back")}
        </button>
        <p className="text-[10px] font-semibold uppercase text-eco-muted">
          {fromLabel(active.from, t)}
        </p>
        <h2 className="text-lg font-semibold text-eco-navy">{t(active.subjectKey as DemoMsgKey)}</h2>
        <p className="text-[11px] text-eco-muted">{active.at}</p>
        <div className="rounded-xl border border-eco-border bg-white p-4 text-sm leading-relaxed text-eco-ink">
          {t(active.bodyKey as DemoMsgKey)}
        </div>
        <button
          type="button"
          onClick={() => onOpenReply(t(active.subjectKey as DemoMsgKey))}
          className="flex min-h-11 w-full items-center justify-center rounded-xl bg-eco-navy py-3 text-sm font-semibold text-white"
        >
          {t("mob_msg_reply")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-eco-muted">{t("mob_msg_inbox")}</p>
      <ul className="space-y-2">
        {threads.map((thread) => (
          <li key={thread.id}>
            <button
              type="button"
              onClick={() => {
                setActive(thread);
                setThreads((prev) =>
                  prev.map((x) => (x.id === thread.id ? { ...x, unread: false } : x)),
                );
              }}
              className={`w-full rounded-xl border px-3 py-3 text-left ${
                thread.unread
                  ? "border-eco-teal/30 bg-eco-teal-muted/20"
                  : "border-eco-border bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase text-eco-muted">
                  {fromLabel(thread.from, t)}
                </span>
                {thread.unread && (
                  <span className="rounded-full bg-eco-teal px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {t("mob_unread")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-eco-navy">
                {t(thread.subjectKey as DemoMsgKey)}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-eco-muted">
                {t(thread.previewKey as DemoMsgKey)}
              </p>
              <p className="mt-1 text-[10px] text-eco-muted">{thread.at}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
