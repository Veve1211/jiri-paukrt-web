import { createFileRoute } from "@tanstack/react-router";

import { CorridorSimulator } from "@/components/site/CorridorSimulator";
import { PageIntro } from "@/components/site/PageIntro";
import { TechRadar } from "@/components/site/TechRadar";

export const Route = createFileRoute("/expertise")({
  head: () => ({
    meta: [
      { title: "Tech Stack & Engineering Radar — Jiri Paukrt" },
      {
        name: "description",
        content:
          "Paramics Discovery, S-Paramics, SATURN, COBA, HDM4, QGIS, ArcGIS, Python, SQL and VBA — plus an interactive corridor simulator showing flow speed and conflict reduction.",
      },
      { property: "og:title", content: "Tech Stack & Engineering Radar — Jiri Paukrt" },
      {
        property: "og:description",
        content: "Explore the modelling instruments and try the corridor telemetry simulator.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExpertisePage,
});

function ExpertisePage() {
  return (
    <div className="px-4 pt-10 md:px-8">
      <PageIntro
        chart="CHART 04 — ENGINEERING RADAR"
        title={
          <>
            Tech Stack &amp; <span className="font-bold">Instruments</span>
          </>
        }
      >
        Strategic assignment, variable demand, microsimulation, appraisal and GIS — the instruments behind every model
        on the chart.
      </PageIntro>
      <div className="mt-10">
        <TechRadar />
      </div>

      <section className="mt-20" aria-labelledby="sim">
        <p className="font-mono text-[11px] tracking-[0.25em] text-cyan/80">CHART 05 — TELEMETRY SIMULATOR</p>
        <h2 id="sim" className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
          Corridor <span className="font-bold">Flow Simulator</span>
        </h2>
        <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-dim">
          Push demand towards capacity and watch speeds fall and conflicts climb — then switch on interventions to see
          what they recover.
        </p>
        <div className="mt-8">
          <CorridorSimulator />
        </div>
      </section>
    </div>
  );
}
