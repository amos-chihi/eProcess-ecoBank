"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLearningPlatform } from "@/contexts/learning-platform-context";

const ADMIN_LEARNING_NAV = [
  { href: "/admin/learning", label: "Overview", exact: true },
  { href: "/admin/learning/catalog", label: "Course catalogue" },
  { href: "/admin/learning/publishing", label: "Publishing workflow" },
] as const;

export function LearningAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { adminToast, setAdminToast } = useLearningPlatform();

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {ADMIN_LEARNING_NAV.map((item) => {
          const active =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/40"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/rm/learning"
          className="ml-auto rounded-lg px-3 py-2 text-sm text-eco-teal-muted hover:underline"
        >
          Advisor view →
        </Link>
      </nav>
      {children}
      {adminToast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[80] flex max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-amber-500/30 bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
        >
          <span className="flex-1">{adminToast}</span>
          <button
            type="button"
            onClick={() => setAdminToast(null)}
            className="shrink-0 rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10"
          >
            ✕
          </button>
        </div>
      ) : null}
    </div>
  );
}
