import Counter from "@/components/reactbits/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { PlaceholderTag } from "@/components/site/Placeholder";
import { SectionHeading } from "@/components/site/SectionHeading";
import { company } from "@/content/company";
import { trustStats } from "@/content/placeholders";

export function IntroStats() {
  return (
    <section aria-labelledby="intro-heading" className="container-luxe py-24 sm:py-32">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <div>
          <SectionHeading
            eyebrow="Chapelhill Multicompany International"
            title={<span id="intro-heading">Excellence in property</span>}
            accent="development."
            intro={company.description}
          />
          <Reveal delay={120} className="mt-12">
            <ul className="grid gap-6 sm:grid-cols-3">
              {company.values.map((v, i) => (
                <li key={v.name} className="border-border border-t pt-5">
                  <span className="text-gold-ink font-sans text-xs tracking-[0.2em] tabular-nums">0{i + 1}</span>
                  <p className="font-display mt-2 text-2xl">{v.name}</p>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{v.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <dl className="border-border grid grid-cols-2 border-t border-l">
            {trustStats.map((s) => (
              <div key={s.label} className="border-border flex flex-col justify-between gap-6 border-r border-b p-6 sm:p-9">
                <dt className="text-muted-foreground order-2 text-sm">
                  {s.label}
                  {s.placeholder && <PlaceholderTag className="ml-2" label="TBC" />}
                </dt>
                <dd className="font-display text-oxblood order-1 leading-none">
                  <Counter
                    value={s.value}
                    locale="en-GB"
                    suffix={s.suffix || undefined}
                    fontSize="clamp(2.6rem, 5.5vw, 4.25rem)"
                    fontWeight={500}
                    motionBlur={false}
                    duration={1.1}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
