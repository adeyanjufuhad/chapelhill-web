import { Reveal } from "@/components/motion/Reveal";
import { PlaceholderTag } from "@/components/site/Placeholder";
import { getSiteStats } from "@/lib/db/public";
import { StatCounter, StatementText } from "./StatementMotion";

export async function Statement() {
  const trustStats = await getSiteStats();
  return (
    <section aria-label="About Chapelhill" className="container-luxe py-28 sm:py-40">
      <p className="eyebrow">Chapelhill Multicompany International</p>
      <StatementText>
        We design, build and care for homes of lasting quality, in Lagos, in Abuja, and for Nigerians wherever they live.
      </StatementText>

      <Reveal className="mt-20 sm:mt-28">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {trustStats.map((s) => (
            <div key={s.label} className="border-ink/15 border-t pt-5">
              <dd className="font-display text-oxblood text-[clamp(2.2rem,3.6vw,3.4rem)] leading-none font-medium tracking-[-0.04em]">
                <StatCounter value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="text-muted-foreground mt-3 text-sm">
                {s.label}
                {s.placeholder && <PlaceholderTag className="ml-2" label="TBC" />}
              </dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
