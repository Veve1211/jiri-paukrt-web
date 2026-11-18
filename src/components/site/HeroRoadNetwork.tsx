import { Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";

import { getProject } from "@/data/portfolio";
import { usePrefersReducedMotion } from "@/hooks/use-telemetry";
import { cn } from "@/lib/utils";

/**
 * Hero graphic: a schematic road network at night. Each junction is a project;
 * headlights (white) and tail-lights (red) travel along the roads.
 */

interface Junction {
  id: string;
  x: number;
  y: number;
  slug: string;
  label: string;
  sub: string;
  major: boolean;
}

interface Pt {
  x: number;
  y: number;
}

const W = 700;
const H = 600;

const JUNCTIONS: Junction[] = [
  { id: "ireland", x: 210, y: 170, slug: "nta-national-demand-model", label: "IRELAND · NTA", sub: "NATIONAL DEMAND MODEL", major: true },
  { id: "cwg", x: 380, y: 300, slug: "commonwealth-games", label: "COMMONWEALTH GAMES", sub: "SPECTATOR DEMAND", major: true },
  { id: "sydney", x: 560, y: 450, slug: "sydney-lane-cove-tunnel", label: "SYDNEY", sub: "LANE COVE TUNNEL", major: true },
  { id: "uk", x: 500, y: 140, slug: "uk-microsimulation-models", label: "UK TOWNS", sub: "11 MICROSIMULATIONS", major: false },
  { id: "melbourne", x: 610, y: 290, slug: "melbourne-dandenong", label: "MELBOURNE", sub: "DANDENONG MICROSIM", major: false },
  { id: "glasgow", x: 140, y: 370, slug: "glasgow-m74-evaluation", label: "GLASGOW M74", sub: "5-YEAR EVALUATION", major: false },
  { id: "safety", x: 290, y: 480, slug: "road-safety-traffic-conflicts", label: "BRNO · ROAD SAFETY", sub: "TRAFFIC CONFLICTS", major: false },
];

/** Roads between project junctions. */
const ROADS: [string, string][] = [
  ["ireland", "cwg"],
  ["cwg", "sydney"],
  ["cwg", "uk"],
  ["ireland", "uk"],
  ["ireland", "glasgow"],
  ["glasgow", "safety"],
  ["safety", "cwg"],
  ["uk", "melbourne"],
  ["melbourne", "sydney"],
  ["cwg", "melbourne"],
];

/** Roads that leave the frame — the network continues beyond the picture. */
const EXITS: [string, Pt][] = [
  ["ireland", { x: -30, y: 110 }],
  ["uk", { x: 730, y: 80 }],
  ["glasgow", { x: -30, y: 440 }],
  ["safety", { x: 250, y: 640 }],
  ["sydney", { x: 730, y: 520 }],
  ["melbourne", { x: 730, y: 250 }],
  ["ireland", { x: 230, y: -30 }],
];

const byId = (id: string) => JUNCTIONS.find((j) => j.id === id)!;

const LABEL_POS: Record<string, { x: number; y: number; anchor?: "end" }> = {
  ireland: { x: 232, y: 152 },
  cwg: { x: 402, y: 326 },
  sydney: { x: 538, y: 488, anchor: "end" },
  uk: { x: 520, y: 124 },
  melbourne: { x: 590, y: 326, anchor: "end" },
  glasgow: { x: 120, y: 404 },
  safety: { x: 312, y: 512 },
};

/** Parallel carriageway offset: shifts a segment sideways by `d` pixels. */
function offset(a: Pt, b: Pt, d: number): [Pt, Pt] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * d;
  const ny = (dx / len) * d;
  return [
    { x: a.x + nx, y: a.y + ny },
    { x: b.x + nx, y: b.y + ny },
  ];
}

function Road({ a, b, lit, dimmed, animate, seed }: { a: Pt; b: Pt; lit: boolean; dimmed: boolean; animate: boolean; seed: number }) {
  const [h1, h2] = offset(a, b, -3.5);
  const [t1, t2] = offset(a, b, 3.5);
  const headPath = `M${h1.x} ${h1.y} L${h2.x} ${h2.y}`;
  const tailPath = `M${t2.x} ${t2.y} L${t1.x} ${t1.y}`;
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const dur = Math.max(3, len / 55) + (seed % 3) * 0.6;
  return (
    <g className={cn("transition-opacity duration-300", dimmed && "opacity-40")}>
      {/* carriageway */}
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth="16" strokeLinecap="round" className="stroke-[#1b2129]" />
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth="1" strokeDasharray="7 9" className="stroke-star/25" />
      {/* light trails */}
      <path d={headPath} strokeWidth={lit ? 1.6 : 1} className={lit ? "stroke-star/80" : "stroke-star/25"} />
      <path d={tailPath} strokeWidth={lit ? 1.6 : 1} className={lit ? "stroke-alert/90" : "stroke-alert/35"} />
      {animate && (
        <>
          {[0, 0.5].map((phase) => (
            <circle key={`h${phase}`} r="2" className="fill-star">
              <animateMotion dur={`${dur}s`} begin={`${-phase * dur}s`} repeatCount="indefinite" path={headPath} />
            </circle>
          ))}
          {[0.25, 0.75].map((phase) => (
            <circle key={`t${phase}`} r="1.8" className="fill-alert">
              <animateMotion dur={`${dur * 1.15}s`} begin={`${-phase * dur}s`} repeatCount="indefinite" path={tailPath} />
            </circle>
          ))}
        </>
      )}
    </g>
  );
}

export function HeroRoadNetwork() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const active = selected ?? hovered;
  const node = selected ? byId(selected) : null;
  const project = node ? getProject(node.slug) : undefined;

  const onNodeKey = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected((s) => (s === id ? null : id));
    }
  };

  const cardStyle = node
    ? ({
        "--x": `${(node.x / W) * 100}%`,
        "--y": `${(node.y / H) * 100}%`,
        "--t": `translate(${node.x > W / 2 ? "calc(-100% - 22px)" : "22px"}, ${node.y > H * 0.6 ? "calc(-100% + 20px)" : "-20px"})`,
      } as CSSProperties)
    : undefined;

  return (
    <div className="relative w-full">
      <div className="relative mx-auto aspect-[7/6] w-full max-w-[760px]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          fill="none"
          role="group"
          aria-label="Road network of selected projects — each junction opens a project"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <defs>
            <radialGradient id="lamp" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.32" />
              <stop offset="60%" stopColor="var(--cyan)" stopOpacity="0.06" />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
            </radialGradient>
            <clipPath id="frame">
              <rect x="0" y="0" width={W} height={H} rx="18" />
            </clipPath>
          </defs>

          <g clipPath="url(#frame)">
            {EXITS.map(([id, p], i) => (
              <Road key={`exit-${id}-${i}`} a={byId(id)} b={p} lit={false} dimmed={active !== null} animate={false} seed={i} />
            ))}
            {ROADS.map(([a, b], i) => {
              const lit = active !== null && (a === active || b === active);
              return (
                <Road
                  key={`${a}-${b}`}
                  a={byId(a)}
                  b={byId(b)}
                  lit={lit}
                  dimmed={active !== null && !lit}
                  animate={!reducedMotion && (i < 6 || lit)}
                  seed={i}
                />
              );
            })}
          </g>

          {JUNCTIONS.map((j) => {
            const isActive = active === j.id;
            const isSel = selected === j.id;
            const showLabel = j.major || isActive;
            const pos = LABEL_POS[j.id] ?? { x: j.x + 16, y: j.y - 10 };
            return (
              <g
                key={j.id}
                role="button"
                tabIndex={0}
                aria-label={`${j.label} — ${j.sub}`}
                aria-pressed={isSel}
                className="cursor-pointer outline-none [&:focus-visible_.focus-ring]:opacity-100"
                onClick={() => setSelected((s) => (s === j.id ? null : j.id))}
                onKeyDown={(e) => onNodeKey(e, j.id)}
                onMouseEnter={() => setHovered(j.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(j.id)}
                onBlur={() => setHovered(null)}
              >
                {/* street-lamp pool of light */}
                <circle cx={j.x} cy={j.y} r={isActive ? 54 : j.major ? 42 : 30} fill="url(#lamp)" className="transition-all duration-300" />
                <circle cx={j.x} cy={j.y} r="24" className="fill-transparent" />
                <circle cx={j.x} cy={j.y} r="20" className="focus-ring stroke-cyan opacity-0 transition-opacity" strokeDasharray="3 3" />
                {/* junction: roundabout ring + central island */}
                <circle cx={j.x} cy={j.y} r={j.major ? 11 : 8} strokeWidth="5" className="fill-void stroke-[#262e38]" />
                <circle
                  cx={j.x}
                  cy={j.y}
                  r={j.major ? 11 : 8}
                  strokeWidth="1"
                  className={cn("transition-colors", isActive ? "stroke-cyan" : "stroke-star/40")}
                />
                <circle cx={j.x} cy={j.y} r={isActive ? 4.5 : j.major ? 3.5 : 2.5} className="fill-cyan transition-all" />
                {showLabel && (
                  <g className="font-mono" letterSpacing="1.4" textAnchor={pos.anchor}>
                    <text x={pos.x} y={pos.y} fontSize="11" className={isActive ? "fill-cyan" : "fill-star"}>
                      {j.label}
                    </text>
                    <text x={pos.x} y={pos.y + 15} fontSize="9" className="fill-dim">
                      {j.sub}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          <text x="24" y="584" fontSize="9" letterSpacing="1.4" className="fill-dim/80 font-mono">
            SCHEMATIC · NOT TO SCALE
          </text>
        </svg>

        {/* legend */}
        <div className="pointer-events-none absolute top-1 right-1 hidden space-y-1 text-right font-mono text-[9.5px] leading-relaxed tracking-[0.14em] text-dim sm:block">
          <div className="flex items-center justify-end gap-2">
            JUNCTION = PROJECT <span className="size-2 rounded-full bg-cyan" />
          </div>
          <div className="flex items-center justify-end gap-2">
            HEADLIGHTS <span className="h-px w-4 bg-star/80" />
          </div>
          <div className="flex items-center justify-end gap-2">
            TAIL-LIGHTS <span className="h-px w-4 bg-alert" />
          </div>
          <div className="pt-1 text-dim/70">{selected ? "ESC TO CLOSE" : "CLICK A JUNCTION"}</div>
        </div>

        {node && project && (
          <div
            style={cardStyle}
            className="glass-strong z-20 mt-3 w-full rounded-[12px] p-4 shadow-glow md:absolute md:top-[var(--y)] md:left-[var(--x)] md:mt-0 md:w-[270px] md:[transform:var(--t)] animate-in fade-in-0 zoom-in-95"
            role="dialog"
            aria-label={`${project.title} — summary`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="telemetry text-[9px] text-cyan">
                {project.location}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="-mt-1 -mr-1 rounded-full p-1 text-dim hover:bg-star/10 hover:text-star"
                aria-label="Close project summary"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <h3 className="mt-2 text-lg leading-snug font-semibold">{project.title}</h3>
            <p className="mt-1 text-xs text-dim">{project.client}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {project.metrics.slice(0, 2).map((m) => (
                <div key={m.label} className="rounded-[8px] border border-star/10 bg-star/[0.03] p-2">
                  <div className="text-lg font-bold text-star">{m.value}</div>
                  <div className="telemetry mt-0.5 text-[8.5px] leading-tight text-dim">{m.label}</div>
                </div>
              ))}
            </div>
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan hover:underline"
            >
              Open project <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
