import { createFileRoute, Link } from "@tanstack/react-router";

import { PageIntro } from "@/components/site/PageIntro";
import { PERSON } from "@/data/portfolio";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy notice — Jiri Paukrt" },
      { name: "description", content: "How personal data sent through the contact form on this website is used." },
      { property: "og:title", content: "Privacy notice — Jiri Paukrt" },
      { property: "og:description", content: "How personal data sent through the contact form is used." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const ITEMS: { title: string; body: string }[] = [
  {
    title: "Who is responsible",
    body: `${PERSON.name}, ${PERSON.home}, is responsible for this website and for the messages sent through it. This is a personal website and is not operated by ${PERSON.company}.`,
  },
  {
    title: "What is collected",
    body: "Only what you type into the contact form: your name, email address, optional organisation, the topic you choose and your message.",
  },
  {
    title: "Why it is used",
    body: "Solely to read and reply to your message. It is not used for marketing, not sold and not shared with anyone else.",
  },
  {
    title: "Where it is kept and for how long",
    body: "Messages are stored in the database of the website's hosting provider and kept only as long as needed to deal with your enquiry.",
  },
  {
    title: "Your rights",
    body: "Under the GDPR you can ask to see, correct or delete your data at any time — send a message through the contact form or on LinkedIn. You can also complain to the Data Protection Commission in Ireland (dataprotection.ie).",
  },
];

function PrivacyPage() {
  return (
    <div className="px-4 pt-10 md:px-8">
      <PageIntro
        chart="PRIVACY"
        title={
          <>
            Privacy <span className="font-bold">notice</span>
          </>
        }
      >
        A short, plain explanation of how the contact form works.
      </PageIntro>
      <div className="mt-10 grid max-w-3xl gap-4">
        {ITEMS.map((i) => (
          <section key={i.title} className="glass rounded-[20px] p-6">
            <h2 className="text-lg font-semibold">{i.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-starblue">{i.body}</p>
          </section>
        ))}
        <Link to="/contact" className="mt-2 text-sm font-medium text-cyan hover:underline">
          ← Back to contact
        </Link>
      </div>
    </div>
  );
}
