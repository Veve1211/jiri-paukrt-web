import { Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";

import { getProject } from "@/data/portfolio";
import { usePrefersReducedMotion, useUtcClock } from "@/hooks/use-telemetry";
import { cn } from "@/lib/utils";

type Tone = "cyan" | "star" | "blue" | "minor";

interface HeroNode {
  id: string;
  x: number;
  y: number;
  slug: string;
  label: string;
  sub: string;
  tone: Tone;
}

const W = 700;
const H = 600;

const NODES: HeroNode[] = [
  { id: "ireland", x: 210, y: 170, slug: "nta-national-demand-model", label: "IRELAND NTA", sub: "NATIONAL DEMAND MODEL", tone: "cyan" },
  { id: "cwg", x: 350, y: 300, slug: "commonwealth-games", label: "COMMONWEALTH GAMES", sub: "EVENT MICROSIM", tone: "star" },
  { id: "sydney", x: 560, y: 430, slug: "sydney-lane-cove-tunnel", label: "SYDNEY", sub: "METRO CORRIDORS", tone: "blue" },
  { id: "uk", x: 470, y: 150, slug: "uk-microsimulation-models", label: "UK MICROSIMS", sub: "11 TOWN MODELS", tone: "minor" },
  { id: "melbourne", x: 600, y: 220, slug: "melbourne-dandenong", label: "MELBOURNE", sub: "DANDENONG MICROSIM", tone: "minor" },
  { id: "glasgow", x: 130, y: 330, slug: "glasgow-m74-evaluation", label: "GLASGOW M74", sub: "5-YEAR EVALUATION", tone: "minor" },
  { id: "safety", x: 250, y: 470, slug: "road-safety-traffic-conflicts", label: "ROAD SAFETY", sub: "TRAFFIC CONFLICTS", tone: "minor" },
];

const EDGES: [string, string][] = [
  ["ireland", "cwg"],
  ["cwg", "sydney"],
  ["cwg", "uk"],
  ["ireland", "glasgow"],
  ["glasgow", "safety"],
  ["safety", "cwg"],
  ["uk", "melbourne"],
  ["melbourne", "sydney"],
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

const LABEL_FILL: Record<Tone, string> = {
  cyan: "fill-cyan",
  star: "fill-star",
  blue: "fill-starblue",
  minor: "fill-star",
};

const LABEL_POS: Record<HeroNode["id"], { x: number; y: number; anchor?: "end" }> = {
  ireland: { x: 230, y: 160 },
  cwg: { x: 368, y: 324 },
  sydney: { x: 490, y: 465 },
  uk: { x: 486, y: 138 },
  melbourne: { x: 586, y: 200, anchor: "end" },
  glasgow: { x: 146, y: 352 },
  safety: { x: 266, y: 494 },
};

export function HeroConstellation() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const clock = useUtcClock();

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
          aria-label="Global project constellation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <circle cx="350" cy="300" r="250" className="stroke-cyan/[0.08]" />
          <circle cx="350" cy="300" r="170" className="stroke-volt/[0.14]" strokeDasharray="2 6" />
          <ellipse cx="350" cy="300" rx="300" ry="110" className="stroke-cyan/10" transform="rotate(-22 350 300)" />

          {EDGES.map(([a, b]) => {
            const na = byId(a);
            const nb = byId(b);
            const lit = active !== null && (a === active || b === active);
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                strokeWidth={lit ? 1.5 : 1}
                strokeDasharray={lit ? "6 3" : undefined}
                className={cn(
                  "transition-all duration-300",
                  lit ? "flow-dash stroke-cyan" : "stroke-cyan/55",
                  active && !lit && "stroke-cyan/25",
                )}
              />
            );
          })}
          <path d="M210 170 Q420 60 600 220" className="stroke-volt/70" strokeDasharray="4 5" />

          {!reducedMotion &&
            EDGES.slice(0, 5).map(([a, b], i) => {
              const na = byId(a);
              const nb = byId(b);
              return (
                <circle key={`p-${a}-${b}`} r="1.8" className="fill-cyan">
                  <animateMotion
                    dur={`${4 + i * 0.7}s`}
                    repeatCount="indefinite"
                    path={`M${na.x} ${na.y} L${nb.x} ${nb.y}`}
                  />
                </circle>
              );
            })}

          {NODES.map((n) => {
            const isActive = active === n.id;
            const isSel = selected === n.id;
            const showLabel = n.tone !== "minor" || isActive;
            const pos = LABEL_POS[n.id] ?? { x: n.x + 16, y: n.y - 10 };
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-label={`${n.label} — ${n.sub}`}
                aria-pressed={isSel}
                className="cursor-pointer outline-none [&:focus-visible_.focus-ring]:opacity-100"
                onClick={() => setSelected((s) => (s === n.id ? null : n.id))}
                onKeyDown={(e) => onNodeKey(e, n.id)}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n.id)}
                onBlur={() => setHovered(null)}
              >
                <circle cx={n.x} cy={n.y} r="22" className="fill-transparent" />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="20"
                  className="focus-ring stroke-cyan opacity-0 transition-opacity"
                  strokeDasharray="3 3"
                />
                {n.tone === "cyan" && (
                  <>
                    <circle cx={n.x} cy={n.y} r="14" className="node-pulse fill-cyan/15" />
                    <circle cx={n.x} cy={n.y} r={isActive ? 6.5 : 5} className="fill-cyan transition-all" />
                  </>
                )}
                {n.tone === "star" && (
                  <>
                    <circle cx={n.x} cy={n.y} r="22" className="fill-star/[0.08]" />
                    <circle cx={n.x} cy={n.y} r={isActive ? 7.5 : 6} className="fill-star transition-all" />
                  </>
                )}
                {n.tone === "blue" && (
                  <>
                    <circle cx={n.x} cy={n.y} r="14" className="fill-volt/25" />
                    <circle cx={n.x} cy={n.y} r={isActive ? 6.5 : 5} className="fill-starblue transition-all" />
                  </>
                )}
                {n.tone === "minor" && (
                  <>
                    {isActive && <circle cx={n.x} cy={n.y} r="10" className="fill-cyan/15" />}
                    <circle cx={n.x} cy={n.y} r={isActive ? 4 : n.id === "uk" ? 3 : 2.5} className={isActive ? "fill-cyan" : "fill-star"} />
                  </>
                )}
                {showLabel && (
                  <g className="font-mono" letterSpacing="1.5" textAnchor={pos.anchor}>
                    <text x={pos.x} y={pos.y} fontSize="11" className={n.tone === "minor" ? "fill-cyan" : LABEL_FILL[n.tone]}>
                      {n.label}
                    </text>
                    <text x={pos.x} y={pos.y + 16} fontSize="9" className="fill-dim">
                      {n.sub}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          <text x="40" y="580" fontSize="9" letterSpacing="1.5" className="fill-dim font-mono">
            RA 00h · DEC +53° · EPOCH 1998–2025
          </text>
        </svg>

        {/* Live telemetry HUD */}
        <div className="pointer-events-none absolute top-0 right-0 hidden text-right font-mono text-[9px] leading-relaxed tracking-[0.15em] text-dim sm:block">
          <div className="flex items-center justify-end gap-1.5 text-cyan">
            <span className="size-1 animate-pulse rounded-full bg-cyan shadow-dot" />
            LIVE TELEMETRY
          </div>
          <div>UTC {clock || "--:--:--"}</div>
          <div>
            NODES {String(NODES.length).padStart(2, "0")} · LINKS {String(EDGES.length + 1).padStart(2, "0")}
          </div>
          <div className="text-dim/70">{selected ? "ESC TO CLOSE" : "SELECT A STAR NODE"}</div>
        </div>

        {node && project && (
          <div
            style={cardStyle}
            className="glass-strong z-20 mt-3 w-full rounded-[14px] p-4 shadow-glow md:absolute md:top-[var(--y)] md:left-[var(--x)] md:mt-0 md:w-[270px] md:[transform:var(--t)] animate-in fade-in-0 zoom-in-95"
            role="dialog"
            aria-label={`${project.title} telemetry`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="telemetry text-[9px] text-cyan">
                Node {project.code} · {project.region}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="-mt-1 -mr-1 rounded-full p-1 text-dim hover:bg-star/10 hover:text-star"
                aria-label="Close telemetry"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <h3 className="mt-2 text-base leading-snug font-medium">{project.title}</h3>
            <p className="mt-1 text-xs text-dim">{project.client}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {project.metrics.slice(0, 2).map((m) => (
                <div key={m.label} className="rounded-[10px] border border-star/10 bg-star/[0.03] p-2">
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
              Open mission file <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
