import type { ReactNode } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLang } from "@/lib/i18n";
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
  const { t } = useLang();
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass-strong max-h-[90vh] overflow-y-auto rounded-[20px] border-star/10 bg-ink/95 sm:max-w-lg">
        <div className="telemetry text-[10px] text-cyan">{t("Message to Jiri", "Zpráva pro Jiřího")}</div>
        <DialogTitle className="text-2xl font-light tracking-tight">
          {subject ? (
            <>
              {t("Discuss ", "Dotaz: ")}
              <span className="font-bold">{subject}</span>
            </>
          ) : (
            t("Send a message", "Napsat zprávu")
          )}
        </DialogTitle>
        <DialogDescription className="text-sm text-dim">
          {t("All fields except organisation are required.", "Vyplňte všechna pole kromě organizace.")}
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
