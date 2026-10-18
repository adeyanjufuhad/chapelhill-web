import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollZoom } from "@/components/motion/ScrollZoom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { EnquiryDialog } from "@/components/site/EnquiryDialog";
import { PageHeader } from "@/components/site/PageHeader";
import { ProcessStack } from "@/components/site/ProcessStack";
import { servicesFaq } from "@/content/faq";
import { services, whyChooseUs } from "@/content/services";
import { stock, type StockImage } from "@/content/stock";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Property development, remodeling and renovation, property maintenance and project management in Lagos and Abuja.",
};

const imageFor: Record<string, StockImage> = {
  "property-development": stock.siteScaffolding,
  "remodeling-renovation": stock.livingWarm,
  "property-maintenance": stock.electrician,
  "project-management": stock.designBlueprint,
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Four disciplines,"
        accent="one standard."
        intro={whyChooseUs.body}
        crumbs={[{ label: "Services" }]}
        image={{ src: stock.siteAerial.src, alt: stock.siteAerial.alt }}
      />

      <div className="container-luxe py-16 sm:py-24">
        {services.map((s, i) => {
          const img = imageFor[s.slug];
          return (
            <section
              key={s.slug}
              id={s.slug}
              aria-labelledby={`${s.slug}-heading`}
              className="border-ink/15 grid scroll-mt-24 items-center gap-10 border-t py-16 sm:py-24 lg:grid-cols-2 lg:gap-20"
            >
              <Reveal
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-[24px]",
                  i % 2 === 1 && "lg:order-2",
                )}
              >
                <ScrollZoom>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    className="object-cover"
                  />
                </ScrollZoom>
              </Reveal>
              <Reveal delay={100}>
                <span className="text-oxblood text-sm font-medium tabular-nums">
                  {s.number}
                </span>
                <h2
                  id={`${s.slug}-heading`}
                  className="mt-4 text-[clamp(2.2rem,4.4vw,4rem)] leading-[0.98] tracking-[-0.045em]"
                >
                  {s.name}
                </h2>
                <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                  {s.description}
                </p>
                <ul
                  className="mt-8 flex flex-wrap gap-2"
                  aria-label={`${s.name} scope`}
                >
                  {s.scope.map((item) => (
                    <li
                      key={item}
                      className="border-ink/15 rounded-full border px-4 py-1.5 text-sm"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <EnquiryDialog
                  topic="service"
                  service={s.name}
                  title={`Enquire about ${s.name.toLowerCase()}`}
                  description="Tell us about your project and we’ll come back within 24 hours."
                  trigger={
                    <Button size="lg" className="mt-10 h-12 rounded-full px-6">
                      Enquire about this service
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  }
                />
              </Reveal>
            </section>
          );
        })}
      </div>

      <section
        aria-labelledby="process-heading"
        className="bg-stone/50 border-border border-y"
      >
        <div className="container-luxe pt-24 sm:pt-32">
          <Reveal>
            <p className="eyebrow">How we work</p>
            <h2
              id="process-heading"
              className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.045em]"
            >
              Six steps, <span className="accent-italic">no surprises.</span>
            </h2>
          </Reveal>
        </div>
        <div className="container-luxe pb-24 sm:pb-32">
          <ProcessStack />
        </div>
      </section>

      <section
        aria-labelledby="services-faq-heading"
        className="container-luxe py-24 sm:py-36"
      >
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2
              id="services-faq-heading"
              className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.045em]"
            >
              About our <span className="accent-italic">services.</span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-sm">
              We are here to help 7 days a week and respond within 24 hours.
            </p>
          </Reveal>
          <Accordion
            type="single"
            collapsible
            className="border-ink/15 border-t"
          >
            {servicesFaq.map((f, i) => (
              <AccordionItem
                key={f.question}
                value={`sfaq-${i}`}
                className="border-ink/15"
              >
                <AccordionTrigger className="hover:text-oxblood py-6 text-left text-lg font-medium tracking-[-0.02em] hover:no-underline sm:text-xl [&>svg]:text-oxblood">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground max-w-2xl pb-7 text-base leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
