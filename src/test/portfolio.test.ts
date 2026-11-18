import { describe, expect, it } from "vitest";

import { CAREER, filterProjects, PERSON, PROJECTS, UK_MICROSIM_TOWNS } from "@/data/portfolio";

describe("portfolio content", () => {
  it("lists all 11 UK microsimulation towns", () => {
    expect(UK_MICROSIM_TOWNS).toHaveLength(11);
  });

  it("filters projects by domain", () => {
    expect(filterProjects("mega-events").map((p) => p.slug)).toEqual(["commonwealth-games"]);
    expect(filterProjects()).toHaveLength(PROJECTS.length);
  });

  it("starts the career in 1999 at CityPlan Prague and is currently at SYSTRA Dublin", () => {
    expect(CAREER.at(-1)?.years).toBe("Jul 1999 – Jun 2004");
    expect(CAREER.at(-1)?.company).toBe("CityPlan");
    expect(CAREER[0]?.company).toBe("SYSTRA");
    expect(new Date().getFullYear() - PERSON.careerStartYear).toBeGreaterThanOrEqual(27);
  });
});
