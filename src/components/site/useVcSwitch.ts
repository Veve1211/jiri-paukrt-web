import { useEffect, useRef, useState, type RefObject } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-telemetry";

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
