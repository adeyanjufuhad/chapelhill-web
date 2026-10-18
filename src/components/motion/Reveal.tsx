import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll entry (DESIGN.md §7): fade + rise (+ soft blur on desktop) to rest as
 * content enters the viewport. Plain markup; one shared observer
 * (`RevealObserver`, mounted in the root layout) flips `data-in`, so pages
 * don't hydrate a component per element. Visible without JavaScript.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  return (
    <Tag data-reveal className={cn(className)} style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
