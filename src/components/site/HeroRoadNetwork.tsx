import { Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { useContent } from "@/data/useContent";
import { useLang } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/hooks/use-telemetry";
import { cn } from "@/lib/utils";
import { useVcSwitch, VcSwitch, VC_FADE } from "@/components/site/VcSwitch";

/**
 * Hero graphic: a schematic traffic-model flow plot. Each junction is a project;
 * road bandwidth shows (illustrative) traffic flow and colour shows volume/capacity,
 * the way strategic models such as SATURN present assignment results.
 */

interface Junction {
  id: string;
  x: number;
  y: number;
  slug: string;
  label: string;
  sub: string;
  subCs: string;
  labelCs?: string;
  major: boolean;
}

interface Pt {
  x: number;
  y: number;
}

const W = 700;
const H = 600;

const JUNCTIONS: Junction[] = [
  {
    id: "ireland",
    x: 210,
    y: 170,
    slug: "nta-national-demand-model",
    label: "IRELAND · NTA",
    labelCs: "IRSKO · NTA",
    sub: "NATIONAL DEMAND MODEL",
    subCs: "NÁRODNÍ MODEL POPTÁVKY",
    major: true,
  },
  {
    id: "cwg",
    x: 380,
    y: 300,
    slug: "commonwealth-games",
    label: "COMMONWEALTH GAMES",
    labelCs: "HRY COMMONWEALTHU",
    sub: "VISITOR DEMAND",
    subCs: "POPTÁVKA NÁVŠTĚVNÍKŮ",
    major: true,
  },
  {
    id: "sydney",
    x: 560,
    y: 450,
    slug: "sydney-lane-cove-tunnel",
    label: "SYDNEY",
    sub: "LANE COVE TUNNEL",
    subCs: "TUNEL LANE COVE",
    major: true,
  },
  {
    id: "uk",
    x: 500,
    y: 140,
    slug: "uk-microsimulation-models",
    label: "UK TOWNS",
    labelCs: "MĚSTA V UK",
    sub: "11 MICROSIMULATIONS",
    subCs: "11 MIKROSIMULACÍ",
    major: false,
  },
  {
    id: "melbourne",
    x: 610,
    y: 290,
    slug: "melbourne-dandenong",
    label: "MELBOURNE",
    sub: "DANDENONG MICROSIM",
    subCs: "MIKROSIMULACE DANDENONG",
    major: false,
  },
  {
    id: "glasgow",
    x: 140,
    y: 370,
    slug: "glasgow-m74-evaluation",
    label: "GLASGOW M74",
    sub: "5-YEAR EVALUATION",
    subCs: "HODNOCENÍ PO 5 LETECH",
    major: false,
  },
  {
    id: "safety",
    x: 290,
    y: 480,
    slug: "road-safety-traffic-conflicts",
    label: "BRNO · ROAD SAFETY",
    labelCs: "BRNO · BEZPEČNOST",
    sub: "TRAFFIC CONFLICTS",
    subCs: "DOPRAVNÍ KONFLIKTY",
    major: false,
  },
];

/** Roads between project junctions, with illustrative two-way flow (veh/h) and volume/capacity. */
const ROADS: { a: string; b: string; flow: number; vc: number }[] = [
  { a: "ireland", b: "cwg", flow: 3400, vc: 0.94 },
  { a: "cwg", b: "sydney", flow: 2900, vc: 0.86 },
  { a: "cwg", b: "uk", flow: 2200, vc: 0.72 },
  { a: "ireland", b: "uk", flow: 1500, vc: 0.55 },
  { a: "ireland", b: "glasgow", flow: 2600, vc: 0.81 },
  { a: "glasgow", b: "safety", flow: 1200, vc: 0.48 },
  { a: "safety", b: "cwg", flow: 1900, vc: 0.66 },
  { a: "uk", b: "melbourne", flow: 1100, vc: 0.42 },
  { a: "melbourne", b: "sydney", flow: 1700, vc: 0.61 },
  { a: "cwg", b: "melbourne", flow: 2400, vc: 0.92 },
];

function vcClass(vc: number): { stroke: string; label: string } {
  if (vc > 0.9) return { stroke: "stroke-alert", label: "fill-alert" };
  if (vc >= 0.7) return { stroke: "stroke-amber", label: "fill-amber" };
  return { stroke: "stroke-go", label: "fill-go" };
}

const bandWidth = (flow: number) => 3 + flow / 380;

/** Roads that leave the frame — the network continues beyond the picture. */
const EXITS: [string, Pt][] = [
  ["ireland", { x: -30, y: 110 }],
  ["uk", { x: 470, y: -30 }],
  ["glasgow", { x: -30, y: 440 }],
  ["safety", { x: 250, y: 640 }],
  ["sydney", { x: 730, y: 520 }],
  ["melbourne", { x: 730, y: 250 }],
  ["ireland", { x: 230, y: -30 }],
];

const byId = (id: string) => JUNCTIONS.find((j) => j.id === id)!;

const LABEL_POS: Record<string, { x: number; y: number; anchor?: "end" }> = {
  ireland: { x: 188, y: 140, anchor: "end" },
  cwg: { x: 348, y: 344, anchor: "end" },
  sydney: { x: 538, y: 488, anchor: "end" },
  uk: { x: 520, y: 124 },
  melbourne: { x: 590, y: 326, anchor: "end" },
  glasgow: { x: 120, y: 404 },
  safety: { x: 312, y: 512 },
};

function FlowLink({
  a,
  b,
  flow,
  vc,
  lit,
  dimmed,
  animate,
  seed,
  showVc,
  slow = false,
}: {
  a: Pt;
  b: Pt;
  flow: number;
  vc: number;
  showVc: boolean;
  slow?: boolean;
  lit: boolean;
  dimmed: boolean;
  animate: boolean;
  seed: number;
}) {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const dur = (Math.max(4, len / 40) + (seed % 3) * 0.8) * (slow ? 1.8 : 1);
  // Two lanes, offset either side of the centreline: headlights travel a→b,
  // tail-lights travel b→a — like traffic seen from above at night.
  // Traffic keeps LEFT (Ireland, UK, Australia), so the a→b lane sits on the
  // left of the direction of travel (left normal in SVG's y-down space).
  const off = Math.min(3.2, bandWidth(flow) / 2 - 0.6);
  const nx = ((b.y - a.y) / (len || 1)) * off;
  const ny = (-(b.x - a.x) / (len || 1)) * off;
  const lane1 = `M${a.x + nx} ${a.y + ny} L${b.x + nx} ${b.y + ny}`;
  const lane2 = `M${b.x - nx} ${b.y - ny} L${a.x - nx} ${a.y - ny}`;
  const cars = flow > 2500 ? 2 : 1;
  const c = showVc ? vcClass(vc) : { stroke: "stroke-cyan", label: "fill-cyan" };
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  return (
    <g className={cn("transition-opacity duration-300", dimmed && "opacity-30")}>
      {/* soft light halo under the band */}
      {!showVc && (
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          strokeWidth={bandWidth(flow) + 8}
          filter="url(#glow)"
          className={cn(
            "stroke-cyan transition-opacity duration-500",
            lit ? "opacity-90" : "opacity-20",
          )}
        />
      )}
      {/* flow bandwidth, coloured by volume / capacity */}
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        strokeWidth={bandWidth(flow) + (lit ? 2 : 0)}
        strokeLinecap="butt"
        style={{ transition: `${VC_FADE}, stroke-width 0.5s, opacity 0.5s` }}
        className={cn(
          c.stroke,
          "transition-[stroke-width,opacity] duration-500",
          lit ? "opacity-100" : showVc ? "opacity-75" : "opacity-60",
        )}
      />
      {/* link centreline — a bright lit core when glowing, a dark lane line when coloured */}
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        strokeWidth={0.8}
        strokeDasharray={showVc ? undefined : "4 5"}
        className={showVc ? "stroke-void/70" : "stroke-void/60"}
      />
      {animate &&
        Array.from({ length: cars }, (_, k) => {
          const phase = (k + (seed % 2) * 0.5) / cars;
          return (
            <g key={k}>
              {/* headlights: a pair of small white lights */}
              <rect
                x="-2.6"
                y="-1.1"
                width="5.2"
                height="2.2"
                rx="1.1"
                className="fill-white"
                filter="url(#glow-small)"
              >
                <animateMotion
                  dur={`${dur}s`}
                  begin={`${-phase * dur}s`}
                  repeatCount="indefinite"
                  path={lane1}
                  rotate="auto"
                />
              </rect>
              {/* tail-lights on the opposite lane */}
              <rect
                x="-2.2"
                y="-0.9"
                width="4.4"
                height="1.8"
                rx="0.9"
                className="fill-alert"
                filter="url(#glow-small)"
              >
                <animateMotion
                  dur={`${dur * 1.1}s`}
                  begin={`${-((phase + 0.37) % 1) * dur}s`}
                  repeatCount="indefinite"
                  path={lane2}
                  rotate="auto"
                />
              </rect>
            </g>
          );
        })}
      {lit && (
        <g className="font-mono" fontSize="9.5" letterSpacing="0.8">
          <rect
            x={mx - 40}
            y={my - 9}
            width="80"
            height="18"
            rx="3"
            className="fill-void stroke-star/20"
          />
          <text x={mx} y={my + 3.5} textAnchor="middle" className={c.label}>
            {flow.toLocaleString("en-IE")} veh/h
          </text>
        </g>
      )}
    </g>
  );
}

export function HeroRoadNetwork() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mouse, setMouse] = useState<Pt | null>(null);

  const trackMouse = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    setMouse({ x: p.x, y: p.y });
  };
  const wrapRef = useRef<HTMLDivElement>(null);
  const vc = useVcSwitch(wrapRef);
  const showVc = vc.showVc;
  const reducedMotion = usePrefersReducedMotion();
  const { t } = useLang();
  const { getProject } = useContent();

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
      <div ref={wrapRef} className="relative mx-auto aspect-[7/6] w-full max-w-[760px]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          fill="none"
          role="group"
          aria-label={t(
            "Traffic-model style network of selected projects — each junction opens a project",
            "Síť vybraných projektů ve stylu dopravního modelu — každá křižovatka otevře projekt",
          )}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
          onMouseMove={trackMouse}
          onMouseLeave={() => setMouse(null)}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id="glow-small" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="junction-light" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
            </radialGradient>
            <clipPath id="frame">
              <rect x="0" y="0" width={W} height={H} rx="18" />
            </clipPath>
            <clipPath id="torch">
              <circle cx={mouse?.x ?? -999} cy={mouse?.y ?? -999} r="95" />
            </clipPath>
            <radialGradient id="torch-light" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* torch: the network lights up where the mouse is */}
          {mouse && !showVc && (
            <g className="pointer-events-none">
              <circle cx={mouse.x} cy={mouse.y} r="110" fill="url(#torch-light)" />
              <g clipPath="url(#torch)">
                {ROADS.map((r) => {
                  const a = byId(r.a);
                  const b = byId(r.b);
                  return (
                    <g key={`torch-${r.a}-${r.b}`}>
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        strokeWidth={bandWidth(r.flow) + 10}
                        filter="url(#glow)"
                        className="stroke-cyan opacity-70"
                      />
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        strokeWidth={bandWidth(r.flow)}
                        className="stroke-[#9fd0ff]"
                      />
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        strokeWidth="1.2"
                        className="stroke-white/80"
                      />
                    </g>
                  );
                })}
              </g>
            </g>
          )}

          <g clipPath="url(#frame)">
            {EXITS.map(([id, p], i) => {
              const j = byId(id);
              return (
                <line
                  key={`exit-${id}-${i}`}
                  x1={j.x}
                  y1={j.y}
                  x2={p.x}
                  y2={p.y}
                  strokeWidth="1.2"
                  strokeDasharray="5 5"
                  className={cn("stroke-volt transition-opacity", active !== null && "opacity-40")}
                />
              );
            })}
            {ROADS.map((r, i) => {
              const lit = active !== null && (r.a === active || r.b === active);
              return (
                <FlowLink
                  key={`${r.a}-${r.b}`}
                  a={byId(r.a)}
                  b={byId(r.b)}
                  flow={r.flow}
                  vc={r.vc}
                  lit={lit}
                  dimmed={active !== null && !lit}
                  animate
                  slow={reducedMotion}
                  seed={i}
                  showVc={showVc}
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
                aria-label={`${t(j.label, j.labelCs ?? j.label)} — ${t(j.sub, j.subCs)}`}
                aria-pressed={isSel}
                className="cursor-pointer outline-none [&:focus-visible_.focus-ring]:opacity-100"
                onClick={() => setSelected((s) => (s === j.id ? null : j.id))}
                onKeyDown={(e) => onNodeKey(e, j.id)}
                onMouseEnter={() => setHovered(j.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(j.id)}
                onBlur={() => setHovered(null)}
              >
                <circle
                  cx={j.x}
                  cy={j.y}
                  r={isActive ? 40 : j.major ? 28 : 22}
                  fill="url(#junction-light)"
                  className="transition-all duration-300"
                />
                <circle cx={j.x} cy={j.y} r="24" className="fill-transparent" />
                <circle
                  cx={j.x}
                  cy={j.y}
                  r="20"
                  className="focus-ring stroke-cyan opacity-0 transition-opacity"
                  strokeDasharray="3 3"
                />
                {/* junction drawn as a technical node symbol: ring, crosshair ticks, centre point */}
                {(isActive || j.major) && (
                  <circle
                    cx={j.x}
                    cy={j.y}
                    r={j.major ? 17 : 14}
                    strokeWidth="0.8"
                    strokeDasharray="2 3"
                    className={isActive ? "stroke-cyan" : "stroke-star/40"}
                  />
                )}
                <path
                  d={`M${j.x - 14} ${j.y}h-5M${j.x + 14} ${j.y}h5M${j.x} ${j.y - 14}v-5M${j.x} ${j.y + 14}v5`}
                  strokeWidth="1"
                  className={isActive ? "stroke-cyan" : "stroke-star/50"}
                />
                <circle
                  cx={j.x}
                  cy={j.y}
                  r={j.major ? 9 : 7}
                  strokeWidth="1.4"
                  className={cn(
                    "fill-void transition-colors",
                    isActive ? "stroke-cyan" : "stroke-star",
                  )}
                />
                <circle
                  cx={j.x}
                  cy={j.y}
                  r={isActive ? 4 : 2.5}
                  className={cn("transition-all", isActive ? "fill-cyan" : "fill-star")}
                />
                {showLabel && (
                  <g
                    className="font-mono"
                    letterSpacing="1.4"
                    textAnchor={pos.anchor}
                    stroke="var(--void)"
                    strokeWidth="4"
                    paintOrder="stroke"
                    strokeLinejoin="round"
                  >
                    <text
                      x={pos.x}
                      y={pos.y}
                      fontSize="11"
                      className={isActive ? "fill-cyan" : "fill-star"}
                    >
                      {t(j.label, j.labelCs ?? j.label)}
                    </text>
                    <text x={pos.x} y={pos.y + 15} fontSize="9" className="fill-dim">
                      {t(j.sub, j.subCs)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          <text x="24" y="584" fontSize="9" letterSpacing="1.4" className="fill-dim/80 font-mono">
            {t(
              "ILLUSTRATIVE FLOWS · NOT PROJECT DATA",
              "ILUSTRATIVNÍ INTENZITY · NE DATA PROJEKTŮ",
            )}
          </text>
        </svg>

        {/* view switch: plain network vs. congestion (V/C) colours */}
        <VcSwitch vc={vc} className="absolute top-1 left-1" />

        {/* legend */}
        <div className="absolute top-1 right-1 hidden space-y-1.5 rounded-lg bg-void/55 px-3 py-2 text-right font-mono text-[11px] leading-relaxed tracking-[0.1em] text-starblue backdrop-blur-sm sm:block">
          <div className="flex items-center justify-end gap-2 text-star">
            {t("FLOW BANDWIDTH", "INTENZITA DOPRAVY")} <span className="h-0.5 w-3 bg-cyan" />
            <span className="h-2 w-3 bg-cyan" />
          </div>
          <div className="flex items-center justify-end gap-2">
            {t("JUNCTION = PROJECT", "KŘIŽOVATKA = PROJEKT")}{" "}
            <span className="size-2.5 rounded-full border border-star bg-void" />
          </div>
          <div className="pt-1 text-dim">
            {selected
              ? t("ESC TO CLOSE", "ESC ZAVŘE")
              : t("CLICK A JUNCTION", "KLIKNĚTE NA KŘIŽOVATKU")}
          </div>
        </div>

        {/* V/C colour legend: one compact row bottom-right, so it never covers a junction */}
        {showVc && (
          <div
            title={t("V/C = volume / capacity", "V/C = intenzita / kapacita")}
            className="absolute right-1 bottom-1 hidden items-center gap-3 rounded-lg bg-void/55 px-3 py-1.5 font-mono text-[10.5px] tracking-[0.1em] text-starblue backdrop-blur-sm animate-in fade-in-0 sm:flex"
          >
            <span className="text-star">V/C</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-4 bg-go" />
              {t("< 0.70", "< 0,70")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-4 bg-amber" />
              {t("0.70 – 0.90", "0,70 – 0,90")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-4 bg-alert" />
              {t("> 0.90", "> 0,90")}
            </span>
          </div>
        )}

        {node && project && (
          <div
            style={cardStyle}
            className="glass-strong z-20 mt-3 w-full rounded-[14px] p-4 shadow-glow md:absolute md:top-[var(--y)] md:left-[var(--x)] md:mt-0 md:w-[270px] md:[transform:var(--t)] animate-in fade-in-0 zoom-in-95"
            role="dialog"
            aria-label={`${project.title} — ${t("summary", "shrnutí")}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="telemetry text-[9px] text-cyan">{project.location}</div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="-mt-1 -mr-1 rounded-full p-1 text-dim hover:bg-star/10 hover:text-star"
                aria-label={t("Close project summary", "Zavřít shrnutí")}
              >
                <X className="size-3.5" />
              </button>
            </div>
            <h3 className="mt-2 text-lg leading-snug font-semibold">{project.title}</h3>
            <p className="mt-1 text-xs text-dim">{project.client}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {project.metrics.slice(0, 2).map((m) => (
                <div
                  key={m.label}
                  className="rounded-[8px] border border-star/10 bg-star/[0.03] p-2"
                >
                  <div className="text-lg font-bold text-star">{m.value}</div>
                  <div className="telemetry mt-0.5 text-[8.5px] leading-tight text-dim">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan hover:underline"
            >
              {t("Open project", "Otevřít projekt")} <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* compact V/C legend for phones (the full legend is hidden below sm) */}
      {showVc && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.1em] text-starblue animate-in fade-in-0 sm:hidden">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-4 bg-go" />
            {t("V/C < 0.70", "V/C < 0,70")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-4 bg-amber" />
            {t("0.70 – 0.90", "0,70 – 0,90")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-4 bg-alert" />
            {t("> 0.90", "> 0,90")}
          </span>
        </div>
      )}
    </div>
  );
}
