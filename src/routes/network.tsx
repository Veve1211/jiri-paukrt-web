import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";

import { NetworkMap } from "@/components/site/NetworkMap";
import { PageIntro } from "@/components/site/PageIntro";
import { getLocation, LOCATIONS, projectsAt, REGIONS, type Region } from "@/data/portfolio";
import { useContent } from "@/data/useContent";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/network")({
  validateSearch: (search: Record<string, unknown>): { node?: string } => {
    const raw = search["node"];
    const node = typeof raw === "string" && getLocation(raw) ? raw : undefined;
    return node ? { node } : {};
  },
  head: () => ({
    meta: [
      { title: "Project Map — Jiri Paukrt" },
      {
        name: "description",
        content:
          "Interactive map of Jiri Paukrt's transport modelling projects and career bases across Ireland, the UK, Australia and Central Europe.",
      },
      { property: "og:title", content: "Project Map — Jiri Paukrt" },
      {
        property: "og:description",
        content:
          "Where the models were built: national demand models, microsimulations, major events and road safety research.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NetworkPage,
});

const KIND_LABEL = {
  hq: "Current employer",
  project: "Project",
  base: "Career base",
  town: "Town model",
} as const;
const KIND_LABEL_CS = {
  hq: "Současný zaměstnavatel",
  project: "Projekt",
  base: "Kariérní zastávka",
  town: "Model města",
} as const;
function NetworkPage() {
  const { node } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [hovered, setHovered] = useState<string | undefined>(undefined);

  const select = (id: string | undefined) =>
    navigate({ search: id ? { node: id } : {}, replace: true, resetScroll: false });

  const loc = node ? getLocation(node) : undefined;
  const { t } = useLang();
  const { regionLabel, countryLabel, cityLabel } = useContent();

  return (
    <div className="px-4 pt-10 md:px-8">
      <PageIntro
        chart={t("PROJECT MAP", "MAPA PROJEKTŮ")}
        title={
          <>
            {t("Where the ", "Kde ")}
            <span className="font-bold">{t("models", "modely")}</span>
            {t(" were built", " vznikaly")}
          </>
        }
      >
        {t(
          "Every point is a place where Jiri built, presented or ran a model. Select a place to see the projects and roles linked to it, or filter by country.",
          "Každý bod je místo, kde Jiří vytvářel, prezentoval nebo provozoval model. Vyberte místo a uvidíte s ním spojené projekty a pozice, nebo filtrujte podle země.",
        )}
      </PageIntro>

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label={t("Filter by region", "Filtrovat podle země")}
      >
        {[undefined, ...REGIONS].map((r) => {
          const count = r ? LOCATIONS.filter((l) => l.region === r).length : LOCATIONS.length;
          const on = region === r;
          return (
            <button
              key={r ?? "all"}
              type="button"
              aria-pressed={on}
              onClick={() => setRegion(r)}
              className={cn(
                "rounded-full border px-4 py-2 font-mono text-[11px] tracking-wider uppercase transition-colors duration-300",
                on
                  ? "border-cyan/40 bg-cyan/10 text-cyan"
                  : "border-star/10 bg-star/[0.03] text-dim hover:border-cyan/40 hover:text-star",
              )}
            >
              {r ? regionLabel(r) : t("All places", "Všechna místa")}{" "}
              <span className={cn("ml-1", on ? "text-cyan" : "text-dim")}>
                {String(count).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="glass relative overflow-hidden rounded-[20px] lg:col-span-8">
          <div className="aspect-[5/3] w-full">
            <NetworkMap
              selected={node}
              region={region}
              onSelect={select}
              hovered={hovered}
              onHover={setHovered}
            />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-star/10 px-4 py-3 font-mono text-[10px] tracking-wider text-dim">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-cyan" />{" "}
              {t("CURRENT EMPLOYER", "SOUČASNÝ ZAMĚSTNAVATEL")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-star" /> {t("PROJECT", "PROJEKT")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-starblue" />{" "}
              {t("CAREER BASE", "KARIÉRNÍ ZASTÁVKA")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-star/80" /> {t("TOWN MODEL", "MODEL MĚSTA")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-px w-4 border-t border-dashed border-volt" />{" "}
              {t("CAREER PATH", "KARIÉRNÍ CESTA")}
            </span>
            <span className="ml-auto text-cyan">
              {t("POINT AT A PLACE, THEN CLICK", "NAJEĎTE NA MÍSTO A KLIKNĚTE")}
            </span>
          </div>
        </div>

        <aside className="glass rounded-[20px] p-5 lg:col-span-4" aria-live="polite">
          {loc ? (
            <LocationPanel id={loc.id} onClose={() => select(undefined)} />
          ) : (
            <Overview region={region} onSelect={select} onHover={setHovered} hovered={hovered} />
          )}
        </aside>
      </div>
    </div>
  );
}

function Overview({
  region,
  onSelect,
  onHover,
  hovered,
}: {
  region?: Region | undefined;
  onSelect: (id: string) => void;
  onHover: (id: string | undefined) => void;
  hovered?: string | undefined;
}) {
  const { t, lang } = useLang();
  const { regionLabel, countryLabel, cityLabel } = useContent();
  const kind = lang === "cs" ? KIND_LABEL_CS : KIND_LABEL;
  const country = countryLabel;
  const list = LOCATIONS.filter((l) => (!region || l.region === region) && l.kind !== "town");
  const towns = LOCATIONS.filter((l) => (!region || l.region === region) && l.kind === "town");
  return (
    <div>
      <div className="telemetry text-[10px] text-cyan">{t("Overview", "Přehled")}</div>
      <h2 className="mt-2 text-xl font-medium">
        {region ? regionLabel(region) : t("All places", "Všechna místa")}
      </h2>
      <p className="mt-1 text-sm text-dim">
        {t(
          "Select a place on the map or from the list below.",
          "Vyberte místo na mapě nebo v seznamu níže.",
        )}
      </p>
      <ul className="mt-5 divide-y divide-star/10">
        {list.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              onClick={() => onSelect(l.id)}
              onMouseEnter={() => onHover(l.id)}
              onMouseLeave={() => onHover(undefined)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-2 py-3 text-left transition-colors hover:bg-cyan/10 hover:text-cyan",
                hovered === l.id && "bg-cyan/10 text-cyan",
              )}
            >
              <span>
                <span className="block text-sm font-medium">{cityLabel(l.name)}</span>
                <span className="telemetry block text-[9.5px] text-dim">
                  {kind[l.kind]} · {country(l.country)}
                </span>
              </span>
              <span className="font-mono text-[10px] text-dim">
                {String(projectsAt(l.id).length).padStart(2, "0")}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {towns.length > 0 && (
        <div className="mt-4">
          <div className="telemetry text-[9.5px] text-dim">
            {t("Town microsimulations", "Mikrosimulace měst")} · {towns.length}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {towns.map((town) => (
              <button
                key={town.id}
                type="button"
                onClick={() => onSelect(town.id)}
                onMouseEnter={() => onHover(town.id)}
                onMouseLeave={() => onHover(undefined)}
                className={cn(
                  "rounded-full border border-star/10 px-2.5 py-1 text-xs text-dim transition-colors hover:border-cyan/40 hover:text-cyan",
                  hovered === town.id && "border-cyan/40 text-cyan",
                )}
              >
                {town.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {list.length === 0 && towns.length === 0 && (
        <p className="mt-6 text-sm text-dim">
          {t("No places in this filter.", "Žádná místa pro tento filtr.")}
        </p>
      )}
    </div>
  );
}

function LocationPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const loc = getLocation(id)!;
  const { t, lang } = useLang();
  const { career, getProject, regionLabel, countryLabel, cityLabel } = useContent();
  const projects = projectsAt(id).map((p) => getProject(p.slug) ?? p);
  const roles = career.filter((c) => c.locationId === id);
  const kind = lang === "cs" ? KIND_LABEL_CS : KIND_LABEL;
  const country = countryLabel;
  return (
    <div className="animate-in fade-in-0">
      <div className="flex items-start justify-between">
        <div className="telemetry text-[10px] text-cyan">
          {kind[loc.kind]} · {regionLabel(loc.region)}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-dim hover:bg-star/10 hover:text-star"
          aria-label={t("Back to overview", "Zpět na přehled")}
        >
          <X className="size-4" />
        </button>
      </div>
      <h2 className="mt-2 text-2xl font-medium">{cityLabel(loc.name)}</h2>
      <p className="text-sm text-dim">{country(loc.country)}</p>
      <div className="mt-4 inline-flex items-baseline gap-2 rounded-[10px] border border-cyan/30 bg-cyan/[0.06] px-3 py-2">
        <span className="text-xl font-bold text-cyan">{projects.length}</span>
        <span className="telemetry text-[9px] text-dim">
          {t(projects.length === 1 ? "Linked project" : "Linked projects", "Propojené projekty")}
        </span>
      </div>

      {roles.map((r) => (
        <div
          key={r.company}
          className="mt-4 rounded-[14px] border border-volt/30 bg-volt/[0.08] p-3"
        >
          <div className="telemetry text-[9.5px] text-starblue">{r.years}</div>
          <div className="mt-1 text-sm font-medium">{r.role}</div>
          <div className="text-xs text-dim">{r.company}</div>
        </div>
      ))}
      {loc.id === "prague" && (
        <p className="mt-3 text-xs text-dim">
          {t(
            "Also home to ČVUT, where Jiri earned his Ing. in Transport Planning and Traffic Engineering.",
            "Také sídlo ČVUT, kde Jiří získal titul Ing. v oboru dopravní plánování a dopravní inženýrství.",
          )}
        </p>
      )}

      {projects.length > 0 && (
        <div className="mt-5">
          <div className="telemetry text-[9.5px] text-dim">
            {t("Projects here", "Projekty zde")}
          </div>
          <ul className="mt-2 space-y-2">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group flex items-center justify-between gap-3 rounded-[14px] border border-star/10 bg-star/[0.03] p-3 hover:border-cyan/40"
                >
                  <span>
                    <span className="telemetry block text-[9px] text-cyan">{p.code}</span>
                    <span className="block text-sm font-medium">{p.title}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-dim group-hover:text-cyan" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
