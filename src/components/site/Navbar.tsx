"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { StaggeredMenu } from "@/components/reactbits/StaggeredMenu";
import { company } from "@/content/company";
import { mainNav } from "@/content/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { PillIcon, pillClasses } from "./PillLink";

// Floating island navigation (DESIGN.md §4): a glass pill that stays legible
// over any section. Sections declare data-nav-tone="dark" | "light"; over dark
// ones the pill tints dark with cream text. It tightens after the first scroll.

type NavState = { dark: boolean; scrolled: boolean };

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

// Snapshot as a string so useSyncExternalStore compares by value.
function snapshot() {
  const header = document.querySelector("[data-site-nav]");
  const below = document.elementsFromPoint(window.innerWidth / 2, 44).find((el) => !header?.contains(el));
  const dark = below?.closest("[data-nav-tone]")?.getAttribute("data-nav-tone") === "dark";
  return `${dark ? 1 : 0}${window.scrollY > 24 ? 1 : 0}`;
}

function useNavState(): NavState {
  const s = useSyncExternalStore(subscribe, snapshot, () => "00");
  return { dark: s[0] === "1", scrolled: s[1] === "1" };
}

export function Navbar() {
  const pathname = usePathname();
  const { dark, scrolled } = useNavState();

  // Re-measure after client-side navigation swaps the page under the bar.
  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header data-site-nav className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
        <div
          className={cn(
            "pointer-events-auto flex w-full items-center justify-between gap-6 rounded-full border transition-[max-width,background-color,border-color,color,box-shadow,padding] duration-700 ease-[var(--ease-luxe)] md:backdrop-blur-xl",
            "shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_1px_2px_rgb(26_26_26/0.04),0_18px_40px_-24px_rgb(63_17_18/0.35)]",
            scrolled ? "max-w-[1120px] py-1.5 pr-1.5 pl-5" : "max-w-[1240px] py-2 pr-2 pl-6",
            dark ? "border-cream/15 bg-oxblood-deep/90 text-cream md:bg-oxblood-deep/45" : "border-ink/10 bg-cream/95 text-ink md:bg-cream/70",
          )}
        >
          <Logo reversed={dark} />

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            <ul className="flex items-center">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center rounded-full px-4 text-sm transition-colors duration-300",
                      isActive(item.href)
                        ? dark
                          ? "bg-cream/12"
                          : "bg-ink/6"
                        : dark
                          ? "hover:bg-cream/10"
                          : "hover:bg-ink/5",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact" className={cn(pillClasses(dark ? "gold" : "primary", "sm"), "ml-3")}>
              <span>Book a consultation</span>
              <PillIcon variant={dark ? "gold" : "primary"} size="sm" />
            </Link>
          </nav>

          {/* Spacer the size of the mobile menu toggle, which StaggeredMenu renders on top. */}
          <span aria-hidden="true" className="h-10 w-20 md:hidden" />
        </div>
      </header>

      <div className="md:hidden">
        <StaggeredMenu
          isFixed
          position="right"
          colors={["#3f1112", "#5c1a1b"]}
          accentColor="#b8893b"
          menuButtonColor={dark ? "#f8f6f2" : "#1a1a1a"}
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
