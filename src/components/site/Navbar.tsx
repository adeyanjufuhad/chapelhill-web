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

type Tone = "dark" | "light" | "solid";

// Sections declare data-nav-tone="dark" | "light" for what sits under the bar.
// Over either, the bar is transparent (cream or ink text); elsewhere it turns solid.
function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function toneUnderBar(): Tone {
  const header = document.querySelector("[data-site-nav]");
  const below = document.elementsFromPoint(window.innerWidth / 2, 36).find((el) => !header?.contains(el));
  const tone = below?.closest("[data-nav-tone]")?.getAttribute("data-nav-tone");
  return tone === "dark" || tone === "light" ? tone : "solid";
}

export function Navbar() {
  const pathname = usePathname();
  const tone = useSyncExternalStore(subscribe, toneUnderBar, (): Tone => "light");
  const transparent = tone !== "solid";
  const onDark = tone === "dark";

  // Re-measure after client-side navigation swaps the page under the bar.
  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        data-site-nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ease-[var(--ease-luxe)]",
          transparent
            ? cn("bg-transparent", onDark ? "text-cream" : "text-ink")
            : "bg-cream/92 text-ink shadow-[0_1px_0_0_var(--stone)] backdrop-blur-md supports-[backdrop-filter]:bg-cream/80",
        )}
      >
        <div className="container-luxe flex h-16 items-center justify-between gap-8 md:h-[72px]">
          <Logo reversed={onDark} />

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
              variant={onDark ? "outline" : "default"}
              className={cn(
                "h-10 rounded-full px-5 text-[0.75rem] tracking-[0.12em] uppercase",
                onDark && "border-cream/45 text-cream hover:bg-cream/10 hover:text-cream bg-transparent",
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
          colors={["#3f1112", "#5c1a1b"]}
          accentColor="#b8893b"
          menuButtonColor={onDark ? "#f8f6f2" : "#1a1a1a"}
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
