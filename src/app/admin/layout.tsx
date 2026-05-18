import Link from "next/link";

const ADMIN_NAV = [
  { href: "/admin/markets", label: "Markets & tax" },
  { href: "/admin/learning", label: "Learning & certification" },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90">
              L&amp;D administration
            </p>
            <p className="text-sm font-semibold text-white">Configuration console</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/rm"
            className="text-xs font-medium text-eco-teal-muted hover:underline"
          >
            ← RM workstation
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
