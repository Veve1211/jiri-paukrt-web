import { createContext, useContext, useRef, type ReactNode } from "react";

import { useVcSwitch, VcSwitch, VC_FADE } from "@/components/site/VcSwitch";
import { useLang } from "@/lib/i18n";

import { cn } from "@/lib/utils";

/**
 * Generic illustrations of modelling methods, drawn in the site's blueprint style.
 * Shapes are invented for illustration — they are not data from any project.
 */

export type Method =
  "calibration" | "matrix" | "bandwidth" | "junction" | "profile" | "beforeAfter";

const W = 400;
const H = 240;

// Deterministic pseudo-random numbers so server and browser render the same picture.
function rand(n: number) {
  const x = Math.sin(n * 91.7 + 13.3) * 43758.5453;
  // Rounded: Math.sin differs in the last digits between the server and the browser,
  // which broke hydration of the SVG attributes.
  return Math.round((x - Math.floor(x)) * 1e6) / 1e6;
}

function Base({ children }: { children: ReactNode }) {
  return (
    <>
      <rect width={W} height={H} className="fill-void/40" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`v${i}`} d={`M${i * 50} 0V${H}`} className="stroke-cyan/[0.06]" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <path key={`h${i}`} d={`M0 ${i * 48}H${W}`} className="stroke-cyan/[0.06]" />
      ))}
      {children}
    </>
  );
}

function Axis({ x, y }: { x: string; y: string }) {
  return (
    <g className="font-mono" fontSize="8" letterSpacing="1">
      <path d="M44 20 V196 H380" className="stroke-star/50" />
      <text x="212" y="222" textAnchor="middle" className="fill-dim">
        {x}
      </text>
      <text x="16" y="108" textAnchor="middle" transform="rotate(-90 16 108)" className="fill-dim">
        {y}
      </text>
    </g>
  );
}

function Calibration() {
  const { t } = useLang();
  const pts = Array.from({ length: 34 }, (_, i) => {
    const obs = 0.08 + rand(i) * 0.86;
    const mod = Math.min(0.97, Math.max(0.03, obs + (rand(i + 50) - 0.5) * 0.16));
    return { x: 44 + obs * 336, y: 196 - mod * 176 };
  });
  return (
    <Base>
      <Axis
        x={t("OBSERVED COUNTS", "SČÍTÁNÍ DOPRAVY")}
        y={t("MODELLED FLOWS", "MODELOVANÉ INTENZITY")}
      />
      <path d="M44 196 L380 20" className="stroke-cyan/40" strokeDasharray="5 4" />
      <path d="M44 196 L380 36 M44 196 L364 20" className="stroke-cyan/15" />
      <path d="M44 196 L380 36 L380 20 L364 20 Z" className="fill-cyan/[0.06]" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.2" className="fill-cyan/80" />
      ))}
      <text x="300" y="44" fontSize="8.5" letterSpacing="1" className="fill-starblue font-mono">
        GEH &lt; 5
      </text>
    </Base>
  );
}

function Matrix() {
  const { t } = useLang();
  const n = 10;
  const cell = 16;
  return (
    <Base>
      <g transform="translate(110 28)">
        {Array.from({ length: n * n }, (_, k) => {
          const i = Math.floor(k / n);
          const j = k % n;
          const v =
            i === j ? 0.9 : Math.max(0.05, 0.75 - Math.abs(i - j) * 0.12 + (rand(k) - 0.5) * 0.25);
          return (
            <rect
              key={k}
              x={j * cell}
              y={i * cell}
              width={cell - 2}
              height={cell - 2}
              rx="2"
              className="fill-cyan"
              fillOpacity={v}
            />
          );
        })}
        <text
          x={(n * cell) / 2}
          y={-8}
          textAnchor="middle"
          fontSize="8"
          letterSpacing="1"
          className="fill-dim font-mono"
        >
          {t("DESTINATION ZONES", "CÍLOVÉ ZÓNY")}
        </text>
        <text
          x={-10}
          y={(n * cell) / 2}
          textAnchor="middle"
          fontSize="8"
          letterSpacing="1"
          transform={`rotate(-90 -10 ${(n * cell) / 2})`}
          className="fill-dim font-mono"
        >
          {t("ORIGINS", "ZDROJE")}
        </text>
      </g>
      <text x="300" y="120" fontSize="8.5" letterSpacing="1" className="fill-starblue font-mono">
        <tspan x="300" dy="0">
          {t("TRIP", "MATICE")}
        </tspan>
        <tspan x="300" dy="12">
          {t("MATRIX", "CEST")}
        </tspan>
      </text>
    </Base>
  );
}

const NET: [number, number][] = [
  [60, 60],
  [170, 40],
  [300, 70],
  [350, 170],
  [240, 200],
  [110, 180],
  [190, 120],
];
const NET_LINKS: [number, number, number][] = [
  [0, 1, 6],
  [1, 2, 10],
  [2, 3, 5],
  [3, 4, 8],
  [4, 5, 4],
  [5, 0, 7],
  [6, 0, 9],
  [6, 2, 12],
  [6, 4, 6],
  [6, 5, 3],
];

/** Colour the assignment picture by volume/capacity (toggle on the figure). */
const VcCtx = createContext(false);

function vcStroke(w: number) {
  if (w >= 10) return "stroke-alert/80"; // over 0.90
  if (w >= 7) return "stroke-amber/80"; // 0.70 – 0.90
  return "stroke-go/75"; // under 0.70
}

function Bandwidth() {
  const showVc = useContext(VcCtx);
  const { t } = useLang();
  return (
    <Base>
      {NET_LINKS.map(([a, b, w], i) => {
        const p = NET[a]!;
        const q = NET[b]!;
        return (
          <line
            key={i}
            x1={p[0]}
            y1={p[1]}
            x2={q[0]}
            y2={q[1]}
            strokeWidth={w}
            style={{ transition: VC_FADE }}
            className={showVc ? vcStroke(w) : "stroke-cyan/60"}
          />
        );
      })}
      {NET.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" className="fill-void stroke-star" strokeWidth="1.4" />
      ))}
      <text x="14" y="228" fontSize="8.5" letterSpacing="1" className="fill-dim font-mono">
        {t("ASSIGNED FLOWS · BANDWIDTH", "PŘIDĚLENÉ INTENZITY · ŠÍŘKA = OBJEM")}
      </text>
    </Base>
  );
}

function BeforeAfter() {
  const { t } = useLang();
  return (
    <Base>
      {NET_LINKS.map(([a, b, w], i) => {
        const p = NET[a]!;
        const q = NET[b]!;
        const delta = i % 3 === 0 ? -1 : i % 3 === 1 ? 1 : 0;
        return (
          <line
            key={i}
            x1={p[0]}
            y1={p[1]}
            x2={q[0]}
            y2={q[1]}
            strokeWidth={Math.max(2, w * 0.8)}
            className={delta < 0 ? "stroke-go/70" : delta > 0 ? "stroke-cyan/70" : "stroke-star/25"}
          />
        );
      })}
      {NET.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" className="fill-void stroke-star" strokeWidth="1.4" />
      ))}
      <g fontSize="8.5" letterSpacing="1" className="font-mono">
        <rect x="270" y="196" width="10" height="4" className="fill-go/80" />
        <text x="286" y="201" className="fill-dim">
          {t("LESS TRAFFIC", "MÉNĚ DOPRAVY")}
        </text>
        <rect x="270" y="210" width="10" height="4" className="fill-cyan/80" />
        <text x="286" y="215" className="fill-dim">
          {t("MORE TRAFFIC", "VÍCE DOPRAVY")}
        </text>
      </g>
      <text x="14" y="228" fontSize="8.5" letterSpacing="1" className="fill-dim font-mono">
        {t("BEFORE vs AFTER", "PŘED A PO")}
      </text>
    </Base>
  );
}

function Junction() {
  const { t } = useLang();
  const cars: [number, number, boolean][] = [
    [30, 128, true],
    [70, 128, true],
    [110, 128, true],
    [250, 104, true],
    [300, 104, true],
    [360, 104, true],
    [212, 20, false],
    [212, 52, false],
    [188, 200, false],
    [188, 226, false],
  ];
  return (
    <Base>
      <path
        d="M0 90 H170 M230 90 H400 M0 142 H170 M230 142 H400"
        className="stroke-star/60"
        strokeWidth="1.4"
      />
      <path
        d="M170 0 V90 M230 0 V90 M170 142 V240 M230 142 V240"
        className="stroke-star/60"
        strokeWidth="1.4"
      />
      <path
        d="M0 116 H150 M250 116 H400 M200 0 V70 M200 162 V240"
        className="stroke-star/30"
        strokeDasharray="8 6"
      />
      <path
        d="M150 116 V142 M250 90 V116 M170 70 H200 M200 162 H230"
        className="stroke-star"
        strokeWidth="2"
      />
      {cars.map(([x, y, h], i) =>
        h ? (
          <rect key={i} x={x - 9} y={y - 4} width="18" height="8" rx="2" className="fill-cyan/80" />
        ) : (
          <rect
            key={i}
            x={x - 4}
            y={y - 9}
            width="8"
            height="18"
            rx="2"
            className="fill-starblue/70"
          />
        ),
      )}
      <g>
        <rect x="156" y="62" width="8" height="22" rx="2" className="fill-void stroke-star/70" />
        <circle cx="160" cy="68" r="2" className="fill-alert/50" />
        <circle cx="160" cy="78" r="2" className="fill-go" />
      </g>
      <text x="14" y="228" fontSize="8.5" letterSpacing="1" className="fill-dim font-mono">
        {t("MICROSIMULATION · VEHICLE BY VEHICLE", "MIKROSIMULACE · VOZIDLO PO VOZIDLE")}
      </text>
    </Base>
  );
}

function Profile() {
  const { t } = useLang();
  const n = 24;
  const vals = Array.from({ length: n }, (_, i) => {
    const am = Math.exp(-((i - 8) ** 2) / 3);
    const pm = Math.exp(-((i - 17.5) ** 2) / 4);
    return 0.12 + am * 0.75 + pm * 0.85;
  });
  const d = vals
    .map((v, i) => `${i === 0 ? "M" : "L"}${44 + (i * 336) / (n - 1)} ${196 - v * 170}`)
    .join(" ");
  return (
    <Base>
      <Axis x={t("TIME OF DAY", "DENNÍ DOBA")} y={t("TRIPS PER HOUR", "CESTY ZA HODINU")} />
      <path d={`${d} L380 196 L44 196 Z`} className="fill-cyan/10" />
      <path d={d} className="stroke-cyan" strokeWidth="2" />
      {["06", "09", "12", "15", "18", "21"].map((h, i) => (
        <text
          key={h}
          x={44 + ((6 + i * 3) * 336) / (n - 1)}
          y="208"
          textAnchor="middle"
          fontSize="7.5"
          className="fill-dim font-mono"
        >
          {h}
        </text>
      ))}
    </Base>
  );
}

const DRAW: Record<Method, () => ReactNode> = {
  calibration: Calibration,
  matrix: Matrix,
  bandwidth: Bandwidth,
  beforeAfter: BeforeAfter,
  junction: Junction,
  profile: Profile,
};

export const METHOD_CAPTION: Record<Method, string> = {
  calibration: "Calibration: modelled flows checked against observed counts",
  matrix: "Demand: trips between zones held in an origin–destination matrix",
  bandwidth: "Assignment: traffic loaded onto the road network",
  beforeAfter: "Evaluation: how traffic moved after a scheme opened",
  junction: "Microsimulation: individual vehicles through a signalised junction",
  profile: "Demand over the day: arrival and departure peaks",
};

export const METHOD_CAPTION_CS: Record<Method, string> = {
  calibration: "Kalibrace: modelované intenzity porovnané se sčítáním dopravy",
  matrix: "Poptávka: cesty mezi zónami v matici zdrojů a cílů",
  bandwidth: "Přidělení: doprava zatížená na silniční síť",
  beforeAfter: "Hodnocení: jak se doprava změnila po otevření stavby",
  junction: "Mikrosimulace: jednotlivá vozidla na světelné křižovatce",
  profile: "Poptávka během dne: špičky příchodů a odchodů",
};

export function MethodIllustration({ method, className }: { method: Method; className?: string }) {
  const Draw = DRAW[method];
  const wrapRef = useRef<HTMLDivElement>(null);
  const vc = useVcSwitch(wrapRef);
  const showVc = vc.showVc;
  const { t } = useLang();
  const svg = (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-auto w-full", className)}
      fill="none"
      role="img"
      aria-label={t(METHOD_CAPTION[method], METHOD_CAPTION_CS[method])}
    >
      <VcCtx.Provider value={showVc}>
        <Draw />
      </VcCtx.Provider>
    </svg>
  );
  if (method !== "bandwidth") return svg;
  return (
    <div ref={wrapRef}>
      {svg}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 pt-2 pb-1">
        <VcSwitch vc={vc} showHint={false} />
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] tracking-[0.08em] text-starblue transition-opacity duration-1000",
            showVc ? "opacity-100" : "opacity-0",
          )}
          title={t("V/C = volume / capacity", "V/C = intenzita / kapacita")}
          aria-hidden={!showVc}
        >
          <span className="text-star">V/C</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-4 bg-go" /> {t("<0.70", "<0,70")}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-4 bg-amber" /> {t("0.70–0.90", "0,70–0,90")}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-4 bg-alert" /> {t(">0.90", ">0,90")}
          </span>
        </div>
      </div>
    </div>
  );
}
