import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LangSwitch, useLang } from "@/lib/i18n";
import { BrandMark } from "./BrandMark";

export const NAV = [
  { to: "/career", label: "Career", cs: "Kariéra" },
  { to: "/projects", label: "Projects", cs: "Projekty" },
  { to: "/network", label: "Map", cs: "Mapa" },
  { to: "/expertise", label: "Expertise", cs: "Odbornost" },
  { to: "/contact", label: "Contact", cs: "Kontakt" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 md:px-8 md:pt-5">
      <div className="glass mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full pr-2 pl-5 md:pr-2.5 md:pl-6">
        <Link
          to="/"
          aria-label={t("Jiri Paukrt — home", "Jiří Paukrt — úvod")}
          className="shrink-0"
        >
          <BrandMark compactTagline />
        </Link>

        <nav aria-label={t("Main", "Hlavní menu")} className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider text-dim uppercase transition-colors hover:text-star"
              activeProps={{ className: "text-cyan bg-cyan/[0.08]" }}
            >
              {t(item.label, item.cs)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch />
          <a
            href="/Jiri-Paukrt-CV.pdf"
            download
            className="hidden items-center gap-2 rounded-full bg-cyan px-4 py-2 font-mono text-[11px] font-semibold tracking-wider text-void uppercase transition-[filter] hover:brightness-105 lg:flex"
          >
            {t("Download CV", "Stáhnout CV (EN)")}
          </a>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="flex size-9 items-center justify-center rounded-full border border-star/15 text-star md:hidden"
            aria-label={t("Open menu", "Otevřít menu")}
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent side="right" className="glass-strong w-[82%] border-l-star/10 bg-ink/95">
            <SheetTitle className="sr-only">{t("Menu", "Menu")}</SheetTitle>
            <div className="mt-2">
              <BrandMark />
            </div>
            <nav
              aria-label={t("Mobile menu", "Mobilní menu")}
              className="mt-10 flex flex-col gap-1"
            >
              {NAV.map((item, i) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 rounded-xl px-3 py-3 text-2xl font-light text-star transition-colors hover:bg-star/5"
                  activeProps={{ className: "text-cyan" }}
                >
                  <span className="font-mono text-[10px] text-dim">0{i + 1}</span>
                  {t(item.label, item.cs)}
                </Link>
              ))}
            </nav>
            <a
              href="/Jiri-Paukrt-CV.pdf"
              download
              className="absolute inset-x-6 bottom-8 flex h-12 items-center justify-center rounded-full bg-cyan font-mono text-[11px] font-semibold tracking-wider text-void uppercase"
            >
              {t("Download CV (PDF)", "Stáhnout CV (PDF, anglicky)")}
            </a>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
