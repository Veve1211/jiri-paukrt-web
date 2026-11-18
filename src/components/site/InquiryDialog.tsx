import type { ReactNode } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InquiryForm, type TopicValue } from "./InquiryForm";

export function InquiryDialog({
  trigger,
  topic,
  source,
  subject,
}: {
  trigger: ReactNode;
  topic?: TopicValue | undefined;
  source?: string | undefined;
  subject?: string | undefined;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass-strong max-h-[90vh] overflow-y-auto rounded-[14px] border-star/10 bg-ink/95 sm:max-w-lg">
        <div className="telemetry text-[10px] text-cyan">Open channel · Dublin HQ</div>
        <DialogTitle className="text-2xl font-light tracking-tight">
          {subject ? (
            <>
              Discuss <span className="font-bold">{subject}</span>
            </>
          ) : (
            "Send a transmission"
          )}
        </DialogTitle>
        <DialogDescription className="text-sm text-dim">
          Your message goes straight to Jiri. All fields except organisation are required.
        </DialogDescription>
        <InquiryForm
          compact
          defaultTopic={topic}
          source={source}
          defaultMessage={subject ? `Re: ${subject}\n\n` : ""}
        />
      </DialogContent>
    </Dialog>
  );
}
