import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Two-language support (English default, Czech). The choice is kept in the URL
 * (?lang=cs) when present, otherwise in localStorage. Server render is English;
 * the browser switches after mount.
 */

export type Lang = "en" | "cs";

const STORAGE_KEY = "site-lang";

interface LangValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Pick the string for the current language. */
  t: (en: string, cs: string) => string;
}

const LangContext = createContext<LangValue>({
  lang: "en",
  setLang: () => {},
  t: (en) => en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let initial: Lang = "en";
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("lang");
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (fromUrl === "cs" || fromUrl === "en") initial = fromUrl;
      else if (stored === "cs" || stored === "en") initial = stored;
    } catch {
      // storage unavailable — stay in English
    }
    setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // nothing to remember
    }
  }, []);

  const value = useMemo<LangValue>(
    () => ({ lang, setLang, t: (en: string, cs: string) => (lang === "cs" ? cs : en) }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
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
