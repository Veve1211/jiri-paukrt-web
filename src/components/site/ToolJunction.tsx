import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { useState, type ComponentType } from "react";

import { type Quadrant } from "@/data/portfolio";
import { useContent } from "@/data/useContent";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Tools shown as a road junction: four approaches, each with a direction sign
 * listing the tools of one discipline. Selecting a tool opens its description.
 */

const ARMS: { quadrant: Quadrant; Arrow: ComponentType<{ className?: string }>; area: string }[] = [
  { quadrant: "Microsimulation", Arrow: ArrowUp, area: "md:col-start-2 md:row-start-1" },
  { quadrant: "Strategic Demand", Arrow: ArrowRight, area: "md:col-start-3 md:row-start-2" },
  { quadrant: "Appraisal", Arrow: ArrowDown, area: "md:col-start-2 md:row-start-3" },
  { quadrant: "GIS & Code", Arrow: ArrowLeft, area: "md:col-start-1 md:row-start-2" },
];

function Junction({ active }: { active: Quadrant | null }) {
  const arm = (q: Quadrant) => (active === q ? "stroke-cyan" : "stroke-star/35");
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden="true">
      {/* approaches */}
      <path d="M78 0V62M122 0V62" strokeWidth="1.4" className={arm("Microsimulation")} />
      <path d="M100 0V48" strokeDasharray="8 6" className={arm("Microsimulation")} />
      <path d="M138 78H200M138 122H200" strokeWidth="1.4" className={arm("Strategic Demand")} />
      <path d="M152 100H200" strokeDasharray="8 6" className={arm("Strategic Demand")} />
      <path d="M78 138V200M122 138V200" strokeWidth="1.4" className={arm("Appraisal")} />
      <path d="M100 152V200" strokeDasharray="8 6" className={arm("Appraisal")} />
      <path d="M0 78H62M0 122H62" strokeWidth="1.4" className={arm("GIS & Code")} />
      <path d="M0 100H48" strokeDasharray="8 6" className={arm("GIS & Code")} />
      {/* roundabout */}
      <circle cx="100" cy="100" r="40" strokeWidth="1.4" className="stroke-star/50" />
      <circle cx="100" cy="100" r="18" strokeWidth="1.4" className="fill-cyan/10 stroke-cyan" />
      <text x="100" y="104" textAnchor="middle" fontSize="10" letterSpacing="1" className="fill-cyan font-mono">
        TOOLS
      </text>
    </svg>
  );
}

export function ToolJunction() {
  const { t } = useLang();
  const { tech: TECH, getProject, quadrantLabel, techLabel } = useContent();
  const [selected, setSelected] = useState(TECH[0]?.name ?? "");
  const [hoverArm, setHoverArm] = useState<Quadrant | null>(null);
  const tech = TECH.find((t) => t.name === selected) ?? TECH[0]!;
  const activeArm = hoverArm ?? tech.quadrant;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="glass rounded-[20px] p-4 md:p-6 lg:col-span-8">
        <div className="grid gap-3 md:grid-cols-[1fr_minmax(140px,180px)_1fr] md:grid-rows-[auto_minmax(140px,180px)_auto]">
          <div className="hidden md:col-start-2 md:row-start-2 md:block">
            <Junction active={activeArm} />
          </div>
          {ARMS.map(({ quadrant, Arrow, area }) => (
            <section
              key={quadrant}
              onMouseEnter={() => setHoverArm(quadrant)}
              onMouseLeave={() => setHoverArm(null)}
              className={cn(
                "self-center rounded-[12px] border-2 bg-[#1c4f9c] p-3 shadow-lg transition-colors",
                activeArm === quadrant ? "border-star" : "border-star/50",
                area,
              )}
              aria-label={quadrantLabel(quadrant)}
            >
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold tracking-wide text-white">
                <Arrow className="size-4" /> {quadrantLabel(quadrant)}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TECH.filter((x) => x.quadrant === quadrant).map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    aria-pressed={t.name === selected}
                    onClick={() => setSelected(t.name)}
                    className={cn(
                      "rounded-[6px] border px-2 py-1 text-left text-xs font-medium transition-colors",
                      t.name === selected
                        ? "border-white bg-white text-[#0f2443]"
                        : "border-white/40 text-white hover:bg-white/15",
                    )}
                  >
                    {techLabel(t.name)}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="glass rounded-[20px] p-5 lg:col-span-4" aria-live="polite">
        <div className="telemetry text-[10px] text-cyan">{quadrantLabel(tech.quadrant)}</div>
        <h3 className="mt-2 text-2xl font-medium">{techLabel(tech.name)}</h3>
        <p className="mt-2 text-sm leading-relaxed text-dim">{tech.blurb}</p>
        {tech.projects && (
          <div className="mt-4">
            <div className="telemetry text-[9.5px] text-dim">{t("Used on", "Použito u")}</div>
            {tech.projects.map((slug) => {
              const p = getProject(slug)!;
              return (
                <Link key={slug} to="/projects/$slug" params={{ slug }} className="mt-1 block text-sm text-cyan hover:underline">
                  {p.title} →
                </Link>
              );
            })}
          </div>
        )}
        <p className="mt-6 border-t border-star/10 pt-4 text-xs leading-relaxed text-dim">
          {t("Choose a tool on one of the direction signs to read what it is used for.", "Vyberte nástroj na některé ze směrových cedulí a přečtěte si, k čemu slouží.")}
        </p>
      </div>
    </div>
  );
}
