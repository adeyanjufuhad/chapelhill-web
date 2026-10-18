import { BuildSequenceHero } from "@/components/hero/BuildSequenceHero";
import { BuyingFromAbroad } from "@/components/home/BuyingFromAbroad";
import { FaqSection } from "@/components/home/FaqSection";
import { FeaturedDevelopments } from "@/components/home/FeaturedDevelopments";
import { IntroStats } from "@/components/home/IntroStats";
import { NewsletterBand } from "@/components/home/NewsletterBand";
import { ServicesList } from "@/components/home/ServicesList";
import { Testimonials } from "@/components/home/Testimonials";
import { TrackerTeaser } from "@/components/home/TrackerTeaser";
import { WhatsAppCta } from "@/components/home/WhatsAppCta";

export default function HomePage() {
  return (
    <>
      <BuildSequenceHero />
      <IntroStats />
      <FeaturedDevelopments />
      <BuyingFromAbroad />
      <TrackerTeaser />
      <ServicesList />
      <Testimonials />
      <FaqSection />
      <NewsletterBand />
      <WhatsAppCta />
    </>
  );
}
