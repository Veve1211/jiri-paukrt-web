import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";

import { MonogramBadge } from "@/components/site/BrandMark";
import { InquiryForm } from "@/components/site/InquiryForm";
import { PageIntro } from "@/components/site/PageIntro";
import { Button } from "@/components/ui/button";
import { PERSON } from "@/data/portfolio";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Jiri Paukrt" },
      {
        name: "description",
        content:
          "Get in touch with Jiri Paukrt, Principal Transportation Engineer at SYSTRA in Dublin, about demand modelling, microsimulation, major events or road safety.",
      },
      { property: "og:title", content: "Contact — Jiri Paukrt" },
      {
        property: "og:description",
        content: "Send a message or connect on LinkedIn. Works for SYSTRA in Dublin, based in the Czech Republic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLang();
  return (
    <div className="px-4 pt-10 md:px-8">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <PageIntro
            chart={t("CONTACT", "KONTAKT")}
            title={
              <>
                {t("Get in ", "Napište ")}
                <span className="font-bold">{t("touch", "zprávu")}</span>
              </>
            }
          >
            {t(
              "Questions about transport modelling, one of the projects or a paper? Send a message or connect on LinkedIn.",
              "Máte otázku k dopravnímu modelování, některému z projektů nebo článků? Pošlete zprávu nebo se spojte přes LinkedIn.",
            )}
          </PageIntro>

          <div className="glass mt-10 flex items-center gap-5 rounded-[20px] p-5">
            <MonogramBadge className="size-24 shrink-0" />
            <div>
              <div className="telemetry text-[10px] text-cyan">{t("Based in the Czech Republic", "Žije v Česku")}</div>
              <div className="mt-1 text-lg font-medium">{t(PERSON.name, "Jiří Paukrt")}</div>
              <div className="text-sm text-dim">
                {t(PERSON.role, "Hlavní dopravní inženýr")} · {PERSON.company}
              </div>
              <div className="mt-3 flex items-center gap-1.5 font-mono text-[10.5px] tracking-wider text-dim uppercase">
                <MapPin className="size-3 text-cyan" /> {t("Czech Republic · SYSTRA Dublin", "Česko · SYSTRA Dublin")}
              </div>
            </div>
          </div>

          <p className="mt-4 max-w-md text-xs leading-relaxed text-dim">
            {t(
              "Jiri works for SYSTRA. Enquiries about commissioning modelling work are handled through SYSTRA; this page is for questions about his projects, papers and experience.",
              "Jiří pracuje pro SYSTRA. Zakázky na modelování se zadávají přes SYSTRA; tato stránka slouží k otázkám o jeho projektech, článcích a zkušenostech.",
            )}
          </p>
          <Button asChild variant="glass" size="pill" className="mt-4">
            <a href={PERSON.linkedin} target="_blank" rel="noreferrer">
              {t("Connect on LinkedIn", "Spojit se na LinkedInu")} <ArrowUpRight />
            </a>
          </Button>
        </div>

        <section className="glass rounded-[20px] p-5 md:p-7 lg:col-span-7" aria-labelledby="form-title">
          <div className="telemetry text-[10px] text-cyan">{t("Message", "Zpráva")}</div>
          <h2 id="form-title" className="mt-2 mb-6 text-2xl font-light tracking-tight">
            {t("Send Jiri a ", "Napište Jiřímu ")}
            <span className="font-bold">{t("message", "zprávu")}</span>
          </h2>
          <InquiryForm source="contact-page" />
        </section>
      </div>
    </div>
  );
}
