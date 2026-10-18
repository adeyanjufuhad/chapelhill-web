import type { Metadata } from "next";
import { BuildSequenceHero } from "@/components/hero/BuildSequenceHero";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

// Bare test page for the build-sequence hero (Phase 2/3 review).

export const metadata: Metadata = {
  title: "Hero test",
  robots: { index: false, follow: false },
};

export default function HeroTestPage() {
  return (
    <main className="flex-1">
      <SmoothScroll />
      <BuildSequenceHero />
      <section className="container-luxe py-32">
        <p className="eyebrow">After the hero</p>
        <div className="rule-gold mt-5" />
        <h2 className="mt-6 max-w-2xl text-5xl">
          The page continues <span className="accent-italic">after the pin releases</span>
        </h2>
        <p className="text-muted-foreground mt-6 max-w-xl leading-relaxed">
          This section confirms that the pinned hero hands scrolling back to the page cleanly. Trust stats, featured
          developments and the rest of the home page arrive in Phase 4.
        </p>
      </section>
      <section className="theme-forest">
        <div className="container-luxe py-32">
          <h2 className="text-4xl">Forest section</h2>
        </div>
      </section>
    </main>
  );
}
