import { BuildSequenceHero } from "@/components/hero/BuildSequenceHero";
import { AbroadZoom } from "@/components/home/AbroadZoom";
import { ClosingCta } from "@/components/home/ClosingCta";
import { FaqSection } from "@/components/home/FaqSection";
import { FeaturedDevelopments } from "@/components/home/FeaturedDevelopments";
import { KineticBand } from "@/components/home/KineticBand";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { Statement } from "@/components/home/Statement";
import { SupportCards } from "@/components/home/SupportCards";
import { Testimonials } from "@/components/home/Testimonials";
import { TrackerTeaser } from "@/components/home/TrackerTeaser";
import { Wordmark } from "@/components/home/Wordmark";
import { stock } from "@/content/stock";
import { getTestimonials } from "@/lib/db/public";

export default async function HomePage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <BuildSequenceHero />
      <Statement />
      <Wordmark image={stock.lagosLagoonAerial.src} imageSmall={stock.lagosLagoonAerial.src.replace("/stock/", "/stock/sm/")} />
      <FeaturedDevelopments />
      <KineticBand lines={["Lekki · Ogudu · Airport Road", "Built with excellence · Delivered with care"]} />
      <AbroadZoom />
      <ServicesShowcase />
      <SupportCards />
      <TrackerTeaser />
      <Testimonials testimonials={testimonials} />
      <FaqSection />
      <KineticBand lines={["Lagos · Abuja · London · Houston · Dubai", "Your home, wherever you are"]} />
      <ClosingCta />
    </>
  );
}
