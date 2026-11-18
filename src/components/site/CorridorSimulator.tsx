import { useEffect, useMemo, useRef, useState } from "react";

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
import { cn } from "@/lib/utils";

const MEASURES: { key: keyof Measures; label: string; detail: string }[] = [
  { key: "adaptiveSignals", label: "Adaptive signal control", detail: `+${ADAPTIVE_SIGNALS_CAPACITY_GAIN * 100}% capacity` },
  { key: "rampMetering", label: "Ramp metering", detail: `+${RAMP_METERING_CAPACITY_GAIN * 100}% capacity` },
  { key: "conflictRedesign", label: "Conflict-zone redesign", detail: `−${CONFLICT_REDESIGN_REDUCTION * 100}% conflict rate` },
];

export function CorridorSimulator() {
  const [demand, setDemand] = useState(3200);
  const [measures, setMeasures] = useState<Measures>({ adaptiveSignals: true, rampMetering: false, conflictRedesign: true });
  const result = useMemo(() => compare(demand, measures), [demand, measures]);
  const { baseline, scenario } = result;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="glass rounded-[14px] p-5 lg:col-span-4">
        <div className="telemetry text-[10px] text-cyan">Inputs</div>
        <div className="mt-5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="sim-demand" className="text-sm">Peak-hour demand</label>
            <span className="font-mono text-sm text-cyan">{demand.toLocaleString("en-IE")} veh/h</span>
          </div>
          <Slider
            id="sim-demand"
            className="mt-3"
            min={400}
            max={4400}
            step={100}
            value={[demand]}
            onValueChange={(v) => setDemand(v[0] ?? 400)}
            aria-label="Peak-hour demand in vehicles per hour"
          />
          <div className="mt-1.5 flex justify-between font-mono text-[9.5px] text-dim">
            <span>400</span>
            <span>CAPACITY 3,600</span>
            <span>4,400</span>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {MEASURES.map((m) => (
            <label key={m.key} className="flex cursor-pointer items-center justify-between gap-3 rounded-[12px] border border-star/10 bg-star/[0.03] p-3">
              <span>
                <span className="block text-sm">{m.label}</span>
                <span className="telemetry block text-[9px] text-dim">{m.detail}</span>
              </span>
              <Switch
                checked={measures[m.key]}
                onCheckedChange={(v) => setMeasures((s) => ({ ...s, [m.key]: v }))}
                aria-label={m.label}
              />
            </label>
          ))}
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-dim/80">
          Illustrative {CORRIDOR_KM} km, two-lane corridor at {FREE_FLOW_KMH} km/h free flow, using the BPR
          volume–delay curve. A teaching model — not output from any project.
        </p>
      </div>

      <div className="space-y-4 lg:col-span-8">
        <div className="glass overflow-hidden rounded-[14px]">
          <div className="flex items-center justify-between px-4 pt-3 font-mono text-[10px] tracking-wider text-dim">
            <span className="flex items-center gap-1.5 text-cyan">
              <span className="size-1 rounded-full bg-cyan" /> SCENARIO
            </span>
            <span>V/C {scenario.vc.toFixed(2)}</span>
          </div>
          <CorridorCanvas speedKmh={scenario.speedKmh} demand={demand} conflictsPerHour={scenario.conflictsPerHour} />
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          <Readout label="Flow speed" value={`${scenario.speedKmh.toFixed(1)}`} unit="km/h" base={`${baseline.speedKmh.toFixed(1)}`} delta={result.speedGainPct} goodWhenUp highlight />
          <Readout label="Travel time" value={scenario.travelTimeMin.toFixed(1)} unit="min" base={baseline.travelTimeMin.toFixed(1)} delta={((scenario.travelTimeMin - baseline.travelTimeMin) / baseline.travelTimeMin) * 100} />
          <Readout label="Volume / capacity" value={scenario.vc.toFixed(2)} unit="" base={baseline.vc.toFixed(2)} delta={((scenario.vc - baseline.vc) / (baseline.vc || 1)) * 100} />
          <Readout label="Conflicts" value={scenario.conflictsPerHour.toFixed(1)} unit="/h" base={baseline.conflictsPerHour.toFixed(1)} delta={-result.conflictReductionPct} />
        </div>
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
}: {
  label: string;
  value: string;
  unit: string;
  base: string;
  delta: number;
  goodWhenUp?: boolean;
  highlight?: boolean;
}) {
  const flat = Math.abs(delta) < 0.05;
  const good = flat ? null : goodWhenUp ? delta > 0 : delta < 0;
  return (
    <div className={cn("rounded-[12px] border p-3", highlight ? "border-cyan/30 bg-cyan/[0.06]" : "border-star/10 bg-star/[0.03]")}>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-bold", highlight && "text-cyan")}>{value}</span>
        <span className="font-mono text-[10px] text-dim">{unit}</span>
      </div>
      <div className="telemetry mt-1 text-[9.5px] text-dim">{label}</div>
      <div className="mt-2 flex items-center justify-between font-mono text-[9.5px]">
        <span className="text-dim/70">BASE {base}</span>
        <span className={cn(good === null ? "text-dim" : good ? "text-cyan" : "text-alert")}>
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

function CorridorCanvas({ speedKmh, demand, conflictsPerHour }: { speedKmh: number; demand: number; conflictsPerHour: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const params = useRef({ speedKmh, demand, conflictsPerHour });
  params.current = { speedKmh, demand, conflictsPerHour };
  const reducedMotion = usePrefersReducedMotion();
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
      const { speedKmh: v, demand: q, conflictsPerHour: c } = params.current;
      const pxPerSec = (v / 80) * 140;
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
          const x = (((offset * (lane ? 0.94 : 1) + k * spacing + jitter) % (width + spacing)) + width + spacing) % (width + spacing) - spacing / 2;
          ctx.fillStyle = lane ? star : cyan;
          ctx.shadowColor = lane ? volt : cyan;
          ctx.shadowBlur = 8;
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

      if (!reducedMotion) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div className="relative">
      <canvas ref={ref} className="block h-40 w-full md:h-48" aria-label="Animated corridor showing simulated traffic flow" role="img" />
      <div className="absolute right-4 bottom-2 font-mono text-[9.5px] tracking-wider text-dim">
        CONFLICTS FLAGGED <span className="text-alert">{String(flagged).padStart(3, "0")}</span>
      </div>
      <div className="absolute bottom-2 left-4 font-mono text-[9.5px] tracking-wider text-dim">1 SIM-HOUR = 30 S</div>
    </div>
  );
}
