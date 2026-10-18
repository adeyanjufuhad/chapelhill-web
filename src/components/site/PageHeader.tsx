import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

/** Dark page header. `data-nav-tone="dark"` keeps the navbar transparent over it. */
export function PageHeader({
  eyebrow,
  title,
  accent,
  intro,
  crumbs = [],
  image,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  accent?: ReactNode;
  intro?: ReactNode;
  crumbs?: Crumb[];
  image?: { src: string; alt: string };
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section data-nav-tone="dark" className={cn("theme-oxblood relative isolate overflow-hidden", className)}>
      {image && (
        <>
          <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="-z-20 object-cover" />
          <div className="from-oxblood-deep/95 via-oxblood-deep/80 to-oxblood-deep/40 absolute inset-0 -z-10 bg-gradient-to-r" />
        </>
      )}
      <div className="container-luxe pt-32 pb-16 sm:pt-40 sm:pb-24">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs tracking-[0.12em] uppercase">
              {[{ label: "Home", href: "/" }, ...crumbs].map((c, i, all) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {c.href && i < all.length - 1 ? (
                    <Link href={c.href} className="hover:text-gold-light transition-colors">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-cream">
                      {c.label}
                    </span>
                  )}
                  {i < all.length - 1 && <ChevronRight className="size-3" aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <div className="rule-gold mt-5" />
        <h1 className="mt-6 max-w-3xl text-5xl leading-[1.04] sm:text-6xl lg:text-7xl">
          {title}
          {accent && <span className="accent-italic"> {accent}</span>}
        </h1>
        {intro && <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">{intro}</p>}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
