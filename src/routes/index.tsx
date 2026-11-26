import { pageHead, personProfile } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";

import { HeroRoadNetwork } from "@/components/site/HeroRoadNetwork";
import { ProjectCover } from "@/components/site/ProjectCover";
import { Button } from "@/components/ui/button";
import { UK_MICROSIM_TOWNS } from "@/data/portfolio";
import { useContent } from "@/data/useContent";
import { useLang } from "@/lib/i18n";
import { spotlightMove } from "@/hooks/use-spotlight";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const head = pageHead(
      match,
      {
        title: "Jiri Paukrt | Principal Transportation Engineer | Transport Modelling",
        description:
          "Jiri Paukrt is a principal transportation modeller at SYSTRA, specialising in travel demand forecasting, traffic microsimulation and scheme evaluation.",
      },
      {
        title: "Jiří Paukrt | Dopravní modelování a plánování dopravy",
        description:
          "Ing. Jiří Paukrt, hlavní dopravní inženýr v SYSTRA. Dopravní modelování, prognózy poptávky, mikrosimulace a hodnocení dopravních projektů.",
      },
      "profile",
    );
    return {
      ...head,
      meta: [...head.meta, { name: "seznam-wmt", content: "xhTtQpmWvW9uVGZRCyfxKoysTzTmFjkI" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(personProfile(match.search.lang ?? "en")).replace(
            /</g,
            "\\u003c",
          ),
        },
      ],
    };
  },
  component: Index,
});

const FACTS = [
  { value: "27+", label: "Years in transport modelling", cs: "Let v dopravním modelování" },
  { value: "4", label: "Countries of practice", cs: "Země praxe" },
  { value: "2", label: "Commonwealth Games", cs: "Hry Commonwealthu" },
  { value: "4", label: "Papers & conference talks", cs: "Články a přednášky" },
];

function Index() {
  return (
    <>
      <Hero />
      <Bento />
      <CareerOverview />
      <Strengths />
    </>
  );
}

function Hero() {
  const { t, lang } = useLang();
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pt-10 pb-10 md:px-8 lg:min-h-[calc(100vh-90px)] lg:grid-cols-12">
      <section className="flex flex-col justify-center lg:col-span-5">
        <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan/30 bg-cyan/[0.08] py-1.5 pr-4 pl-2 font-mono text-[10.5px] tracking-[0.16em] text-cyan uppercase">
          <span className="rounded-full bg-cyan px-2 py-0.5 font-semibold text-void">SYSTRA</span>
          {t("Dublin · based in the Czech Republic", "Dublin · žije v Česku")}
        </p>
        <h1 className="text-[52px] leading-[0.95] font-semibold tracking-[-0.04em] text-balance sm:text-[76px]">
          {lang === "cs" && (
            <span className="mr-[0.25em] text-[0.55em] font-light tracking-[-0.02em] text-dim">
              Ing.
            </span>
          )}
          <span className="text-gradient">{t("Jiri Paukrt", "Jiří Paukrt")}</span>
          {lang === "en" && (
            <span className="text-[0.55em] font-light tracking-[-0.02em] text-dim">, Ing.</span>
          )}
          <span className="text-glow mt-4 block text-[26px] leading-tight font-semibold tracking-[-0.02em] sm:text-[38px]">
            {t("Principal Transportation Engineer", "Hlavní dopravní inženýr")}
          </span>
        </h1>
        <p className="mt-6 max-w-[460px] text-[16px] leading-relaxed text-starblue">
          {t(
            "27 years of transport modelling across Ireland, the UK, Australia and Central Europe — from national demand forecasting to junction-level microsimulation and post-opening scheme evaluation.",
            "27 let dopravního modelování v Irsku, Velké Británii, Austrálii a střední Evropě — od národních prognóz poptávky po mikrosimulace křižovatek a hodnocení staveb po jejich otevření.",
          )}
        </p>
        <dl className="mt-8 grid max-w-[500px] grid-cols-2 gap-2.5 sm:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} className="glass rounded-[16px] p-3.5">
              <dt className="sr-only">{t(f.label, f.cs)}</dt>
              <dd className="text-2xl font-semibold font-display text-star">{f.value}</dd>
              <dd className="mt-1 font-mono text-[9.5px] leading-snug tracking-wider text-dim uppercase">
                {t(f.label, f.cs)}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="glow" size="pill" className="font-medium">
            <a href="/Jiri-Paukrt-CV.pdf" download>
              {t("Download CV (PDF)", "Stáhnout CV (PDF, anglicky)")}
            </a>
          </Button>
          <Button asChild variant="glass" size="pill" className="font-normal">
            <Link to="/contact">{t("Get in touch →", "Napsat zprávu →")}</Link>
          </Button>
        </div>
      </section>
      <section className="relative flex items-center lg:col-span-7">
        <HeroRoadNetwork />
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bento overview: the CV at a glance, one tile per part of the site.

function Tile({
  to,
  className,
  children,
  label,
}: {
  to: "/career" | "/projects" | "/expertise" | "/contact" | "/network";
  className?: string;
  children: ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      onMouseMove={spotlightMove}
      className={cn(
        "group glass spotlight reveal flex flex-col rounded-[24px] p-6 transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="telemetry text-[10px] text-cyan">{label}</span>
        <ArrowUpRight className="size-4 text-dim transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
      </div>
      {children}
    </Link>
  );
}

function Bento() {
  const { t, lang } = useLang();
  const { projects, tech, education, techLabel, getProject } = useContent();
  const ukTowns = getProject("uk-microsimulation-models")?.highlights ?? UK_MICROSIM_TOWNS;
  const pubs = projects.filter((p) => p.publication);
  const tools = tech.map((x) => techLabel(x.name));
  return (
    <section aria-labelledby="overview" className="pt-6 pb-4">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="telemetry text-[11px] text-cyan">{t("At a glance", "Na první pohled")}</p>
        <h2 id="overview" className="mt-3 text-4xl font-light md:text-5xl">
          {t("The work, ", "Práce ")}
          <span className="font-semibold">{t("in brief", "ve zkratce")}</span>
        </h2>

        <div className="mt-10 grid auto-rows-[minmax(190px,auto)] gap-4 md:grid-cols-6">
          <Tile to="/career" label={t("Current role", "Současná pozice")} className="md:col-span-4">
            <h3 className="mt-6 text-3xl font-semibold md:text-4xl">
              {t("Principal Transportation Engineer", "Hlavní dopravní inženýr")}
            </h3>
            <p className="mt-2 text-starblue">
              {t(
                "SYSTRA Dublin · since 2008 · based in the Czech Republic",
                "SYSTRA Dublin · od roku 2008 · žije v Česku",
              )}
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-6 font-mono text-[10.5px] tracking-wider text-dim uppercase">
              {[t("Prague 1999", "Praha 1999"), "Leeds 2004", "Melbourne 2006", "Dublin 2008"].map(
                (stop, i) => (
                  <span key={stop} className="flex items-center gap-2">
                    {i > 0 && <span className="h-px w-6 bg-cyan/50" />}
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1",
                        i === 3 ? "border-cyan/50 text-cyan" : "border-star/15",
                      )}
                    >
                      {stop}
                    </span>
                  </span>
                ),
              )}
            </div>
          </Tile>

          <Tile
            to="/contact"
            label={t("Contact", "Kontakt")}
            className="bg-cyan/[0.06] md:col-span-2"
          >
            <p className="mt-6 text-xl leading-snug font-medium">
              {t(
                "Curious about one of the models or papers?",
                "Zajímá vás některý z modelů nebo článků?",
              )}
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-cyan">
              {t("Send a message", "Napsat zprávu")} <ArrowRight className="size-4" />
            </span>
          </Tile>

          <Tile
            to="/projects"
            label={t("Strategic models", "Strategické modely")}
            className="md:col-span-3"
          >
            <div className="-mx-6 mt-4 border-y border-star/10">
              <ProjectCover slug="nta-long-distance-model" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold">
              {t("NTA Regional Modelling System", "Regionální modelový systém NTA")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dim">
              {t(
                "The National Demand Forecasting Model and five regional multi-modal models behind transport planning in Ireland — plus the Long Distance Model for Ireland and Northern Ireland.",
                "Národní model prognózy poptávky a pět regionálních multimodálních modelů, o které se opírá plánování dopravy v Irsku — a k tomu model dálkové dopravy pro Irsko a Severní Irsko.",
              )}
            </p>
            <div className="mt-auto flex gap-6 pt-6">
              <Stat value="5" label={t("Regional models", "Regionální modely")} />
              <Stat
                value={t("~20k", "~20 tis.")}
                label={t("Travel-diary records (2022)", "Záznamů z cestovních deníků (2022)")}
              />
            </div>
          </Tile>

          <Tile
            to="/projects"
            label={t("Microsimulation", "Mikrosimulace")}
            className="md:col-span-3"
          >
            <div className="-mx-6 mt-4 border-y border-star/10">
              <ProjectCover slug="sydney-lane-cove-tunnel" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold">
              {t("From one tunnel to eleven towns", "Od tunelu po jedenáct měst")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dim">
              {t(
                "Sydney's Lane Cove Tunnel, Dandenong in Melbourne and town models across England and the Isle of Man.",
                "Tunel Lane Cove v Sydney, Dandenong v Melbourne a modely měst v Anglii a na ostrově Man.",
              )}
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
              {ukTowns.slice(0, 6).map((town) => (
                <span
                  key={town}
                  className="rounded-full border border-star/10 px-2.5 py-1 text-xs text-dim"
                >
                  {town}
                </span>
              ))}
              <span className="rounded-full border border-cyan/30 px-2.5 py-1 text-xs text-cyan">
                +{ukTowns.length - 6}
              </span>
            </div>
          </Tile>

          <Tile to="/projects" label={t("Publications", "Publikace")} className="md:col-span-2">
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-6xl font-semibold">{pubs.length}</span>
              <span className="text-sm text-dim">{t("papers & talks", "články a přednášky")}</span>
            </div>
            <ul className="mt-auto space-y-2 pt-6">
              {pubs.map((p) => (
                <li key={p.slug} className="flex gap-2 text-xs leading-snug text-starblue">
                  <BookOpen className="mt-0.5 size-3.5 shrink-0 text-cyan" />
                  <span className="line-clamp-1">{p.publication!.venue}</span>
                </li>
              ))}
            </ul>
          </Tile>

          <Tile
            to="/expertise"
            label={t("Tools", "Nástroje")}
            className="overflow-hidden md:col-span-2"
          >
            <h3 className="mt-6 text-2xl font-semibold">
              {t(`${tools.length} tools & methods`, `${tools.length} nástrojů a metod`)}
            </h3>
            <p className="mt-2 text-sm text-dim">
              {t(
                "Strategic assignment, microsimulation, appraisal, GIS and code.",
                "Strategické přidělení, mikrosimulace, hodnocení, GIS a programování.",
              )}
            </p>
            <div className="relative mt-auto -mx-6 overflow-hidden pt-6 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
              <div className="marquee flex w-max gap-2">
                {[...tools, ...tools].map((name, i) => (
                  <span
                    key={`${name}-${i}`}
                    aria-hidden={i >= tools.length ? true : undefined}
                    className="rounded-full border border-star/10 bg-star/[0.04] px-3 py-1.5 font-mono text-[11px] whitespace-nowrap text-starblue"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </Tile>

          <Tile to="/career" label={t("Education", "Vzdělání")} className="md:col-span-2">
            <GraduationCap className="mt-6 size-7 text-cyan" />
            <h3 className="mt-3 text-lg leading-snug font-semibold">{education.school}</h3>
            <p className="mt-auto pt-4 text-sm text-dim">
              {t(
                "Ing. — Transport Planning and Traffic Engineering",
                "Ing. — Dopravní plánování a dopravní inženýrství",
              )}
            </p>
          </Tile>
        </div>
      </div>
    </section>
  );
}

function CareerOverview() {
  const { t } = useLang();
  const { career } = useContent();
  return (
    <section aria-labelledby="career-overview" className="pt-16 pb-4">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="telemetry text-[11px] text-cyan">{t("Career", "Kariéra")}</p>
        <h2 id="career-overview" className="mt-3 text-4xl font-light md:text-5xl">
          {t("27 years, ", "27 let, ")}
          <span className="font-semibold">{t("four employers", "čtyři zaměstnavatelé")}</span>
        </h2>

        <div className="glass reveal mt-10 flex flex-col gap-3 rounded-[24px] border-cyan/30 p-6 md:flex-row md:items-center md:gap-8">
          <span className="w-fit rounded-full bg-cyan px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-void uppercase">
            {t("Latest · 2025", "Nejnověji · 2025")}
          </span>
          <p className="text-[15px] leading-relaxed text-star">
            {t(
              "New post-COVID trip rates for the National Transport Authority's 2022 base-year model update — the first in Ireland since the pandemic — presented at the European Transport Conference 2025 in Antwerp.",
              "Nové míry tvorby cest po covidu pro aktualizaci modelu National Transport Authority na rok 2022 — první v Irsku od pandemie — prezentované na European Transport Conference 2025 v Antverpách.",
            )}
          </p>
        </div>

        <ol className="relative mt-8 grid gap-4 lg:grid-cols-4">
          <span
            aria-hidden="true"
            className="absolute top-[30px] right-6 left-6 hidden h-[3px] bg-[repeating-linear-gradient(to_right,var(--cyan)_0_14px,transparent_14px_24px)] opacity-50 lg:block"
          />
          {career.map((c) => (
            <li key={c.company} className="glass reveal relative rounded-[24px] p-6">
              <span
                aria-hidden="true"
                className={cn(
                  "mb-4 block size-4 rounded-full border-2",
                  c.current ? "border-cyan bg-cyan shadow-dot" : "border-star/60 bg-void",
                )}
              />
              <p className="font-mono text-[11px] tracking-wider text-cyan uppercase">{c.years}</p>
              <h3 className="mt-2 text-xl leading-snug font-semibold">{c.role}</h3>
              <p className="mt-1 text-sm text-starblue">
                {c.company} · {c.location}
              </p>
              <ul className="mt-4 space-y-2">
                {c.duties.slice(0, c.current ? 3 : 2).map((d) => (
                  <li key={d} className="flex gap-2.5 text-[13px] leading-relaxed text-dim">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-cyan" />
                    {d}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <Link
          to="/career"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline"
        >
          {t("Full career and education", "Celá kariéra a vzdělání")}{" "}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function Strengths() {
  const { t } = useLang();
  const { person } = useContent();
  return (
    <section aria-labelledby="strengths" className="pt-10 pb-6">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="telemetry text-[11px] text-cyan">{t("Strengths", "Silné stránky")}</p>
        <h2 id="strengths" className="mt-3 text-4xl font-light md:text-5xl">
          {t("What Jiri ", "Co Jiří ")}
          <span className="font-semibold">{t("brings", "přináší")}</span>
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {person.strengths.map((s, i) => (
            <li
              key={s.title}
              onMouseMove={spotlightMove}
              className="glass spotlight reveal rounded-[24px] p-6"
            >
              <span className="font-mono text-[11px] text-cyan">0{i + 1}</span>
              <h3 className="mt-4 text-xl leading-snug font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-starblue">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-semibold text-star">{value}</div>
      <div className="mt-0.5 font-mono text-[10px] tracking-wider text-dim uppercase">{label}</div>
    </div>
  );
}
