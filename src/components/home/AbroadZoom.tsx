"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { stock } from "@/content/stock";
import { whatsappLink } from "@/lib/whatsapp";

gsap.registerPlugin(ScrollTrigger);

// Steps condensed from the client's diaspora FAQ (src/content/faq.ts).
const steps = [
  { title: "Consult and inspect by video", body: "Meet our team on a virtual consultation and walk the site live on a video call, wherever you are." },
  { title: "Verified title and documents", body: "Land titles, legal due diligence and documentation, checked with trusted legal professionals." },
  { title: "Pay on a plan that suits you", body: "Secure digital transactions, flexible payment plans, and introductions to mortgage providers." },
  { title: "See every stage to handover", body: "Regular progress reports, photos and videos, plus independent inspection partners if you want them." },
];

/**
 * "Buying from abroad?": a Lagos aerial grows from a framed card to full-bleed
 * as the section pins, then the four steps follow.
 */
export function AbroadZoom() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=140%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        // The navbar goes transparent once the photo fills the screen.
        onUpdate: (self) => (section.dataset.navTone = self.progress > 0.55 ? "dark" : "light"),
      },
    });
    tl.fromTo(
      frame,
      { clipPath: mobile ? "inset(22% 8% 22% 8% round 24px)" : "inset(18% 26% 18% 26% round 32px)" },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 },
    )
      .fromTo(imageRef.current, { scale: 1.25 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
      .fromTo(textRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.55);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section aria-labelledby="abroad-heading">
      <div ref={sectionRef} data-nav-tone="light" className="bg-cream relative h-svh overflow-hidden">
        <div ref={frameRef} className="theme-oxblood absolute inset-0 overflow-hidden">
          <div ref={imageRef} className="absolute inset-0">
            <Image src={stock.lagosLagoonAerial.src} alt={stock.lagosLagoonAerial.alt} fill sizes="100vw" className="object-cover" />
          </div>
          <div className="from-oxblood-deep/85 via-oxblood-deep/30 absolute inset-0 bg-gradient-to-t to-transparent" />
          <div ref={textRef} className="container-luxe absolute inset-x-0 bottom-0 pb-14 sm:pb-20">
            <p className="eyebrow">Buying from abroad?</p>
            <h2 id="abroad-heading" className="mt-4 max-w-4xl text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.96] tracking-[-0.045em]">
              Own a home in Nigeria <span className="accent-italic block">without flying home.</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="container-luxe py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_2fr] lg:gap-20">
          <Reveal>
            <p className="text-muted-foreground max-w-sm text-lg leading-relaxed">
              From London, Houston or Dubai, our diaspora desk handles every step of the purchase and keeps you informed at
              each one.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full px-6">
                <a
                  href={whatsappLink("Hello Chapelhill, I live abroad and I’m interested in buying a home.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="size-4" />
                  Speak to the diaspora desk
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-ink/20 h-12 rounded-full bg-transparent px-6">
                <Link href="#faq">Read the buyer FAQ</Link>
              </Button>
            </div>
          </Reveal>
          <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 90} className="border-ink/15 border-t pt-6">
                <span className="text-oxblood font-display text-sm font-medium tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-2xl tracking-[-0.03em]">{s.title}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
