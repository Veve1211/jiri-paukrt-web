import { Gauge, Route } from "lucide-react";

import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { useVcSwitch } from "./useVcSwitch";

export function VcSwitch({
  vc,
  className,
  showHint = true,
}: {
  vc: ReturnType<typeof useVcSwitch>;
  className?: string;
  showHint?: boolean;
}) {
  const { t } = useLang();
  return (
    <div className={cn("z-10 flex flex-col items-start gap-1.5", className)}>
      <div
        role="radiogroup"
        aria-label={t("Map view", "Zobrazení mapy")}
        onAnimationEnd={vc.endPulse}
        className={cn(
          "inline-flex gap-1 rounded-full border border-cyan/50 bg-void/80 p-1 font-mono text-[11px] tracking-[0.1em] uppercase backdrop-blur-sm sm:text-xs",
          vc.pulse && "animate-[vc-pulse_1.8s_ease-in-out_3]",
        )}
      >
        {[
          { on: false, label: t("Network", "Síť"), Icon: Route },
          { on: true, label: t("Congestion (V/C)", "Vytížení (V/C)"), Icon: Gauge },
        ].map(({ on, label, Icon }) => (
          <button
            key={String(on)}
            type="button"
            role="radio"
            aria-checked={vc.showVc === on}
            onClick={() => vc.choose(on)}
            title={
              on
                ? t(
                    "Colour roads by volume-to-capacity ratio",
                    "Obarvit silnice podle poměru intenzity a kapacity",
                  )
                : undefined
            }
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 transition-colors duration-1000",
              vc.showVc === on
                ? "bg-cyan/20 text-cyan"
                : "text-dim hover:bg-cyan/10 hover:text-star",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      {showHint && vc.hint && (
        <div className="hidden items-center gap-1.5 pl-3 font-mono text-[10px] tracking-[0.1em] text-cyan/70 uppercase animate-in fade-in-0 sm:flex">
          <span className="size-1.5 rounded-full bg-cyan/70" />
          {t("Switch the map view", "Přepněte zobrazení mapy")}
        </div>
      )}
    </div>
  );
}
