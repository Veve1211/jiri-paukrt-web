// Portfolio content for Jiri Paukrt. Primary source: Jiri's own LinkedIn profile export
// (Nov 2026). Cross-checked against public sources (NTA, STAR 2017, ETC 2019,
// SWOV/ICTTE 2014). Anything only in the older Lovable brief and not confirmed by
// LinkedIn or a public source has been left out.
// Do not add metrics, dates or clients that are not verified.

export const PERSON = {
  name: "Jiri Paukrt",
  role: "Principal Transportation Engineer",
  company: "SYSTRA",
  city: "Dublin",
  yearsLabel: "27+",
  careerStartYear: 1999,
  linkedin: "https://www.linkedin.com/in/jiri-paukrt",
  summary:
    "Transport modeller with 27 years of experience across Ireland, the UK, Australia and the Czech Republic. Managed the development and calibration of Ireland's National Demand Forecasting Model for the National Transport Authority, backed by more than ten years of microsimulation modelling, variable demand modelling, GIS analysis and programming.",
  languages: [
    { name: "Czech", level: "Native" },
    { name: "English", level: "Professional working proficiency" },
  ],
  strengths: [
    {
      title: "National-scale models, end to end",
      body: "Managed the development and calibration of Ireland's National Demand Forecasting Model and built its trip-end and long-distance sub-models.",
    },
    {
      title: "Strategic and microscopic",
      body: "Variable demand and SATURN assignment models alongside more than ten years of microsimulation — from town centres to the Lane Cove Tunnel corridor.",
    },
    {
      title: "Builds his own tools",
      body: "Python, VBA, SQL and Ruby programs that automate model development, data processing and reporting.",
    },
    {
      title: "International and published",
      body: "Four countries of practice and four papers and conference talks with the NTA, ETC, STAR and ICTTE.",
    },
  ],
  waysOfWorking: [
    "Managing model development, calibration and validation for national clients such as the NTA",
    "Analysis and processing of large datasets, with GIS for accident and accessibility studies",
    "Presenting methods and results at international conferences (ETC, STAR, ICTTE)",
    "Reproducible modelling: automated data pipelines and checks in Python, SQL and VBA",
  ],
} as const;

export type DomainKey = "national" | "microsim" | "mega-events" | "gis-safety";

export const DOMAINS: { key: DomainKey; label: string }[] = [
  { key: "national", label: "Strategic Models" },
  { key: "microsim", label: "Microsimulation" },
  { key: "mega-events", label: "Major Events" },
  { key: "gis-safety", label: "Road Safety" },
];

export function isDomainKey(value: unknown): value is DomainKey {
  return typeof value === "string" && DOMAINS.some((d) => d.key === value);
}

export type Region = "Ireland" | "UK" | "Australia" | "Czech Republic";

export interface Metric {
  value: string;
  label: string;
}

export interface Publication {
  title: string;
  venue: string;
  authors?: string;
  url?: string;
}

export interface Project {
  slug: string;
  code: string;
  title: string;
  client: string;
  location: string;
  region: Region;
  domains: DomainKey[];
  summary: string;
  highlights: string[];
  metrics: Metric[];
  /** Jiri's own part in the project. */
  role?: string;
  /** When the work took place, where known. */
  years?: string;
  /** What the model or study was used for — the decision it supported. */
  usedFor?: string;
  publication?: Publication;
  tools?: string[];
  locationIds: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "nta-national-demand-model",
    usedFor: "Used by the NTA to appraise future transport and land-use alternatives at national and regional level.",
    role: "Managed the development and calibration of the NDFM; developed the National Trip End Model",
    code: "IE-01",
    title: "National Demand Forecasting Model",
    client: "National Transport Authority (NTA), Ireland",
    location: "Dublin, Ireland",
    region: "Ireland",
    domains: ["national"],
    summary:
      "The NTA's Regional Modelling System is the strategic tool behind national transport planning in Ireland: a National Demand Forecasting Model that feeds five regional multi-modal models, which together cover the entire Republic of Ireland.",
    highlights: [
      "Managed the development and calibration of the National Demand Forecasting Model (NDFM)",
      "Developed the National Trip End Model and a demand model for major ports and airports in Ireland and Northern Ireland",
      "Involved in developing and calibrating the five regional models: East, West, Mid-West, South-East and South-West",
      "Post-COVID trip rates estimated from the 2022 National Household Travel Survey (about 20,000 diary records)",
    ],
    metrics: [
      { value: "5", label: "Regional multi-modal models" },
      { value: "~20k", label: "Travel-diary records (2022)" },
    ],
    publication: {
      title: "Post COVID-19 Trip Rate Estimation in Ireland",
      venue: "National Transport Authority technical paper",
      authors: "William Brazil, Warren Whitney, Jiri Paukrt",
      url: "https://www.nationaltransport.ie/wp-content/uploads/2025/09/Post-COVID-19-Trip-Rate-Estimation-in-Ireland.pdf",
    },
    tools: ["Python", "VBA"],
    locationIds: ["dublin"],
  },
  {
    slug: "nta-long-distance-model",
    usedFor: "Testing long-distance rail changes such as more trains, higher capacity or new fares.",
    role: "Developed the Long Distance Demand Model; co-presenter at ETC 2019",
    years: "2019",
    code: "IE-02",
    title: "NTA Long Distance Model",
    client: "National Transport Authority (NTA) · SYSTRA",
    location: "Dublin, Ireland",
    region: "Ireland",
    domains: ["national"],
    summary:
      "The NTA's model of long-distance inter-urban travel across Ireland and Northern Ireland by car, bus, rail and goods vehicle. Recent work improved long-distance rail demand forecasting, so the model can test more trains, higher capacity or fare changes.",
    highlights: [
      "Covers Ireland and Northern Ireland",
      "Modes: car, bus, rail and goods vehicles",
      "Focus on long-distance rail demand",
      "Presented at ETC 2019 in Dublin with Sean Kearns (SYSTRA)",
    ],
    metrics: [
      { value: "4", label: "Modes modelled" },
      { value: "2019", label: "ETC Dublin" },
    ],
    publication: {
      title: "National Transport Authority Long Distance Model",
      venue: "European Transport Conference (ETC 2019), Dublin",
      authors: "Sean Kearns, Jiri Paukrt",
      url: "https://www.systra.com/en/news/european-transport-conference-british-and-french-systra-experts-in-the-spotlight/",
    },
    locationIds: ["dublin"],
  },
  {
    slug: "glasgow-m74-evaluation",
    usedFor: "Checking whether the new motorway delivered the expected traffic relief five years after it opened.",
    role: "Co-author of the five-year post-opening evaluation",
    years: "2016–2017",
    code: "UK-01",
    title: "M74 Completion Scheme — 5 Years After",
    client: "Transport Scotland · SYSTRA",
    location: "Glasgow, Scotland",
    region: "UK",
    domains: ["national"],
    summary:
      "Five-year after-opening evaluation of the M74 Completion — about 8 km of motorway across the south side of Glasgow, opened in June 2011 — for Transport Scotland. Observed traffic was compared with what the scheme was expected to deliver.",
    highlights: [
      "About 8 km of new motorway linking the M74 and the M8",
      "Opened to traffic in June 2011",
      "Evaluated traffic redistribution and relief to the M8",
      "Presented at the STAR Conference 2017 with Robert Allan & Iain Clement",
    ],
    metrics: [
      { value: "~8 km", label: "New motorway" },
      { value: "5 yrs", label: "After opening" },
    ],
    publication: {
      title: "Scottish Trunk Road Infrastructure Project Evaluation (STRIPE): M74 Completion Scheme — 5 Years After Opening",
      venue: "STAR Conference 2017, Glasgow",
      authors: "Robert Allan, Iain Clement, Jiri Paukrt",
      url: "https://starconference.org.uk/star/2017/Allan.pdf",
    },
    locationIds: ["glasgow"],
  },
  {
    slug: "road-safety-traffic-conflicts",
    usedFor: "Showing whether microsimulation can flag risky junctions before accidents happen.",
    role: "Co-author",
    years: "2014",
    code: "RS-01",
    title: "Road Safety via Traffic Conflicts",
    client: "With the Transport Research Centre (CDV)",
    location: "Brno, Czech Republic",
    region: "Czech Republic",
    domains: ["gis-safety", "microsim"],
    summary:
      "A pilot comparing traffic conflicts produced by S-Paramics microsimulation with conflicts observed on street using the Czech traffic conflict technique — testing microsimulation as a proactive road-safety tool that does not have to wait for years of accident records.",
    highlights: [
      "Signalised intersections in Brno",
      "S-Paramics microsimulation, time-to-conflict indicator",
      "Simulated vs observed traffic conflicts",
      "Presented at ICTTE, Belgrade, November 2014",
    ],
    metrics: [
      { value: "2", label: "Methods compared" },
      { value: "2014", label: "ICTTE Belgrade" },
    ],
    publication: {
      title:
        "Road safety evaluation using traffic conflicts: Pilot comparison of micro-simulation and observation",
      venue: "ICTTE 2014, Belgrade",
      authors: "Jiří Ambros, Richard Turek, Jiri Paukrt",
      url: "https://www.researchgate.net/publication/271135792_Road_safety_evaluation_using_traffic_conflicts_Pilot_comparison_of_micro-simulation_and_observation",
    },
    tools: ["S-Paramics"],
    locationIds: ["brno"],
  },
  {
    slug: "commonwealth-games",
    usedFor: "Planning how visitors would travel to the venues during the Games.",
    role: "Involved in modelling visitor demand",
    years: "2014 · 2022",
    code: "EV-01",
    title: "Commonwealth Games Visitor Demand",
    client: "Glasgow 2014 · Birmingham 2022",
    location: "Glasgow & Birmingham, UK",
    region: "UK",
    domains: ["mega-events"],
    summary:
      "Visitor demand modelling and planning for two Commonwealth Games — forecasting how visitors travel to venues on event days.",
    highlights: [
      "Commonwealth Games Glasgow 2014",
      "Commonwealth Games Birmingham 2022",
      "Visitor demand modelling",
    ],
    metrics: [
      { value: "2", label: "Games editions" },
      { value: "2014 · 2022", label: "Host years" },
    ],
    locationIds: ["glasgow", "birmingham"],
  },
  {
    slug: "sydney-lane-cove-tunnel",
    usedFor: "Assessing traffic management plans for the tunnel construction period.",
    role: "Involved in developing the microsimulation model",
    years: "2006–2007",
    code: "AU-01",
    title: "Lane Cove Tunnel Microsimulation",
    client: "Hyder Consulting",
    location: "Sydney, Australia",
    region: "Australia",
    domains: ["microsim"],
    summary:
      "Microsimulation model of the surface road network along the full length of the Lane Cove Tunnel corridor in Sydney, used to assess traffic management plans while the 3.6 km twin-tube tunnel was being built. At the time it was the largest microsimulation model in Australia by geographical coverage.",
    highlights: [
      "Covered the surface network along the full tunnel corridor",
      "Used to assess construction traffic management plans",
      "Largest microsimulation model in Australia by geographical coverage at the time",
      "Tunnel opened to traffic in March 2007",
    ],
    metrics: [
      { value: "3.6 km", label: "Twin-tube tunnel" },
      { value: "2007", label: "Opened to traffic" },
    ],
    locationIds: ["sydney"],
  },
  {
    slug: "melbourne-dandenong",
    usedFor: "Testing revitalisation options for the town centre.",
    role: "Responsible for the model and option testing",
    years: "2006–2007",
    code: "AU-02",
    title: "Dandenong Revitalisation Microsimulation",
    client: "Hyder Consulting",
    location: "Dandenong, Melbourne, Australia",
    region: "Australia",
    domains: ["microsim"],
    summary:
      "Microsimulation model of Dandenong in Melbourne, used to test revitalisation options — land-use changes, road network alterations and public transport operations — for one of the largest revitalisation projects in Australia at the time.",
    highlights: [
      "Responsible for developing the microsimulation model",
      "Tested land-use, road network and public transport options",
      "Delivered with Hyder Consulting",
    ],
    metrics: [{ value: "2006–07", label: "Hyder Consulting" }],
    locationIds: ["melbourne"],
  },
  {
    slug: "uk-microsimulation-models",
    role: "Developed the microsimulation models",
    code: "UK-02",
    title: "UK Town Microsimulation Models",
    client: "UK portfolio",
    location: "England & Isle of Man",
    region: "UK",
    domains: ["microsim"],
    summary: "Eleven microsimulation models for towns across England and the Isle of Man, alongside variable demand models of Plymouth and Chippenham.",
    highlights: [
      "Gillingham",
      "Douglas (Isle of Man)",
      "Blackpool",
      "Plymouth",
      "Weymouth",
      "Chippenham",
      "New Barnet",
      "Nuneaton",
      "Coalville",
      "Derriford",
      "Hinckley",
    ],
    metrics: [{ value: "11", label: "Town models" }],
    tools: ["Paramics Discovery"],
    locationIds: [
      "gillingham",
      "douglas",
      "blackpool",
      "plymouth",
      "weymouth",
      "chippenham",
      "new-barnet",
      "nuneaton",
      "coalville",
      "derriford",
      "hinckley",
    ],
  },
];

export const UK_MICROSIM_TOWNS = PROJECTS.find((p) => p.slug === "uk-microsimulation-models")!
  .highlights;

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function filterProjects(domain?: DomainKey): Project[] {
  if (!domain) return PROJECTS;
  return PROJECTS.filter((p) => p.domains.includes(domain));
}

export function domainLabel(key: DomainKey): string {
  return DOMAINS.find((d) => d.key === key)?.label ?? key;
}

// ---------------------------------------------------------------------------
// Network locations (real coordinates)

export type LocationKind = "hq" | "project" | "base" | "town";

export interface NetworkLocation {
  id: string;
  name: string;
  country: string;
  region: Region;
  lat: number;
  lon: number;
  kind: LocationKind;
  note?: string;
}

export const LOCATIONS: NetworkLocation[] = [
  { id: "dublin", name: "Dublin", country: "Ireland", region: "Ireland", lat: 53.3498, lon: -6.2603, kind: "hq", note: "SYSTRA · 2008–present" },
  { id: "glasgow", name: "Glasgow", country: "Scotland, UK", region: "UK", lat: 55.8642, lon: -4.2518, kind: "project" },
  { id: "birmingham", name: "Birmingham", country: "England, UK", region: "UK", lat: 52.4862, lon: -1.8904, kind: "project" },
  { id: "leeds", name: "Leeds", country: "England, UK", region: "UK", lat: 53.8008, lon: -1.5491, kind: "base", note: "Jacobs Babtie · 2004–2006" },
  { id: "prague", name: "Prague", country: "Czech Republic", region: "Czech Republic", lat: 50.0755, lon: 14.4378, kind: "base", note: "CityPlan · 1999–2004 · ČVUT" },
  { id: "brno", name: "Brno", country: "Czech Republic", region: "Czech Republic", lat: 49.1951, lon: 16.6068, kind: "project" },
  { id: "melbourne", name: "Melbourne", country: "Australia", region: "Australia", lat: -37.8136, lon: 144.9631, kind: "base", note: "Hyder Consulting · 2006–2007" },
  { id: "sydney", name: "Sydney", country: "Australia", region: "Australia", lat: -33.8688, lon: 151.2093, kind: "project" },
  { id: "gillingham", name: "Gillingham", country: "England, UK", region: "UK", lat: 51.389, lon: 0.5486, kind: "town" },
  { id: "douglas", name: "Douglas", country: "Isle of Man", region: "UK", lat: 54.1523, lon: -4.4861, kind: "town" },
  { id: "blackpool", name: "Blackpool", country: "England, UK", region: "UK", lat: 53.8175, lon: -3.0357, kind: "town" },
  { id: "plymouth", name: "Plymouth", country: "England, UK", region: "UK", lat: 50.3755, lon: -4.1427, kind: "town" },
  { id: "weymouth", name: "Weymouth", country: "England, UK", region: "UK", lat: 50.6144, lon: -2.4576, kind: "town" },
  { id: "chippenham", name: "Chippenham", country: "England, UK", region: "UK", lat: 51.4585, lon: -2.1158, kind: "town" },
  { id: "new-barnet", name: "New Barnet", country: "England, UK", region: "UK", lat: 51.6488, lon: -0.1729, kind: "town" },
  { id: "nuneaton", name: "Nuneaton", country: "England, UK", region: "UK", lat: 52.523, lon: -1.4652, kind: "town" },
  { id: "coalville", name: "Coalville", country: "England, UK", region: "UK", lat: 52.723, lon: -1.37, kind: "town" },
  { id: "derriford", name: "Derriford", country: "England, UK", region: "UK", lat: 50.4167, lon: -4.1167, kind: "town" },
  { id: "hinckley", name: "Hinckley", country: "England, UK", region: "UK", lat: 52.5413, lon: -1.3725, kind: "town" },
];

export const REGIONS: Region[] = ["Ireland", "UK", "Australia", "Czech Republic"];

export function projectsAt(locationId: string): Project[] {
  return PROJECTS.filter((p) => p.locationIds.includes(locationId));
}

export function getLocation(id: string): NetworkLocation | undefined {
  return LOCATIONS.find((l) => l.id === id);
}

export function formatCoord(lat: number, lon: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns} · ${Math.abs(lon).toFixed(4)}° ${ew}`;
}

// ---------------------------------------------------------------------------
// Career

export interface CareerEntry {
  years: string;
  role: string;
  company: string;
  location: string;
  locationId: string;
  current?: boolean;
  /** What the role involved — from Jiri's LinkedIn profile. */
  duties: string[];
  related: string[];
}

export const CAREER: CareerEntry[] = [
  {
    years: "Jan 2008 – present",
    role: "Principal Transportation Engineer",
    company: "SYSTRA",
    location: "Dublin, Ireland",
    locationId: "dublin",
    current: true,
    duties: [
      "Development, calibration and validation of large strategic demand models.",
      "Managed the development and calibration of the National Demand Forecasting Model for the National Transport Authority; involved in developing and calibrating its five regional models, which together cover the Republic of Ireland.",
      "Developed the National Trip End Model, the Long Distance Demand Model of Ireland and a demand model for major ports and airports in Ireland and Northern Ireland.",
      "Microsimulation models of 11 UK towns, including Plymouth, Blackpool, Nuneaton and Douglas (Isle of Man); variable demand models of Plymouth and Chippenham.",
      "Visitor demand modelling for the Glasgow 2014 and Birmingham 2022 Commonwealth Games.",
      "Standalone programs in VB, VBA and Python that add functionality, increase efficiency and improve reporting.",
      "Co-author of papers and talks on post-COVID trip rates (NTA), the Long Distance Model (ETC 2019), the M74 evaluation (STAR 2017) and traffic conflicts (ICTTE 2014).",
    ],
    related: [
      "nta-national-demand-model",
      "nta-long-distance-model",
      "glasgow-m74-evaluation",
      "commonwealth-games",
    ],
  },
  {
    years: "Oct 2006 – Dec 2007",
    role: "Senior Transport Modeller",
    company: "Hyder Consulting",
    location: "Melbourne, Australia",
    locationId: "melbourne",
    duties: [
      "Responsible for the microsimulation model of Dandenong, Melbourne, and for testing revitalisation options — land use, road network and public transport — for one of the largest revitalisation projects in Australia at the time.",
      "Involved in developing the Lane Cove Tunnel microsimulation model in Sydney, covering the surface network along the full tunnel corridor and used to assess construction traffic management plans; the largest microsimulation model in Australia by geographical coverage at the time.",
    ],
    related: ["sydney-lane-cove-tunnel", "melbourne-dandenong"],
  },
  {
    years: "Jul 2004 – Sep 2006",
    role: "Transport Planner",
    company: "Jacobs Babtie",
    location: "Leeds, UK",
    locationId: "leeds",
    duties: [
      "Development of strategic models in SATURN.",
      "Cost–benefit assessments using COBA.",
      "Spreadsheet-based traffic models and transport assessments.",
      "Visual Basic applications to speed up model development and data processing.",
    ],
    related: [],
  },
  {
    years: "Jul 1999 – Jun 2004",
    role: "Transport Planner",
    company: "CityPlan",
    location: "Prague, Czech Republic",
    locationId: "prague",
    duties: [
      "Economic assessments using HDM-4.",
      "SWOT and multi-criteria assessments of transport networks.",
      "Research projects for the Czech Ministry of Transport.",
    ],
    related: [],
  },
];

export const EDUCATION = {
  degree: "Master's Degree (Ing.) in Transport Planning and Traffic Engineering",
  years: "1994 – 1999",
  school: "Czech Technical University in Prague (ČVUT)",
  location: "Prague, Czech Republic",
};

// ---------------------------------------------------------------------------
// Tech stack radar

export type Quadrant = "Microsimulation" | "Strategic Demand" | "Appraisal" | "GIS & Code";

export const QUADRANTS: Quadrant[] = ["Microsimulation", "Strategic Demand", "Appraisal", "GIS & Code"];

export interface Tech {
  name: string;
  quadrant: Quadrant;
  blurb: string;
  projects?: string[];
}

export const TECH: Tech[] = [
  { name: "3D visualisation", quadrant: "Microsimulation", blurb: "Three-dimensional visualisation of simulated traffic to explain schemes to clients and the public." },
  { name: "Paramics Discovery", quadrant: "Microsimulation", blurb: "Microscopic traffic simulation of junctions, corridors and town networks, vehicle by vehicle." },
  { name: "S-Paramics", quadrant: "Microsimulation", blurb: "Microsimulation platform used for the traffic-conflict road-safety pilot.", projects: ["road-safety-traffic-conflicts"] },
  { name: "SATURN", quadrant: "Strategic Demand", blurb: "Strategic highway assignment for network-wide route choice and congestion." },
  { name: "Variable Demand Modeling", quadrant: "Strategic Demand", blurb: "Demand that responds to changing travel costs — frequency, mode, destination and time of day." },
  { name: "COBA", quadrant: "Appraisal", blurb: "UK cost–benefit analysis for road schemes." },
  { name: "HDM-4", quadrant: "Appraisal", blurb: "Highway Development and Management model for road investment appraisal." },
  { name: "QGIS", quadrant: "GIS & Code", blurb: "Open-source spatial analysis: accident analysis, accessibility studies and network mapping." },
  { name: "ArcGIS", quadrant: "GIS & Code", blurb: "Spatial analysis, geodatabases and cartographic outputs." },
  { name: "Python", quadrant: "GIS & Code", blurb: "Model automation, data pipelines and analysis." },
  { name: "Ruby", quadrant: "GIS & Code", blurb: "Scripting for data processing and automation." },
  { name: "Google Maps & OpenStreetMap APIs", quadrant: "GIS & Code", blurb: "Web mapping data for accessibility studies and network analysis." },
  { name: "SQL", quadrant: "GIS & Code", blurb: "Querying large survey, count and model datasets." },
  { name: "VB/VBA", quadrant: "GIS & Code", blurb: "Automation of spreadsheet-based model processing and reporting." },
];
