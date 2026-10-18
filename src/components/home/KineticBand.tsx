"use client";

import ScrollVelocity from "@/components/reactbits/ScrollVelocity";
import { cn } from "@/lib/utils";

/**
 * Kinetic marquee (DESIGN.md §7, React Bits ScrollVelocity): two rows that
 * drift in opposite directions and speed up with scroll. Decorative, so it is
 * hidden from assistive tech; reduced motion stops it.
 */
export function KineticBand({ lines, tone = "light", className }: { lines: [string, string]; tone?: "light" | "dark"; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden py-10 select-none sm:py-14",
        tone === "dark" ? "theme-oxblood bg-oxblood-deep text-cream" : "text-ink",
        className,
      )}
    >
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
    </div>
  );
}
