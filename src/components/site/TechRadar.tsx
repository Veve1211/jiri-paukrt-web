import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { getProject, QUADRANTS, TECH, type Quadrant } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const C = 200;
const START: Record<Quadrant, number> = {
  Microsimulation: -90,
  "Strategic Demand": 0,
  Appraisal: 90,
  "GIS & Code": 180,
};

const POS = (() => {
  const out: Record<string, { x: number; y: number }> = {};
  for (const q of QUADRANTS) {
    const items = TECH.filter((t) => t.quadrant === q);
    items.forEach((t, i) => {
      const a = ((START[q] + ((i + 1) * 90) / (items.length + 1)) * Math.PI) / 180;
      const r = i % 2 === 0 ? 150 : 100;
      out[t.name] = { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r };
    });
  }
  return out;
})();

const LABEL_POS: Record<Quadrant, { x: number; y: number; anchor: "start" | "end" }> = {
  Microsimulation: { x: 392, y: 16, anchor: "end" },
  "Strategic Demand": { x: 392, y: 392, anchor: "end" },
  Appraisal: { x: 8, y: 392, anchor: "start" },
  "GIS & Code": { x: 8, y: 16, anchor: "start" },
};

export function TechRadar() {
  const [selected, setSelected] = useState(TECH[0]?.name ?? "");
  const [quadrant, setQuadrant] = useState<Quadrant | null>(null);
  const tech = TECH.find((t) => t.name === selected) ?? TECH[0]!;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="glass rounded-[14px] p-4 lg:col-span-7">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Radar sector">
          {[null, ...QUADRANTS].map((q) => (
            <button
              key={q ?? "all"}
              type="button"
              aria-pressed={quadrant === q}
              onClick={() => setQuadrant(q)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase transition-colors",
                quadrant === q ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-star/10 text-dim hover:text-star",
              )}
            >
              {q ?? "All"}
            </button>
          ))}
        </div>
        <svg viewBox="0 0 400 400" className="mx-auto mt-4 w-full max-w-[460px]" fill="none" role="group" aria-label="Engineering radar">
          {[60, 100, 150, 190].map((r, i) => (
            <circle key={r} cx={C} cy={C} r={r} className={i % 2 ? "stroke-volt/20" : "stroke-cyan/15"} strokeDasharray={i % 2 ? "2 6" : undefined} />
          ))}
          <line x1={C} y1="6" x2={C} y2="394" className="stroke-star/10" />
          <line x1="6" y1={C} x2="394" y2={C} className="stroke-star/10" />
          <g className="font-mono" fontSize="9" letterSpacing="1.5">
            {QUADRANTS.map((q) => (
              <text
                key={q}
                x={LABEL_POS[q].x}
                y={LABEL_POS[q].y}
                textAnchor={LABEL_POS[q].anchor}
                className={cn("cursor-pointer", quadrant === q ? "fill-cyan" : "fill-dim")}
                onClick={() => setQuadrant(quadrant === q ? null : q)}
              >
                {q.toUpperCase()}
              </text>
            ))}
          </g>
          <circle cx={C} cy={C} r="4" className="fill-cyan" />
          {TECH.map((t) => {
            const p = POS[t.name] ?? { x: C, y: C };
            const sel = selected === t.name;
            const dim = quadrant !== null && t.quadrant !== quadrant;
            return (
              <g
                key={t.name}
                role="button"
                tabIndex={0}
                aria-label={t.name}
                aria-pressed={sel}
                className={cn("cursor-pointer outline-none transition-opacity", dim && "opacity-20")}
                onClick={() => setSelected(t.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(t.name);
                  }
                }}
              >
                <circle cx={p.x} cy={p.y} r="14" className="fill-transparent" />
                {sel && <circle cx={p.x} cy={p.y} r="11" className="node-pulse fill-cyan/20" />}
                <circle cx={p.x} cy={p.y} r={sel ? 5 : 3.5} className={sel ? "fill-cyan" : "fill-star"} />
                <text
                  x={p.x}
                  y={p.y + 17}
                  textAnchor="middle"
                  fontSize="9.5"
                  letterSpacing="0.5"
                  className={cn("font-mono", sel ? "fill-cyan" : "fill-star/80")}
                >
                  {t.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="glass rounded-[14px] p-5 lg:col-span-5" aria-live="polite">
        <div className="telemetry text-[10px] text-cyan">{tech.quadrant}</div>
        <h3 className="mt-2 text-2xl font-medium">{tech.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-dim">{tech.blurb}</p>
        {tech.projects && (
          <div className="mt-4">
            <div className="telemetry text-[9.5px] text-dim">Used on</div>
            {tech.projects.map((slug) => {
              const p = getProject(slug)!;
              return (
                <Link key={slug} to="/projects/$slug" params={{ slug }} className="mt-1 block text-sm text-cyan hover:underline">
                  {p.title} →
                </Link>
              );
            })}
          </div>
        )}
        <div className="mt-6 border-t border-star/10 pt-4">
          <div className="telemetry text-[9.5px] text-dim">All tools</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {TECH.filter((t) => !quadrant || t.quadrant === quadrant).map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setSelected(t.name)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  t.name === selected ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-star/10 text-dim hover:text-star",
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
