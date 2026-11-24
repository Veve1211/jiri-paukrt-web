import type { Method } from "@/components/site/MethodIllustration";

export const METHOD_CAPTION: Record<Method, string> = {
  calibration: "Calibration: modelled flows checked against observed counts",
  matrix: "Demand: trips between zones held in an origin–destination matrix",
  bandwidth: "Assignment: traffic loaded onto the road network",
  beforeAfter: "Evaluation: how traffic moved after a scheme opened",
  junction: "Microsimulation: individual vehicles through a signalised junction",
  profile: "Demand over the day: arrival and departure peaks",
};

export const METHOD_CAPTION_CS: Record<Method, string> = {
  calibration: "Kalibrace: modelované intenzity porovnané se sčítáním dopravy",
  matrix: "Poptávka: cesty mezi zónami v matici zdrojů a cílů",
  bandwidth: "Přidělení: doprava zatížená na silniční síť",
  beforeAfter: "Hodnocení: jak se doprava změnila po otevření stavby",
  junction: "Mikrosimulace: jednotlivá vozidla na světelné křižovatce",
  profile: "Poptávka během dne: špičky příchodů a odchodů",
};
