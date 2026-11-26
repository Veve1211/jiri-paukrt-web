import { pageHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";

import { PageIntro } from "@/components/site/PageIntro";
import { PERSON } from "@/data/portfolio";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: ({ match }) =>
    pageHead(
      match,
      {
        title: "Privacy notice — Jiri Paukrt",
        description: "How personal data sent through the contact form on this website is used.",
      },
      {
        title: "Ochrana osobních údajů — Jiří Paukrt",
        description:
          "Jak se zpracovávají osobní údaje odeslané přes kontaktní formulář a jak uplatnit svá práva.",
      },
      "website",
    ),
  component: PrivacyPage,
});

const ITEMS: { title: string; titleCs: string; body: string; bodyCs: string }[] = [
  {
    title: "Who is responsible",
    titleCs: "Kdo za údaje odpovídá",
    body: `${PERSON.name}, Czech Republic, is responsible for this website and for the messages sent through it. This is a personal website and is not operated by ${PERSON.company}.`,
    bodyCs: `Za tento web a zprávy odeslané jeho prostřednictvím odpovídá Jiří Paukrt, Česká republika. Jde o osobní web, který neprovozuje ${PERSON.company}.`,
  },
  {
    title: "What is collected",
    titleCs: "Co se shromažďuje",
    body: "Only what you type into the contact form: your name, email address, optional organisation, the topic you choose and your message.",
    bodyCs:
      "Jen to, co zadáte do kontaktního formuláře: jméno, e-mail, případně organizaci, zvolené téma a text zprávy.",
  },
  {
    title: "Why it is used",
    titleCs: "K čemu se používá",
    body: "Solely to read and reply to your message. It is not used for marketing, not sold and not shared with anyone else.",
    bodyCs:
      "Výhradně k přečtení zprávy a odpovědi na ni. Údaje se nepoužívají k marketingu, neprodávají se a nikomu dalšímu se nepředávají.",
  },
  {
    title: "Where it is kept and for how long",
    titleCs: "Kde a jak dlouho se uchovává",
    body: "Messages are delivered to Jiri by email through the form service Web3Forms, and a copy is stored in the database of the website's hosting provider. They are kept only as long as needed to deal with your enquiry.",
    bodyCs:
      "Zprávy se doručují Jiřímu e-mailem přes formulářovou službu Web3Forms a kopie se ukládá v databázi poskytovatele hostingu webu. Uchovávají se jen po dobu nutnou k vyřízení dotazu.",
  },
  {
    title: "Your rights",
    titleCs: "Vaše práva",
    body: "Under the GDPR you can ask to see, correct or delete your data at any time — send a message through the contact form or on LinkedIn. You can also complain to a data protection authority, such as the Czech Office for Personal Data Protection (ÚOOÚ).",
    bodyCs:
      "Podle GDPR můžete kdykoli požádat o přístup ke svým údajům, jejich opravu nebo výmaz — napište přes kontaktní formulář nebo LinkedIn. Stížnost můžete podat také u dozorového úřadu, například u Úřadu pro ochranu osobních údajů (ÚOOÚ).",
  },
];

function PrivacyPage() {
  const { t } = useLang();
  return (
    <div className="px-4 pt-10 md:px-8">
      <PageIntro
        chart={t("PRIVACY", "SOUKROMÍ")}
        title={
          <>
            {t("Privacy ", "Ochrana ")}
            <span className="font-bold">{t("notice", "osobních údajů")}</span>
          </>
        }
      >
        {t(
          "A short, plain explanation of how the contact form works.",
          "Krátké a srozumitelné vysvětlení, jak funguje kontaktní formulář.",
        )}
      </PageIntro>
      <div className="mt-10 grid max-w-3xl gap-4">
        {ITEMS.map((i) => (
          <section key={i.title} className="glass rounded-[20px] p-6">
            <h2 className="text-lg font-semibold">{t(i.title, i.titleCs)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-starblue">{t(i.body, i.bodyCs)}</p>
          </section>
        ))}
        <Link to="/contact" className="mt-2 text-sm font-medium text-cyan hover:underline">
          {t("← Back to contact", "← Zpět na kontakt")}
        </Link>
      </div>
    </div>
  );
}
