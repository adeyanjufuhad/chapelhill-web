import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Zoom-parallax for framed photos (DESIGN.md §7): the image settles from a
 * slight zoom to rest as its frame scrolls through the viewport. Pure CSS
 * (scroll-driven animation, `.scroll-zoom` in globals.css; the frame must use
 * `overflow-clip`, not `overflow-hidden`), so it costs no
 * JavaScript; browsers without `animation-timeline` show the photo at rest.
 * Skipped with reduced motion.
 */
export function ScrollZoom({ children, from = 1.18, className }: { children: ReactNode; from?: number; className?: string }) {
  return (
    <div className={cn("scroll-zoom absolute inset-0", className)} style={{ "--zoom-from": from } as CSSProperties}>
      {children}
    </div>
  );
}
