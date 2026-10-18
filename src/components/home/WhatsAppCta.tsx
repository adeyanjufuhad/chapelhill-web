import Image from "next/image";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { company } from "@/content/company";
import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppCta() {
  const primary = company.contact.phones[0];

  return (
    <section aria-labelledby="cta-heading" className="theme-oxblood relative isolate overflow-hidden">
      {/* Last frame of the build sequence: the finished home. */}
      <Image src="/build/final.webp" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="from-oxblood-deep/95 via-oxblood-deep/75 to-oxblood-deep/30 absolute inset-0 -z-10 bg-gradient-to-r" />

      <Reveal className="container-luxe py-28 sm:py-40">
        <p className="eyebrow">Begin the conversation</p>
        <div className="rule-gold mt-5" />
        <h2 id="cta-heading" className="mt-6 max-w-2xl text-4xl leading-[1.05] sm:text-6xl">
          Your home, built with care. <span className="accent-italic block">Let’s talk.</span>
        </h2>
        <p className="text-muted-foreground mt-6 max-w-lg text-base leading-relaxed sm:text-lg">
          Message our team on WhatsApp for prices, payment plans or a virtual inspection. We are here 7 days a week and respond within 24 hours.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 px-7">
            <a href={whatsappLink("Hello Chapelhill, I’d like to discuss buying a home.")} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-cream/40 text-cream hover:bg-cream/10 hover:text-cream h-12 bg-transparent px-7"
          >
            <a href={`tel:${primary.e164}`}>
              <Phone aria-hidden="true" />
              {primary.display}
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
