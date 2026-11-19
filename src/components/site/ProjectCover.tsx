import { createContext, useContext, type ReactNode } from "react";

import { getLocation, UK_MICROSIM_TOWNS } from "@/data/portfolio";
import { usePrefersReducedMotion } from "@/hooks/use-telemetry";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Project illustrations drawn in the site's blueprint style. They are schematic
 * engineering sketches of each project's subject — not reproductions of
 * project outputs or client drawings.
 */

const W = 400;

/** Whether the little cars should drive (hovered card or project page). */
const AnimateCtx = createContext(false);

type CarKind = "head" | "tail";

/** Car lights moving along a path: white headlights or red tail-lights. */
function Cars({
  d,
  kind = "head",
  n = 1,
  dur: baseDur = 6,
  offset = 0,
}: {
  d: string;
  kind?: CarKind;
  n?: number;
  dur?: number;
  offset?: number;
}) {
  const animate = useContext(AnimateCtx);
  const reduced = usePrefersReducedMotion();
  if (!animate) return null;
  const dur = reduced ? baseDur * 1.8 : baseDur;
  return (
    <>
      {Array.from({ length: n }, (_, k) => (
        <rect
          key={k}
          x="-2.6"
          y="-1.1"
          width="5.2"
          height="2.2"
          rx="1.1"
          className={kind === "head" ? "fill-white" : "fill-alert"}
          style={{
            filter: `drop-shadow(0 0 2px ${kind === "head" ? "rgb(255 255 255 / 0.8)" : "rgb(239 83 80 / 0.8)"})`,
          }}
        >
          <animateMotion
            dur={`${dur}s`}
            begin={`${-((k / n + offset) % 1) * dur}s`}
            repeatCount="indefinite"
            path={d}
            rotate="auto"
          />
        </rect>
      ))}
    </>
  );
}
const H = 210;

const LABEL_CS: Record<string, string> = {
  "TRIP ENDS → ZONES · NATIONAL DEMAND": "ZDROJE A CÍLE CEST → ZÓNY · NÁRODNÍ POPTÁVKA",
  "INTER-URBAN CAR · BUS · RAIL · GOODS": "MEZIMĚSTSKÁ AUTA · AUTOBUSY · VLAKY · NÁKLAD",
  "M74 COMPLETION · ABOUT 8 KM · OPENED 2011": "DOSTAVBA M74 · ASI 8 KM · OTEVŘENO 2011",
  "SIMULATED vs OBSERVED CONFLICTS · TTC": "SIMULOVANÉ vs POZOROVANÉ KONFLIKTY · TTC",
  "VISITOR ARRIVALS AND DEPARTURES · EVENT DAY": "PŘÍCHODY A ODCHODY NÁVŠTĚVNÍKŮ · DEN AKCE",
  "SURFACE NETWORK ALONG THE TUNNEL CORRIDOR": "POVRCHOVÁ SÍŤ PODÉL KORIDORU TUNELU",
  "TOWN CENTRE OPTIONS · LAND USE · ROADS · BUSES": "VARIANTY CENTRA · ÚZEMÍ · SILNICE · AUTOBUSY",
};

function Frame({ label, children }: { label: string; children: ReactNode }) {
  const { t } = useLang();
  const text = t(
    label,
    LABEL_CS[label] ?? label.replace("TOWN MICROSIMULATION MODELS", "MIKROSIMULAČNÍCH MODELŮ MĚST"),
  );
  return (
    <>
      <defs>
        <pattern id="cover-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" className="stroke-cyan/[0.08]" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#cover-grid)" />
      {children}
      <rect x="0" y={H - 26} width={W} height="26" className="fill-void/85" />
      <text x="14" y={H - 10} fontSize="8.5" letterSpacing="1.4" className="fill-dim font-mono">
        {text}
      </text>
    </>
  );
}

/** Simple equirectangular projection into a box. */
function geo(
  lat: number,
  lon: number,
  box: { lat: [number, number]; lon: [number, number]; x: [number, number]; y: [number, number] },
) {
  const k = Math.cos(((box.lat[0] + box.lat[1]) / 2) * (Math.PI / 180));
  const tx = ((lon - box.lon[0]) * k) / ((box.lon[1] - box.lon[0]) * k);
  const ty = (box.lat[1] - lat) / (box.lat[1] - box.lat[0]);
  return { x: box.x[0] + tx * (box.x[1] - box.x[0]), y: box.y[0] + ty * (box.y[1] - box.y[0]) };
}

function NationalModel() {
  const cells = [];
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 14; c++) {
      const x = 20 + c * 26 + (r % 2) * 13;
      const y = 18 + r * 24;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={x}
          y={y}
          width="22"
          height="20"
          rx="2"
          className="stroke-cyan/25"
          strokeWidth="0.8"
        />,
      );
    }
  const hub = { x: 262, y: 88 };
  const origins: [number, number][] = [
    [44, 30],
    [96, 126],
    [150, 54],
    [70, 150],
    [330, 30],
    [370, 140],
    [200, 160],
    [310, 162],
    [124, 92],
    [356, 78],
  ];
  return (
    <Frame label="TRIP ENDS → ZONES · NATIONAL DEMAND">
      {cells}
      {origins.map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y} Q${(x + hub.x) / 2} ${Math.min(y, hub.y) - 30} ${hub.x} ${hub.y}`}
          className="stroke-cyan/70"
          strokeWidth={0.8 + (i % 4) * 0.6}
        />
      ))}
      {origins.map(([x, y], i) => (
        <Cars
          key={`c${i}`}
          d={`M${x} ${y} Q${(x + hub.x) / 2} ${Math.min(y, hub.y) - 30} ${hub.x} ${hub.y}`}
          dur={3 + (i % 4)}
          offset={i * 0.13}
        />
      ))}
      {origins.map(([x, y], i) => (
        <circle key={`o${i}`} cx={x} cy={y} r="2.5" className="fill-star" />
      ))}
      <circle cx={hub.x} cy={hub.y} r="7" className="fill-void stroke-cyan" strokeWidth="1.6" />
      <circle cx={hub.x} cy={hub.y} r="2.5" className="fill-cyan" />
    </Frame>
  );
}

const IRISH_CITIES: [string, number, number][] = [
  ["DUBLIN", 53.35, -6.26],
  ["BELFAST", 54.6, -5.93],
  ["DERRY", 55.0, -7.32],
  ["SLIGO", 54.27, -8.47],
  ["GALWAY", 53.27, -9.05],
  ["LIMERICK", 52.66, -8.63],
  ["CORK", 51.9, -8.47],
  ["WATERFORD", 52.26, -7.11],
];
const IRISH_LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 0],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 3],
];

function LongDistance() {
  const box = {
    lat: [51.6, 55.3] as [number, number],
    lon: [-10.2, -5.4] as [number, number],
    x: [120, 290] as [number, number],
    y: [14, 186] as [number, number],
  };
  const p = IRISH_CITIES.map(([, lat, lon]) => geo(lat, lon, box));
  return (
    <Frame label="INTER-URBAN CAR · BUS · RAIL · GOODS">
      {IRISH_LINKS.map(([a, b], i) => (
        <line
          key={i}
          x1={p[a]!.x}
          y1={p[a]!.y}
          x2={p[b]!.x}
          y2={p[b]!.y}
          strokeWidth={a === 0 || b === 0 ? 2.2 : 1}
          className={a === 0 || b === 0 ? "stroke-cyan/80" : "stroke-cyan/40"}
        />
      ))}
      {IRISH_LINKS.filter(([a, b]) => a === 0 || b === 0).map(([a, b], i) => (
        <g key={`car${i}`}>
          <Cars
            d={`M${p[a]!.x} ${p[a]!.y} L${p[b]!.x} ${p[b]!.y}`}
            dur={4 + (i % 3)}
            offset={i * 0.2}
          />
          <Cars
            d={`M${p[b]!.x} ${p[b]!.y} L${p[a]!.x} ${p[a]!.y}`}
            kind="tail"
            dur={4.5 + (i % 3)}
            offset={i * 0.3 + 0.5}
          />
        </g>
      ))}
      {IRISH_CITIES.map(([name], i) => (
        <g key={name}>
          <circle
            cx={p[i]!.x}
            cy={p[i]!.y}
            r={i === 0 ? 5 : 3.2}
            className={i === 0 ? "fill-cyan" : "fill-void stroke-star"}
            strokeWidth="1.2"
          />
          <text
            x={p[i]!.x + (p[i]!.x > 215 ? 8 : -8)}
            y={p[i]!.y + 3}
            textAnchor={p[i]!.x > 215 ? "start" : "end"}
            fontSize="8"
            letterSpacing="1"
            className="fill-starblue font-mono"
          >
            {name}
          </text>
        </g>
      ))}
    </Frame>
  );
}

function Motorway() {
  const { t } = useLang();
  return (
    <Frame label="M74 COMPLETION · ABOUT 8 KM · OPENED 2011">
      {/* existing M8 */}
      <path d="M0 52 H400" strokeWidth="10" className="stroke-volt/30" />
      <text x="370" y="40" fontSize="8.5" className="fill-dim font-mono">
        M8
      </text>
      {/* existing M74 */}
      <path d="M0 150 H90" strokeWidth="10" className="stroke-volt/40" />
      {/* the completion */}
      <path
        d="M90 150 C170 150 200 120 250 104 S330 70 360 52"
        strokeWidth="10"
        className="stroke-cyan/70"
      />
      <path
        d="M90 150 C170 150 200 120 250 104 S330 70 360 52"
        strokeWidth="1"
        strokeDasharray="6 5"
        className="stroke-void"
      />
      <Cars d="M0 49 H400" n={3} dur={7} />
      <Cars d="M400 55 H0" kind="tail" n={3} dur={7.5} offset={0.2} />
      <Cars d="M0 150 H90 C170 150 200 120 250 104 S330 70 360 52" n={2} dur={6} />
      {(
        [
          [90, 150],
          [180, 138],
          [262, 99],
          [360, 52],
        ] as [number, number][]
      ).map(([x, y]) => (
        <g key={x}>
          <rect
            x={x - 6}
            y={y - 6}
            width="12"
            height="12"
            transform={`rotate(45 ${x} ${y})`}
            className="fill-void stroke-star"
            strokeWidth="1.2"
          />
        </g>
      ))}
      <text x="96" y="176" fontSize="8.5" className="fill-dim font-mono">
        M74
      </text>
      <text x="200" y="168" fontSize="8.5" letterSpacing="1" className="fill-cyan font-mono">
        {t("NEW SECTION", "NOVÝ ÚSEK")}
      </text>
    </Frame>
  );
}

function ConflictJunction() {
  return (
    <Frame label="SIMULATED vs OBSERVED CONFLICTS · TTC">
      <path d="M0 80 H400 M0 130 H400" className="stroke-star/50" strokeWidth="1.2" />
      <path d="M175 0 V210 M225 0 V210" className="stroke-star/50" strokeWidth="1.2" />
      <path
        d="M0 105 H160 M240 105 H400 M200 0 V65 M200 145 V210"
        strokeDasharray="8 6"
        className="stroke-star/30"
      />
      {/* trajectories */}
      <path
        d="M20 118 C120 118 170 118 190 150 S200 200 196 210"
        className="stroke-cyan/80"
        strokeWidth="1.6"
      />
      <path
        d="M212 0 C212 60 214 98 260 92 S360 92 400 92"
        className="stroke-cyan/80"
        strokeWidth="1.6"
      />
      <Cars d="M20 118 C120 118 170 118 190 150 S200 200 196 210" dur={4} />
      <Cars d="M212 0 C212 60 214 98 260 92 S360 92 400 92" dur={4.5} offset={0.4} />
      <path
        d="M380 92 C300 92 230 96 205 120 S188 160 188 210"
        className="stroke-starblue/60"
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      {/* conflict points */}
      {(
        [
          [190, 128],
          [214, 96],
          [200, 112],
        ] as [number, number][]
      ).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" className="stroke-alert/80" strokeWidth="1.2" />
          <circle cx={x} cy={y} r="2.5" className="fill-alert" />
        </g>
      ))}
      {(
        [
          [168, 80],
          [232, 130],
        ] as [number, number][]
      ).map(([x, y]) => (
        <g key={x}>
          <rect
            x={x - 3}
            y={y - 9}
            width="6"
            height="18"
            rx="2"
            className="fill-void stroke-star/70"
          />
          <circle cx={x} cy={y - 4.5} r="1.4" className="fill-alert" />
          <circle cx={x} cy={y + 4.5} r="1.4" className="fill-go" />
        </g>
      ))}
    </Frame>
  );
}

function EventDemand() {
  const { t } = useLang();
  const bars = [4, 7, 12, 22, 38, 58, 74, 66, 40, 18, 9, 5, 9, 26, 52, 70, 48, 20];
  return (
    <Frame label="VISITOR ARRIVALS AND DEPARTURES · EVENT DAY">
      <ellipse cx="300" cy="78" rx="78" ry="44" className="stroke-star/60" strokeWidth="1.4" />
      <ellipse cx="300" cy="78" rx="52" ry="26" className="stroke-cyan/70" strokeWidth="1.2" />
      <text
        x="300"
        y="82"
        textAnchor="middle"
        fontSize="8.5"
        letterSpacing="1"
        className="fill-cyan font-mono"
      >
        {t("VENUE", "SPORTOVIŠTĚ")}
      </text>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={22 + i * 12}
          y={184 - h * 1.6}
          width="8"
          height={h * 1.6}
          rx="1.5"
          className={i < 11 ? "fill-cyan/70" : "fill-starblue/50"}
        />
      ))}
      <path d="M22 185 H240" className="stroke-star/40" />
      <path
        d="M240 150 C260 140 268 118 236 100"
        className="stroke-star/30"
        strokeDasharray="4 4"
      />
    </Frame>
  );
}

function Tunnel() {
  const { t } = useLang();
  return (
    <Frame label="SURFACE NETWORK ALONG THE TUNNEL CORRIDOR">
      {/* surface street network */}
      <path
        d="M0 40 H400 M0 70 C120 66 260 74 400 64"
        className="stroke-cyan/70"
        strokeWidth="1.6"
      />
      {[40, 100, 160, 220, 280, 340].map((x) => (
        <path
          key={x}
          d={`M${x} 10 L${x + (x % 3) * 4} 96`}
          className="stroke-cyan/40"
          strokeWidth="1"
        />
      ))}
      {/* ground line */}
      <path d="M0 112 H400" className="stroke-star/40" strokeDasharray="2 4" />
      {/* twin tubes */}
      <path
        d="M40 112 Q60 150 100 156 H300 Q340 150 360 112"
        className="stroke-star/80"
        strokeWidth="1.4"
      />
      <path
        d="M40 112 Q58 164 100 172 H300 Q342 164 360 112"
        className="stroke-star/80"
        strokeWidth="1.4"
      />
      <Cars d="M40 112 Q60 150 100 156 H300 Q340 150 360 112" n={2} dur={6} />
      <Cars
        d="M360 112 Q342 164 300 172 H100 Q58 164 40 112"
        kind="tail"
        n={2}
        dur={6.5}
        offset={0.3}
      />
      <Cars d="M0 40 H400" n={2} dur={7} offset={0.1} />
      <Cars d="M400 70 C260 74 120 66 0 70" kind="tail" n={2} dur={7.5} offset={0.6} />
      <rect x="30" y="104" width="20" height="10" className="fill-void stroke-star" />
      <rect x="350" y="104" width="20" height="10" className="fill-void stroke-star" />
      <text
        x="200"
        y="168"
        textAnchor="middle"
        fontSize="8.5"
        letterSpacing="1"
        className="fill-starblue font-mono"
      >
        {t("TWIN TUBES · 3.6 KM", "DVA TUBUSY · 3,6 KM")}
      </text>
    </Frame>
  );
}

function TownCentre() {
  const v = [30, 78, 130, 190, 250, 310, 362];
  const h = [24, 62, 104, 146, 182];
  return (
    <Frame label="TOWN CENTRE OPTIONS · LAND USE · ROADS · BUSES">
      {v.map((x, i) => (
        <path
          key={`v${x}`}
          d={`M${x + (i % 2) * 6} 0 L${x - (i % 2) * 6} 210`}
          className="stroke-star/35"
          strokeWidth={i === 3 ? 4 : 1.2}
        />
      ))}
      {h.map((y, i) => (
        <path
          key={`h${y}`}
          d={`M0 ${y} L400 ${y + (i % 2) * 6}`}
          className="stroke-star/35"
          strokeWidth={i === 2 ? 4 : 1.2}
        />
      ))}
      <rect
        x="140"
        y="70"
        width="100"
        height="70"
        rx="4"
        className="fill-cyan/10 stroke-cyan"
        strokeWidth="1.2"
        strokeDasharray="5 4"
      />
      <path d="M0 116 H120 L150 62 H300 L330 0" className="stroke-cyan" strokeWidth="2" />
      <Cars d="M0 116 H120 L150 62 H300 L330 0" dur={8} />
      <Cars d="M0 104 L400 110" n={2} dur={7} offset={0.3} />
      <Cars d="M196 210 L184 0" kind="tail" n={2} dur={6} offset={0.5} />
      {[60, 150, 230, 318].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={[116, 62, 62, 18][i]}
          r="3.5"
          className="fill-void stroke-cyan"
          strokeWidth="1.4"
        />
      ))}
    </Frame>
  );
}

function UkTowns() {
  const box = {
    lat: [50.2, 54.6] as [number, number],
    lon: [-5.2, 1.2] as [number, number],
    x: [130, 330] as [number, number],
    y: [14, 186] as [number, number],
  };
  const ids = [
    "gillingham",
    "douglas",
    "blackpool",
    "plymouth",
    "weymouth",
    "chippenham",
    "new-barnet",
    "nuneaton",
    "coalville",
    "derriford",
    "hinckley",
  ];
  const towns = ids.map((id) => getLocation(id)).filter((l) => l !== undefined);
  return (
    <Frame label={`${UK_MICROSIM_TOWNS.length} TOWN MICROSIMULATION MODELS`}>
      {towns.map((t) => {
        const p = geo(t.lat, t.lon, box);
        const right = p.x < 230;
        return (
          <g key={t.id}>
            <circle cx={p.x} cy={p.y} r="7" className="stroke-cyan/40" />
            <circle cx={p.x} cy={p.y} r="2.6" className="fill-cyan" />
            {["douglas", "plymouth", "gillingham", "nuneaton", "blackpool", "weymouth"].includes(
              t.id,
            ) && (
              <text
                x={p.x + (right ? -11 : 11)}
                y={p.y + 3}
                textAnchor={right ? "end" : "start"}
                fontSize="8"
                letterSpacing="1"
                className="fill-starblue font-mono"
              >
                {t.name.toUpperCase()}
              </text>
            )}
          </g>
        );
      })}
    </Frame>
  );
}

const COVERS: Record<string, () => ReactNode> = {
  "nta-national-demand-model": NationalModel,
  "nta-long-distance-model": LongDistance,
  "glasgow-m74-evaluation": Motorway,
  "road-safety-traffic-conflicts": ConflictJunction,
  "commonwealth-games": EventDemand,
  "sydney-lane-cove-tunnel": Tunnel,
  "melbourne-dandenong": TownCentre,
  "uk-microsimulation-models": UkTowns,
};

export function ProjectCover({
  slug,
  className,
  animate = false,
}: {
  slug: string;
  className?: string;
  animate?: boolean;
}) {
  const { t } = useLang();
  const Cover = COVERS[slug];
  if (!Cover) return null;
  return (
    <AnimateCtx.Provider value={animate}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={cn("block h-auto w-full bg-void/40", className)}
        fill="none"
        role="img"
        aria-label={t("Schematic illustration of the project", "Schematická ilustrace projektu")}
      >
        <Cover />
      </svg>
    </AnimateCtx.Provider>
  );
}
