import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { company } from "@/content/company";
import { diasporaFaq } from "@/content/faq";

export function FaqSection() {
  const primary = company.contact.phones[0];

  return (
    <section id="faq" aria-labelledby="faq-heading" className="container-luxe scroll-mt-24 py-24 sm:py-32">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Need help?"
            title={<span id="faq-heading">Questions from</span>}
            accent="buyers abroad."
            intro={
              <>
                Can’t find your answer? Call{" "}
                <a href={`tel:${primary.e164}`} className="text-oxblood decoration-gold underline underline-offset-4">
                  {primary.display}
                </a>{" "}
                or email{" "}
                <a href={`mailto:${company.contact.email}`} className="text-oxblood decoration-gold break-all underline underline-offset-4">
                  {company.contact.email}
                </a>
                .
              </>
            }
          />
        </div>

        <Reveal delay={120}>
          <Accordion type="single" collapsible className="border-border border-t">
            {diasporaFaq.map((f, i) => (
              <AccordionItem key={f.question} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="font-display hover:text-oxblood py-6 text-left text-lg leading-snug font-medium tracking-[-0.02em] hover:no-underline sm:text-xl [&>svg]:text-oxblood">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground max-w-2xl pb-7 text-base leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
