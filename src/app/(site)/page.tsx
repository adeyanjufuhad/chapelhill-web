import { BuildSequenceHero } from "@/components/hero/BuildSequenceHero";
import { AbroadZoom } from "@/components/home/AbroadZoom";
import { ClosingCta } from "@/components/home/ClosingCta";
import { FaqSection } from "@/components/home/FaqSection";
import { FeaturedDevelopments } from "@/components/home/FeaturedDevelopments";
import { ServicesFlow } from "@/components/home/ServicesFlow";
import { Statement } from "@/components/home/Statement";
import { Testimonials } from "@/components/home/Testimonials";
import { TrackerTeaser } from "@/components/home/TrackerTeaser";
import { Wordmark } from "@/components/home/Wordmark";
import { stock } from "@/content/stock";

export default function HomePage() {
  return (
    <>
      <BuildSequenceHero />
      <Statement />
      <Wordmark image={stock.lagosBridgeSky.src} imageSmall={stock.lagosBridgeSky.src.replace("/stock/", "/stock/sm/")} />
      <FeaturedDevelopments />
      <AbroadZoom />
      <ServicesFlow />
      <TrackerTeaser />
      <Testimonials />
      <FaqSection />
      <ClosingCta />
    </>
  );
}
