import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { statusLabel, type Development } from "@/content/developments";
import { formatBeds, formatNgnShort } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DevelopmentCard({
  development: d,
  className,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw",
}: {
  development: Development;
  className?: string;
  sizes?: string;
}) {
  const cover = d.images[0];
  const href = `/developments/${d.slug}`;

  return (
    <article className={cn("group relative", className)}>
      <div className="bg-stone relative aspect-[4/5] overflow-hidden rounded-[20px]">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="bg-cream/90 text-oxblood rounded-full px-3 py-1 text-[0.7rem] font-medium backdrop-blur-sm">
            {statusLabel[d.status]}
          </span>
          {cover.render && (
            <span className="bg-ink/50 text-cream rounded-full px-2.5 py-1 text-[0.65rem] backdrop-blur-sm">
              Artist’s impression
            </span>
          )}
        </div>
        <span
          aria-hidden="true"
          className="bg-cream text-ink absolute right-4 bottom-4 inline-flex size-11 translate-y-2 items-center justify-center rounded-full opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl tracking-[-0.03em]">
            <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {d.name}
            </Link>
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {d.area}, {d.city} · {formatBeds(d.bedrooms)}
          </p>
        </div>
        <p className="shrink-0 text-right text-sm">
          <span className="text-muted-foreground block text-xs">From</span>
          <span className="font-medium tabular-nums">{formatNgnShort(d.priceFromNgn)}</span>
        </p>
      </div>
    </article>
  );
}
