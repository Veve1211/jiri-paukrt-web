import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, MapPin } from "lucide-react";

import { InquiryDialog } from "@/components/site/InquiryDialog";
import type { TopicValue } from "@/components/site/InquiryForm";
import { Button } from "@/components/ui/button";
import { domainLabel, getProject, PROJECTS, type DomainKey } from "@/data/portfolio";

const TOPIC_FOR: Record<DomainKey, TopicValue> = {
  national: "national-models",
  microsim: "microsimulation",
  "mega-events": "mega-events",
  "gis-safety": "gis-safety",
};

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "Project not found — Jiri Paukrt" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${p.title} — Jiri Paukrt` },
        { name: "description", content: p.summary },
        { property: "og:title", content: `${p.title} — Jiri Paukrt` },
        { property: "og:description", content: p.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectPage,
});

function ProjectNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 pt-24 text-center">
      <p className="telemetry text-[11px] text-cyan">Not found</p>
      <h1 className="mt-4 text-4xl font-light">This project isn't listed</h1>
      <p className="mt-3 text-dim">It may have been renamed or removed.</p>
      <Button asChild variant="glow" size="pill" className="mt-8">
        <Link to="/projects">Browse all projects →</Link>
      </Button>
    </div>
  );
}

function ProjectPage() {
  const { project: p } = Route.useLoaderData();
  const idx = PROJECTS.findIndex((x) => x.slug === p.slug);
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length] ?? p;
  const next = PROJECTS[(idx + 1) % PROJECTS.length] ?? p;
  const isTownList = p.slug === "uk-microsimulation-models";

  return (
    <article className="px-4 pt-10 md:px-8">
      <Link to="/projects" className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-dim hover:text-star">
        <ArrowLeft className="size-3.5" /> ALL PROJECTS
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-[11px] tracking-[0.25em] text-cyan/80">
            {p.region.toUpperCase()} · {p.location.toUpperCase()}
          </p>
          <h1 className="mt-5 text-[40px] leading-[1.04] font-light tracking-tight text-balance md:text-[52px]">
            {p.title}
          </h1>
          <p className="mt-4 text-sm text-star">
            {p.client} <span className="text-dim">· {p.location}</span>
          </p>
          <p className="mt-6 max-w-[580px] text-[15px] leading-relaxed text-dim">{p.summary}</p>

          <div className="mt-8 grid max-w-[560px] grid-cols-2 gap-2.5 sm:grid-cols-3">
            {p.metrics.map((m, i) => (
              <div
                key={m.label}
                className={
                  i === 0
                    ? "rounded-[14px] border border-cyan/30 bg-cyan/[0.06] p-3"
                    : "rounded-[14px] border border-star/10 bg-star/[0.03] p-3"
                }
              >
                <div className={i === 0 ? "text-2xl font-bold text-cyan" : "text-2xl font-bold"}>{m.value}</div>
                <div className="mt-1 font-mono text-[10px] tracking-wider text-dim uppercase">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <InquiryDialog
              topic={p.domains[0] ? TOPIC_FOR[p.domains[0]] : "other"}
              source={p.slug}
              subject={p.title}
              trigger={
                <Button variant="glow" size="pill" className="font-medium">
                  Discuss a similar project →
                </Button>
              }
            />
            <Button asChild variant="glass" size="pill">
              <Link to="/network" search={p.locationIds[0] ? { node: p.locationIds[0] } : {}}>
                <MapPin /> Show on map
              </Link>
            </Button>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-5">
          <div className="glass rounded-[20px] p-5">
            <div className="telemetry text-[10px] text-cyan">{isTownList ? "Towns modelled" : "Key points"}</div>
            <ul className={isTownList ? "mt-4 grid grid-cols-2 gap-x-4 gap-y-2" : "mt-4 space-y-3"}>
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-star">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan shadow-dot" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {p.publication && (
            <div className="glass rounded-[20px] p-5">
              <div className="telemetry flex items-center gap-2 text-[10px] text-cyan">
                <BookOpen className="size-3.5" /> Publication
              </div>
              <p className="mt-3 text-base leading-snug font-medium">"{p.publication.title}"</p>
              <p className="mt-2 text-sm text-dim">{p.publication.venue}</p>
              {p.publication.authors && <p className="mt-1 text-sm text-dim">{p.publication.authors}</p>}
              {p.publication.url && (
                <a
                  href={p.publication.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan hover:underline"
                >
                  Read the paper <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </div>
          )}

          <div className="glass rounded-[20px] p-5">
            <div className="telemetry text-[10px] text-dim">Domains</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.domains.map((d) => (
                <Link
                  key={d}
                  to="/projects"
                  search={{ domain: d }}
                  className="rounded-full border border-star/10 px-3 py-1 font-mono text-[10px] tracking-wider text-dim uppercase hover:border-cyan/40 hover:text-cyan"
                >
                  {domainLabel(d)}
                </Link>
              ))}
              {p.tools?.map((t) => (
                <span key={t} className="rounded-full border border-volt/40 bg-volt/10 px-3 py-1 font-mono text-[10px] tracking-wider text-starblue uppercase">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <nav aria-label="More projects" className="mt-16 grid gap-3 border-t border-star/10 pt-6 sm:grid-cols-2">
        <Link to="/projects/$slug" params={{ slug: prev.slug }} className="group glass rounded-[20px] p-4 hover:border-cyan/40">
          <span className="telemetry flex items-center gap-1.5 text-[10px] text-dim">
            <ArrowLeft className="size-3" /> Previous
          </span>
          <span className="mt-1 block font-medium group-hover:text-cyan">{prev.title}</span>
        </Link>
        <Link to="/projects/$slug" params={{ slug: next.slug }} className="group glass rounded-[20px] p-4 text-right hover:border-cyan/40">
          <span className="telemetry flex items-center justify-end gap-1.5 text-[10px] text-dim">
            Next <ArrowRight className="size-3" />
          </span>
          <span className="mt-1 block font-medium group-hover:text-cyan">{next.title}</span>
        </Link>
      </nav>
    </article>
  );
}
