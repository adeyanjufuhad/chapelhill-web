import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { heroCopy } from "./build-manifest";

/** Primary follows the surrounding theme (oxblood on light, gold on dark); `tone` styles the outline button. */
export function HeroCtas({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Button asChild size="lg" className="h-12 rounded-full px-7">
        <Link href={heroCopy.primaryCta.href}>{heroCopy.primaryCta.label}</Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className={cn(
          "h-12 rounded-full bg-transparent px-6",
          tone === "dark"
            ? "border-cream/40 text-cream hover:bg-cream/10 hover:text-cream"
            : "border-ink/20 text-ink hover:bg-ink/5",
        )}
      >
        <a href={whatsappLink(heroCopy.whatsappCta.message)} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon className="size-4" />
          {heroCopy.whatsappCta.label}
        </a>
      </Button>
    </div>
  );
}
