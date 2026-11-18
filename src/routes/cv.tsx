import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer } from "lucide-react";

import { CAREER, EDUCATION, PERSON, PROJECTS, QUADRANTS, TECH } from "@/data/portfolio";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "CV — Jiri Paukrt, Principal Transportation Engineer" },
      {
        name: "description",
        content:
          "Curriculum vitae of Jiri Paukrt: 27 years of travel demand modelling, traffic microsimulation and scheme evaluation in Ireland, the UK, Australia and Central Europe.",
      },
      { property: "og:title", content: "CV — Jiri Paukrt" },
      { property: "og:description", content: PERSON.summary },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CvPage,
});

/** A printable, document-style CV. The same page is exported to /Jiri-Paukrt-CV.pdf. */
function CvPage() {
  const projects = PROJECTS.filter((p) => p.role);
  const pubs = PROJECTS.filter((p) => p.publication);
  return (
    <div className="px-4 pt-10 md:px-8 print:p-0">
      <div className="no-print mx-auto mb-6 flex max-w-[860px] flex-wrap items-center justify-between gap-3">
        <p className="telemetry text-[11px] text-cyan">Curriculum vitae</p>
        <div className="flex gap-2">
          <a
            href="/Jiri-Paukrt-CV.pdf"
            download
            className="inline-flex h-10 items-center gap-2 rounded-full bg-cyan px-4 text-sm font-semibold text-void hover:brightness-105"
          >
            <Download className="size-4" /> Download PDF
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-star/15 px-4 text-sm text-star hover:bg-star/10"
          >
            <Printer className="size-4" /> Print
          </button>
        </div>
      </div>

      <article className="cv-sheet mx-auto max-w-[860px] rounded-[20px] bg-white px-10 py-12 text-[12.5px] leading-[1.55] text-[#1d2a3d] shadow-2xl md:px-14 print:max-w-none print:rounded-none print:px-0 print:py-0 print:shadow-none">
        <header className="border-b-2 border-[#1f5fad] pb-5">
          <h1 className="text-[34px] leading-tight font-semibold tracking-tight text-[#0f2443]">{PERSON.name}, Ing.</h1>
          <p className="mt-1 text-[15px] font-medium text-[#1f5fad]">
            {PERSON.role} · {PERSON.company}, {PERSON.city}, Ireland
          </p>
          <p className="mt-2 text-[12px] text-[#4a5a70]">
            paukrt@yahoo.com · linkedin.com/in/jiri-paukrt · transport-constellation-atlas.lovable.app
          </p>
        </header>

        <Section title="Profile">
          <p>{PERSON.summary}</p>
        </Section>

        <Section title="Experience">
          <div className="space-y-5">
            {CAREER.map((c) => (
              <div key={c.company} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[14.5px] font-semibold text-[#0f2443]">
                    {c.role} — {c.company}
                  </h3>
                  <span className="font-mono text-[11.5px] text-[#4a5a70]">{c.years}</span>
                </div>
                <p className="text-[12px] text-[#4a5a70]">{c.location}</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 marker:text-[#1f5fad]">
                  {c.duties.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Selected projects">
          <ul className="space-y-1.5">
            {projects.map((p) => (
              <li key={p.slug} className="break-inside-avoid">
                <span className="font-semibold text-[#0f2443]">{p.title}</span>
                <span className="text-[#4a5a70]">
                  {" "}
                  — {p.location}
                  {p.years ? `, ${p.years}` : ""}
                </span>
                <br />
                <span>Role: {p.role}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Publications & conference papers">
          <ul className="space-y-1.5">
            {pubs.map((p) => (
              <li key={p.slug} className="break-inside-avoid">
                <span className="font-medium text-[#0f2443]">{p.publication!.title}.</span>{" "}
                <span className="text-[#4a5a70]">
                  {p.publication!.authors ? `${p.publication!.authors}. ` : ""}
                  {p.publication!.venue}.
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <div className="grid gap-x-10 md:grid-cols-2 print:grid-cols-2">
          <Section title="Tools">
            <dl className="space-y-1.5">
              {QUADRANTS.map((q) => (
                <div key={q}>
                  <dt className="inline font-semibold text-[#0f2443]">{q}: </dt>
                  <dd className="inline">
                    {TECH.filter((t) => t.quadrant === q)
                      .map((t) => t.name)
                      .join(", ")}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
          <div>
            <Section title="Education">
              <p className="font-semibold text-[#0f2443]">{EDUCATION.degree}</p>
              <p className="text-[#4a5a70]">
                {EDUCATION.school}, {EDUCATION.location}, {EDUCATION.years}
              </p>
            </Section>
            <Section title="Languages">
              <p>{PERSON.languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(" · ")}</p>
            </Section>
          </div>
        </div>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 break-after-avoid font-mono text-[11px] font-medium tracking-[0.16em] text-[#1f5fad] uppercase">{title}</h2>
      {children}
    </section>
  );
}
