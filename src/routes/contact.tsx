import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";

import { MonogramBadge } from "@/components/site/BrandMark";
import { InquiryForm } from "@/components/site/InquiryForm";
import { PageIntro } from "@/components/site/PageIntro";
import { Button } from "@/components/ui/button";
import { PERSON } from "@/data/portfolio";
import { useUtcClock } from "@/hooks/use-telemetry";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Dublin HQ — Jiri Paukrt" },
      {
        name: "description",
        content:
          "Get in touch with Jiri Paukrt, Principal Transportation Engineer at SYSTRA Dublin, about demand modelling, microsimulation, mega-events or GIS.",
      },
      { property: "og:title", content: "Contact & Dublin HQ — Jiri Paukrt" },
      {
        property: "og:description",
        content: "Send a message or connect on LinkedIn. Dublin HQ · 53.3498° N · 6.2603° W.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function DublinTime() {
  const utc = useUtcClock();
  const local = utc
    ? new Intl.DateTimeFormat("en-IE", { timeZone: "Europe/Dublin", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date())
    : "--:--";
  return <span>{local}</span>;
}

function ContactPage() {
  return (
    <div className="px-4 pt-10 md:px-8">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <PageIntro
            chart="CHART 07 — OPEN CHANNEL"
            title={
              <>
                Contact &amp; <span className="font-bold">Dublin HQ</span>
              </>
            }
          >
            Planning a national model, a town-centre microsimulation or transport for a major event? Send a
            transmission or connect on LinkedIn.
          </PageIntro>

          <div className="glass mt-10 flex items-center gap-5 rounded-[14px] p-5">
            <MonogramBadge className="size-24 shrink-0" />
            <div>
              <div className="telemetry text-[10px] text-cyan">Dublin HQ</div>
              <div className="mt-1 text-lg font-medium">{PERSON.name}</div>
              <div className="text-sm text-dim">
                {PERSON.role} · {PERSON.company}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10.5px] tracking-wider text-dim">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3 text-cyan" /> {PERSON.coordinates}
                </span>
                <span>
                  LOCAL <DublinTime />
                </span>
              </div>
            </div>
          </div>

          <Button asChild variant="glass" size="pill" className="mt-4">
            <a href={PERSON.linkedin} target="_blank" rel="noreferrer">
              Connect on LinkedIn <ArrowUpRight />
            </a>
          </Button>
        </div>

        <section className="glass rounded-[14px] p-5 md:p-7 lg:col-span-7" aria-labelledby="form-title">
          <div className="telemetry text-[10px] text-cyan">New transmission</div>
          <h2 id="form-title" className="mt-2 mb-6 text-2xl font-light tracking-tight">
            Send Jiri a <span className="font-bold">message</span>
          </h2>
          <InquiryForm source="contact-page" />
        </section>
      </div>
    </div>
  );
}
