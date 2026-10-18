import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { DevelopmentCard } from "@/components/site/DevelopmentCard";
import { developments } from "@/content/developments";

export function FeaturedDevelopments() {
  const featured = developments.filter((d) => d.featured);

  return (
    <section aria-labelledby="developments-heading" className="container-luxe py-24 sm:py-36">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Current developments</p>
          <h2 id="developments-heading" className="mt-4 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.98] tracking-[-0.045em]">
            Homes in Lagos <span className="accent-italic text-oxblood">and Abuja.</span>
          </h2>
        </div>
        <Link
          href="/developments"
          className="border-ink/15 hover:border-oxblood hover:text-oxblood group inline-flex h-12 items-center gap-2 self-start rounded-full border px-6 text-sm font-medium transition-colors sm:self-auto"
        >
          View all developments
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
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
