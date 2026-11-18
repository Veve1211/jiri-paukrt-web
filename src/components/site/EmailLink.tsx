import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

// Stored in parts and assembled only in the browser, so simple scrapers reading the
// HTML don't find a ready-made address.
const USER = "paukrt";
const DOMAIN = ["yahoo", "com"];

export function EmailLink({ className }: { className?: string }) {
  const [address, setAddress] = useState<string | null>(null);
  useEffect(() => setAddress(`${USER}@${DOMAIN.join(".")}`), []);
  return (
    <a
      href={address ? `mailto:${address}` : undefined}
      className={cn("inline-flex items-center gap-2 text-sm text-star hover:text-cyan", className)}
    >
      <Mail className="size-4 text-cyan" />
      {address ?? `${USER} [at] ${DOMAIN.join(" [dot] ")}`}
    </a>
  );
}
