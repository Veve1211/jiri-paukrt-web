import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";

import { NetworkMap } from "@/components/site/NetworkMap";
import { PageIntro } from "@/components/site/PageIntro";
import {
  CAREER,
  formatCoord,
  getLocation,
  LOCATIONS,
  projectsAt,
  REGIONS,
  type Region,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/network")({
  validateSearch: (search: Record<string, unknown>): { node?: string } => {
    const raw = search["node"];
    const node = typeof raw === "string" && getLocation(raw) ? raw : undefined;
    return node ? { node } : {};
  },
  head: () => ({
    meta: [
      { title: "Star Network Models — Jiri Paukrt Global Projects Map" },
      {
        name: "description",
        content:
          "Interactive star chart of Jiri Paukrt's transport modelling projects and career bases across Ireland, the UK, Australia, Czech Republic and Serbia.",
      },
      { property: "og:title", content: "Star Network Models — Jiri Paukrt" },
      {
        property: "og:description",
        content: "Explore every project node: national demand models, microsimulations, mega-events and road safety research.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NetworkPage,
});

const KIND_LABEL = { hq: "Dublin HQ", project: "Project node", base: "Career base", town: "Town model" } as const;

function NetworkPage() {
  const { node } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [region, setRegion] = useState<Region | undefined>(undefined);

  const select = (id: string | undefined) =>
    navigate({ search: id ? { node: id } : {}, replace: true, resetScroll: false });

  const loc = node ? getLocation(node) : undefined;

  return (
    <div className="px-4 pt-10 md:px-8">
      <PageIntro
        chart="CHART 02 — STAR NETWORK"
        title={
          <>
            Star Network <span className="font-bold">Models</span>
          </>
        }
      >
        Every star is a place where models were built, presented or run. Select a node to read its telemetry; filter by
        region to isolate a sector.
      </PageIntro>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by region">
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
                "rounded-full border px-4 py-2 font-mono text-[11px] tracking-wider uppercase transition-colors",
                on ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-star/10 bg-star/[0.03] text-dim hover:text-star",
              )}
            >
              {r ?? "All sectors"} <span className="ml-1 text-dim/70">{String(count).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="glass relative overflow-hidden rounded-[14px] lg:col-span-8">
          <div className="aspect-[5/3] w-full">
            <NetworkMap selected={node} region={region} onSelect={select} />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-star/10 px-4 py-3 font-mono text-[10px] tracking-wider text-dim">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-cyan" /> DUBLIN HQ</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-star" /> PROJECT NODE</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-starblue" /> CAREER BASE</span>
            <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-star/80" /> TOWN MODEL</span>
            <span className="flex items-center gap-1.5"><span className="h-px w-4 border-t border-dashed border-volt" /> CAREER PATH</span>
          </div>
        </div>

        <aside className="glass rounded-[14px] p-5 lg:col-span-4" aria-live="polite">
          {loc ? <LocationPanel id={loc.id} onClose={() => select(undefined)} /> : <Overview region={region} onSelect={select} />}
        </aside>
      </div>
    </div>
  );
}

function Overview({ region, onSelect }: { region?: Region | undefined; onSelect: (id: string) => void }) {
  const list = LOCATIONS.filter((l) => (!region || l.region === region) && l.kind !== "town");
  const towns = LOCATIONS.filter((l) => (!region || l.region === region) && l.kind === "town");
  return (
    <div>
      <div className="telemetry text-[10px] text-cyan">Network overview</div>
      <h2 className="mt-2 text-xl font-medium">{region ?? "All sectors"}</h2>
      <p className="mt-1 text-sm text-dim">Select a star on the chart or from the list below.</p>
      <ul className="mt-5 divide-y divide-star/10">
        {list.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              onClick={() => onSelect(l.id)}
              className="flex w-full items-center justify-between gap-3 py-3 text-left hover:text-cyan"
            >
              <span>
                <span className="block text-sm font-medium">{l.name}</span>
                <span className="telemetry block text-[9.5px] text-dim">{KIND_LABEL[l.kind]} · {l.country}</span>
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
          <div className="telemetry text-[9.5px] text-dim">Town microsimulations · {towns.length}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {towns.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelect(t.id)}
                className="rounded-full border border-star/10 px-2.5 py-1 text-xs text-dim hover:border-cyan/40 hover:text-cyan"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {list.length === 0 && towns.length === 0 && (
        <p className="mt-6 text-sm text-dim">No nodes in this sector yet.</p>
      )}
    </div>
  );
}

function LocationPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const loc = getLocation(id)!;
  const projects = projectsAt(id);
  const roles = CAREER.filter((c) => c.locationId === id);
  return (
    <div className="animate-in fade-in-0">
      <div className="flex items-start justify-between">
        <div className="telemetry text-[10px] text-cyan">{KIND_LABEL[loc.kind]} · {loc.region}</div>
        <button type="button" onClick={onClose} className="rounded-full p-1 text-dim hover:bg-star/10 hover:text-star" aria-label="Back to overview">
          <X className="size-4" />
        </button>
      </div>
      <h2 className="mt-2 text-2xl font-medium">{loc.name}</h2>
      <p className="text-sm text-dim">{loc.country}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-[12px] border border-star/10 bg-star/[0.03] p-3">
          <div className="font-mono text-[11px] text-star">{formatCoord(loc.lat, loc.lon)}</div>
          <div className="telemetry mt-1 text-[9px] text-dim">Coordinates</div>
        </div>
        <div className="rounded-[12px] border border-cyan/30 bg-cyan/[0.06] p-3">
          <div className="text-xl font-bold text-cyan">{String(projects.length).padStart(2, "0")}</div>
          <div className="telemetry mt-1 text-[9px] text-dim">Linked missions</div>
        </div>
      </div>

      {roles.map((r) => (
        <div key={r.company} className="mt-4 rounded-[12px] border border-volt/30 bg-volt/[0.08] p-3">
          <div className="telemetry text-[9.5px] text-starblue">{r.years}</div>
          <div className="mt-1 text-sm font-medium">{r.role}</div>
          <div className="text-xs text-dim">{r.company}</div>
        </div>
      ))}
      {loc.id === "prague" && (
        <p className="mt-3 text-xs text-dim">Also home to ČVUT, where Jiri earned his Ing. in Transport Planning and Traffic Engineering.</p>
      )}

      {projects.length > 0 && (
        <div className="mt-5">
          <div className="telemetry text-[9.5px] text-dim">Missions at this node</div>
          <ul className="mt-2 space-y-2">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group flex items-center justify-between gap-3 rounded-[12px] border border-star/10 bg-star/[0.03] p-3 hover:border-cyan/40"
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
