import { createContext, useContext } from "react";

/** English by default. Czech is served at the same path with ?lang=cs. */
export type Lang = "en" | "cs";

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
