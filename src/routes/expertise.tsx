import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

import { CorridorSimulator } from "@/components/site/CorridorSimulator";
import { PageIntro } from "@/components/site/PageIntro";
import { ToolJunction } from "@/components/site/ToolJunction";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/expertise")({
  head: ({ match }) =>
    pageHead(
      match,
      {
        title: "Expertise & Tools — Jiri Paukrt",
        description:
          "Strategic demand modelling, traffic microsimulation, appraisal, GIS and programming — plus an illustrative corridor simulator showing how speed and conflicts respond to demand.",
      },
      {
        title: "Dopravní modelování a simulační nástroje — Jiří Paukrt",
        description:
          "Modelování dopravní poptávky, mikrosimulace, hodnocení projektů a GIS. Vyzkoušejte simulátor dopravy na koridoru.",
      },
      "website",
    ),
  component: ExpertisePage,
});

function ExpertisePage() {
  const { t } = useLang();
  return (
    <div className="px-4 pt-10 md:px-8">
      <PageIntro
        chart={t("EXPERTISE", "ODBORNOST")}
        title={
          <>
            {t("Expertise & ", "Odbornost a ")}
            <span className="font-bold">{t("tools", "nástroje")}</span>
          </>
        }
      >
        {t(
          "Strategic assignment, variable demand, microsimulation, appraisal and GIS — the tools behind the projects.",
          "Strategické přidělení dopravy, proměnná poptávka, mikrosimulace, hodnocení a GIS — nástroje, na kterých stojí projekty.",
        )}
      </PageIntro>
      <div className="mt-10">
        <ToolJunction />
      </div>

      <section className="mt-20" aria-labelledby="sim">
        <p className="font-mono text-[11px] tracking-[0.25em] text-cyan/80">
          {t("TRY IT — ILLUSTRATIVE MODEL", "VYZKOUŠEJTE — ILUSTRATIVNÍ MODEL")}
        </p>
        <h2 id="sim" className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
          {t("Corridor ", "Simulátor ")}
          <span className="font-bold">{t("Flow Simulator", "dopravy v koridoru")}</span>
        </h2>
        <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-dim">
          {t(
            "Push demand towards capacity and watch speeds fall and conflicts climb — then switch on interventions to see what they recover.",
            "Zvyšte poptávku ke kapacitě a sledujte, jak klesá rychlost a přibývá konfliktů — pak zapněte opatření a uvidíte, co zlepší.",
          )}
        </p>
        <div className="mt-8">
          <CorridorSimulator />
        </div>
      </section>
    </div>
  );
}
