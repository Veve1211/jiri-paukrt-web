import { EDUCATION, PERSON } from "@/data/portfolio";
import { PERSON_CS } from "@/data/portfolio.cs";
import type { Lang } from "./i18n";

import { SITE_ORIGIN } from "./site-origin";

type PageCopy = { title: string; description: string };
const image = `${SITE_ORIGIN}/og.png`;
const personId = `${SITE_ORIGIN}/#person`;

export function canonicalUrl(pathname: string, lang: Lang) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return `${SITE_ORIGIN}${path}${lang === "cs" ? "?lang=cs" : ""}`;
}

export function pageHead(
  match: { pathname: string; search: { lang?: Lang } },
  en: PageCopy,
  cs: PageCopy,
  type: "website" | "profile" | "article" = "website",
) {
  const lang = match.search.lang ?? "en";
  const { title, description } = lang === "cs" ? cs : en;
  const imageAlt =
    lang === "cs"
      ? "Jiří Paukrt — hlavní dopravní inženýr"
      : "Jiri Paukrt — Principal Transportation Engineer";
  const enUrl = canonicalUrl(match.pathname, "en");
  const csUrl = canonicalUrl(match.pathname, "cs");
  const locale = lang === "cs" ? "cs_CZ" : "en_GB";

  return {
    links: [
      { rel: "canonical", href: lang === "cs" ? csUrl : enUrl },
      { rel: "alternate", hrefLang: "en", href: enUrl },
      { rel: "alternate", hrefLang: "cs", href: csUrl },
      { rel: "alternate", hrefLang: "x-default", href: enUrl },
    ],
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:site_name", content: lang === "cs" ? PERSON_CS.name : PERSON.name },
      { property: "og:url", content: lang === "cs" ? csUrl : enUrl },
      { property: "og:locale", content: locale },
      { property: "og:locale:alternate", content: lang === "cs" ? "en_GB" : "cs_CZ" },
      { property: "og:image", content: image },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: imageAlt },
    ],
  };
}

export function personProfile(lang: Lang) {
  const czech = lang === "cs";
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: canonicalUrl("/", lang),
    inLanguage: lang,
    mainEntity: {
      "@type": "Person",
      "@id": personId,
      name: PERSON_CS.name,
      alternateName: PERSON.name,
      honorificPrefix: "Ing.",
      url: canonicalUrl("/", "en"),
      jobTitle: czech ? PERSON_CS.role : PERSON.role,
      description: czech ? PERSON_CS.summary : PERSON.summary,
      sameAs: [PERSON.linkedin],
      worksFor: { "@type": "Organization", name: PERSON.company, url: "https://www.systra.com/" },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: EDUCATION.school,
        url: "https://www.cvut.cz/",
      },
      knowsLanguage: ["cs", "en"],
      knowsAbout: czech
        ? [
            "Dopravní modelování",
            "Prognózy dopravní poptávky",
            "Dopravní mikrosimulace",
            "Bezpečnost silničního provozu",
          ]
        : [
            "Transport modelling",
            "Travel demand forecasting",
            "Traffic microsimulation",
            "Road safety",
          ],
    },
  };
}
