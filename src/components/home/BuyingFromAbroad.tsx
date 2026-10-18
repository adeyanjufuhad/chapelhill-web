import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { whatsappLink } from "@/lib/whatsapp";

// Steps condensed from the client's diaspora FAQ (src/content/faq.ts).
const steps = [
  {
    title: "Consult and inspect by video",
    body: "Meet our team on a virtual consultation and walk the site live on a video call, wherever you are.",
  },
  {
    title: "Verified title and documents",
    body: "Land titles, legal due diligence and documentation, checked with trusted legal professionals under Nigerian property law.",
  },
  {
    title: "Pay securely, on a plan that suits you",
    body: "Secure digital transactions, flexible payment plans, and introductions to financial institutions and mortgage providers.",
  },
  {
    title: "See every stage until handover",
    body: "Regular progress reports, photos and videos, with the option of your own representative or our independent inspection partners.",
  },
];

export function BuyingFromAbroad() {
  return (
    <section aria-labelledby="abroad-heading" className="theme-oxblood relative overflow-hidden">
      <div className="container-luxe grid gap-16 py-24 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Buying from abroad?"
            title={<span id="abroad-heading">Own a home in Nigeria</span>}
            accent="without flying home."
            intro="From London, Houston or Dubai, our diaspora desk handles every step of the purchase, and keeps you informed at each one."
          />
          <Reveal delay={150} className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-6">
              <a
                href={whatsappLink("Hello Chapelhill, I live abroad and I’m interested in buying a home.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="size-4" />
                Speak to the diaspora desk
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream/35 text-cream hover:bg-cream/10 hover:text-cream h-12 bg-transparent px-6"
            >
              <Link href="#faq">Read the buyer FAQ</Link>
            </Button>
          </Reveal>
        </div>

        <ol className="divide-border border-border divide-y border-y">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90} className="grid grid-cols-[3.5rem_1fr] gap-4 py-8 sm:py-10">
              <span className="font-display text-gold-light text-4xl leading-none tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-2xl sm:text-3xl">{s.title}</h3>
                <p className="text-muted-foreground mt-3 max-w-lg leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
