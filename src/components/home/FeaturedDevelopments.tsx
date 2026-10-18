import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { DevelopmentCard } from "@/components/site/DevelopmentCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { developments } from "@/content/developments";

export function FeaturedDevelopments() {
  const featured = developments.filter((d) => d.featured);

  return (
    <section aria-labelledby="developments-heading" className="bg-ivory border-border border-y">
      <div className="container-luxe py-24 sm:py-32">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Our developments"
            title={<span id="developments-heading">Homes in Lagos</span>}
            accent="and Abuja."
            intro="Three addresses, one standard of finish. Each is for sale now, with flexible payment plans for buyers at home and abroad."
          />
          <Reveal>
            <Link
              href="/developments"
              className="text-oxblood hover:text-gold-ink group inline-flex items-center gap-2 text-sm font-medium tracking-[0.12em] whitespace-nowrap uppercase transition-colors"
            >
              View all developments
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {featured.map((d, i) => (
            <Reveal as="li" key={d.slug} delay={i * 110} className="relative">
              <DevelopmentCard development={d} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
