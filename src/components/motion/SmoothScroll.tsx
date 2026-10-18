"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scroll on desktop only (fine pointer, motion allowed).
 * Touch devices keep native scrolling and never download Lenis or GSAP for
 * it. Lenis is driven by GSAP's ticker so ScrollTrigger scrubs stay in sync.
 */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let cleanup = () => {};
    let cancelled = false;
    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: Lenis }, { default: gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, autoRaf: false });
        const raf = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        // Lenis caches the scroll limit and only watches <html>, which is
        // viewport-height here. Re-measure when the page grows (pin spacers
        // added near the viewport, streamed content), or scrolling stops short.
        const resize = () => lenis.resize();
        const observer = new ResizeObserver(resize);
        observer.observe(document.body);
        ScrollTrigger.addEventListener("refresh", resize);
        cleanup = () => {
          observer.disconnect();
          ScrollTrigger.removeEventListener("refresh", resize);
          gsap.ticker.remove(raf);
          lenis.destroy();
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
