# Bezpečnostní kontrola

Poslední kontrola: 18. 11. 2026. Postup podle bezpečnostní matice z manuálu Vibecoding Akademie (secrets, databáze, závislosti).

## V pořádku

1. **žádné tajné klíče v kódu ani v historii.** Prohledána celá historie gitu (33 commitů). Klíč `SUPABASE_SERVICE_ROLE_KEY` se načítá jen z prostředí serveru a v repu není.
2. **databáze je zamčená.** Tabulka `contact_inquiries` má zapnuté Row Level Security. Veřejnost smí jen vkládat (`INSERT`), zprávy nikdo zvenku číst nemůže. Délky polí hlídá přímo databáze (`CHECK`).
3. **ochrana formuláře proti spamu:** skryté pole (honeypot), minimální čas vyplnění 4 s, 10 minut pauza mezi zprávami, blokace jednorázových e-mailů, limit odkazů a filtr nesmyslného textu.
4. **žádné osobní údaje navíc.** Na webu ani v PDF CV není soukromá adresa ani osobní telefon.

## Upozornění (vědomě přijaté)

1. **`.env` je v repu.** Soubor obsahuje jen *veřejné* údaje Supabase (URL a publishable key), které stejně dostává každý prohlížeč. Soubor spravuje Lovable, proto zůstává.
2. **klíč Web3Forms je v kódu.** Je veřejný záměrně: umí jen poslat zprávu na jednu předem registrovanou adresu. Riziko je nanejvýš spam, proti kterému má Web3Forms vlastní ochranu.

## K řešení

1. **zranitelné balíčky.** `bun audit` hlásí 30 nálezů (1 kritický, 15 vysokých). Většina jsou vývojové nástroje (vite, esbuild, launch-editor, shell-quote), které na produkčním webu neběží. Za běhu webu se týká jen `seroval` (přes TanStack Router; střední závažnost) a `zod`. Řešení: `bun audit fix`, potom `npx tsc --noEmit`, `npx vitest run` a kontrola webu, než to půjde do `main`.
2. **historie commitů.** Jedna zpráva commitu zmiňuje odstranění textu o hledání práce. Dokud je to tak, repo by mělo zůstat soukromé a přístup se dává pozváním jako collaborator.
