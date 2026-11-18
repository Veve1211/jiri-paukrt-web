import { createFileRoute } from "@tanstack/react-router";

import { CorridorSimulator } from "@/components/site/CorridorSimulator";
import { PageIntro } from "@/components/site/PageIntro";
import { TechRadar } from "@/components/site/TechRadar";

export const Route = createFileRoute("/expertise")({
  head: () => ({
    meta: [
      { title: "Expertise & Tools — Jiri Paukrt" },
      {
        name: "description",
        content:
          "Strategic demand modelling, traffic microsimulation, appraisal, GIS and programming — plus an illustrative corridor simulator showing how speed and conflicts respond to demand.",
      },
      { property: "og:title", content: "Expertise & Tools — Jiri Paukrt" },
      {
        property: "og:description",
        content: "The modelling tools behind the projects, and a small corridor flow simulator to try.",
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
        chart="EXPERTISE"
        title={
          <>
            Expertise &amp; <span className="font-bold">tools</span>
          </>
        }
      >
        Strategic assignment, variable demand, microsimulation, appraisal and GIS — the tools behind the projects.
      </PageIntro>
      <div className="mt-10">
        <TechRadar />
      </div>

      <section className="mt-20" aria-labelledby="sim">
        <p className="font-mono text-[11px] tracking-[0.25em] text-cyan/80">TRY IT — ILLUSTRATIVE MODEL</p>
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
