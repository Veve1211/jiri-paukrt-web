import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Small roundabout glyph — four arms meeting at a ring. */
export function JunctionGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.4" className={cn("size-5 stroke-cyan", className)} aria-hidden="true">
      <circle cx="10" cy="10" r="4" />
      <path d="M10 1v5M10 14v5M1 10h5M14 10h5" strokeLinecap="round" />
      <circle cx="10" cy="10" r="1.2" className="fill-cyan stroke-none" />
    </svg>
  );
}

export function BrandMark({ showTagline = true }: { showTagline?: boolean }) {
  const { t } = useLang();
  return (
    <span className="flex items-center gap-2.5">
      <JunctionGlyph />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-semibold tracking-wide">Jiri Paukrt</span>
        {showTagline && (
          <span className="mt-1 font-mono text-[9px] tracking-wider text-dim uppercase">{t("Transport modelling · Dublin & CZ", "Dopravní modelování · Dublin a ČR")}</span>
        )}
      </span>
    </span>
  );
}

/** Large monogram badge — a roundabout plan used in place of a portrait. */
export function MonogramBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={cn("size-28", className)} aria-hidden="true">
      <path d="M60 0v34M60 86v34M0 60h34M86 60h34" strokeWidth="14" className="stroke-volt/40" />
      <path d="M60 2v30M60 88v30M2 60h30M88 60h30" strokeDasharray="4 5" className="stroke-star/30" />
      <circle cx="60" cy="60" r="30" strokeWidth="14" className="stroke-volt/40" />
      <circle cx="60" cy="60" r="30" strokeDasharray="4 5" className="stroke-star/30" />
      <circle cx="60" cy="60" r="20" className="fill-void stroke-cyan" strokeWidth="1.2" />
      <text x="60" y="65" textAnchor="middle" className="fill-star font-display" fontSize="14" fontWeight="700" letterSpacing="1.5">
        JP
      </text>
    </svg>
  );
}
