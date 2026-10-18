import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { stock } from "@/content/stock";

/** Split-screen card for portal sign-in and password pages. */
export function AuthCard({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main id="main" className="bg-cream grid min-h-svh lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link href="/" aria-label="Chapelhill home">
            <Image src="/brand/chapelhill-logo.png" alt="Chapelhill Multicompany International" width={238} height={47} className="h-8 w-auto" />
          </Link>
          <p className="eyebrow mt-12">Client portal</p>
          <h1 className="mt-3 text-4xl tracking-[-0.045em]">{title}</h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{intro}</p>
          {children}
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image src={stock.handoverKeys.src} alt="" fill sizes="50vw" className="object-cover" />
        <div className="from-oxblood-deep/70 absolute inset-0 bg-gradient-to-t to-transparent" />
        <p className="text-cream absolute right-10 bottom-10 left-10 text-3xl leading-tight font-medium tracking-[-0.04em]">
          Follow your home from anywhere, <span className="accent-italic text-gold-light">update by update.</span>
        </p>
      </div>
    </main>
  );
}
