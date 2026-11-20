import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LOCATIONS, type NetworkLocation, type Region } from "@/data/portfolio";
import { useContent } from "@/data/useContent";
import { usePrefersReducedMotion } from "@/hooks/use-telemetry";

const VW = 1000;
const VH = 600;

/** Two-panel map projection: Europe on the left, Australia on the right. */
export function project(loc: { lat: number; lon: number }): { x: number; y: number } {
  if (loc.lat < 0) {
    const k = 24.7;
    return {
      x: 720 + (loc.lon - 142) * Math.cos((36 * Math.PI) / 180) * k,
      y: 200 + (-31 - loc.lat) * k,
    };
  }
  const k = 29.5;
  return {
    x: 40 + (loc.lon + 11) * Math.cos((52 * Math.PI) / 180) * k,
    y: 60 + (58.5 - loc.lat) * k,
  };
}

const POS = new Map(LOCATIONS.map((l) => [l.id, project(l)]));
const pt = (id: string) => POS.get(id) ?? { x: 0, y: 0 };

const PROJECT_LINKS = ["glasgow", "birmingham", "brno", "sydney"];
const CAREER_PATH = ["prague", "leeds", "melbourne", "dublin"];

/** Schematic road between two points: straight run, then a 45° section (octilinear). */
function road(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const mx = b.x - Math.sign(dx) * Math.abs(dy);
    return `M${a.x} ${a.y} L${mx} ${a.y} L${b.x} ${b.y}`;
  }
  const my = b.y - Math.sign(dy) * Math.abs(dx);
  return `M${a.x} ${a.y} L${a.x} ${my} L${b.x} ${b.y}`;
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
  const { t } = useLang();
  const { cityLabel, countryLabel } = useContent();
  const inRegion = (l: NetworkLocation) => !region || l.region === region;

  const careerD = CAREER_PATH.slice(1)
    .map((id, i) => {
      const from = CAREER_PATH[i] ?? id;
      return road(pt(from), pt(id));
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="h-full w-full"
      fill="none"
      role="group"
      aria-label={t("Map of projects and career bases", "Mapa projektů a kariérních zastávek")}
      onClick={(e) => {
        if (e.target === e.currentTarget) onSelect(undefined);
      }}
    >
      {/* sector frames */}
      <g className="font-mono" fontSize="9" letterSpacing="2">
        <rect x="20" y="30" width="640" height="510" rx="14" className="stroke-star/[0.06]" />
        <text x="36" y="52" className="fill-dim">
          {t("EUROPE", "EVROPA")}
        </text>
        <rect x="690" y="170" width="290" height="280" rx="14" className="stroke-star/[0.06]" />
        <text x="706" y="192" className="fill-dim">
          {t("AUSTRALIA", "AUSTRÁLIE")}
        </text>
        <text x="36" y="575" className="fill-dim/70">
          {t(
            "SCHEMATIC MAP · NOT TO SCALE BETWEEN PANELS",
            "SCHEMATICKÁ MAPA · PANELY NEJSOU VE STEJNÉM MĚŘÍTKU",
          )}
        </text>
      </g>
      {/* career route */}
      <path d={careerD} strokeWidth="7" strokeLinejoin="round" className="stroke-volt/25" />
      <path
        d={careerD}
        strokeWidth="1.2"
        strokeLinejoin="round"
        className="stroke-starblue/70"
        strokeDasharray="8 6"
      />

      {/* project links radiate from the Dublin base */}
      {PROJECT_LINKS.map((id) => {
        const lit = selected === id || selected === "dublin";
        const d = road(pt("dublin"), pt(id));
        return (
          <g key={id}>
            <path
              d={d}
              strokeWidth={lit ? 6 : 4}
              strokeLinejoin="round"
              className={cn(lit ? "stroke-cyan/70" : "stroke-cyan/25", "transition-all")}
            />
            <path d={d} strokeWidth="0.8" strokeLinejoin="round" className="stroke-void/80" />
          </g>
        );
      })}
      {!reducedMotion &&
        PROJECT_LINKS.slice(0, 3).map((id, i) => (
          <circle key={`vehicle-${id}`} r="1.6" className="fill-star">
            <animateMotion
              dur={`${5 + i}s`}
              repeatCount="indefinite"
              path={road(pt("dublin"), pt(id))}
            />
          </circle>
        ))}

      {LOCATIONS.map((l, idx) => {
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
            aria-label={`${cityLabel(l.name)}, ${countryLabel(l.country)}`}
            aria-pressed={sel}
            className={cn(
              "group cursor-pointer outline-none transition-opacity",
              dimmed && "opacity-25",
            )}
            onClick={() => onSelect(sel ? undefined : l.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(sel ? undefined : l.id);
              }
            }}
          >
            <circle cx={p.x} cy={p.y} r={town ? 9 : 16} className="fill-transparent" />
            {/* pulsing ring: shows every point that can be clicked */}
            {!dimmed && !sel && !reducedMotion && (
              <circle cx={p.x} cy={p.y} r={r + 2} strokeWidth="2" className="stroke-cyan">
                <animate
                  attributeName="r"
                  values={`${r + 2};${r + (town ? 9 : 14)}`}
                  dur="2.4s"
                  begin={`${(idx % 6) * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.9;0"
                  dur="2.4s"
                  begin={`${(idx % 6) * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={r + 8}
              className="stroke-cyan opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              strokeDasharray="3 3"
            />
            {(l.kind === "hq" || sel) && (
              <circle
                cx={p.x}
                cy={p.y}
                r={r + 9}
                strokeWidth="0.8"
                strokeDasharray="2 3"
                className="stroke-cyan"
              />
            )}
            {!town && (
              <>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r + 3.5}
                  strokeWidth="1.2"
                  className={cn(
                    "fill-void",
                    sel || l.kind === "hq" ? "stroke-cyan" : "stroke-star/70",
                  )}
                />
                <path
                  d={`M${p.x - r - 7} ${p.y}h-4M${p.x + r + 7} ${p.y}h4M${p.x} ${p.y - r - 7}v-4M${p.x} ${p.y + r + 7}v4`}
                  strokeWidth="1"
                  className={sel || l.kind === "hq" ? "stroke-cyan" : "stroke-star/50"}
                />
              </>
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={town ? (sel ? r + 1.5 : r) : sel ? 3.5 : 2.6}
              className={cn(
                "transition-all",
                l.kind === "hq" || sel
                  ? "fill-cyan"
                  : l.kind === "base"
                    ? "fill-starblue"
                    : "fill-star",
                town && !sel && "fill-star/80 group-hover:fill-cyan",
              )}
            />
            {(!town || sel) && (
              <g
                className="font-mono"
                letterSpacing="1.5"
                textAnchor={labelRight ? "start" : "end"}
              >
                <text
                  x={p.x + (labelRight ? 18 : -18)}
                  y={p.y - 4}
                  fontSize="11"
                  className={cn(
                    sel || l.kind === "hq"
                      ? "fill-cyan"
                      : l.kind === "base"
                        ? "fill-starblue"
                        : "fill-star",
                  )}
                >
                  {cityLabel(l.name).toUpperCase()}
                </text>
                <text
                  x={p.x + (labelRight ? 18 : -18)}
                  y={p.y + 10}
                  fontSize="8.5"
                  className="fill-dim"
                >
                  {l.kind === "hq"
                    ? "SYSTRA DUBLIN"
                    : l.kind === "base"
                      ? t("CAREER BASE", "KARIÉRNÍ ZASTÁVKA")
                      : l.kind === "town"
                        ? t("TOWN MODEL", "MODEL MĚSTA")
                        : t("PROJECT", "PROJEKT")}
                </text>
              </g>
            )}
            <title>{`${cityLabel(l.name)}, ${countryLabel(l.country)}`}</title>
          </g>
        );
      })}
    </svg>
  );
}
