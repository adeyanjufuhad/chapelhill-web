"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PlaceholderTag } from "@/components/site/Placeholder";
import type { Testimonial } from "@/lib/db/public";
import { cn } from "@/lib/utils";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const anyPlaceholder = testimonials.some((t) => t.placeholder);
  const [active, setActive] = useState(0);
  const go = (delta: number) => setActive((i) => (i + delta + testimonials.length) % testimonials.length);

  return (
    <section aria-labelledby="testimonials-heading" aria-roledescription="carousel" className="bg-ivory border-border border-y">
      <div className="container-luxe py-24 sm:py-36">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="eyebrow">
              In their words {anyPlaceholder && <PlaceholderTag className="ml-2" label="Placeholder quotes" />}
            </p>
            <h2 id="testimonials-heading" className="sr-only">
              Testimonials
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="border-ink/15 hover:border-oxblood hover:text-oxblood inline-flex size-11 items-center justify-center rounded-full border transition-colors"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="border-ink/15 hover:border-oxblood hover:text-oxblood inline-flex size-11 items-center justify-center rounded-full border transition-colors"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="relative mt-12 grid" aria-live="polite">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              aria-hidden={i !== active}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${testimonials.length}`}
              className={cn(
                "col-start-1 row-start-1 max-w-4xl transition-[opacity,transform] duration-700 ease-[var(--ease-luxe)]",
                i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
              )}
            >
              <span aria-hidden="true" className="font-serif text-oxblood block text-8xl leading-none">
                “
              </span>
              <blockquote className="font-display -mt-6 text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1.12] font-medium tracking-[-0.035em] text-balance">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 text-sm">
                <span aria-hidden="true" className="rule-gold" />
                <span>
                  {t.name}
                  {t.location && <span className="text-muted-foreground"> · {t.location}</span>}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 flex gap-2" role="tablist" aria-label="Choose testimonial">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setActive(i)}
              className="group flex h-8 items-center"
            >
              <span
                className={cn(
                  "block h-px transition-all duration-500",
                  i === active ? "bg-oxblood w-12" : "bg-ink/20 group-hover:bg-ink/40 w-6",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
