import Image from "next/image";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { company } from "@/content/company";
import { stock } from "@/content/stock";
import { whatsappLink } from "@/lib/whatsapp";

/** Airy closing band: Lagos sky, ink headline, echoing the opening of the page. */
export function ClosingCta() {
  const primary = company.contact.phones[0];

  return (
    <section aria-labelledby="cta-heading" className="px-4 pb-4 sm:px-[4vw] sm:pb-[4vh]">
      <div className="relative isolate overflow-hidden rounded-[22px] sm:rounded-[32px]">
        <Image
          src={stock.lagosBridgeSky.src}
          alt={stock.lagosBridgeSky.alt}
          fill
          sizes="96vw"
          className="-z-20 object-cover object-[50%_70%]"
        />
        <div className="from-cream/95 via-cream/55 absolute inset-0 -z-10 bg-gradient-to-b to-transparent" />
        <Reveal className="px-6 pt-20 pb-64 sm:px-14 sm:pt-28 sm:pb-[28rem]">
          <p className="eyebrow">Begin the conversation</p>
          <h2 id="cta-heading" className="mt-4 max-w-4xl text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.96] tracking-[-0.045em]">
            Your home, built with care. <span className="accent-italic text-oxblood block">Let’s talk.</span>
          </h2>
          <p className="text-ink/75 mt-6 max-w-lg text-base leading-relaxed sm:text-lg">
            Message our team on WhatsApp for prices, payment plans or a virtual inspection. We are here 7 days a week and
            respond within 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-7">
              <a href={whatsappLink("Hello Chapelhill, I’d like to discuss buying a home.")} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="size-4" />
                Chat on WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-ink/20 bg-cream/60 h-12 rounded-full px-6 backdrop-blur-sm">
              <a href={`tel:${primary.e164}`}>
                <Phone aria-hidden="true" />
                {primary.display}
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
