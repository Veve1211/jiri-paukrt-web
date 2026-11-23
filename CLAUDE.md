# CLAUDE.md - Živý dokument. Průběžně aktualizuj, udržuj krátký a přehledný.

## Projekt
* Název: Jiri Paukrt — osobní web (vizitka a online CV)
* Cíl: představit Jirkovu odbornost a projekty. Jirka = Jiri Paukrt, Ing., Principal Transportation Engineer, SYSTRA Dublin, 27 let praxe.
* Cílová skupina: odborníci a firmy z oboru dopravního inženýrství, mezinárodně. Web anglicky i česky (EN výchozí).
* Adresa: paukrt.lovable.app

## Uživatel
* Skill level: začátečník. AI rozhoduje technickou syntaxi a architekturu sama, uživatelce vysvětluje funkčně a jednoduše česky.

## Stack & Prostředí
* Framework: TanStack Start + React 19 + TypeScript, build Vite
* UI: Tailwind CSS 4 + shadcn/ui (`src/components/ui`), vlastní komponenty v `src/components/site`
* Data: obsah webu v `src/data/portfolio.ts`; Supabase spravuje Lovable
* Hosting: Lovable (paukrt.lovable.app), repo GitHub Veve1211/transport-constellation-atlas
* Testy: `npx vitest run`, typy: `npx tsc --noEmit`. Před každým pushem obojí musí projít.
* Testy v prohlížeči: `bun run test:e2e` (Playwright: počítač, tablet, mobil; všechny stránky EN i CZ, axe WCAG 2.1 AA, kontrola textu o hledání práce, formulář). Běží i v CI. V cloud sandboxu s `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
* Zákaz: secrets a `.env` hodnoty nikdy do repa.

## Jazyk
* Web je dvojjazyčný: angličtina výchozí, čeština přes přepínač EN/CZ v hlavičce.
* Každý nový nebo změněný text musí mít obě verze (`t("en", "cs")`, `portfolio.cs.ts`). Žádný text jen v jednom jazyce.
* Kód, komentáře a commity anglicky.

## Styl
* Moderní, modrá barva, motiv silnic, křižovatek a dopravního modelu.
* Žádný vesmír, žádná Jirkova fotka.
* Design nesmí přebít odborné úspěchy. "Principal Engineer" musí vyniknout.

## Obsah
* Zdroj faktů: export Jirkova LinkedInu a `src/data/portfolio.ts`. Fakta si nevymýšlej.
* Publikace: NTA/ETC 2025, ETC 2019 Dublin, STAR 2017 Glasgow, ICTTE 2014 Belgrade. Počet v UI musí sedět se seznamem.

## Pravidla (nikdy neporušit)
* NIKDY text o hledání práce ("open to roles", "available", "hledám práci"). Web Jirku představuje, neinzeruje.
* Žádný placeholder ani lorem ipsum v UI.
* Žádná soukromá adresa ani osobní telefon na webu ani v PDF CV.
* Obrázky patří do `/public`, ne na externí dočasné adresy. Náhled pro sdílení: `public/og.png` (1200×630), og:image nastavený v `src/routes/index.tsx`.
* Opakované (dekorativní) kopie obsahu mají `aria-hidden`.
* Needituj `supabase/migrations/`, `drizzle/` ani automaticky generované soubory (viz AGENTS.md).

## Git
* Práce na větvi `dev`, do `main` jen otestované. `main` se synchronizuje do Lovable.
* Nikdy force push ani přepis historie.
* Na začátku každé práce `git pull` (do repa píše i Lovable a další nástroje). Na konci commit a push. Při nepushnutých změnách upozorni uživatelku.
* Nikdy necommituj přímo do `main` a nenahrávej soubory přes web GitHubu; změny jen přes Claude Code → `dev` → PR → `main` (CI: lint, typy, testy, build).

## Před publikováním
* Test na mobilu, tabletu i počítači.
* Kontrola: žádný text o hledání práce, přepínač EN/CZ funguje a česká verze je kompletní, odkazy fungují.
