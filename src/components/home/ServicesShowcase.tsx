"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { services } from "@/content/services";
import { stock, type StockImage } from "@/content/stock";
import { cn } from "@/lib/utils";

// "How Chapelhill can help you" (owner's reference: FIND's Buy / Sell / Rent).
// The row crossing the middle of the viewport wipes in a photo band and an
// arrow; hover and keyboard focus take over while the pointer is on a row.

const rows: { verb: string; slug: string; image: StockImage; blurb: string }[] = [
  {
    verb: "Develop",
    slug: "property-development",
    image: stock.siteAerial,
    blurb: "Homes, estates and industrial buildings, with the roads, drainage and structural steel around them.",
  },
  {
    verb: "Renovate",
    slug: "remodeling-renovation",
    image: stock.livingWarm,
    blurb: "From carcass or semi-completed structure to an impeccable finish, including space design and rapid partitions.",
  },
  {
    verb: "Maintain",
    slug: "property-maintenance",
    image: stock.electrician,
    blurb: "Plumbing, electrical, air-conditioning, roofing, tiling and waterfront reclamation, handled for you.",
  },
  {
    verb: "Manage",
    slug: "project-management",
    image: stock.designDrafting,
    blurb: "Specialist advice on purchase and construction, and management of consultants and contractors.",
  },
];

export function ServicesShowcase() {
  const listRef = useRef<HTMLUListElement>(null);
  const [scrollActive, setScrollActive] = useState(0);
  const [pointerActive, setPointerActive] = useState<number | null>(null);
  const active = pointerActive ?? scrollActive;

  // Activate the row that crosses a thin band at the middle of the viewport.
  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-row]");
    if (!items?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setScrollActive(Number((e.target as HTMLElement).dataset.row));
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="services-heading" data-nav-tone="dark" className="theme-oxblood bg-oxblood-deep">
      <div className="container-luxe grid gap-6 pt-24 pb-14 sm:pt-36 lg:grid-cols-[1fr_2fr]">
        <p className="eyebrow">Services</p>
        <h2 id="services-heading" className="text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.045em]">
          How Chapelhill
          <br />
          <span className="accent-italic">can help you.</span>
        </h2>
      </div>

      <ul ref={listRef} className="border-cream/12 border-t" onPointerLeave={() => setPointerActive(null)}>
        {rows.map((r, i) => {
          const on = i === active;
          const name = services.find((s) => s.slug === r.slug)?.name ?? r.verb;
          return (
            <li key={r.slug} data-row={i} className="border-cream/12 relative isolate overflow-hidden border-b">
              {/* Photo band: wipes in from the left when the row is active. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 transition-[clip-path] duration-[900ms] ease-[var(--ease-luxe)] motion-reduce:transition-none"
                style={{ clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
              >
                <Image
                  src={r.image.src.replace("/stock/", "/stock/sm/")}
                  alt=""
                  fill
                  sizes="100vw"
                  className={cn(
                    "object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)]",
                    on ? "scale-100" : "scale-110",
                  )}
                />
                <div className="from-oxblood-deep/90 via-oxblood-deep/55 to-oxblood-deep/80 absolute inset-0 bg-gradient-to-r" />
              </div>

              <Link
                href={`/services#${r.slug}`}
                onPointerEnter={() => setPointerActive(i)}
                onFocus={() => setPointerActive(i)}
                onBlur={() => setPointerActive(null)}
                aria-label={`${r.verb}: ${name}`}
                className="container-luxe grid items-center gap-x-8 gap-y-3 py-8 focus-visible:outline-none sm:py-10 lg:grid-cols-[1fr_2fr] lg:py-12"
              >
                <span className="text-cream/75 order-2 flex max-w-[34ch] items-start gap-4 text-sm leading-relaxed lg:order-1">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "border-cream/30 mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.65rem] tabular-nums transition-colors duration-500",
                      on && "border-gold-light text-gold-light",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {r.blurb}
                </span>
                <span className="order-1 flex items-center justify-between gap-6 lg:order-2">
                  <span
                    className={cn(
                      "block text-[clamp(3.6rem,10vw,9.5rem)] leading-[0.9] font-medium tracking-[-0.055em] transition-[transform,opacity] duration-700 ease-[var(--ease-luxe)]",
                      on ? "translate-x-0 opacity-100" : "opacity-70 lg:-translate-x-2",
                    )}
                  >
                    {r.verb}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className={cn(
                      "size-[clamp(2.5rem,5vw,4.5rem)] shrink-0 transition-[transform,opacity] duration-700 ease-[var(--ease-luxe)]",
                      on ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0",
                    )}
                    strokeWidth={1.25}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="container-luxe grid gap-8 py-20 sm:py-28 lg:grid-cols-[1fr_2fr]">
        <span />
        <div>
          <p className="max-w-3xl text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.15] font-medium tracking-[-0.035em]">
            From the first survey peg to the day we hand over your keys, our team guides every stage{" "}
            <span className="text-cream/60">with expert knowledge and reliable support.</span>
          </p>
          <div className="mt-8">
            <ShowcaseCta />
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseCta() {
  return (
    <Link
      href="/services"
      className="group border-cream/25 hover:border-cream/60 inline-flex h-12 items-center gap-3 rounded-full border pr-1.5 pl-6 text-sm font-medium transition-colors"
    >
      Explore our services
      <span className="bg-cream text-ink inline-flex size-9 items-center justify-center rounded-full transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-0.5">
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
