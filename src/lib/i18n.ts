import { createContext, useContext } from "react";

/**
 * Two-language support (English default, Czech). The choice is kept in the URL
 * (?lang=cs) when present, otherwise in localStorage. Server render is English;
 * the browser switches after mount.
 */

export type Lang = "en" | "cs";

export const STORAGE_KEY = "site-lang";

export interface LangValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Pick the string for the current language. */
  t: (en: string, cs: string) => string;
}

export const LangContext = createContext<LangValue>({
  lang: "en",
  setLang: () => {},
  t: (en) => en,
});

export function useLang() {
  return useContext(LangContext);
}
