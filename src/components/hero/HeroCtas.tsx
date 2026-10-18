import { PillLink } from "@/components/site/PillLink";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { heroCopy } from "./build-manifest";

/** Primary pill plus WhatsApp pill; `tone` matches the surface they sit on. */
export function HeroCtas({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <PillLink href={heroCopy.primaryCta.href} variant={tone === "dark" ? "gold" : "primary"}>
        {heroCopy.primaryCta.label}
      </PillLink>
      <PillLink
        href={whatsappLink(heroCopy.whatsappCta.message)}
        external
        variant={tone === "dark" ? "dark" : "light"}
        icon={<WhatsAppIcon className="size-4" />}
      >
        {heroCopy.whatsappCta.label}
      </PillLink>
    </div>
  );
}
