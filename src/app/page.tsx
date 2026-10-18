import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { company } from "@/content/company";
import { diasporaFaq } from "@/content/faq";
import { developments, statusLabel } from "@/content/developments";

// Phase 1 brand preview. Replaced by the real home page in Phase 4.

const swatches = [
  { name: "Oxblood (lead)", token: "bg-oxblood", hex: "#5C1A1B", text: "text-cream" },
  { name: "Oxblood deep", token: "bg-oxblood-deep", hex: "#3F1112", text: "text-cream" },
  { name: "Oxblood soft", token: "bg-oxblood-soft", hex: "#7A2426", text: "text-cream" },
  { name: "Blush (text on oxblood)", token: "bg-blush", hex: "#E2CFC9", text: "text-ink" },
  { name: "Gold", token: "bg-gold", hex: "#B8893B", text: "text-ink" },
  { name: "Gold ink (text on cream)", token: "bg-gold-ink", hex: "#8A6424", text: "text-cream" },
  { name: "Gold light (text on dark)", token: "bg-gold-light", hex: "#DBB46B", text: "text-ink" },
  { name: "Cream", token: "bg-cream", hex: "#F8F6F2", text: "text-ink" },
  { name: "Stone", token: "bg-stone", hex: "#E7E2D9", text: "text-ink" },
  { name: "Ink", token: "bg-ink", hex: "#1A1A1A", text: "text-cream" },
  { name: "Forest (minor accent)", token: "bg-forest", hex: "#2F4A3F", text: "text-cream" },
];

const formatNgn = (n: number) => `₦${(n / 1_000_000).toLocaleString("en-NG")}M`;

export default function BrandPreview() {
  return (
    <main className="flex-1">
      <section className="theme-oxblood">
        <div className="container-luxe py-24 sm:py-32">
          <p className="eyebrow">Brand preview · Phase 1</p>
          <div className="rule-gold mt-6" />
          <h1 className="mt-8 max-w-3xl text-5xl leading-[1.05] sm:text-7xl">
            A home <span className="accent-italic">worthy of you</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed sm:text-lg">{company.intro}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg">Explore developments</Button>
            <Button size="lg" variant="outline" className="border-cream/40 bg-transparent text-cream hover:bg-cream/10">
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="container-luxe py-20">
        <p className="eyebrow">Palette</p>
        <h2 className="mt-4 text-4xl">Colour tokens</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map((s) => (
            <div key={s.name} className={`${s.token} ${s.text} flex aspect-[4/3] flex-col justify-end rounded-sm border p-4`}>
              <span className="text-sm font-medium">{s.name}</span>
              <span className="text-xs opacity-80">{s.hex}</span>
            </div>
          ))}
        </div>
        <div className="mt-12 flex items-center gap-6 rounded-sm border bg-ivory p-6">
          <Image src="/brand/chapelhill-logo.png" alt="Chapelhill Multicompany International" width={238} height={47} />
          <p className="text-muted-foreground text-sm">Current logo (238×47 PNG). SVG requested from client.</p>
        </div>
      </section>

      <section className="border-y bg-ivory">
        <div className="container-luxe grid gap-12 py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Typography</p>
            <h2 className="mt-4 text-6xl">Cormorant Garamond</h2>
            <p className="font-display mt-4 text-3xl italic">Excellence in property development</p>
            <h3 className="mt-8 text-3xl">Homes built with excellence.</h3>
          </div>
          <div className="space-y-4 text-base leading-relaxed">
            <p className="text-sm font-medium tracking-wide">Inter for body copy</p>
            <p>{company.mission}</p>
            <p className="text-muted-foreground">{company.vision}</p>
          </div>
        </div>
      </section>

      <section className="container-luxe py-20">
        <p className="eyebrow">Developments</p>
        <h2 className="mt-4 text-4xl">Content check</h2>
        <ul className="mt-8 divide-y border-y">
          {developments.map((d) => (
            <li key={d.slug} className="flex flex-wrap items-baseline justify-between gap-3 py-5">
              <div>
                <p className="font-display text-2xl">{d.name}</p>
                <p className="text-muted-foreground text-sm">
                  {d.area}, {d.city} · {d.bedrooms.join(", ")} bed
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">from {formatNgn(d.priceFromNgn)}</span>
                <Badge variant="secondary">{statusLabel[d.status]}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="theme-ink">
        <div className="container-luxe py-20">
          <p className="eyebrow">Diaspora FAQ</p>
          <h2 className="mt-4 text-4xl">Buying from abroad</h2>
          <Accordion type="single" collapsible className="mt-8 max-w-3xl">
            {diasporaFaq.map((f) => (
              <AccordionItem key={f.question} value={f.question}>
                <AccordionTrigger className="font-display text-xl">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}
