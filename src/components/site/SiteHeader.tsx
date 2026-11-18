import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandMark } from "./BrandMark";

export const NAV = [
  { to: "/network", label: "Network" },
  { to: "/projects", label: "Projects" },
  { to: "/expertise", label: "Expertise" },
  { to: "/career", label: "Career" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 md:px-8 md:pt-5">
      <div className="glass flex h-12 items-center justify-between rounded-[14px] px-4 md:px-5">
        <Link to="/" aria-label="Paukrt / Transit — home" className="shrink-0">
          <BrandMark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider text-dim uppercase transition-colors hover:text-star"
              activeProps={{ className: "text-cyan bg-cyan/[0.08]" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 font-mono text-[11px] tracking-wider text-cyan lg:flex">
          <span className="size-1.5 rounded-full bg-cyan shadow-dot" />
          SYSTEM: 27+ YRS TRANSPORT MODELING
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="flex size-9 items-center justify-center rounded-full border border-star/15 text-star md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent side="right" className="glass-strong w-[82%] border-l-star/10 bg-ink/95">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-2">
              <BrandMark />
            </div>
            <nav aria-label="Mobile" className="mt-10 flex flex-col gap-1">
              {NAV.map((item, i) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 rounded-xl px-3 py-3 text-2xl font-light text-star transition-colors hover:bg-star/5"
                  activeProps={{ className: "text-cyan" }}
                >
                  <span className="font-mono text-[10px] text-dim">0{i + 1}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="absolute inset-x-6 bottom-8 flex items-center gap-2 font-mono text-[10px] tracking-wider text-cyan">
              <span className="size-1.5 rounded-full bg-cyan shadow-dot" />
              SYSTEM: 27+ YRS TRANSPORT MODELING
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
