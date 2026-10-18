import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/admin/actions";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { getCurrentUser } from "@/lib/auth/session";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: { default: "Client portal", template: "%s | Chapelhill client portal" },
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/portal", label: "My home" },
  { href: "/portal/documents", label: "Documents" },
  { href: "/portal/inspection", label: "Video inspection" },
];

async function Greeting() {
  const user = await getCurrentUser();
  return user ? <span className="text-muted-foreground hidden text-sm sm:inline">{user.email}</span> : null;
}

export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return (
    <div className="bg-cream min-h-svh">
      <header className="border-b border-[var(--stone)] bg-white">
        <div className="container-luxe flex h-16 items-center justify-between gap-4">
          <Link href="/portal" aria-label="Client portal home">
            <Image src="/brand/chapelhill-logo.png" alt="Chapelhill" width={238} height={47} className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Suspense fallback={null}>
              <Greeting />
            </Suspense>
            <form action={signOutAction}>
              <input type="hidden" name="to" value="/portal/login" />
              <button type="submit" className="hover:text-oxblood inline-flex items-center gap-1.5 text-sm">
                <LogOut className="size-4" aria-hidden="true" /> Sign out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Portal" className="container-luxe">
          <ul className="-mb-px flex gap-6 overflow-x-auto text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-oxblood inline-block border-b-2 border-transparent py-3 whitespace-nowrap">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main" className="container-luxe py-10 sm:py-14">
        {children}
      </main>
      <a
        href={whatsappLink("Hello Chapelhill, I’m a client and I have a question about my home.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message your Chapelhill account manager on WhatsApp (opens in a new tab)"
        className="bg-oxblood text-cream fixed right-4 bottom-4 inline-flex size-14 items-center justify-center rounded-full shadow-lg sm:right-6 sm:bottom-6"
      >
        <WhatsAppIcon className="size-6" />
      </a>
    </div>
  );
}
