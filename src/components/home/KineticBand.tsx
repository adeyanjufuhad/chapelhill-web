"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// React Bits ScrollVelocity (and its `motion` dependency) loads only when the
// band nears the viewport, keeping it off the critical path.
const ScrollVelocity = dynamic(() => import("@/components/reactbits/ScrollVelocity"), { ssr: false });

/**
 * Kinetic marquee (DESIGN.md §7): two rows drifting in opposite directions
 * that speed up with scroll. Decorative, hidden from assistive tech; reduced
 * motion stops it.
 */
export function KineticBand({ lines, tone = "light", className }: { lines: [string, string]; tone?: "light" | "dark"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "min-h-[calc(2*clamp(2.75rem,8vw,7.5rem)+5rem)] overflow-hidden py-10 select-none sm:py-14",
        tone === "dark" ? "theme-oxblood bg-oxblood-deep text-cream" : "text-ink",
        className,
      )}
    >
      {near && (
        <ScrollVelocity
          texts={lines}
          velocity={38}
          numCopies={6}
          fadeEdges
          outlineAlternate
          fontSize="clamp(2.75rem, 8vw, 7.5rem)"
          fontWeight={500}
          gap={40}
          separator={<span className="bg-gold mx-[0.5em] inline-block size-[0.14em] rounded-full align-middle" />}
          className="tracking-[-0.045em]"
        />
      )}
    </div>
  );
}
