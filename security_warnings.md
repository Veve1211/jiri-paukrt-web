# Bezpečnostní kontrola

Poslední kontrola: 23. 11. 2026. Postup podle bezpečnostní matice z manuálu Vibecoding Akademie (secrets, databáze, závislosti).

## V pořádku

1. **žádné tajné klíče v kódu ani v historii.** Prohledána celá historie gitu (23. 11. 2026, 82 commitů). Klíč `SUPABASE_SERVICE_ROLE_KEY` se načítá jen z prostředí serveru a v repu není.
2. **databáze je zamčená.** Tabulka `contact_inquiries` má zapnuté Row Level Security. Veřejnost smí jen vkládat (`INSERT`), zprávy nikdo zvenku číst nemůže. Délky polí hlídá přímo databáze (`CHECK`).
3. **ochrana formuláře proti spamu:** skryté pole (honeypot), minimální čas vyplnění 4 s, 10 minut pauza mezi zprávami, blokace jednorázových e-mailů, limit odkazů a filtr nesmyslného textu.
4. **žádné osobní údaje navíc.** Na webu ani v PDF CV není soukromá adresa ani osobní telefon.

## Upozornění (vědomě přijaté)

1. **`.env` je v repu.** Soubor obsahuje jen *veřejné* údaje Supabase (URL a publishable key), které stejně dostává každý prohlížeč. Soubor spravuje Lovable, proto zůstává.
2. **klíč Web3Forms je v kódu.** Je veřejný záměrně: umí jen poslat zprávu na jednu předem registrovanou adresu. Riziko je nanejvýš spam, proti kterému má Web3Forms vlastní ochranu.

## Závislosti

1. **opraveno 18. 11. 2026.** `bun audit fix` a aktualizace vite (8.1.6) a vitest (4.1.12) snížily počet nálezů z 30 (1 kritický, 15 vysokých) na 4. Opravený je i kritický `shell-quote` a `seroval`, který běží přímo na webu. Po aktualizaci prošly typy, testy i build.
2. **23. 11. 2026: přechod na zod 4** (validace kontaktního formuláře). Tím zmizel jediný vysoký nález.
3. **zbývají 2 střední, vědomě ponecháno:** `esbuild` a `minimatch` jsou nástroje pro build a vývojový server, na živém webu neběží.

## Vědomé rozhodnutí

1. **repo je veřejné (od 18. 11. 2026).** Jedna zpráva commitu v historii zmiňuje odstranění textu o hledání práce. Historie se nepřepisuje (rozbilo by to synchronizaci s Lovable), riziko je tedy vědomě přijaté.
