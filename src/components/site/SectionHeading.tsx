import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  intro,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  accent?: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <Heading className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.045em]">
        {title}
        {accent && <span className="accent-italic"> {accent}</span>}
      </Heading>
      {intro && <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">{intro}</p>}
    </Reveal>
  );
}
