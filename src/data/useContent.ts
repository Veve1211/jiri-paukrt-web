import { useMemo } from "react";

import { useLang } from "@/lib/i18n";
import {
  CAREER,
  DOMAINS,
  EDUCATION,
  PERSON,
  PROJECTS,
  TECH,
  type CareerEntry,
  type DomainKey,
  type Project,
  type Quadrant,
  type Tech,
} from "./portfolio";
import {
  CAREER_CS,
  DOMAINS_CS,
  EDUCATION_CS,
  PERSON_CS,
  PROJECTS_CS,
  QUADRANT_CS,
  REGION_CS,
  TECH_BLURB_CS,
} from "./portfolio.cs";

function localizeProject(p: Project): Project {
  const cs = PROJECTS_CS[p.slug];
  if (!cs) return p;
  const out: Project = {
    ...p,
    title: cs.title ?? p.title,
    client: cs.client ?? p.client,
    location: cs.location ?? p.location,
    summary: cs.summary ?? p.summary,
    highlights: cs.highlights ?? p.highlights,
    metrics: p.metrics.map((m, i) => ({ ...m, label: cs.metricLabels?.[i] ?? m.label })),
  };
  if (cs.role) out.role = cs.role;
  if (cs.usedFor) out.usedFor = cs.usedFor;
  if (p.publication && cs.venue) out.publication = { ...p.publication, venue: cs.venue };
  return out;
}

function localizeCareer(c: CareerEntry): CareerEntry {
  const cs = CAREER_CS[c.company];
  if (!cs) return c;
  return { ...c, years: cs.years ?? c.years, role: cs.role ?? c.role, location: cs.location ?? c.location, duties: cs.duties };
}

/** Portfolio content in the current language. */
export function useContent() {
  const { lang } = useLang();
  return useMemo(() => {
    const cs = lang === "cs";
    const projects = cs ? PROJECTS.map(localizeProject) : PROJECTS;
    const person = cs
      ? {
          ...PERSON,
          home: PERSON_CS.home,
          summary: PERSON_CS.summary,
          languages: PERSON_CS.languages,
          strengths: PERSON_CS.strengths,
          waysOfWorking: PERSON_CS.waysOfWorking,
        }
      : PERSON;
    const tech: Tech[] = cs ? TECH.map((t) => ({ ...t, blurb: TECH_BLURB_CS[t.name] ?? t.blurb })) : TECH;
    return {
      lang,
      person,
      projects,
      career: cs ? CAREER.map(localizeCareer) : CAREER,
      education: cs ? { ...EDUCATION, ...EDUCATION_CS } : EDUCATION,
      tech,
      getProject: (slug: string) => projects.find((p) => p.slug === slug),
      domainLabel: (k: DomainKey) => (cs ? DOMAINS_CS[k] : (DOMAINS.find((d) => d.key === k)?.label ?? k)),
      quadrantLabel: (q: Quadrant) => (cs ? QUADRANT_CS[q] : q),
      regionLabel: (r: string) => (cs ? (REGION_CS[r] ?? r) : r),
    };
  }, [lang]);
}
