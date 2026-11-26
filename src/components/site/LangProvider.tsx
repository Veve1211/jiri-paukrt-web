import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo, type ReactNode } from "react";

import { LangContext, useLang, type LangValue } from "@/lib/i18n";

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useRouterState({ select: (s) => s.matches[0]?.search.lang }) ?? "en";
  const navigate = useNavigate();
  const value = useMemo<LangValue>(
    () => ({
      lang,
      setLang: (language) => {
        void navigate({
          to: ".",
          search: (current) => ({ ...current, lang: language }),
          resetScroll: false,
        });
      },
      t: (en, cs) => (lang === "cs" ? cs : en),
    }),
    [lang, navigate],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/** EN | CZ switch for the header. */
export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label={lang === "cs" ? "Jazyk" : "Language"}
      className={`inline-flex items-center rounded-full border border-star/15 p-0.5 font-mono text-[10.5px] tracking-wider ${className ?? ""}`}
    >
      {(["en", "cs"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 transition-colors ${lang === l ? "bg-star/15 text-star" : "text-dim hover:text-star"}`}
        >
          {l === "en" ? "EN" : "CZ"}
        </button>
      ))}
    </div>
  );
}
