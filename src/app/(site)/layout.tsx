import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Analytics } from "@/components/site/Analytics";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { TawkChat } from "@/components/site/TawkChat";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { jsonLd, organizationSchema } from "@/lib/seo";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="bg-ink text-cream focus:ring-gold sr-only z-[70] px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-2"
      >
        Skip to content
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationSchema())} />
      <SmoothScroll />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <TawkChat />
      <Analytics />
    </>
  );
}
