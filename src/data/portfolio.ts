// Verified portfolio content for Jiri Paukrt. Every fact here comes from the brief;
// do not add metrics, dates or clients that are not verified.

export const PERSON = {
  name: "Jiri Paukrt",
  role: "Principal Transportation Engineer",
  company: "SYSTRA",
  city: "Dublin",
  yearsLabel: "27+",
  careerStartYear: 1999,
  linkedin: "https://linkedin.com/in/jiri-paukrt",
  coordinates: "53.3498° N · 6.2603° W",
} as const;

export type DomainKey = "national" | "microsim" | "mega-events" | "gis-safety";

export const DOMAINS: { key: DomainKey; label: string }[] = [
  { key: "national", label: "National Models" },
  { key: "microsim", label: "Microsimulations" },
  { key: "mega-events", label: "Mega-Events" },
  { key: "gis-safety", label: "GIS & Safety" },
];

export function isDomainKey(value: unknown): value is DomainKey {
  return typeof value === "string" && DOMAINS.some((d) => d.key === value);
}

export type Region = "Ireland" | "UK" | "Australia" | "Czech Republic" | "Serbia";

export interface Metric {
  value: string;
  label: string;
}

export interface Publication {
  title: string;
  venue: string;
  authors?: string;
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
  publication?: Publication;
  tools?: string[];
  locationIds: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "nta-national-demand-model",
    code: "IE-01",
    title: "National Demand Forecasting Model",
    client: "National Transport Authority (NTA), Ireland",
    location: "Dublin, Ireland",
    region: "Ireland",
    domains: ["national"],
    summary:
      "A national-scale model suite for the National Transport Authority, covering the entire Republic of Ireland — from trip generation through long-distance travel to regional detail.",
    highlights: [
      "National Demand Forecasting Model (NDFM)",
      "National Trip End Model (NTEM)",
      "Long Distance Demand Model",
      "5 Regional Models covering the entire Republic of Ireland",
    ],
    metrics: [
      { value: "100%", label: "Republic of Ireland coverage" },
      { value: "5", label: "Regional models" },
      { value: "3", label: "National model components" },
    ],
    publication: {
      title: "Post COVID-19 Trip Rate Estimation in Ireland",
      venue: "Co-authored paper",
      authors: "William Brazil, Warren Whitney, Jiri Paukrt",
    },
    locationIds: ["dublin"],
  },
  {
    slug: "nta-long-distance-model",
    code: "IE-02",
    title: "NTA Long Distance Model",
    client: "National Transport Authority (NTA) · SYSTRA",
    location: "Dublin, Ireland",
    region: "Ireland",
    domains: ["national"],
    summary:
      "The National Transport Authority's long-distance model spanning rail, bus, car and freight — presented at the European Transport Conference 2019 in Dublin.",
    highlights: [
      "Modes: rail, bus, car and freight",
      "Presented at ETC 2019, Dublin",
      "Co-presented with Sean Kearns (SYSTRA)",
    ],
    metrics: [
      { value: "4", label: "Modes modelled" },
      { value: "2019", label: "ETC Dublin" },
    ],
    publication: {
      title: "National Transport Authority Long Distance Model",
      venue: "European Transport Conference (ETC 2019), Dublin",
      authors: "With Sean Kearns (SYSTRA)",
    },
    locationIds: ["dublin"],
  },
  {
    slug: "glasgow-m74-evaluation",
    code: "UK-01",
    title: "M74 Completion Scheme — 5 Years After",
    client: "Transport Scotland · SYSTRA",
    location: "Glasgow, Scotland",
    region: "UK",
    domains: ["national"],
    summary:
      "Five-year after-opening evaluation of the Glasgow M74 Completion Scheme for Transport Scotland, presented at the STAR Conference 2017.",
    highlights: [
      "5-Year After Opening Project Evaluation",
      "Client: Transport Scotland",
      "Presented at the STAR Conference 2017",
      "With Robert Allan & Iain Clement",
    ],
    metrics: [
      { value: "5 yrs", label: "After-opening horizon" },
      { value: "2017", label: "STAR Conference" },
    ],
    publication: {
      title: "M74 Completion Scheme: 5-Year After Opening Project Evaluation",
      venue: "STAR Conference 2017",
      authors: "With Robert Allan & Iain Clement",
    },
    locationIds: ["glasgow"],
  },
  {
    slug: "road-safety-traffic-conflicts",
    code: "RS-01",
    title: "Road Safety via Traffic Conflicts",
    client: "Research pilot",
    location: "Presented at ICTTE, Belgrade",
    region: "Serbia",
    domains: ["gis-safety", "microsim"],
    summary:
      "A pilot comparing traffic conflicts produced by S-Paramics microsimulation with conflicts observed on street — testing microsimulation as a road-safety evaluation tool.",
    highlights: [
      "S-Paramics microsimulation",
      "Simulated vs observed traffic conflicts",
      "Presented at ICTTE Belgrade 2014",
    ],
    metrics: [
      { value: "2", label: "Methods compared" },
      { value: "2014", label: "ICTTE Belgrade" },
    ],
    publication: {
      title:
        "Road safety evaluation using traffic conflicts: Pilot comparison of micro-simulation and observation",
      venue: "ICTTE Belgrade 2014",
    },
    tools: ["S-Paramics"],
    locationIds: ["belgrade"],
  },
  {
    slug: "commonwealth-games",
    code: "EV-01",
    title: "Commonwealth Games Visitor Demand",
    client: "Glasgow 2014 · Birmingham 2022",
    location: "Glasgow & Birmingham, UK",
    region: "UK",
    domains: ["mega-events"],
    summary:
      "Visitor demand modelling for two Commonwealth Games — forecasting how spectators travel to venues on event days.",
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
    code: "AU-01",
    title: "Lane Cove Tunnel Microsimulation",
    client: "Hyder Consulting",
    location: "Sydney, Australia",
    region: "Australia",
    domains: ["microsim"],
    summary:
      "Microsimulation of the Lane Cove Tunnel in Sydney — the largest microsimulation model in Australia by geographical coverage at the time.",
    highlights: [
      "Largest microsimulation model in Australia by geographical coverage at the time",
      "Delivered with Hyder Consulting",
    ],
    metrics: [
      { value: "#1", label: "Coverage in Australia at the time" },
      { value: "Hyder", label: "Consulting" },
    ],
    locationIds: ["sydney"],
  },
  {
    slug: "melbourne-dandenong",
    code: "AU-02",
    title: "Dandenong Revitalisation Microsimulation",
    client: "Hyder Consulting",
    location: "Dandenong, Melbourne, Australia",
    region: "Australia",
    domains: ["microsim"],
    summary: "Microsimulation supporting the revitalisation of Dandenong in Melbourne.",
    highlights: ["Dandenong revitalisation", "Delivered with Hyder Consulting"],
    metrics: [{ value: "Hyder", label: "Consulting" }],
    locationIds: ["melbourne"],
  },
  {
    slug: "uk-microsimulation-models",
    code: "UK-02",
    title: "UK Town Microsimulation Models",
    client: "UK portfolio",
    location: "England & Isle of Man",
    region: "UK",
    domains: ["microsim"],
    summary: "Eleven microsimulation models for towns across England and the Isle of Man.",
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
  { id: "dublin", name: "Dublin", country: "Ireland", region: "Ireland", lat: 53.3498, lon: -6.2603, kind: "hq", note: "SYSTRA · 2008–Present" },
  { id: "glasgow", name: "Glasgow", country: "Scotland, UK", region: "UK", lat: 55.8642, lon: -4.2518, kind: "project" },
  { id: "birmingham", name: "Birmingham", country: "England, UK", region: "UK", lat: 52.4862, lon: -1.8904, kind: "project" },
  { id: "leeds", name: "Leeds", country: "England, UK", region: "UK", lat: 53.8008, lon: -1.5491, kind: "base", note: "Jacobs Babtie · 2004–2006" },
  { id: "prague", name: "Prague", country: "Czech Republic", region: "Czech Republic", lat: 50.0755, lon: 14.4378, kind: "base", note: "CityPlan · 1999–2004 · ČVUT" },
  { id: "belgrade", name: "Belgrade", country: "Serbia", region: "Serbia", lat: 44.7866, lon: 20.4489, kind: "project" },
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

export const REGIONS: Region[] = ["Ireland", "UK", "Australia", "Czech Republic", "Serbia"];

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
  related: string[];
}

export const CAREER: CareerEntry[] = [
  {
    years: "2008 – Present",
    role: "Principal Transportation Engineer",
    company: "SYSTRA",
    location: "Dublin, Ireland",
    locationId: "dublin",
    current: true,
    related: [
      "nta-national-demand-model",
      "nta-long-distance-model",
      "glasgow-m74-evaluation",
      "commonwealth-games",
    ],
  },
  {
    years: "2006 – 2007",
    role: "Senior Transport Modeller",
    company: "Hyder Consulting",
    location: "Melbourne, Australia",
    locationId: "melbourne",
    related: ["sydney-lane-cove-tunnel", "melbourne-dandenong"],
  },
  {
    years: "2004 – 2006",
    role: "Transport Planner",
    company: "Jacobs Babtie",
    location: "Leeds, UK",
    locationId: "leeds",
    related: [],
  },
  {
    years: "1999 – 2004",
    role: "Transport Planner",
    company: "CityPlan",
    location: "Prague, Czech Republic",
    locationId: "prague",
    related: [],
  },
];

export const EDUCATION = {
  degree: "Master's Degree (Ing.) in Transport Planning and Traffic Engineering",
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
  { name: "Paramics Discovery", quadrant: "Microsimulation", blurb: "Microscopic traffic simulation of junctions, corridors and town networks, vehicle by vehicle." },
  { name: "S-Paramics", quadrant: "Microsimulation", blurb: "Microsimulation platform used for the traffic-conflict road-safety pilot.", projects: ["road-safety-traffic-conflicts"] },
  { name: "3D Traffic Simulation", quadrant: "Microsimulation", blurb: "Three-dimensional playback of simulated traffic to communicate schemes to stakeholders." },
  { name: "SATURN", quadrant: "Strategic Demand", blurb: "Strategic highway assignment for network-wide route choice and congestion." },
  { name: "Variable Demand Modeling", quadrant: "Strategic Demand", blurb: "Demand that responds to changing travel costs — frequency, mode, destination and time of day." },
  { name: "COBA", quadrant: "Appraisal", blurb: "UK cost–benefit analysis for road schemes." },
  { name: "HDM4", quadrant: "Appraisal", blurb: "Highway Development and Management model for road investment appraisal." },
  { name: "QGIS", quadrant: "GIS & Code", blurb: "Open-source spatial analysis, zoning systems and network mapping." },
  { name: "ArcGIS", quadrant: "GIS & Code", blurb: "Spatial analysis, geodatabases and cartographic outputs." },
  { name: "Python", quadrant: "GIS & Code", blurb: "Model automation, data pipelines and analysis." },
  { name: "SQL", quadrant: "GIS & Code", blurb: "Querying large survey, count and model datasets." },
  { name: "VB/VBA", quadrant: "GIS & Code", blurb: "Automation of spreadsheet-based model processing and reporting." },
];
