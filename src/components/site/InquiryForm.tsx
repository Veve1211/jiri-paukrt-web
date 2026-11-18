import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const TOPICS = [
  { value: "role", label: "A role or job opportunity" },
  { value: "national-models", label: "National / strategic demand model" },
  { value: "microsimulation", label: "Microsimulation" },
  { value: "mega-events", label: "Major-event transport" },
  { value: "gis-safety", label: "GIS & road safety" },
  { value: "other", label: "Something else" },
] as const;

export type TopicValue = (typeof TOPICS)[number]["value"];

// --- Junk filters ----------------------------------------------------------
// Client-side checks that stop careless spam and nonsense messages. They are not a
// substitute for server-side protection, which is managed in Lovable.

const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "throwawaymail.com",
];
const URL_RE = /(https?:\/\/|www\.)/gi; // global: for counting links
const HAS_URL = /(https?:\/\/|www\.)/i; // non-global: safe for .test()
const MIN_FILL_MS = 4000;
const COOLDOWN_MS = 10 * 60 * 1000;
const COOLDOWN_KEY = "inquiry-last-sent";

function looksLikeGibberish(text: string): boolean {
  const letters = (text.match(/\p{L}/gu) ?? []).length;
  if (letters < text.replace(/\s/g, "").length * 0.6) return true; // mostly symbols or digits
  if (/(.)\1{6,}/u.test(text)) return true; // "aaaaaaa", "!!!!!!!"
  const words = text.split(/\s+/).filter((w) => /\p{L}{2,}/u.test(w));
  if (words.length < 4) return true; // too few real words to be a question
  if (words.some((w) => w.length > 40)) return true; // keyboard mashing
  return false;
}

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(100, "Keep it under 100 characters")
    .refine((v) => /\p{L}{2,}/u.test(v), "Please enter your name")
    .refine((v) => !HAS_URL.test(v), "A name can't contain a link"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(255)
    .refine(
      (v) => !DISPOSABLE_DOMAINS.includes(v.split("@")[1]?.toLowerCase() ?? ""),
      "Please use a permanent email address so Jiri can reply",
    ),
  organisation: z.string().trim().max(120, "Keep it under 120 characters").optional(),
  topic: z.enum(["role", "national-models", "microsimulation", "mega-events", "gis-safety", "other"]),
  message: z
    .string()
    .trim()
    .min(30, "Please describe your question in a sentence or two (at least 30 characters)")
    .max(2000, "Keep it under 2,000 characters")
    .refine((v) => (v.match(URL_RE) ?? []).length <= 2, "Please include no more than two links")
    .refine((v) => !looksLikeGibberish(v), "This doesn't look like a question yet — please write it in a few words"),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; reference: string }
  | { kind: "error"; message: string };

const fieldClass =
  "w-full rounded-[14px] border border-star/10 bg-star/[0.03] px-3.5 py-2.5 text-sm text-star placeholder:text-dim/60 outline-none transition-colors focus:border-cyan/50 focus:bg-cyan/[0.04] aria-[invalid=true]:border-alert/60";

export function InquiryForm({
  defaultTopic = "other",
  source,
  defaultMessage = "",
  compact = false,
}: {
  defaultTopic?: TopicValue | undefined;
  source?: string | undefined;
  defaultMessage?: string | undefined;
  compact?: boolean | undefined;
}) {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    organisation: "",
    topic: defaultTopic,
    message: defaultMessage,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");
  const openedAt = useRef(Date.now());
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    let lastSent = 0;
    try {
      lastSent = Number(window.localStorage.getItem(COOLDOWN_KEY) ?? 0);
    } catch {
      // storage unavailable — skip the cooldown check
    }
    if (Date.now() - lastSent < COOLDOWN_MS) {
      setStatus({
        kind: "error",
        message: "You've just sent a message. Please wait a few minutes before sending another.",
      });
      return;
    }
    // Bots fill the hidden field or submit within a couple of seconds of loading.
    if (honeypot || Date.now() - openedAt.current < MIN_FILL_MS) {
      setStatus({ kind: "sent", reference: "MSG-00000000" });
      return;
    }
    setStatus({ kind: "sending" });
    const id = crypto.randomUUID();
    const { error } = await supabase.from("contact_inquiries").insert({
      id,
      name: parsed.data.name,
      email: parsed.data.email,
      organisation: parsed.data.organisation || null,
      // The database only accepts the original topics, so job enquiries are stored
      // as "other" and tagged in `source`.
      topic: parsed.data.topic === "role" ? "other" : parsed.data.topic,
      message: parsed.data.message,
      source: parsed.data.topic === "role" ? `role:${source ?? "site"}`.slice(0, 120) : (source ?? null),
    });
    if (error) {
      setStatus({
        kind: "error",
        message: "The message didn't go through. Check your connection and try again.",
      });
      return;
    }
    try {
      window.localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    } catch {
      // storage unavailable — nothing to remember
    }
    setStatus({ kind: "sent", reference: `MSG-${id.slice(0, 8).toUpperCase()}` });
  }

  if (status.kind === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 py-4 animate-in fade-in-0">
        <div className="flex size-11 items-center justify-center rounded-full bg-cyan/10 text-cyan shadow-glow">
          <CheckCircle2 className="size-5" />
        </div>
        <div>
          <div className="telemetry text-[10px] text-cyan">Message received · {status.reference}</div>
          <h3 className="mt-2 text-xl font-medium">Thanks, {values.name.split(" ")[0]}.</h3>
          <p className="mt-1 max-w-sm text-sm text-dim">
            Your message is logged for Jiri. He'll reply to {values.email}.
          </p>
        </div>
        <Button
          variant="glass"
          className="h-10 px-5"
          onClick={() => {
            setValues({ name: "", email: "", organisation: "", topic: defaultTopic, message: "" });
            setStatus({ kind: "idle" });
          }}
        >
          <RotateCcw /> Send another message
        </Button>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field label="Name" error={errors.name} htmlFor="inq-name">
          <input
            id="inq-name"
            className={fieldClass}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
            aria-invalid={!!errors.name}
            maxLength={100}
          />
        </Field>
        <Field label="Email" error={errors.email} htmlFor="inq-email">
          <input
            id="inq-email"
            type="email"
            className={fieldClass}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
            aria-invalid={!!errors.email}
            maxLength={255}
          />
        </Field>
      </div>
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field label="Organisation (optional)" error={errors.organisation} htmlFor="inq-org">
          <input
            id="inq-org"
            className={fieldClass}
            value={values.organisation}
            onChange={(e) => set("organisation", e.target.value)}
            autoComplete="organization"
            maxLength={120}
          />
        </Field>
        <Field label="Topic" htmlFor="inq-topic">
          <select
            id="inq-topic"
            className={cn(fieldClass, "appearance-none bg-ink")}
            value={values.topic}
            onChange={(e) => set("topic", e.target.value as TopicValue)}
          >
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Message" error={errors.message} htmlFor="inq-message" hint={`${values.message.length}/2000`}>
        <textarea
          id="inq-message"
          rows={compact ? 4 : 5}
          className={cn(fieldClass, "resize-y")}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
          maxLength={2000}
          placeholder="The role or project, where it is based and the timeline…"
        />
      </Field>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />
      {status.kind === "error" && (
        <p role="alert" className="rounded-[14px] border border-alert/40 bg-alert/10 px-3.5 py-2.5 text-sm text-star">
          {status.message}
        </p>
      )}
      <p className="text-xs leading-relaxed text-dim">
        Your details are used only to reply to your message.{" "}
        <a href="/privacy" className="text-cyan underline-offset-2 hover:underline">
          Privacy notice
        </a>
      </p>
      <Button type="submit" variant="glow" size="pill" disabled={sending} className="w-full font-medium sm:w-auto">
        {sending ? (
          <>
            <Loader2 className="animate-spin" /> Sending…
          </>
        ) : status.kind === "error" ? (
          "Try again →"
        ) : (
          "Send message →"
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  error?: string | undefined;
  htmlFor: string;
  hint?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="telemetry text-[10px] text-dim">
          {label}
        </label>
        {hint && <span className="font-mono text-[10px] text-dim/60">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1.5 text-xs text-alert">{error}</p>}
    </div>
  );
}
