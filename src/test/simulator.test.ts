import { describe, expect, it } from "vitest";

import { compare, corridorCapacity, NO_MEASURES, simulate } from "@/lib/simulator";

describe("corridor telemetry simulator", () => {
  it("runs at the 80 km/h free-flow speed with no traffic and no conflicts", () => {
    const r = simulate(0, NO_MEASURES);
    expect(r.speedKmh).toBe(80);
    expect(r.conflictsPerHour).toBe(0);
  });

  it("follows the BPR curve: at capacity speed drops to 80 / 1.15", () => {
    const r = simulate(3600, NO_MEASURES);
    expect(r.vc).toBe(1);
    expect(r.speedKmh).toBeCloseTo(69.565, 2);
  });

  it("adaptive signals plus ramp metering raise capacity by 10% then 8%", () => {
    expect(corridorCapacity({ adaptiveSignals: true, rampMetering: true, conflictRedesign: false })).toBeCloseTo(
      3600 * 1.1 * 1.08,
      6,
    );
  });

  it("conflict-zone redesign alone cuts conflicts by 35% without changing speed", () => {
    const c = compare(3000, { adaptiveSignals: false, rampMetering: false, conflictRedesign: true });
    expect(c.conflictReductionPct).toBeCloseTo(35, 6);
    expect(c.speedGainPct).toBe(0);
  });
});
