"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useNear } from "./useNear";

gsap.registerPlugin(ScrollTrigger);

/**
 * Zoom-parallax for framed photos (DESIGN.md §7): the image settles from a
 * slight zoom to rest as its frame scrolls through the viewport. Transform
 * only; skipped with reduced motion.
 */
export function ScrollZoom({ children, from = 1.18, className }: { children: ReactNode; from?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNear(ref);

  useEffect(() => {
    const el = ref.current;
    if (!near || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      el,
      { scale: from, yPercent: -4 },
      {
        scale: 1,
        yPercent: 4,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [from, near]);

  return (
    <div ref={ref} className={cn("absolute inset-0 will-change-transform", className)}>
      {children}
    </div>
  );
}
