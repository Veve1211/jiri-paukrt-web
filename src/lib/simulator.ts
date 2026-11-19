// Illustrative corridor model for the telemetry simulator. Uses the standard BPR
// volume-delay curve; it demonstrates behaviour and is not data from any project.

export const FREE_FLOW_KMH = 80;
export const LANE_CAPACITY_VPH = 1800;
export const LANES = 2;
export const CORRIDOR_KM = 5;
export const ADAPTIVE_SIGNALS_CAPACITY_GAIN = 0.1;
export const RAMP_METERING_CAPACITY_GAIN = 0.08;
export const CONFLICT_REDESIGN_REDUCTION = 0.35;
const CONFLICT_RATE = 0.004;

export interface Measures {
  adaptiveSignals: boolean;
  rampMetering: boolean;
  conflictRedesign: boolean;
}

export const NO_MEASURES: Measures = {
  adaptiveSignals: false,
  rampMetering: false,
  conflictRedesign: false,
};

export interface SimResult {
  capacity: number;
  vc: number;
  speedKmh: number;
  travelTimeMin: number;
  conflictsPerHour: number;
}

export function corridorCapacity(m: Measures): number {
  let cap = LANE_CAPACITY_VPH * LANES;
  if (m.adaptiveSignals) cap *= 1 + ADAPTIVE_SIGNALS_CAPACITY_GAIN;
  if (m.rampMetering) cap *= 1 + RAMP_METERING_CAPACITY_GAIN;
  return cap;
}

export function bprSpeed(demand: number, capacity: number): number {
  const vc = Math.max(0, demand) / capacity;
  return FREE_FLOW_KMH / (1 + 0.15 * vc ** 4);
}

export function simulate(demand: number, m: Measures): SimResult {
  const capacity = corridorCapacity(m);
  const vc = Math.max(0, demand) / capacity;
  const speedKmh = bprSpeed(demand, capacity);
  const travelTimeMin = (CORRIDOR_KM / speedKmh) * 60;
  const conflictsPerHour =
    CONFLICT_RATE *
    Math.max(0, demand) *
    vc ** 2 *
    (m.conflictRedesign ? 1 - CONFLICT_REDESIGN_REDUCTION : 1);
  return { capacity, vc, speedKmh, travelTimeMin, conflictsPerHour };
}

export interface Comparison {
  baseline: SimResult;
  scenario: SimResult;
  speedGainPct: number;
  conflictReductionPct: number;
}

export function compare(demand: number, m: Measures): Comparison {
  const baseline = simulate(demand, NO_MEASURES);
  const scenario = simulate(demand, m);
  const speedGainPct = ((scenario.speedKmh - baseline.speedKmh) / baseline.speedKmh) * 100;
  const conflictReductionPct =
    baseline.conflictsPerHour > 0
      ? ((baseline.conflictsPerHour - scenario.conflictsPerHour) / baseline.conflictsPerHour) * 100
      : 0;
  return { baseline, scenario, speedGainPct, conflictReductionPct };
}
