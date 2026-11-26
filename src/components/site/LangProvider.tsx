import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, type ReactNode } from "react";

import { LangContext, useLang, type LangValue } from "@/lib/i18n";

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useRouterState({ select: (s) => s.matches[0]?.search.lang }) ?? "en";
  const value = useMemo<LangValue>(
    () => ({
      lang,
      t: (en, cs) => (lang === "cs" ? cs : en),
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/** EN | CZ switch for the header. */
export function LangSwitch({ className }: { className?: string }) {
  const { lang } = useLang();
  return (
    <div
      role="group"
      aria-label={lang === "cs" ? "Jazyk" : "Language"}
      className={`inline-flex items-center rounded-full border border-star/15 p-0.5 font-mono text-[10.5px] tracking-wider ${className ?? ""}`}
    >
      {(["en", "cs"] as const).map((l) => (
        <Link
          key={l}
          to="."
          search={(current) => ({ ...current, lang: l })}
          resetScroll={false}
          aria-current={lang === l ? "page" : false}
          hrefLang={l}
          className={`rounded-full px-2.5 py-1 transition-colors ${lang === l ? "bg-star/15 text-star" : "text-dim hover:text-star"}`}
        >
          {l === "en" ? "EN" : "CZ"}
        </Link>
      ))}
    </div>
  );
}
