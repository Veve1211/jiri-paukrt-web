import { createFileRoute, Link } from "@tanstack/react-router";

import { HeroRoadNetwork } from "@/components/site/HeroRoadNetwork";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jiri Paukrt — Principal Transportation Engineer | Transport Modelling" },
      {
        name: "description",
        content:
          "Principal Transportation Engineer at SYSTRA in Dublin. 27+ years of travel demand modelling, traffic microsimulation and scheme evaluation across Ireland, the UK, Australia and Central Europe.",
      },
      { property: "og:title", content: "Jiri Paukrt — Principal Transportation Engineer" },
      {
        property: "og:description",
        content:
          "Travel demand modelling, traffic microsimulation and scheme evaluation across Ireland, the UK, Australia and Central Europe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FACTS = [
  { value: "27+", label: "Years in transport modelling" },
  { value: "4", label: "Countries of practice" },
  { value: "1999", label: "Modelling since" },
  { value: "4", label: "Papers & conference talks" },
];

function Index() {
  return (
    <div className="grid grid-cols-1 gap-8 px-4 pt-10 pb-10 md:px-8 lg:min-h-[calc(100vh-68px)] lg:grid-cols-12">
      <section className="flex flex-col justify-center lg:col-span-5">
        <p className="mb-5 font-mono text-[11px] tracking-[0.22em] text-cyan">
          PRINCIPAL TRANSPORTATION ENGINEER · SYSTRA, DUBLIN
        </p>
        <h1 className="text-[48px] leading-[1] font-semibold tracking-tight text-balance sm:text-[64px]">
          Jiri Paukrt<span className="font-light text-dim">, Ing.</span>
        </h1>
        <p className="mt-6 max-w-[460px] text-[16px] leading-relaxed text-starblue">
          27 years of transport modelling across Ireland, the UK, Australia and Central Europe — from national demand
          forecasting to junction-level microsimulation and post-opening scheme evaluation.
        </p>
        <dl className="mt-8 grid max-w-[500px] grid-cols-2 gap-2.5 sm:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} className="rounded-[10px] border border-star/10 bg-star/[0.03] p-3">
              <dt className="sr-only">{f.label}</dt>
              <dd className="text-2xl font-semibold font-display text-star">{f.value}</dd>
              <dd className="mt-1 font-mono text-[9.5px] leading-snug tracking-wider text-dim uppercase">{f.label}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="glow" size="pill" className="font-medium">
            <Link to="/career">View career →</Link>
          </Button>
          <Button asChild variant="glass" size="pill" className="font-normal">
            <Link to="/projects">Projects &amp; publications</Link>
          </Button>
        </div>
      </section>
      <section className="relative flex items-center lg:col-span-7">
        <HeroRoadNetwork />
      </section>
    </div>
  );
}
