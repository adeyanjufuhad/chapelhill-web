import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { services } from "@/content/services";

export function ServicesList() {
  return (
    <section aria-labelledby="services-heading" className="bg-ivory border-border border-y">
      <div className="container-luxe py-24 sm:py-32">
        <SectionHeading
          eyebrow="What we do"
          title={<span id="services-heading">Four disciplines,</span>}
          accent="one standard."
          intro="From a bare plot to a building that is cared for long after handover, every stage is handled in-house."
        />

        <ul className="border-border mt-14 border-t">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={i * 80} className="border-border border-b">
              <Link
                href={`/services#${s.slug}`}
                className="group grid gap-4 py-9 md:grid-cols-[5rem_1fr_1.3fr_2rem] md:items-start md:gap-8 md:py-11"
              >
                <span className="text-gold-ink font-sans text-sm tracking-[0.2em] tabular-nums">{s.number}</span>
                <h3 className="group-hover:text-oxblood text-3xl transition-colors sm:text-4xl">{s.name}</h3>
                <div>
                  <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${s.name} scope`}>
                    {s.scope.map((item) => (
                      <li key={item} className="border-border text-foreground/80 rounded-full border px-3 py-1 text-xs">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="text-gold hidden size-6 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 md:block"
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
