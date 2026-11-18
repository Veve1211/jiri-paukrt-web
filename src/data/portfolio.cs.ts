// Czech translations of the portfolio content. Keys mirror portfolio.ts; anything
// missing here falls back to English. Keep facts identical to the English source.

import type { DomainKey, Quadrant } from "./portfolio";

export const PERSON_CS = {
  role: "Principal Transportation Engineer (hlavní dopravní inženýr)",
  home: "Česká republika",
  summary:
    "Dopravní modelář s 27 lety praxe v Irsku, Velké Británii, Austrálii a České republice. Řídil vývoj a kalibraci irského národního modelu prognózy poptávky (National Demand Forecasting Model) pro National Transport Authority a opírá se o více než deset let mikrosimulačního modelování, modelů proměnné poptávky, GIS analýz a programování.",
  languages: [
    { name: "Čeština", level: "Rodilý mluvčí" },
    { name: "Angličtina", level: "Profesionální pracovní úroveň" },
  ],
  strengths: [
    {
      title: "Národní modely od začátku do konce",
      body: "Řídil vývoj a kalibraci irského národního modelu prognózy poptávky a vytvořil jeho podmodely zdrojů a cílů cest a dálkové dopravy.",
    },
    {
      title: "Strategicky i mikroskopicky",
      body: "Modely proměnné poptávky a přidělení dopravy v SATURNu a k tomu přes deset let mikrosimulací — od center měst po koridor tunelu Lane Cove.",
    },
    {
      title: "Vytváří si vlastní nástroje",
      body: "Programy v Pythonu, VBA, SQL a Ruby, které automatizují vývoj modelů, zpracování dat a reporting.",
    },
    {
      title: "Mezinárodní praxe a publikace",
      body: "Praxe ve čtyřech zemích; články a přednášky s NTA, na ETC (2019 a 2025), STAR a ICTTE.",
    },
  ],
  waysOfWorking: [
    "Řízení vývoje, kalibrace a validace modelů pro národní klienty, jako je NTA",
    "Analýza a zpracování velkých datových souborů, GIS pro studie nehodovosti a dostupnosti",
    "Prezentace metod a výsledků na mezinárodních konferencích (ETC, STAR, ICTTE)",
    "Reprodukovatelné modelování: automatizované datové procesy a kontroly v Pythonu, SQL a VBA",
  ],
};

export const DOMAINS_CS: Record<DomainKey, string> = {
  national: "Strategické modely",
  microsim: "Mikrosimulace",
  "mega-events": "Velké akce",
  "gis-safety": "Bezpečnost silničního provozu",
};

export const REGION_CS: Record<string, string> = {
  Ireland: "Irsko",
  UK: "Velká Británie",
  Australia: "Austrálie",
  "Czech Republic": "Česko",
};

interface ProjectCs {
  title?: string;
  client?: string;
  location?: string;
  summary?: string;
  highlights?: string[];
  role?: string;
  usedFor?: string;
  metricLabels?: string[];
  venue?: string;
}

export const PROJECTS_CS: Record<string, ProjectCs> = {
  "nta-national-demand-model": {
    title: "Národní model prognózy poptávky (NDFM)",
    client: "National Transport Authority (NTA), Irsko",
    location: "Dublin, Irsko",
    summary:
      "Regional Modelling System irské NTA je strategický nástroj, o který se opírá plánování dopravy v celém Irsku: národní model prognózy poptávky zásobuje pět regionálních multimodálních modelů, které dohromady pokrývají celou Irskou republiku.",
    highlights: [
      "Řídil vývoj a kalibraci národního modelu prognózy poptávky (NDFM)",
      "Vytvořil model zdrojů a cílů cest (National Trip End Model) a model poptávky pro hlavní přístavy a letiště v Irsku a Severním Irsku",
      "Podílel se na vývoji a kalibraci pěti regionálních modelů: východ, západ, středozápad, jihovýchod a jihozápad",
      "Aktualizace na rok 2022: první míry tvorby cest v Irsku po covidu, z asi 20 000 záznamů cestovních deníků",
      "Prezentováno na European Transport Conference 2025 v Antverpách",
    ],
    role: "Řídil vývoj a kalibraci NDFM; vytvořil National Trip End Model",
    usedFor: "NTA podle něj posuzuje budoucí varianty dopravy a využití území na národní i regionální úrovni.",
    metricLabels: ["Regionální multimodální modely", "Záznamy cestovních deníků (2022)"],
    venue: "NTA, září 2025 · prezentováno na ETC 2025, Antverpy",
  },
  "nta-long-distance-model": {
    title: "Model dálkové dopravy NTA",
    client: "National Transport Authority (NTA) · SYSTRA",
    location: "Dublin, Irsko",
    summary:
      "Model meziměstských dálkových cest NTA po Irsku a Severním Irsku autem, autobusem, vlakem a nákladními vozidly. Novější práce zpřesnila prognózu dálkové železniční poptávky, takže model umí testovat víc vlaků, vyšší kapacitu nebo změny jízdného.",
    highlights: [
      "Pokrývá Irsko a Severní Irsko",
      "Druhy dopravy: auto, autobus, vlak a nákladní vozidla",
      "Důraz na dálkovou železniční poptávku",
      "Prezentováno na ETC 2019 v Dublinu se Seanem Kearnsem (SYSTRA)",
    ],
    role: "Vytvořil model dálkové poptávky; spoluprezentující na ETC 2019",
    usedFor: "Testování změn na dálkové železnici — víc vlaků, vyšší kapacita nebo nové jízdné.",
    metricLabels: ["Modelované druhy dopravy", "ETC Dublin"],
  },
  "glasgow-m74-evaluation": {
    title: "Dostavba dálnice M74 — 5 let po otevření",
    location: "Glasgow, Skotsko",
    summary:
      "Hodnocení dostavby dálnice M74 pět let po otevření pro Transport Scotland — asi 8 km dálnice přes jižní část Glasgow, otevřené v červnu 2011. Skutečná doprava se porovnávala s tím, co měla stavba přinést.",
    highlights: [
      "Asi 8 km nové dálnice spojující M74 a M8",
      "Otevřena pro provoz v červnu 2011",
      "Hodnocení přerozdělení dopravy a odlehčení dálnice M8",
      "Prezentováno na konferenci STAR 2017 s Robertem Allanem a Iainem Clementem",
    ],
    role: "Spoluautor hodnocení pět let po otevření",
    usedFor: "Ověření, zda nová dálnice pět let po otevření přinesla očekávané odlehčení dopravy.",
    metricLabels: ["Nová dálnice", "Po otevření"],
  },
  "road-safety-traffic-conflicts": {
    title: "Bezpečnost provozu pomocí dopravních konfliktů",
    client: "S Centrem dopravního výzkumu (CDV)",
    location: "Brno, Česko",
    summary:
      "Pilotní studie porovnávající dopravní konflikty z mikrosimulace v S-Paramics s konflikty pozorovanými v terénu českou metodou dopravních konfliktů — ověření mikrosimulace jako nástroje prevence, který nemusí čekat roky na statistiky nehod.",
    highlights: [
      "Světelně řízené křižovatky v Brně",
      "Mikrosimulace v S-Paramics, ukazatel time-to-conflict",
      "Simulované a pozorované konflikty",
      "Prezentováno na ICTTE v Bělehradě, listopad 2014",
    ],
    role: "Spoluautor",
    usedFor: "Ověření, zda mikrosimulace dokáže odhalit rizikové křižovatky dřív, než dojde k nehodám.",
    metricLabels: ["Porovnané metody", "ICTTE Bělehrad"],
  },
  "commonwealth-games": {
    title: "Poptávka návštěvníků Her Commonwealthu",
    location: "Glasgow a Birmingham, Velká Británie",
    summary:
      "Modelování a plánování poptávky návštěvníků pro dvoje Hry Commonwealthu — prognóza, jak se návštěvníci v den akce dopraví na sportoviště.",
    highlights: ["Hry Commonwealthu Glasgow 2014", "Hry Commonwealthu Birmingham 2022", "Modelování poptávky návštěvníků"],
    role: "Podílel se na modelování poptávky návštěvníků",
    usedFor: "Plánování, jak se návštěvníci během Her dopraví na sportoviště.",
    metricLabels: ["Ročníky Her", "Roky konání"],
  },
  "sydney-lane-cove-tunnel": {
    title: "Mikrosimulace tunelu Lane Cove",
    location: "Sydney, Austrálie",
    summary:
      "Mikrosimulační model povrchové silniční sítě podél celého koridoru tunelu Lane Cove v Sydney, sloužící k posouzení dopravních opatření během stavby 3,6 km dlouhého dvoutubusového tunelu. V té době šlo o největší mikrosimulační model v Austrálii co do rozlohy.",
    highlights: [
      "Pokrýval povrchovou síť podél celého koridoru tunelu",
      "Sloužil k posouzení dopravních opatření během stavby",
      "V té době největší mikrosimulační model v Austrálii co do rozlohy",
      "Tunel otevřen pro provoz v březnu 2007",
    ],
    role: "Podílel se na vývoji mikrosimulačního modelu",
    usedFor: "Posouzení dopravních opatření po dobu stavby tunelu.",
    metricLabels: ["Dvoutubusový tunel", "Otevřen pro provoz"],
  },
  "melbourne-dandenong": {
    title: "Mikrosimulace revitalizace Dandenongu",
    location: "Dandenong, Melbourne, Austrálie",
    summary:
      "Mikrosimulační model Dandenongu v Melbourne pro testování variant revitalizace — změn využití území, úprav silniční sítě a provozu veřejné dopravy — u jednoho z tehdy největších revitalizačních projektů v Austrálii.",
    highlights: [
      "Odpovídal za vývoj mikrosimulačního modelu",
      "Testoval varianty využití území, silniční sítě a veřejné dopravy",
      "Realizováno s Hyder Consulting",
    ],
    role: "Odpovídal za model a testování variant",
    usedFor: "Testování variant revitalizace centra města.",
  },
  "uk-microsimulation-models": {
    title: "Mikrosimulační modely britských měst",
    client: "Projekty ve Velké Británii",
    location: "Anglie a ostrov Man",
    summary:
      "Jedenáct mikrosimulačních modelů měst v Anglii a na ostrově Man a k tomu modely proměnné poptávky Plymouthu a Chippenhamu.",
    role: "Vytvořil mikrosimulační modely",
    metricLabels: ["Modely měst"],
  },
};

export const CAREER_CS: Record<string, { years?: string; role?: string; location?: string; duties: string[] }> = {
  SYSTRA: {
    years: "01/2008 – dosud",
    location: "Dublin, Irsko",
    duties: [
      "Vývoj, kalibrace a validace velkých strategických modelů poptávky.",
      "Řídil vývoj a kalibraci národního modelu prognózy poptávky pro National Transport Authority; podílel se na vývoji a kalibraci jeho pěti regionálních modelů, které dohromady pokrývají Irskou republiku.",
      "Vytvořil National Trip End Model, model dálkové poptávky Irska a model poptávky pro hlavní přístavy a letiště v Irsku a Severním Irsku.",
      "Mikrosimulační modely 11 britských měst, mimo jiné Plymouthu, Blackpoolu, Nuneatonu a Douglasu (ostrov Man); modely proměnné poptávky Plymouthu a Chippenhamu.",
      "Modelování poptávky návštěvníků pro Hry Commonwealthu v Glasgow 2014 a Birminghamu 2022.",
      "Samostatné programy ve VB, VBA a Pythonu, které přidávají funkce, zvyšují efektivitu a zlepšují reporting.",
      "Nejnověji: nové míry tvorby cest po covidu pro aktualizaci modelu NTA na rok 2022, prezentované na European Transport Conference 2025 v Antverpách.",
      "Spoluautor článků a přednášek o modelu dálkové dopravy (ETC 2019), hodnocení M74 (STAR 2017) a dopravních konfliktech (ICTTE 2014).",
    ],
  },
  "Hyder Consulting": {
    years: "10/2006 – 12/2007",
    location: "Melbourne, Austrálie",
    duties: [
      "Odpovídal za mikrosimulační model Dandenongu v Melbourne a za testování variant revitalizace — využití území, silniční sítě a veřejné dopravy — u jednoho z tehdy největších revitalizačních projektů v Austrálii.",
      "Podílel se na vývoji mikrosimulačního modelu tunelu Lane Cove v Sydney, který pokrýval povrchovou síť podél celého koridoru tunelu a sloužil k posouzení dopravních opatření během stavby; v té době největší mikrosimulační model v Austrálii co do rozlohy.",
    ],
  },
  "Jacobs Babtie": {
    years: "07/2004 – 09/2006",
    location: "Leeds, Velká Británie",
    duties: [
      "Vývoj strategických modelů v SATURNu.",
      "Hodnocení nákladů a přínosů v programu COBA.",
      "Dopravní modely v tabulkových procesorech a dopravní posouzení.",
      "Aplikace ve Visual Basicu pro rychlejší vývoj modelů a zpracování dat.",
    ],
  },
  CityPlan: {
    years: "07/1999 – 06/2004",
    location: "Praha, Česko",
    duties: [
      "Ekonomická hodnocení v programu HDM-4.",
      "SWOT a multikriteriální hodnocení dopravních sítí.",
      "Výzkumné projekty pro Ministerstvo dopravy ČR.",
    ],
  },
};

export const EDUCATION_CS = {
  degree: "Inženýr (Ing.), Dopravní plánování a dopravní inženýrství",
  school: "České vysoké učení technické v Praze (ČVUT)",
  location: "Praha, Česko",
};

export const QUADRANT_CS: Record<Quadrant, string> = {
  Microsimulation: "Mikrosimulace",
  "Strategic Demand": "Strategická poptávka",
  Appraisal: "Hodnocení",
  "GIS & Code": "GIS a programování",
};

export const TECH_BLURB_CS: Record<string, string> = {
  "3D visualisation": "Trojrozměrná vizualizace simulované dopravy, která klientům a veřejnosti vysvětlí navrhovaná řešení.",
  "Paramics Discovery": "Mikroskopická simulace dopravy na křižovatkách, v koridorech a městských sítích, vozidlo po vozidle.",
  "S-Paramics": "Mikrosimulační platforma použitá v pilotní studii bezpečnosti pomocí dopravních konfliktů.",
  SATURN: "Strategické přidělení dopravy na síť: volba trasy a kongesce v celé síti.",
  "Variable Demand Modeling": "Poptávka, která reaguje na změnu nákladů cesty — četnost, druh dopravy, cíl a čas.",
  COBA: "Britská metodika hodnocení nákladů a přínosů silničních staveb.",
  "HDM-4": "Model Highway Development and Management pro hodnocení investic do silnic.",
  QGIS: "Prostorové analýzy v open-source GIS: nehodovost, dostupnost a mapování sítí.",
  ArcGIS: "Prostorové analýzy, geodatabáze a kartografické výstupy.",
  Python: "Automatizace modelů, datové procesy a analýzy.",
  Ruby: "Skripty pro zpracování dat a automatizaci.",
  "Google Maps & OpenStreetMap APIs": "Webová mapová data pro studie dostupnosti a analýzy sítí.",
  SQL: "Dotazy nad velkými soubory průzkumů, sčítání a modelových dat.",
  "VB/VBA": "Automatizace zpracování modelů v tabulkách a reportingu.",
};
