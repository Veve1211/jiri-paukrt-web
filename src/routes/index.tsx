import { createFileRoute, Link } from "@tanstack/react-router";

import { HeroConstellation } from "@/components/site/HeroConstellation";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jiri Paukrt — Navigating Planetary Flow | Transport Modelling" },
      {
        name: "description",
        content:
          "Principal Transportation Engineer at SYSTRA Dublin. Macro-scale demand forecasting, dynamic microsimulation and GIS intelligence across 27+ years.",
      },
      { property: "og:title", content: "Jiri Paukrt — Navigating Planetary Flow" },
      {
        property: "og:description",
        content: "Macro-scale demand forecasting, dynamic microsimulation, and GIS intelligence. 27+ years of global impact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STATS = [
  { value: "27+", label: "YEARS GLOBAL IMPACT", highlight: false },
  { value: "100%", label: "NATIONAL DEMAND MODEL", highlight: true },
  { value: "Multi", label: "CITY MICROSIMULATIONS", highlight: false },
];

function Index() {
  return (
    <div className="grid grid-cols-1 gap-8 px-4 pt-10 pb-10 md:px-8 lg:min-h-[calc(100vh-68px)] lg:grid-cols-12">
      <section className="flex flex-col justify-center lg:col-span-5">
        <p className="mb-5 font-mono text-[11px] tracking-[0.25em] text-cyan/80">CHART 01 — GLOBAL NETWORK</p>
        <h1 className="text-[44px] leading-[1.02] font-light tracking-tight text-balance sm:text-[56px]">
          Navigating <span className="font-bold">Planetary Flow</span> Across Space &amp; Time
        </h1>
        <p className="mt-6 max-w-[440px] text-[15px] leading-relaxed text-dim">
          <span className="font-medium text-star">Jiri Paukrt — Principal Transportation Engineer.</span> Macro-scale
          demand forecasting, dynamic microsimulation, and GIS intelligence.
        </p>
        <div className="mt-8 grid max-w-[480px] grid-cols-3 gap-2.5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={
                s.highlight
                  ? "rounded-[12px] border border-cyan/30 bg-cyan/[0.06] p-3"
                  : "rounded-[12px] border border-star/10 bg-star/[0.03] p-3"
              }
            >
              <div className={s.highlight ? "text-2xl font-bold text-cyan" : "text-2xl font-bold"}>{s.value}</div>
              <div className="mt-1 font-mono text-[10px] tracking-wider text-dim">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="glow" size="pill" className="font-medium">
            <Link to="/network">Explore Star Network Models →</Link>
          </Button>
          <Button asChild variant="glass" size="pill" className="font-normal">
            <Link to="/contact">Contact &amp; Dublin HQ</Link>
          </Button>
        </div>
      </section>
      <section className="relative flex items-center lg:col-span-7">
        <HeroConstellation />
      </section>
    </div>
  );
}
