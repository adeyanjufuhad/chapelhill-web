import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { heroCopy } from "./build-manifest";

export function HeroCtas({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Button asChild size="lg" className="h-12 px-7">
        <Link href={heroCopy.primaryCta.href}>{heroCopy.primaryCta.label}</Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="border-cream/40 text-cream hover:bg-cream/10 hover:text-cream h-12 bg-transparent px-7"
      >
        <a href={whatsappLink(heroCopy.whatsappCta.message)} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" />
          {heroCopy.whatsappCta.label}
        </a>
      </Button>
    </div>
  );
}
