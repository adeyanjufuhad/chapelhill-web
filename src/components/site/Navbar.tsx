"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { StaggeredMenu } from "@/components/reactbits/StaggeredMenu";
import { company } from "@/content/company";
import { mainNav } from "@/content/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const NAV_HEIGHT = 72;

// Transparent while a dark [data-hero] section sits under the bar, solid cream otherwise.
function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function overDarkHero() {
  const hero = document.querySelector("[data-hero]");
  return hero ? hero.getBoundingClientRect().bottom > NAV_HEIGHT : false;
}

export function Navbar() {
  const pathname = usePathname();
  const transparent = useSyncExternalStore(subscribe, overDarkHero, () => true);

  // Re-measure after client-side navigation swaps the page under the bar.
  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ease-[var(--ease-luxe)]",
          transparent
            ? "text-cream bg-transparent"
            : "bg-cream/92 text-ink shadow-[0_1px_0_0_var(--stone)] backdrop-blur-md supports-[backdrop-filter]:bg-cream/80",
        )}
      >
        <div className="container-luxe flex h-16 items-center justify-between gap-8 md:h-[72px]">
          <Logo reversed={transparent} />

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-7 text-[0.8rem] tracking-[0.12em] uppercase">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative py-2 transition-opacity hover:opacity-100",
                      "after:bg-gold after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-500 hover:after:scale-x-100",
                      isActive(item.href) ? "after:scale-x-100" : "opacity-85",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button
              asChild
              size="sm"
              variant={transparent ? "outline" : "default"}
              className={cn(
                "h-10 px-5 text-[0.75rem] tracking-[0.12em] uppercase",
                transparent && "border-cream/45 text-cream hover:bg-cream/10 hover:text-cream bg-transparent",
              )}
            >
              <Link href="/contact">Book a consultation</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="md:hidden">
        <StaggeredMenu
          isFixed
          position="right"
          className="[&_.staggered-menu-header]:z-[60]"
          colors={["#3f1112", "#5c1a1b"]}
          accentColor="#b8893b"
          menuButtonColor={transparent ? "#f8f6f2" : "#1a1a1a"}
          openMenuButtonColor="#1a1a1a"
          displayItemNumbering
          logo={<Logo />}
          items={[...mainNav, { label: "Client portal", href: "/portal" }].map((item) => ({
            label: item.label,
            ariaLabel: `Go to ${item.label}`,
            link: item.href,
          }))}
          socialItems={company.socials.map((s) => ({ label: s.name, link: s.href }))}
          displaySocials
        />
      </div>
    </>
  );
}
