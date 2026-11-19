import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, MapPin } from "lucide-react";

import { InquiryDialog } from "@/components/site/InquiryDialog";
import { METHOD_CAPTION, METHOD_CAPTION_CS, MethodIllustration, type Method } from "@/components/site/MethodIllustration";
import { useContent } from "@/data/useContent";
import { useLang } from "@/lib/i18n";
import { ProjectCover } from "@/components/site/ProjectCover";

import type { TopicValue } from "@/components/site/InquiryForm";
import { Button } from "@/components/ui/button";
import { getProject, type DomainKey } from "@/data/portfolio";

const GALLERY: Record<string, Method[]> = {
  "nta-national-demand-model": ["matrix", "calibration", "bandwidth"],
  "nta-long-distance-model": ["matrix", "bandwidth", "profile"],
  "glasgow-m74-evaluation": ["beforeAfter", "bandwidth", "calibration"],
  "road-safety-traffic-conflicts": ["junction", "calibration", "bandwidth"],
  "commonwealth-games": ["profile", "bandwidth", "junction"],
  "sydney-lane-cove-tunnel": ["junction", "bandwidth", "calibration"],
  "melbourne-dandenong": ["junction", "beforeAfter", "bandwidth"],
  "uk-microsimulation-models": ["junction", "calibration", "bandwidth"],
};

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
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-lg px-4 pt-24 text-center">
      <p className="telemetry text-[11px] text-cyan">{t("Not found", "Nenalezeno")}</p>
      <h1 className="mt-4 text-4xl font-light">{t("This project isn't listed", "Tento projekt tu není")}</h1>
      <p className="mt-3 text-dim">{t("It may have been renamed or removed.", "Mohl být přejmenován nebo odstraněn.")}</p>
      <Button asChild variant="glow" size="pill" className="mt-8">
        <Link to="/projects">{t("Browse all projects →", "Všechny projekty →")}</Link>
      </Button>
    </div>
  );
}

function ProjectPage() {
  const { project: base } = Route.useLoaderData();
  const { t, lang } = useLang();
  const { projects, domainLabel, regionLabel, techLabel } = useContent();
  const p = projects.find((x) => x.slug === base.slug) ?? base;
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length] ?? p;
  const next = projects[(idx + 1) % projects.length] ?? p;
  const isTownList = p.slug === "uk-microsimulation-models";

  return (
    <article className="px-4 pt-10 md:px-8">
      <Link to="/projects" className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-dim hover:text-star">
        <ArrowLeft className="size-3.5" /> {t("ALL PROJECTS", "VŠECHNY PROJEKTY")}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-[11px] tracking-[0.25em] text-cyan/80">
            {regionLabel(p.region).toUpperCase()} · {p.location.toUpperCase()}
          </p>
          <h1 className="mt-5 text-[40px] leading-[1.04] font-light tracking-tight text-balance md:text-[52px]">
            {p.title}
          </h1>
          <p className="mt-4 text-sm text-star">
            {p.client} <span className="text-dim">· {p.location}</span>
            {p.years && <span className="text-dim"> · {p.years}</span>}
          </p>
          {p.role && (
            <p className="mt-4 inline-flex max-w-[580px] items-start gap-2 rounded-[14px] border border-cyan/30 bg-cyan/[0.07] px-3.5 py-2.5 text-sm text-star">
              <span className="telemetry mt-0.5 shrink-0 text-[9.5px] text-cyan">{t("Jiri's role", "Jiřího role")}</span>
              {p.role}
            </p>
          )}
          <p className="mt-6 max-w-[580px] text-[15px] leading-relaxed text-dim">{p.summary}</p>
          {p.usedFor && (
            <p className="mt-4 max-w-[580px] text-[15px] leading-relaxed text-star">
              <span className="telemetry mr-2 text-[10px] text-cyan">{t("Used for", "K čemu sloužil")}</span>
              {p.usedFor}
            </p>
          )}

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
                  {t("Ask about this project →", "Zeptat se na projekt →")}
                </Button>
              }
            />
            <Button asChild variant="glass" size="pill">
              <Link to="/network" search={p.locationIds[0] ? { node: p.locationIds[0] } : {}}>
                <MapPin /> {t("Show on map", "Ukázat na mapě")}
              </Link>
            </Button>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-5">
          <div className="glass overflow-hidden rounded-[20px]">
            <ProjectCover slug={p.slug} animate />
          </div>
          <div className="glass rounded-[20px] p-5">
            <div className="telemetry text-[10px] text-cyan">{isTownList ? t("Towns modelled", "Modelovaná města") : t("Key points", "Hlavní body")}</div>
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
                <BookOpen className="size-3.5" /> {t("Publication", "Publikace")}
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
                  {t("Read the paper", "Číst článek")} <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </div>
          )}

          <div className="glass rounded-[20px] p-5">
            <div className="telemetry text-[10px] text-dim">{t("Domains", "Obory")}</div>
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
              {p.tools?.map((tool) => (
                <span key={tool} className="rounded-full border border-volt/40 bg-volt/10 px-3 py-1 font-mono text-[10px] tracking-wider text-starblue uppercase">
                  {techLabel(tool)}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {GALLERY[p.slug] && (
        <section className="mt-16" aria-labelledby="how">
          <p className="telemetry text-[11px] text-cyan">{t("How this kind of work is done", "Jak se taková práce dělá")}</p>
          <h2 id="how" className="mt-3 text-2xl font-light md:text-3xl">
            {t("The method, ", "Metoda ")}
            <span className="font-semibold">{t("in pictures", "v obrázcích")}</span>
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {GALLERY[p.slug]!.map((m) => (
              <figure key={m} className="glass reveal overflow-hidden rounded-[20px]">
                <MethodIllustration method={m} />
                <figcaption className="border-t border-star/10 px-5 py-3 text-sm text-starblue">{lang === "cs" ? METHOD_CAPTION_CS[m] : METHOD_CAPTION[m]}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-3 text-xs text-dim">{t("Illustrations of the method — not data from this project.", "Ilustrace metody — nejde o data z tohoto projektu.")}</p>
        </section>
      )}

      <nav aria-label={t("More projects", "Další projekty")} className="mt-16 grid gap-3 border-t border-star/10 pt-6 sm:grid-cols-2">
        <Link to="/projects/$slug" params={{ slug: prev.slug }} className="group glass rounded-[20px] p-4 hover:border-cyan/40">
          <span className="telemetry flex items-center gap-1.5 text-[10px] text-dim">
            <ArrowLeft className="size-3" /> {t("Previous", "Předchozí")}
          </span>
          <span className="mt-1 block font-medium group-hover:text-cyan">{prev.title}</span>
        </Link>
        <Link to="/projects/$slug" params={{ slug: next.slug }} className="group glass rounded-[20px] p-4 text-right hover:border-cyan/40">
          <span className="telemetry flex items-center justify-end gap-1.5 text-[10px] text-dim">
            {t("Next", "Další")} <ArrowRight className="size-3" />
          </span>
          <span className="mt-1 block font-medium group-hover:text-cyan">{next.title}</span>
        </Link>
      </nav>
    </article>
  );
}
