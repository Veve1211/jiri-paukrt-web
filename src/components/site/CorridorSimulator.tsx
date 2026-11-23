import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { usePrefersReducedMotion } from "@/hooks/use-telemetry";
import {
  ADAPTIVE_SIGNALS_CAPACITY_GAIN,
  compare,
  CONFLICT_REDESIGN_REDUCTION,
  CORRIDOR_KM,
  FREE_FLOW_KMH,
  RAMP_METERING_CAPACITY_GAIN,
  type Measures,
} from "@/lib/simulator";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const MEASURES: {
  key: keyof Measures;
  label: string;
  labelCs: string;
  detail: string;
  detailCs: string;
}[] = [
  {
    key: "adaptiveSignals",
    label: "Adaptive signal control",
    labelCs: "Adaptivní řízení světel",
    detail: `+${ADAPTIVE_SIGNALS_CAPACITY_GAIN * 100}% capacity`,
    detailCs: `+${ADAPTIVE_SIGNALS_CAPACITY_GAIN * 100} % kapacity`,
  },
  {
    key: "rampMetering",
    label: "Ramp metering",
    labelCs: "Řízení vjezdu na dálnici",
    detail: `+${RAMP_METERING_CAPACITY_GAIN * 100}% capacity`,
    detailCs: `+${RAMP_METERING_CAPACITY_GAIN * 100} % kapacity`,
  },
  {
    key: "conflictRedesign",
    label: "Conflict-zone redesign",
    labelCs: "Úprava konfliktních míst",
    detail: `−${CONFLICT_REDESIGN_REDUCTION * 100}% conflict rate`,
    detailCs: `−${CONFLICT_REDESIGN_REDUCTION * 100} % konfliktů`,
  },
];

export function CorridorSimulator() {
  const { t } = useLang();
  const [demand, setDemand] = useState(3200);
  const [measures, setMeasures] = useState<Measures>({
    adaptiveSignals: true,
    rampMetering: false,
    conflictRedesign: true,
  });
  const result = useMemo(() => compare(demand, measures), [demand, measures]);
  const { baseline, scenario } = result;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="glass rounded-[20px] p-5 lg:col-span-4">
        <Step n={1} title={t("Set the traffic", "Nastavte provoz")}>
          {t(
            "Drag the slider: how many vehicles per hour want to use the road. Around 3,600 the road is full.",
            "Posuňte jezdcem, kolik vozidel za hodinu chce silnici použít. Kolem 3 600 je silnice plná.",
          )}
        </Step>
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <label htmlFor="sim-demand" className="text-sm">
              {t("Peak-hour demand", "Poptávka ve špičce")}
            </label>
            <span className="font-mono text-sm text-cyan">
              {demand.toLocaleString("en-IE")} veh/h
            </span>
          </div>
          <Slider
            id="sim-demand"
            className="mt-3"
            min={400}
            max={4400}
            step={100}
            value={[demand]}
            onValueChange={(v) => setDemand(v[0] ?? 400)}
            aria-label={t(
              "Peak-hour demand in vehicles per hour",
              "Poptávka ve špičce ve vozidlech za hodinu",
            )}
          />
          <div className="mt-1.5 flex justify-between font-mono text-[9.5px] text-dim">
            <span>400</span>
            <span>{t("CAPACITY 3,600", "KAPACITA 3 600")}</span>
            <span>4,400</span>
          </div>
        </div>
        <div className="mt-7">
          <Step n={2} title={t("Switch on measures", "Zapněte opatření")}>
            {t(
              "Each switch is one real-world fix. Try them on and off.",
              "Každý přepínač je jedno opatření z praxe. Zkuste je zapínat a vypínat.",
            )}
          </Step>
        </div>
        <div className="mt-4 space-y-3">
          {MEASURES.map((m) => (
            <label
              key={m.key}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-[14px] border p-3 transition-colors hover:border-cyan/50",
                measures[m.key] ? "border-cyan/30 bg-cyan/[0.04]" : "border-star/20 bg-star/[0.03]",
              )}
            >
              <span>
                <span className="block text-sm">{t(m.label, m.labelCs)}</span>
                <span className="telemetry block text-[9px] text-dim">
                  {t(m.detail, m.detailCs)}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "w-8 text-right font-mono text-[10px] tracking-wider",
                    measures[m.key] ? "text-cyan" : "text-dim",
                  )}
                >
                  {measures[m.key] ? t("ON", "ZAP") : t("OFF", "VYP")}
                </span>
                <Switch
                  className="h-6 w-11 border-star/40 data-[state=checked]:border-cyan/60 data-[state=checked]:bg-cyan/70 data-[state=unchecked]:bg-star/15 [&>span]:h-5 [&>span]:w-5 [&>span]:data-[state=checked]:translate-x-5"
                  checked={measures[m.key]}
                  onCheckedChange={(v) => setMeasures((s) => ({ ...s, [m.key]: v }))}
                  aria-label={t(m.label, m.labelCs)}
                />
              </span>
            </label>
          ))}
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-dim/80">
          {t(
            `Illustrative ${CORRIDOR_KM} km, two-lane corridor at ${FREE_FLOW_KMH} km/h free flow, using the BPR volume–delay curve. A teaching model — not output from any project.`,
            `Ilustrativní ${CORRIDOR_KM} km dlouhý dvoupruhový koridor s volnou rychlostí ${FREE_FLOW_KMH} km/h a křivkou BPR. Výukový model — nejde o výstup žádného projektu.`,
          )}
        </p>
      </div>

      <div className="space-y-4 lg:col-span-8">
        <div className="glass overflow-hidden rounded-[20px]">
          <div className="flex flex-wrap items-start justify-between gap-3 px-4 pt-4">
            <Step n={3} title={t("Watch the result", "Sledujte výsledek")}>
              {t(
                "Each dash is a car. The fuller the road, the slower they go and the colour turns green → amber → red. A red ring is a near-miss (traffic conflict).",
                "Každá čárka je auto. Čím plnější silnice, tím jedou pomaleji a barva se mění zelená → oranžová → červená. Červený kroužek je kolizní situace (dopravní konflikt).",
              )}
            </Step>
            <span className="font-mono text-[10px] tracking-wider text-dim">
              V/C {scenario.vc.toFixed(2)}
            </span>
          </div>
          <CorridorCanvas
            vc={scenario.vc}
            speedKmh={scenario.speedKmh}
            demand={demand}
            conflictsPerHour={scenario.conflictsPerHour}
          />
        </div>

        <p className="text-[13px] leading-relaxed text-dim">
          {t(
            "The cards compare your scenario with the same road without any measures. Green % = better, red % = worse.",
            "Karty porovnávají váš scénář se stejnou silnicí bez opatření. Zelené % = lepší, červené % = horší.",
          )}
        </p>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          <Readout
            baseLabel={t("WITHOUT", "BEZ OPATŘENÍ")}
            label={t("Flow speed", "Rychlost")}
            value={`${scenario.speedKmh.toFixed(1)}`}
            unit="km/h"
            base={`${baseline.speedKmh.toFixed(1)}`}
            delta={result.speedGainPct}
            goodWhenUp
            highlight
          />
          <Readout
            baseLabel={t("WITHOUT", "BEZ OPATŘENÍ")}
            label={t("Travel time", "Doba jízdy")}
            value={scenario.travelTimeMin.toFixed(1)}
            unit="min"
            base={baseline.travelTimeMin.toFixed(1)}
            delta={
              ((scenario.travelTimeMin - baseline.travelTimeMin) / baseline.travelTimeMin) * 100
            }
          />
          <Readout
            baseLabel={t("WITHOUT", "BEZ OPATŘENÍ")}
            label={t("Volume / capacity", "Intenzita / kapacita")}
            value={scenario.vc.toFixed(2)}
            unit=""
            base={baseline.vc.toFixed(2)}
            delta={((scenario.vc - baseline.vc) / (baseline.vc || 1)) * 100}
          />
          <Readout
            baseLabel={t("WITHOUT", "BEZ OPATŘENÍ")}
            label={t("Conflicts", "Konflikty")}
            value={scenario.conflictsPerHour.toFixed(1)}
            unit="/h"
            base={baseline.conflictsPerHour.toFixed(1)}
            delta={-result.conflictReductionPct}
          />
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="flex max-w-[520px] gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-cyan/40 font-mono text-sm font-bold text-cyan">
        {n}
      </span>
      <div>
        <div className="text-sm font-medium text-star">{title}</div>
        <p className="mt-0.5 text-[12.5px] leading-snug text-dim">{children}</p>
      </div>
    </div>
  );
}

function Readout({
  label,
  value,
  unit,
  base,
  delta,
  goodWhenUp = false,
  highlight = false,
  baseLabel = "BASE",
}: {
  label: string;
  value: string;
  unit: string;
  base: string;
  delta: number;
  goodWhenUp?: boolean;
  highlight?: boolean;
  baseLabel?: string;
}) {
  const flat = Math.abs(delta) < 0.05;
  const good = flat ? null : goodWhenUp ? delta > 0 : delta < 0;
  return (
    <div
      className={cn(
        "rounded-[14px] border p-3",
        highlight ? "border-cyan/30 bg-cyan/[0.06]" : "border-star/10 bg-star/[0.03]",
      )}
    >
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-bold", highlight && "text-cyan")}>{value}</span>
        <span className="font-mono text-[10px] text-dim">{unit}</span>
      </div>
      <div className="telemetry mt-1 text-[9.5px] text-dim">{label}</div>
      <div className="mt-2 flex items-center justify-between font-mono text-[9.5px]">
        <span className="text-dim">
          {baseLabel} {base}
        </span>
        <span className={cn(good === null ? "text-dim" : good ? "text-go" : "text-alert")}>
          {flat ? "±0%" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`}
        </span>
      </div>
    </div>
  );
}

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function CorridorCanvas({
  vc,
  speedKmh,
  demand,
  conflictsPerHour,
}: {
  vc: number;
  speedKmh: number;
  demand: number;
  conflictsPerHour: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const params = useRef({ vc, speedKmh, demand, conflictsPerHour });
  params.current = { vc, speedKmh, demand, conflictsPerHour };
  const reducedMotion = usePrefersReducedMotion();
  const { t } = useLang();
  const [flagged, setFlagged] = useState(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const css = getComputedStyle(document.documentElement);
    const col = (name: string) => css.getPropertyValue(name).trim();
    const cyan = col("--cyan");
    const star = col("--star");
    const dim = col("--dim");
    const alert = col("--alert");
    const volt = col("--volt");
    const go = col("--go");
    const amber = col("--amber");

    let raf = 0;
    let last = performance.now();
    let offset = 0;
    let width = 0;
    let height = 0;
    const flashes: { x: number; y: number; t: number }[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { vc: load, speedKmh: v, demand: q, conflictsPerHour: c } = params.current;
      // exaggerate the speed difference so the slowdown is easy to see. The cars always move:
      // the moving corridor is the point of this demo (with reduced motion they just move gently)
      const pxPerSec = Math.pow(v / 80, 2) * (reducedMotion ? 110 : 170);
      // cars take the V/C colour: green = free flow, amber = busy, red = congested
      const carCol = load < 0.7 ? go : load < 0.9 ? amber : alert;
      offset += pxPerSec * dt;

      ctx.clearRect(0, 0, width, height);
      const laneY = [height * 0.38, height * 0.62];
      ctx.strokeStyle = dim;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.26);
      ctx.lineTo(width, height * 0.26);
      ctx.moveTo(0, height * 0.74);
      ctx.lineTo(width, height * 0.74);
      ctx.stroke();
      ctx.setLineDash([10, 12]);
      ctx.beginPath();
      ctx.moveTo(0, height * 0.5);
      ctx.lineTo(width, height * 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // vehicles visible over ~1 km of corridor: density = q / v (veh/km)
      const perLane = Math.max(1, Math.round(q / v / 2));
      const spacing = width / perLane;
      laneY.forEach((y, lane) => {
        for (let k = 0; k < perLane + 1; k++) {
          const jitter = (hash(k * 7 + lane * 131) - 0.5) * spacing * 0.6;
          const x =
            ((((offset * (lane ? 0.94 : 1) + k * spacing + jitter) % (width + spacing)) +
              width +
              spacing) %
              (width + spacing)) -
            spacing / 2;
          ctx.fillStyle = carCol || (lane ? star : cyan);
          ctx.shadowColor = lane ? volt : cyan;
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.roundRect(x - 7, y - 3, 14, 6, 3);
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      // conflict events — 1 simulated hour plays over 30 seconds
      if (Math.random() < (c / 30) * dt) {
        flashes.push({ x: Math.random() * width, y: height * (0.42 + Math.random() * 0.16), t: 0 });
        setFlagged((n) => n + 1);
      }
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        if (!f) continue;
        f.t += dt;
        if (f.t > 1) {
          flashes.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = alert;
        ctx.globalAlpha = 1 - f.t;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 6 + f.t * 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div className="relative">
      <canvas
        ref={ref}
        className="block h-40 w-full md:h-48"
        aria-label={t(
          "Animated corridor showing simulated traffic flow",
          "Animovaný koridor se simulovanou dopravou",
        )}
        role="img"
      />
      <div className="absolute right-4 bottom-2 font-mono text-[9.5px] tracking-wider text-dim">
        {t("CONFLICTS FLAGGED", "ZAZNAMENANÉ KONFLIKTY")}{" "}
        <span className="text-alert">{String(flagged).padStart(3, "0")}</span>
      </div>
      <div
        className={cn(
          "absolute top-2 left-4 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors duration-500",
          vc < 0.7
            ? "border-go/50 text-go"
            : vc < 0.9
              ? "border-amber/50 text-amber"
              : "border-alert/50 text-alert",
        )}
      >
        {vc < 0.7
          ? t("Free flow", "Plynulý provoz")
          : vc < 0.9
            ? t("Busy", "Hustý provoz")
            : t("Congested", "Kongesce")}
      </div>
      <div className="absolute bottom-2 left-4 font-mono text-[9.5px] tracking-wider text-dim">
        {t("1 SIM-HOUR = 30 S", "1 SIMULOVANÁ HODINA = 30 S")}
      </div>
    </div>
  );
}
