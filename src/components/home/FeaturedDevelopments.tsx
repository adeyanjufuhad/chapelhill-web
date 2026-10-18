import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PillLink } from "@/components/site/PillLink";
import { DevelopmentCard } from "@/components/site/DevelopmentCard";
import { getDevelopments } from "@/lib/db/public";

export async function FeaturedDevelopments() {
  const featured = (await getDevelopments()).filter((d) => d.featured);

  return (
    <section aria-labelledby="developments-heading" className="container-luxe py-24 sm:py-36">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Current developments</p>
          <SplitHeading
            id="developments-heading"
            text="Homes in Lagos"
            accent="and Abuja."
            className="mt-4 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.98] tracking-[-0.045em]"
          />
        </div>
        <PillLink href="/developments" variant="light" className="self-start sm:self-auto">
          View all developments
        </PillLink>
      </Reveal>

      <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((d, i) => (
          <Reveal as="li" key={d.slug} delay={i * 110}>
            <DevelopmentCard development={d} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
