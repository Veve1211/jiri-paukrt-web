import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { PERSON } from "@/data/portfolio";
import { useLang } from "@/lib/i18n";
import { BrandMark } from "./BrandMark";
import { NAV } from "./SiteHeader";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="relative z-10 mx-4 mt-24 mb-6 md:mx-8">
      <div className="glass grid gap-8 rounded-[24px] px-6 py-8 md:grid-cols-3 md:px-8">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-xs text-sm text-dim">
            {t(`${PERSON.name} — ${PERSON.role}, ${PERSON.company} ${PERSON.city}.`, `Jiří Paukrt — hlavní dopravní inženýr, ${PERSON.company} ${PERSON.city}.`)}
          </p>
        </div>
        <nav aria-label={t("Footer", "Patička")} className="flex flex-wrap gap-x-6 gap-y-2 md:flex-col">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="telemetry text-[11px] text-dim hover:text-star">
              {t(item.label, item.cs)}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 md:items-end">
          <a
            href={PERSON.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-star hover:text-cyan"
          >
            LinkedIn <ArrowUpRight className="size-4" />
          </a>
          <span className="telemetry text-[10px] text-dim">
            {t(`Based in the ${PERSON.home}`, "Žije v Česku")} · SYSTRA {PERSON.city}
          </span>
          <a href="/privacy" className="telemetry text-[10px] text-dim hover:text-star">
            {t("Privacy notice", "Ochrana osobních údajů")}
          </a>
          <span className="telemetry text-[10px] text-dim/70">
            © {new Date().getFullYear()} {t(PERSON.name, "Jiří Paukrt")}
          </span>
        </div>
      </div>
    </footer>
  );
}
