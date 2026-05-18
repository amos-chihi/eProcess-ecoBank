"use client";

import { useDemoLocale } from "@/components/demo/demo-locale-provider";
import { DOMAIN_PROGRESS } from "@/lib/demo-data";
import { domainKey } from "./learning-utils";

export function CompetencyRadar() {
  const { t } = useDemoLocale();
  const domains = DOMAIN_PROGRESS;
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 80;
  const angles = domains.map((_, i) => (i * 2 * Math.PI) / domains.length - Math.PI / 2);

  const point = (pct: number, i: number) => {
    const r = (pct / 100) * maxR;
    return { x: cx + r * Math.cos(angles[i]!), y: cy + r * Math.sin(angles[i]!) };
  };

  const actual = domains.map((d, i) => point(d.pct, i));
  const target = domains.map((d, i) => point(d.targetPct, i));

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
    " Z";

  return (
    <div className="flex flex-col items-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-eco-muted">
        {t("learn_radarTitle")}
      </p>
      <svg width={size} height={size} className="text-eco-border" aria-hidden>
        {[25, 50, 75, 100].map((ring) => (
          <circle
            key={ring}
            cx={cx}
            cy={cy}
            r={(ring / 100) * maxR}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.35}
          />
        ))}
        {angles.map((a, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + maxR * Math.cos(a)}
            y2={cy + maxR * Math.sin(a)}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.35}
          />
        ))}
        <path d={toPath(target)} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" />
        <path d={toPath(actual)} fill="rgba(15, 118, 110, 0.2)" stroke="#0f766e" strokeWidth={2} />
      </svg>
      <ul className="mt-3 grid w-full max-w-xs grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-eco-muted">
        {domains.map((d) => (
          <li key={d.id} className="flex justify-between gap-2">
            <span>{t(domainKey(d.id))}</span>
            <span className="font-medium text-eco-navy">{d.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
