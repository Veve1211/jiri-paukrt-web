import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { domainLabel, type Project } from "@/data/portfolio";
import { spotlightMove } from "@/hooks/use-spotlight";

export function ProjectCard({ project }: { project: Project }) {
  const lead = project.metrics[0] ?? { value: project.code, label: project.region };
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      onMouseMove={spotlightMove}
      className="group glass spotlight reveal flex h-full flex-col rounded-[20px] p-6 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <span className="telemetry text-[10px] text-cyan">{project.location}</span>
        
      </div>
      <h3 className="mt-4 text-xl leading-snug font-medium">{project.title}</h3>
      <p className="mt-1 text-xs text-dim">
        {project.client}
        {project.years && <> · {project.years}</>}
      </p>
      {project.role && (
        <p className="mt-3 text-xs leading-snug text-starblue">
          <span className="telemetry mr-1.5 text-[9px] text-cyan">Role</span>
          {project.role}
        </p>
      )}
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-dim">{project.summary}</p>
      <div className="mt-auto pt-5">
        <div className="flex items-end justify-between gap-3 border-t border-star/10 pt-4">
          <div>
            <div className="text-2xl font-bold">{lead.value}</div>
            <div className="telemetry text-[9px] text-dim">{lead.label}</div>
          </div>
          <span className="inline-flex items-center gap-1 text-sm text-cyan">
            Details <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.domains.map((d) => (
            <span key={d} className="rounded-full border border-star/10 px-2 py-0.5 font-mono text-[9.5px] tracking-wider text-dim uppercase">
              {domainLabel(d)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
