import { Gauge, Route } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-telemetry";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** How long the map stays plain before it lights up, and how long the colour fade takes. */
export const VC_INTRO_DELAY_MS = 4000;
export const VC_FADE = "stroke 3.5s ease";

/**
 * Shared state for the "Network | Congestion (V/C)" view switch. Once the figure scrolls
 * into view it waits a moment, then slowly switches to V/C colours and pulses the switch,
 * so visitors notice the map has a congestion view. A click by the visitor cancels it.
 */
export function useVcSwitch(targetRef: RefObject<HTMLElement | null>) {
  const [showVc, setShowVc] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [hint, setHint] = useState(true);
  const touched = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const choose = (on: boolean) => {
    touched.current = true;
    setPulse(false);
    setHint(false);
    setShowVc(on);
  };

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      timer = setTimeout(
        () => {
          if (touched.current) return;
          setShowVc(true);
          if (!reducedMotion) setPulse(true);
        },
        reducedMotion ? 0 : VC_INTRO_DELAY_MS,
      );
    };
    if (typeof IntersectionObserver === "undefined") {
      run();
      return () => clearTimeout(timer);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [targetRef, reducedMotion]);

  return { showVc, pulse, hint, choose, endPulse: () => setPulse(false) };
}

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
