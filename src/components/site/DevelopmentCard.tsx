import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { statusLabel, type Development } from "@/content/developments";
import { formatBeds, formatNgnShort } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DevelopmentCard({ development: d, className }: { development: Development; className?: string }) {
  const cover = d.images[0];
  const href = `/developments/${d.slug}`;

  return (
    <SpotlightCard
      theme="light"
      intensity={0.35}
      spotlightSize={320}
      borderGlow={0.5}
      flare={false}
      className={cn("group h-full", className)}
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <span className="bg-cream/92 text-oxblood px-2.5 py-1 text-[0.65rem] font-medium tracking-[0.18em] uppercase backdrop-blur-sm">
              {statusLabel[d.status]}
            </span>
            {cover.render && (
              <span className="bg-ink/55 text-cream px-2 py-1 text-[0.6rem] tracking-[0.14em] uppercase backdrop-blur-sm">
                Artist’s impression
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <p className="eyebrow">
            {d.area}, {d.city}
          </p>
          <h3 className="mt-3 text-3xl">
            <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {d.name}
            </Link>
          </h3>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{d.summary}</p>

          <div className="border-border mt-auto flex items-end justify-between gap-4 border-t pt-5">
            <dl className="flex gap-6 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">Homes</dt>
                <dd className="mt-0.5">{formatBeds(d.bedrooms)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">From</dt>
                <dd className="mt-0.5 tabular-nums">{formatNgnShort(d.priceFromNgn)}</dd>
              </div>
            </dl>
            <ArrowUpRight
              aria-hidden="true"
              className="text-gold size-5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
