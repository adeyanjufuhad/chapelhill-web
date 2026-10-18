import Image from "next/image";
import { Camera, FileText, Gauge } from "lucide-react";
import { PillLink } from "@/components/site/PillLink";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollZoom } from "@/components/motion/ScrollZoom";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PlaceholderTag } from "@/components/site/Placeholder";
import { stock } from "@/content/stock";

const features = [
  {
    icon: Camera,
    title: "Dated photo and video updates",
    body: "Posted by the site team at every milestone.",
  },
  {
    icon: Gauge,
    title: "Percentage complete, stage by stage",
    body: "From foundation to finishing, in plain numbers.",
  },
  {
    icon: FileText,
    title: "Documents in one place",
    body: "Request your allotment letter, survey or receipts online.",
  },
];

// Illustrative preview of the portal tracker. Real updates come from the
// admin dashboard in Phase 6; nothing here describes a real development.
const sampleUpdates = [
  {
    date: "12 Sep",
    title: "Roof covering installed",
    stage: "Roofing & windows",
    pct: 68,
  },
  {
    date: "22 Aug",
    title: "First-floor slab cast",
    stage: "Structure",
    pct: 52,
  },
  {
    date: "30 Jul",
    title: "Ground-floor blockwork complete",
    stage: "Structure",
    pct: 38,
  },
];

export function TrackerTeaser() {
  const latest = sampleUpdates[0];

  return (
    <section
      aria-labelledby="tracker-heading"
      className="container-luxe py-24 sm:py-36"
    >
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <p className="eyebrow">Live construction tracker</p>
          <SplitHeading
            id="tracker-heading"
            text="Watch your home rise,"
            accent="update by update."
            className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.045em]"
          />
          <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
            Every buyer gets a private client portal to follow their home from
            anywhere in the world.
          </p>
          <ul className="mt-10 space-y-6">
            {features.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="bg-oxblood/8 text-oxblood inline-flex size-10 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <PillLink href="/portal/login" variant="light" className="mt-10">
            Explore the client portal
          </PillLink>
        </Reveal>

        <Reveal delay={150} className="relative pb-24 sm:pb-0">
          <div className="relative aspect-[4/5] overflow-clip rounded-[24px]">
            <ScrollZoom>
              <Image
                src={stock.siteTeam.src}
                alt={stock.siteTeam.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
            </ScrollZoom>
          </div>
          <figure className="bg-ivory/95 absolute right-4 -bottom-0 left-4 rounded-[20px] p-6 shadow-[0_30px_60px_-30px_rgb(26_26_26/0.45)] backdrop-blur-md sm:right-auto sm:bottom-8 sm:-left-10 sm:w-[340px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-muted-foreground text-xs">Your unit</p>
                <p className="mt-1 font-medium">Sample home, Block C</p>
              </div>
              <PlaceholderTag label="Illustrative" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <p className="font-display text-oxblood text-5xl leading-none font-medium tracking-[-0.04em] tabular-nums">
                {latest.pct}
                <span className="text-2xl">%</span>
              </p>
              <p className="text-muted-foreground text-right text-xs">
                complete
                <br />
                <span className="text-foreground">{latest.stage}</span>
              </p>
            </div>
            <div className="bg-stone mt-3 h-1 w-full overflow-hidden rounded-full">
              <div
                className="bg-gold h-full rounded-full"
                style={{ width: `${latest.pct}%` }}
              />
            </div>
            <ol className="mt-5 space-y-3">
              {sampleUpdates.slice(0, 2).map((u) => (
                <li
                  key={u.title}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span>{u.title}</span>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {u.date}
                  </span>
                </li>
              ))}
            </ol>
            <figcaption className="sr-only">
              Illustrative example of the client portal construction tracker.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
