import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/site/ContactForm";
import { DevelopmentsMap } from "@/components/site/DevelopmentsMap";
import { InquiryForm } from "@/components/site/InquiryForm";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceholderTag } from "@/components/site/Placeholder";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { company } from "@/content/company";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit, call, email or WhatsApp Chapelhill in Lekki, Lagos. We respond within 24 hours, 7 days a week.",
};

// Approximate pin for HFP Shopping Complex, Abraham Adesanya Junction (to be confirmed by the client).
const office = { lat: 6.4669, lng: 3.5652 };

export default function ContactPage() {
  const { address, phones, email, hours } = company.contact;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s talk about"
        accent="your home."
        intro="Visit our Lekki office, call, email or message us on WhatsApp. We are here 7 days a week and respond within 24 hours."
        crumbs={[{ label: "Contact" }]}
      >
        <Button asChild size="lg" className="h-12 rounded-full px-6">
          <a href={whatsappLink("Hello Chapelhill, I’d like to speak with your team.")} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="size-4" /> Chat on WhatsApp
          </a>
        </Button>
      </PageHeader>

      <section aria-label="Contact details and form" className="container-luxe pt-4 pb-24 sm:pb-36">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <ul className="divide-ink/10 border-ink/15 divide-y border-y">
              <li className="flex gap-4 py-6">
                <MapPin className="text-oxblood mt-1 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-muted-foreground text-xs">Office</p>
                  <address className="mt-1 text-lg not-italic leading-snug">
                    {address.line1}
                    <br />
                    {address.line2}
                    <br />
                    {address.state}, {address.country}
                  </address>
                </div>
              </li>
              <li className="flex gap-4 py-6">
                <Phone className="text-oxblood mt-1 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  {phones.map((p) => (
                    <a key={p.e164} href={`tel:${p.e164}`} className="hover:text-oxblood mt-1 block text-lg tabular-nums">
                      {p.display}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex gap-4 py-6">
                <Mail className="text-oxblood mt-1 size-5 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs">Email</p>
                  <a href={`mailto:${email}`} className="hover:text-oxblood mt-1 block text-lg break-all">
                    {email}
                  </a>
                </div>
              </li>
              <li className="flex gap-4 py-6">
                <Clock className="text-oxblood mt-1 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-muted-foreground text-xs">Office hours</p>
                  <p className="mt-1 text-lg">
                    {hours} <PlaceholderTag className="ml-1" label="TBC" />
                  </p>
                </div>
              </li>
            </ul>
            <DevelopmentsMap
              className="mt-8 h-[360px] rounded-[22px]"
              zoom={15}
              label="Map showing the Chapelhill office in Lekki"
              points={[{ slug: "office", name: "Chapelhill office", area: "HFP Shopping Complex, Lekki", lat: office.lat, lng: office.lng, approximate: true }]}
            />
          </div>

          <div>
            <p className="eyebrow">Send a message</p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[1] tracking-[-0.045em]">
              Tell us what you’re <span className="accent-italic">looking for.</span>
            </h2>
            <div className="mt-8">
              <Suspense fallback={<InquiryForm topic="general" />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
