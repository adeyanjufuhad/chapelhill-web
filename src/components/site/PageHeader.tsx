import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { ScrollZoom } from "@/components/motion/ScrollZoom";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

/**
 * Light, airy page header in the home-page style: large tight headline on
 * cream, optional photo framed in a rounded window below.
 */
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
  image?: { src: string; alt: string; position?: string };
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section data-nav-tone="light" className={cn("bg-cream", className)}>
      <div className="container-luxe pt-28 pb-12 sm:pt-36 sm:pb-16">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
              {[{ label: "Home", href: "/" }, ...crumbs].map((c, i, all) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {c.href && i < all.length - 1 ? (
                    <Link
                      href={c.href}
                      className="hover:text-oxblood transition-colors"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-ink">
                      {c.label}
                    </span>
                  )}
                  {i < all.length - 1 && (
                    <ChevronRight className="size-3" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="grid items-end gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            {typeof title === "string" &&
            (accent === undefined || typeof accent === "string") ? (
              <SplitHeading
                as="h1"
                text={title}
                accent={accent}
                className="mt-4 text-[clamp(2.8rem,7.4vw,7rem)] leading-[0.95] tracking-[-0.05em]"
              />
            ) : (
              <h1 className="mt-4 text-[clamp(2.8rem,7.4vw,7rem)] leading-[0.95] tracking-[-0.05em]">
                {title}
                {accent && <span className="accent-italic"> {accent}</span>}
              </h1>
            )}
          </div>
          {(intro || children) && (
            <div className="pb-2">
              {intro && (
                <p className="text-muted-foreground max-w-md text-base leading-relaxed sm:text-lg">
                  {intro}
                </p>
              )}
              {children && <div className="mt-6">{children}</div>}
            </div>
          )}
        </div>
      </div>
      {image && (
        <div className="px-4 pb-4 sm:px-[4vw] sm:pb-6">
          <div className="relative aspect-[4/3] overflow-clip rounded-[22px] sm:aspect-[21/9] sm:rounded-[32px]">
            <ScrollZoom>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload
                fetchPriority="high"
                sizes="96vw"
                className="object-cover"
                style={{ objectPosition: image.position ?? "50% 50%" }}
              />
            </ScrollZoom>
          </div>
        </div>
      )}
    </section>
  );
}
