import { Reveal } from "@/components/motion/Reveal";
import { NewsletterForm } from "@/components/site/NewsletterForm";

export function NewsletterBand() {
  return (
    <section aria-labelledby="newsletter-heading" className="bg-stone/60 border-border border-y">
      <Reveal className="container-luxe grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow">The Chapelhill letter</p>
          <h2 id="newsletter-heading" className="mt-4 text-3xl leading-tight sm:text-4xl">
            Be first to hear about <span className="accent-italic">new releases.</span>
          </h2>
        </div>
        <NewsletterForm source="home" className="lg:justify-self-end" />
      </Reveal>
    </section>
  );
}
