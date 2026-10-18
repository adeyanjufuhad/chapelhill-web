import type { Metadata } from "next";
import Image from "next/image";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollZoom } from "@/components/motion/ScrollZoom";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceholderTag } from "@/components/site/Placeholder";
import { company } from "@/content/company";
import { stock } from "@/content/stock";
import { team } from "@/content/team";

export const metadata: Metadata = {
  title: "About",
  description: company.description,
};

const initials = (name: string) =>
  name
    .replace(/^(Dr\.|Barr\.)\s*/, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Chapelhill"
        title="Built on quality,"
        accent="delivered with care."
        intro="A property development, construction and maintenance company serving families, investors and the diaspora across Lagos and Abuja."
        crumbs={[{ label: "About" }]}
        image={{
          src: "/images/developments/ivy-abijo-01.jpg",
          alt: "A completed Chapelhill apartment block in Abijo GRA, Lekki",
          position: "50% 30%",
        }}
      />

      <section
        aria-labelledby="story-heading"
        className="container-luxe py-24 sm:py-36"
      >
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2
              id="story-heading"
              className="mt-6 text-[clamp(1.7rem,3.2vw,3rem)] leading-[1.12] tracking-[-0.035em]"
            >
              {company.story[0]}
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:pt-14">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {company.story[1]}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {company.positioning.map((p) => (
                <li
                  key={p}
                  className="border-ink/15 rounded-full border px-4 py-1.5 text-sm"
                >
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section
        aria-label="Mission and vision"
        data-nav-tone="dark"
        className="theme-oxblood bg-oxblood-deep"
      >
        <div className="container-luxe grid gap-16 py-24 sm:py-32 lg:grid-cols-2 lg:gap-24">
          {[
            { label: "Our mission", text: company.mission },
            { label: "Our vision", text: company.vision },
          ].map((m, i) => (
            <Reveal key={m.label} delay={i * 120}>
              <p className="eyebrow">{m.label}</p>
              <p className="mt-6 text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.15] font-medium tracking-[-0.035em]">
                {m.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="values-heading"
        className="container-luxe py-24 sm:py-36"
      >
        <Reveal>
          <p className="eyebrow">What we stand for</p>
          <h2
            id="values-heading"
            className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.045em]"
          >
            Three values, <span className="accent-italic">every project.</span>
          </h2>
        </Reveal>
        <ul className="mt-14 grid gap-10 md:grid-cols-3">
          {company.values.map((v, i) => (
            <Reveal
              as="li"
              key={v.name}
              delay={i * 100}
              className="border-ink/15 border-t pt-6"
            >
              <span className="text-oxblood text-sm font-medium tabular-nums">
                0{i + 1}
              </span>
              <p className="mt-6 text-4xl font-medium tracking-[-0.04em]">
                {v.name}
              </p>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                {v.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="goals-heading"
        className="bg-ivory border-border border-y"
      >
        <div className="container-luxe grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-2 lg:gap-24">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
            <ScrollZoom>
              <Image
                src={stock.livingView.src}
                alt={stock.livingView.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
            </ScrollZoom>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Our goals</p>
            <h2
              id="goals-heading"
              className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.045em]"
            >
              Where home <span className="accent-italic">meets happiness.</span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
              {company.goals.body}
            </p>
            <ul className="mt-10 space-y-4">
              {company.goals.points.map((p) => (
                <li
                  key={p}
                  className="border-ink/15 flex items-center gap-4 border-t pt-4 text-lg"
                >
                  <span
                    aria-hidden="true"
                    className="bg-gold size-1.5 rounded-full"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="team-heading"
        className="container-luxe py-24 sm:py-36"
      >
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Leadership</p>
            <h2
              id="team-heading"
              className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.045em]"
            >
              Meet the <span className="accent-italic">team.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Decades of experience serving high-net-worth individuals and leading
            corporate clients.
          </p>
        </Reveal>
        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <Reveal as="li" key={m.name} delay={(i % 3) * 90}>
              <div className="bg-stone relative aspect-[4/5] overflow-hidden rounded-[20px]">
                {m.photo ? (
                  <Image
                    src={m.photo}
                    alt={`Portrait of ${m.name}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 92vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <span className="text-oxblood/80 text-6xl font-medium tracking-[-0.05em]">
                      {initials(m.name)}
                    </span>
                    <PlaceholderTag label="Photo to follow" />
                  </div>
                )}
              </div>
              <p className="mt-5 text-xl font-medium tracking-[-0.02em]">
                {m.name}
              </p>
              <p className="text-muted-foreground text-sm">{m.role}</p>
              {m.bio ? (
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {m.bio}
                </p>
              ) : (
                <PlaceholderTag className="mt-3" label="Bio to follow" />
              )}
            </Reveal>
          ))}
        </ul>
      </section>

      <ClosingCta />
    </>
  );
}
