import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const TOPICS = [
  { value: "national-models", label: "National / strategic demand model" },
  { value: "microsimulation", label: "Microsimulation" },
  { value: "mega-events", label: "Mega-event transport" },
  { value: "gis-safety", label: "GIS & road safety" },
  { value: "other", label: "Something else" },
] as const;

export type TopicValue = (typeof TOPICS)[number]["value"];

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Keep it under 100 characters"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  organisation: z.string().trim().max(120, "Keep it under 120 characters").optional(),
  topic: z.enum(["national-models", "microsimulation", "mega-events", "gis-safety", "other"]),
  message: z
    .string()
    .trim()
    .min(10, "Tell Jiri a little more (at least 10 characters)")
    .max(2000, "Keep it under 2,000 characters"),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; reference: string }
  | { kind: "error"; message: string };

const fieldClass =
  "w-full rounded-[12px] border border-star/10 bg-star/[0.03] px-3.5 py-2.5 text-sm text-star placeholder:text-dim/60 outline-none transition-colors focus:border-cyan/50 focus:bg-cyan/[0.04] aria-[invalid=true]:border-alert/60";

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
    if (honeypot) {
      setStatus({ kind: "sent", reference: "TX-00000000" });
      return;
    }
    setStatus({ kind: "sending" });
    const id = crypto.randomUUID();
    const { error } = await supabase.from("contact_inquiries").insert({
      id,
      name: parsed.data.name,
      email: parsed.data.email,
      organisation: parsed.data.organisation || null,
      topic: parsed.data.topic,
      message: parsed.data.message,
      source: source ?? null,
    });
    if (error) {
      setStatus({
        kind: "error",
        message: "The transmission didn't go through. Check your connection and try again.",
      });
      return;
    }
    setStatus({ kind: "sent", reference: `TX-${id.slice(0, 8).toUpperCase()}` });
  }

  if (status.kind === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 py-4 animate-in fade-in-0">
        <div className="flex size-11 items-center justify-center rounded-full bg-cyan/10 text-cyan shadow-glow">
          <CheckCircle2 className="size-5" />
        </div>
        <div>
          <div className="telemetry text-[10px] text-cyan">Transmission received · {status.reference}</div>
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
          placeholder="Project scope, timeline, the question you're trying to answer…"
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
        <p role="alert" className="rounded-[12px] border border-alert/40 bg-alert/10 px-3.5 py-2.5 text-sm text-star">
          {status.message}
        </p>
      )}
      <Button type="submit" variant="glow" size="pill" disabled={sending} className="w-full font-medium sm:w-auto">
        {sending ? (
          <>
            <Loader2 className="animate-spin" /> Transmitting…
          </>
        ) : status.kind === "error" ? (
          "Try again →"
        ) : (
          "Send transmission →"
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
