"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PlaceholderTag } from "@/components/site/Placeholder";
import { testimonials } from "@/content/placeholders";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [active, setActive] = useState(0);
  const go = (delta: number) => setActive((i) => (i + delta + testimonials.length) % testimonials.length);

  return (
    <section aria-labelledby="testimonials-heading" aria-roledescription="carousel" className="theme-ink">
      <div className="container-luxe py-24 sm:py-32">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="eyebrow">
              In their words <PlaceholderTag className="ml-2" label="Placeholder quotes" />
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
              className="border-border hover:border-gold hover:text-gold-light inline-flex size-11 items-center justify-center rounded-full border transition-colors"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="border-border hover:border-gold hover:text-gold-light inline-flex size-11 items-center justify-center rounded-full border transition-colors"
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
              <span aria-hidden="true" className="font-display text-gold block text-7xl leading-none">
                “
              </span>
              <blockquote className="font-display -mt-4 text-3xl leading-snug text-balance sm:text-4xl lg:text-5xl">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 text-sm">
                <span aria-hidden="true" className="rule-gold" />
                <span>
                  {t.name}
                  <span className="text-muted-foreground"> · {t.location}</span>
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
                  i === active ? "bg-gold w-12" : "bg-cream/30 group-hover:bg-cream/60 w-6",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
