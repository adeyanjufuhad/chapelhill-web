import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Geist } from "next/font/google";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { company } from "@/content/company";
import "./globals.css";

// Accent face for one italic phrase per heading: a single italic file, preloaded
// so headings don't re-wrap (layout shift) when it arrives.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://chapelhill.com.ng"),
  title: {
    default: `${company.shortName} | ${company.tagline}`,
    template: `%s | ${company.shortName}`,
  },
  description: company.description,
  applicationName: company.shortName,
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.name,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#5c1a1b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={`${cormorant.variable} ${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <Suspense fallback={null}>
          <RevealObserver />
        </Suspense>
        <div aria-hidden="true" className="grain" />
      </body>
    </html>
  );
}
