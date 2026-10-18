"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Giant CHAPELHILL wordmark filled with photography (background-clip: text).
 * The photo drifts slowly behind the letters as the section scrolls past.
 */
export function Wordmark({ image, imageSmall }: { image: string; imageSmall: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      el,
      { backgroundPosition: "50% 20%" },
      {
        backgroundPosition: "50% 80%",
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section aria-label="Chapelhill" className="overflow-hidden pb-16 sm:pb-24">
      <p
        ref={ref}
        aria-hidden="true"
        style={{ "--wm": `url(${image})`, "--wm-sm": `url(${imageSmall})` } as React.CSSProperties}
        className="font-display bg-oxblood bg-[image:var(--wm-sm)] bg-cover bg-clip-text text-center text-[18.5vw] leading-[0.82] font-semibold tracking-[-0.065em] text-transparent select-none md:bg-[image:var(--wm)]"
      >
        Chapelhill
      </p>
      <div className="container-luxe mt-8 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">Property development · Construction · Renovation · Maintenance</p>
        <p className="eyebrow">Lagos · Abuja · The diaspora</p>
      </div>
    </section>
  );
}
