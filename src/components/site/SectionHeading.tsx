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
      <div className={cn("rule-gold mt-5", align === "center" && "mx-auto")} />
      <Heading className="mt-6 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
        {title}
        {accent && <span className="accent-italic"> {accent}</span>}
      </Heading>
      {intro && <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">{intro}</p>}
    </Reveal>
  );
}
