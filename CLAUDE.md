# CLAUDE.md - Živý dokument. Průběžně aktualizuj, udržuj krátký a přehledný.

## Projekt
* Název: Jiri Paukrt — osobní web (vizitka a online CV)
* Cíl: zaujmout tak, aby Jirkovi někdo nabídl práci. Jirka = Jiri Paukrt, Ing., Principal Transportation Engineer, SYSTRA Dublin, 27 let praxe.
* Cílová skupina: personalisté a firmy z oboru dopravního inženýrství, mezinárodně.
* Adresa: paukrt.lovable.app

## Jazyk
* Web VÝHRADNĚ anglicky. Žádný přepínač jazyků, žádná česká verze v UI.
* Kód, komentáře a commity anglicky.

## Styl
* Moderní, modrá barva, motiv silnic, křižovatek a dopravního modelu.
* Žádný vesmír, žádná Jirkova fotka.
* Design nesmí přebít odborné úspěchy. "Principal Engineer" musí vyniknout.

## Obsah
* Zdroj faktů: export Jirkova LinkedInu a `src/data/portfolio.ts`. Fakta si nevymýšlej.
* Publikace: NTA/ETC 2025, ETC 2019 Dublin, STAR 2017 Glasgow, ICTTE 2014 Belgrade. Počet v UI musí sedět se seznamem.

## Pravidla (nikdy neporušit)
* NIKDY text o hledání práce ("open to roles", "available", "hledám práci"). Nadřízení v SYSTRA to nesmí vidět.
* Žádný placeholder ani lorem ipsum v UI.
* Žádná soukromá adresa ani osobní telefon na webu ani v PDF CV.
* Obrázky (např. og.png) patří do `/public`, ne na externí dočasné adresy.
* Opakované (dekorativní) kopie obsahu mají `aria-hidden`.
* Needituj `supabase/migrations/`, `drizzle/` ani automaticky generované soubory (viz AGENTS.md).

## Git
* Práce na větvi `dev`, do `main` jen otestované. `main` se synchronizuje do Lovable.
* Nikdy force push ani přepis historie.

## Před publikováním
* Test na mobilu, tabletu i počítači.
* Kontrola: žádný text o hledání práce, žádný přepínač jazyků, odkazy fungují.
