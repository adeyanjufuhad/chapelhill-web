import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

// Button-in-button CTA (DESIGN.md §4): pill with the trailing icon in its own
// circle that shifts toward the pointer. Real links stay real links.

export type PillVariant = "primary" | "gold" | "light" | "dark";

const shell: Record<PillVariant, string> = {
  primary: "bg-oxblood text-cream hover:bg-oxblood-soft",
  gold: "bg-gold text-ink hover:bg-gold-light",
  light: "border border-ink/15 bg-white/60 text-ink backdrop-blur-sm hover:border-ink/35",
  dark: "border border-cream/25 bg-cream/5 text-cream hover:border-cream/50",
};
const dot: Record<PillVariant, string> = {
  primary: "bg-cream/15",
  gold: "bg-ink/10",
  light: "bg-oxblood text-cream",
  dark: "bg-cream text-ink",
};

export function pillClasses(variant: PillVariant = "primary", size: "md" | "sm" = "md") {
  return cn(
    "group inline-flex items-center rounded-full font-medium transition-[background-color,border-color,transform] duration-300 ease-[var(--ease-luxe)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4",
    size === "md" ? "h-12 gap-3 pr-1.5 pl-6 text-[0.95rem]" : "h-10 gap-2.5 pr-1 pl-4 text-sm",
    shell[variant],
  );
}

export function PillIcon({ variant = "primary", size = "md", icon }: { variant?: PillVariant; size?: "md" | "sm"; icon?: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105",
        size === "md" ? "size-9" : "size-8",
        dot[variant],
      )}
    >
      {icon ?? <ArrowUpRight className="size-4" />}
    </span>
  );
}

type Props = {
  href: string;
  children: ReactNode;
  variant?: PillVariant;
  size?: "md" | "sm";
  icon?: ReactNode;
  external?: boolean;
  magnetic?: boolean;
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

export function PillLink({ href, children, variant = "primary", size = "md", icon, external, magnetic = true, className, ...rest }: Props) {
  const inner = (
    <>
      <span>{children}</span>
      <PillIcon variant={variant} size={size} icon={icon} />
    </>
  );
  const link = external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn(pillClasses(variant, size), className)} {...rest}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cn(pillClasses(variant, size), className)} {...rest}>
      {inner}
    </Link>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
