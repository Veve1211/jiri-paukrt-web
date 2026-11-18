import { cn } from "@/lib/utils";

export function StarGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      strokeWidth="1.2"
      className={cn("size-[18px] stroke-cyan", className)}
      aria-hidden="true"
    >
      <path d="M9 1l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
    </svg>
  );
}

export function BrandMark({ showCoords = true }: { showCoords?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <StarGlyph />
      <span className="flex flex-col leading-none">
        <span className="text-sm font-medium tracking-wide">
          Paukrt<span className="font-light text-dim"> / Transit</span>
        </span>
        {showCoords && (
          <span className="mt-1 font-mono text-[9px] tracking-wider text-dim">
            53.3498° N · 6.2603° W
          </span>
        )}
      </span>
    </span>
  );
}

/** Large monogram badge — a celestial compass used in place of a portrait. */
export function MonogramBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={cn("size-28", className)} aria-hidden="true">
      <circle cx="60" cy="60" r="56" className="stroke-cyan/20" />
      <circle cx="60" cy="60" r="44" className="stroke-volt/40" strokeDasharray="2 5" />
      <path d="M60 4v10M60 106v10M4 60h10M106 60h10" className="stroke-cyan/50" />
      <path d="M60 22l7 31 31 7-31 7-7 31-7-31-31-7 31-7z" className="fill-cyan/10 stroke-cyan" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="3" className="fill-star" />
      <text x="60" y="47" textAnchor="middle" className="fill-star font-display" fontSize="10" fontWeight="700" letterSpacing="2">
        JP
      </text>
    </svg>
  );
}
