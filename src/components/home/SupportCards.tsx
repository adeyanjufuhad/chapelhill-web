import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { PillLink } from "@/components/site/PillLink";
import { stock, type StockImage } from "@/content/stock";

// "Support beyond buying and selling" from the owner's reference, adapted:
// three photo cards with the title on the image and a pill "Learn more".

const cards: { title: string; body: string; href: string; image: StockImage }[] = [
  {
    title: "Payment plans & mortgages",
    body: "Flexible plans and introductions to mortgage providers for buyers at home and abroad.",
    href: "/calculator",
    image: stock.kitchenMarble,
  },
  {
    title: "Diaspora client portal",
    body: "Progress photos, documents and video inspections in one private place.",
    href: "/portal/login",
    image: stock.handoverKeys,
  },
  {
    title: "Rental & resale management",
    body: "We maintain, let and resell your home so it keeps earning while you’re away.",
    href: "/contact",
    image: stock.livingView,
  },
];

export function SupportCards() {
  return (
    <section aria-labelledby="support-heading" data-nav-tone="dark" className="theme-oxblood bg-oxblood-deep pb-24 sm:pb-36">
      <div className="container-luxe">
        <div className="border-cream/12 grid gap-8 border-t pt-20 sm:pt-28 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <h2 id="support-heading" className="text-[clamp(2.2rem,4.4vw,4rem)] leading-[0.98] tracking-[-0.045em]">
              Support beyond <span className="accent-italic block">buying & building.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="flex flex-col items-start gap-6 lg:pt-3">
            <p className="text-cream/75 max-w-xl text-lg leading-relaxed">
              Your investment needs care long after the keys change hands. Our team keeps it maintained, let and growing in value,
              wherever you live.
            </p>
            <PillLink href="/contact" variant="gold">
              Talk to our team
            </PillLink>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 110}>
              <article className="group border-cream/10 relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[24px] border p-6 sm:p-7">
                <Image
                  src={c.image.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 32vw, 92vw"
                  className="-z-20 object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-105"
                />
                <div className="from-ink/70 via-ink/10 to-ink/75 absolute inset-0 -z-10 bg-gradient-to-b" />
                <div>
                  <h3 className="max-w-[14ch] text-3xl leading-[1.02] tracking-[-0.04em]">{c.title}</h3>
                  <p className="text-cream/80 mt-3 max-w-[30ch] text-sm leading-relaxed opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100">
                    {c.body}
                  </p>
                </div>
                <PillLink href={c.href} variant="dark" size="sm" magnetic={false} className="self-start">
                  Learn more<span className="sr-only"> about {c.title.toLowerCase()}</span>
                </PillLink>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
