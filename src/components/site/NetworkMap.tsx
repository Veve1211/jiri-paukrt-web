import { cn } from "@/lib/utils";
import { LOCATIONS, type NetworkLocation, type Region } from "@/data/portfolio";
import { usePrefersReducedMotion } from "@/hooks/use-telemetry";

const VW = 1000;
const VH = 600;

/** Two-panel map projection: Europe on the left, Australia on the right. */
export function project(loc: { lat: number; lon: number }): { x: number; y: number } {
  if (loc.lat < 0) {
    const k = 24.7;
    return { x: 720 + (loc.lon - 142) * Math.cos((36 * Math.PI) / 180) * k, y: 200 + (-31 - loc.lat) * k };
  }
  const k = 29.5;
  return { x: 40 + (loc.lon + 11) * Math.cos((52 * Math.PI) / 180) * k, y: 60 + (58.5 - loc.lat) * k };
}

const POS = new Map(LOCATIONS.map((l) => [l.id, project(l)]));
const pt = (id: string) => POS.get(id) ?? { x: 0, y: 0 };

const PROJECT_LINKS = ["glasgow", "birmingham", "brno", "sydney", "melbourne"];
const CAREER_PATH = ["prague", "leeds", "melbourne", "dublin"];

function arc(a: { x: number; y: number }, b: { x: number; y: number }, lift = 0.25) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.abs(b.x - a.x) * lift;
  return `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
}

export function NetworkMap({
  selected,
  region,
  onSelect,
}: {
  selected?: string | undefined;
  region?: Region | undefined;
  onSelect: (id: string | undefined) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const inRegion = (l: NetworkLocation) => !region || l.region === region;

  const careerD = CAREER_PATH.slice(1)
    .map((id, i) => {
      const from = CAREER_PATH[i] ?? id;
      return arc(pt(from), pt(id), id === "melbourne" || from === "melbourne" ? 0.18 : 0.12);
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="h-full w-full"
      fill="none"
      role="group"
      aria-label="Map of projects and career bases"
      onClick={(e) => {
        if (e.target === e.currentTarget) onSelect(undefined);
      }}
    >
      {/* sector frames */}
      <g className="font-mono" fontSize="9" letterSpacing="2">
        <rect x="20" y="30" width="640" height="510" rx="14" className="stroke-star/[0.06]" />
        <text x="36" y="52" className="fill-dim">EUROPE</text>
        <rect x="690" y="170" width="290" height="280" rx="14" className="stroke-star/[0.06]" />
        <text x="706" y="192" className="fill-dim">AUSTRALIA</text>
        <text x="36" y="575" className="fill-dim/70">SCHEMATIC MAP · NOT TO SCALE BETWEEN PANELS</text>
      </g>
      <circle cx={pt("dublin").x} cy={pt("dublin").y} r="160" className="stroke-cyan/[0.07]" />
      <circle cx={pt("dublin").x} cy={pt("dublin").y} r="90" className="stroke-volt/[0.14]" strokeDasharray="2 6" />

      {/* career trajectory */}
      <path d={careerD} className="stroke-volt/60" strokeDasharray="4 5" />

      {/* project links radiate from the Dublin base */}
      {PROJECT_LINKS.map((id) => {
        const lit = selected === id || selected === "dublin";
        const d = pt(id).x > 680 ? arc(pt("dublin"), pt(id), 0.22) : `M${pt("dublin").x} ${pt("dublin").y} L${pt(id).x} ${pt(id).y}`;
        return (
          <path
            key={id}
            d={d}
            strokeWidth={lit ? 1.4 : 1}
            strokeDasharray={lit ? "6 3" : undefined}
            className={cn(lit ? "flow-dash stroke-cyan" : "stroke-cyan/40", "transition-all")}
          />
        );
      })}
      {!reducedMotion &&
        PROJECT_LINKS.slice(0, 3).map((id, i) => (
          <circle key={`pulse-${id}`} r="1.8" className="fill-cyan">
            <animateMotion dur={`${3.5 + i}s`} repeatCount="indefinite" path={`M${pt("dublin").x} ${pt("dublin").y} L${pt(id).x} ${pt(id).y}`} />
          </circle>
        ))}

      {LOCATIONS.map((l) => {
        const p = pt(l.id);
        const sel = selected === l.id;
        const dimmed = !inRegion(l);
        const town = l.kind === "town";
        const r = l.kind === "hq" ? 6 : town ? 2.2 : 4.5;
        const labelRight = p.x < 600 || (p.x > 690 && p.x < 900);
        return (
          <g
            key={l.id}
            role="button"
            tabIndex={0}
            aria-label={`${l.name}, ${l.country}`}
            aria-pressed={sel}
            className={cn("group cursor-pointer outline-none transition-opacity", dimmed && "opacity-25")}
            onClick={() => onSelect(sel ? undefined : l.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(sel ? undefined : l.id);
              }
            }}
          >
            <circle cx={p.x} cy={p.y} r={town ? 9 : 16} className="fill-transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={r + 8}
              className="stroke-cyan opacity-0 transition-opacity group-focus-visible:opacity-100"
              strokeDasharray="3 3"
            />
            {(l.kind === "hq" || sel) && <circle cx={p.x} cy={p.y} r={r + 9} className="node-pulse fill-cyan/15" />}
            {l.kind === "base" && <circle cx={p.x} cy={p.y} r={r + 5} className="fill-volt/25" />}
            <circle
              cx={p.x}
              cy={p.y}
              r={sel ? r + 1.5 : r}
              className={cn(
                "transition-all",
                l.kind === "hq" || sel ? "fill-cyan" : l.kind === "base" ? "fill-starblue" : "fill-star",
                town && !sel && "fill-star/80 group-hover:fill-cyan",
              )}
            />
            {(!town || sel) && (
              <g className="font-mono" letterSpacing="1.5" textAnchor={labelRight ? "start" : "end"}>
                <text
                  x={p.x + (labelRight ? 14 : -14)}
                  y={p.y - 4}
                  fontSize="11"
                  className={cn(sel || l.kind === "hq" ? "fill-cyan" : l.kind === "base" ? "fill-starblue" : "fill-star")}
                >
                  {l.name.toUpperCase()}
                </text>
                <text x={p.x + (labelRight ? 14 : -14)} y={p.y + 10} fontSize="8.5" className="fill-dim">
                  {l.kind === "hq" ? "CURRENT BASE" : l.kind === "base" ? "CAREER BASE" : l.kind === "town" ? "TOWN MODEL" : "PROJECT"}
                </text>
              </g>
            )}
            <title>{`${l.name}, ${l.country}`}</title>
          </g>
        );
      })}
    </svg>
  );
}
