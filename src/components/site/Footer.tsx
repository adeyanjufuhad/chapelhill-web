import Link from "next/link";
import { company } from "@/content/company";
import { developments } from "@/content/developments";
import { footerNav } from "@/content/navigation";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { PlaceholderTag } from "./Placeholder";

const year = new Date().getFullYear();

export function Footer() {
  const { address, phones, email } = company.contact;

  return (
    <footer data-nav-tone="dark" className="theme-oxblood overflow-hidden">
      <div className="container-luxe py-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo reversed />
            <p className="text-muted-foreground mt-6 max-w-sm text-sm leading-relaxed">{company.vision}</p>
            <div className="mt-10">
              <p className="eyebrow">Stay informed</p>
              <NewsletterForm source="footer" className="mt-3" />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <FooterColumn title="Developments">
              {developments.map((d) => (
                <li key={d.slug}>
                  <Link href={`/developments/${d.slug}`} className="hover:text-gold-light transition-colors">
                    {d.name}
                    <span className="text-muted-foreground block text-xs">{d.area}, {d.city}</span>
                  </Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Explore">
              {[...footerNav.explore, ...footerNav.company].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-gold-light transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Visit or call">
              <li>
                <address className="text-muted-foreground not-italic leading-relaxed">
                  {address.line1}
                  <br />
                  {address.line2}
                  <br />
                  {address.state}, {address.country}
                </address>
              </li>
              {phones.map((p) => (
                <li key={p.e164}>
                  <a href={`tel:${p.e164}`} className="hover:text-gold-light tabular-nums transition-colors">
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${email}`} className="hover:text-gold-light break-all transition-colors">
                  {email}
                </a>
              </li>
            </FooterColumn>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="font-display text-cream/[0.07] mt-16 -mb-6 text-center text-[18vw] leading-[0.8] font-semibold tracking-[-0.065em] select-none sm:-mb-10"
        >
          Chapelhill
        </p>

        <div className="border-border text-muted-foreground relative mt-0 flex flex-col gap-4 border-t pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-5">
            {company.socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} className="hover:text-gold-light transition-colors">
                  {s.name}
                </a>
              </li>
            ))}
            <li>
              <PlaceholderTag label="Social links pending" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}
