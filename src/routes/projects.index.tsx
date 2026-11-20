import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";

import { PageIntro } from "@/components/site/PageIntro";
import { ProjectCard } from "@/components/site/ProjectCard";
import { DOMAINS, filterProjects, isDomainKey, type DomainKey } from "@/data/portfolio";
import { useContent } from "@/data/useContent";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/")({
  validateSearch: (search: Record<string, unknown>): { domain?: DomainKey } => {
    const raw = search["domain"];
    return isDomainKey(raw) ? { domain: raw } : {};
  },
  head: () => ({
    meta: [
      { title: "Projects & Publications — Jiri Paukrt Transport Modelling" },
      {
        name: "description",
        content:
          "National demand models for Ireland's NTA, Commonwealth Games visitor demand, Sydney's Lane Cove Tunnel and 11 UK town microsimulations, plus papers and conference talks.",
      },
      { property: "og:title", content: "Projects & Publications — Jiri Paukrt" },
      {
        property: "og:description",
        content:
          "Filter projects by strategic models, microsimulation, major events and road safety.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { domain } = Route.useSearch();
  const { t } = useLang();
  const { projects, domainLabel } = useContent();
  const list = domain ? projects.filter((p) => p.domains.includes(domain)) : projects;
  const publications = projects.filter((p) => p.publication);

  return (
    <div className="px-4 pt-10 md:px-8">
      <PageIntro
        chart={t("PROJECTS", "PROJEKTY")}
        title={
          <>
            {t("Featured ", "Vybrané ")}
            <span className="font-bold">{t("Projects", "projekty")}</span>
            {t(" & Publications", " a publikace")}
          </>
        }
      >
        {t(
          "From national demand models for Ireland to vehicle-by-vehicle simulation of a single town centre.",
          "Od národních modelů poptávky pro Irsko po simulaci jednotlivých vozidel v centru jednoho města.",
        )}
      </PageIntro>

      <div
        className="mt-8 flex flex-wrap items-center gap-2"
        role="group"
        aria-label={t("Filter by domain", "Filtrovat podle oboru")}
      >
        <FilterChip
          active={!domain}
          label={t("All projects", "Všechny projekty")}
          count={projects.length}
          search={{}}
        />
        {DOMAINS.map((d) => (
          <FilterChip
            key={d.key}
            active={domain === d.key}
            label={domainLabel(d.key)}
            count={filterProjects(d.key).length}
            search={{ domain: d.key }}
          />
        ))}
      </div>

      <p className="mt-6 font-mono text-[11px] tracking-wider text-dim" aria-live="polite">
        {String(list.length).padStart(2, "0")}{" "}
        {t(
          list.length === 1 ? "PROJECT" : "PROJECTS",
          list.length === 1 ? "PROJEKT" : list.length < 5 ? "PROJEKTY" : "PROJEKTŮ",
        )}
      </p>

      {list.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <div className="glass mt-4 rounded-[20px] p-10 text-center">
          <p className="text-dim">
            {t("No projects in this category.", "V této kategorii nejsou žádné projekty.")}
          </p>
          <Link to="/projects" className="mt-3 inline-block text-sm text-cyan hover:underline">
            {t("Show all projects", "Zobrazit všechny projekty")}
          </Link>
        </div>
      )}

      <section className="mt-20" aria-labelledby="pubs">
        <p className="font-mono text-[11px] tracking-[0.25em] text-cyan/80">
          {t("PUBLICATIONS & CONFERENCE PAPERS", "PUBLIKACE A KONFERENČNÍ PŘÍSPĚVKY")}
        </p>
        <h2 id="pubs" className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
          {t("Papers & ", "Články a ")}
          <span className="font-bold">{t("Presentations", "přednášky")}</span>
        </h2>
        <ul className="mt-8 divide-y divide-star/10 border-y border-star/10">
          {publications.map((p) => (
            <li key={p.slug}>
              <Link
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="group grid gap-2 py-5 md:grid-cols-12 md:items-center md:gap-6"
              >
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-cyan md:col-span-3">
                  <BookOpen className="size-3.5" /> {p.publication!.venue.toUpperCase()}
                </span>
                <span className="md:col-span-7">
                  <span className="block text-base font-medium group-hover:text-cyan">
                    {p.publication!.title}
                  </span>
                  {p.publication!.titleCs && (
                    <span className="mt-0.5 block text-sm text-dim">
                      ({p.publication!.titleCs})
                    </span>
                  )}
                  {p.publication!.authors && (
                    <span className="mt-0.5 block text-sm text-dim">{p.publication!.authors}</span>
                  )}
                </span>
                <span className="hidden justify-end md:col-span-2 md:flex">
                  <ArrowRight className="size-4 text-dim group-hover:text-cyan" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function FilterChip({
  active,
  label,
  count,
  search,
}: {
  active: boolean;
  label: string;
  count: number;
  search: { domain?: DomainKey };
}) {
  return (
    <Link
      to="/projects"
      search={search}
      resetScroll={false}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 font-mono text-[11px] tracking-wider uppercase transition-colors duration-300",
        active
          ? "border-cyan bg-cyan/15 text-cyan"
          : "border-cyan/30 bg-void/60 text-star hover:border-cyan hover:bg-cyan/10 hover:text-cyan",
      )}
    >
      {label}{" "}
      <span className={cn("ml-1", active ? "text-cyan/70" : "text-dim")}>
        {String(count).padStart(2, "0")}
      </span>
    </Link>
  );
}
