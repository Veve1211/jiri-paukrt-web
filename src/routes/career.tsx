import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { PageIntro } from "@/components/site/PageIntro";
import { CAREER, EDUCATION, getProject } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Career Timeline 1999–Present — Jiri Paukrt" },
      {
        name: "description",
        content:
          "From CityPlan Prague (1999) through Jacobs Babtie Leeds and Hyder Consulting Melbourne to Principal Transportation Engineer at SYSTRA Dublin since 2008.",
      },
      { property: "og:title", content: "Career Timeline — Jiri Paukrt" },
      {
        property: "og:description",
        content: "Prague → Leeds → Melbourne → Dublin: 27+ years of transport planning and modelling.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareerPage,
});

function CareerPage() {
  return (
    <div className="px-4 pt-10 md:px-8">
      <PageIntro
        chart="CHART 06 — FLIGHT LOG"
        title={
          <>
            Career <span className="font-bold">Trajectory</span>
          </>
        }
      >
        Four orbits across three continents: Prague, Leeds, Melbourne and, since 2008, Dublin.
      </PageIntro>

      <ol className="relative mt-12 max-w-4xl">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-cyan via-volt/60 to-star/10 md:left-[167px]" />
        {CAREER.map((c) => (
          <li key={c.company} className="relative grid gap-3 pb-10 pl-8 md:grid-cols-[150px_1fr] md:gap-10 md:pl-0">
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1.5 left-0 size-[15px] rounded-full border md:left-[160px]",
                c.current ? "border-cyan bg-cyan shadow-glow" : "border-starblue/60 bg-void",
              )}
            />
            <div className="font-mono text-[12px] tracking-wider text-cyan md:pt-1 md:text-right">{c.years.toUpperCase()}</div>
            <div className="glass rounded-[14px] p-5 md:ml-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-medium">{c.role}</h2>
                {c.current && <span className="telemetry text-[9.5px] text-cyan">Current orbit</span>}
              </div>
              <p className="mt-1 text-sm text-star">
                {c.company} <span className="text-dim">· {c.location}</span>
              </p>
              <Link
                to="/network"
                search={{ node: c.locationId }}
                className="telemetry mt-3 inline-block text-[9.5px] text-dim hover:text-cyan"
              >
                Locate on star network →
              </Link>
              {c.related.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-star/10 pt-4">
                  {c.related.map((slug) => (
                    <Link
                      key={slug}
                      to="/projects/$slug"
                      params={{ slug }}
                      className="rounded-full border border-star/10 px-3 py-1 text-xs text-dim hover:border-cyan/40 hover:text-cyan"
                    >
                      {getProject(slug)!.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-6 max-w-4xl md:pl-[198px]" aria-labelledby="edu">
        <div className="rounded-[14px] border border-volt/30 bg-volt/[0.08] p-6">
          <div className="telemetry flex items-center gap-2 text-[10px] text-starblue">
            <GraduationCap className="size-4" /> Launch pad · Education
          </div>
          <h2 id="edu" className="mt-3 text-xl font-medium">{EDUCATION.degree}</h2>
          <p className="mt-1 text-sm text-dim">
            {EDUCATION.school} · {EDUCATION.location}
          </p>
        </div>
      </section>
    </div>
  );
}
