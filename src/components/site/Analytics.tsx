"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

// GA4 + Hotjar, loaded afterInteractive and only after the visitor accepts
// analytics cookies (UK/EU diaspora visitors need consent). The choice is kept
// in localStorage; nothing loads when the IDs are not configured.

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
const KEY = "ch-analytics-consent";
const EVENT = "ch-consent-change";

type Consent = "granted" | "denied" | "unset";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "denied";
  }
}

function choose(value: "granted" | "denied") {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Private mode: the choice lasts for this page view only.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function Analytics() {
  // Server and first client render: "denied" (no banner flash, no scripts).
  const consent = useSyncExternalStore(subscribe, read, () => "denied" as Consent);
  if (!GA_ID && !HOTJAR_ID) return null;

  return (
    <>
      {consent === "unset" && (
        <div
          role="region"
          aria-label="Cookie preferences"
          className="bg-ivory/95 fixed bottom-4 left-4 z-[60] max-w-sm rounded-2xl border border-[var(--stone)] p-5 text-sm shadow-[0_1px_2px_rgb(26_26_26/0.04),0_24px_48px_-24px_rgb(63_17_18/0.35)] backdrop-blur-md sm:bottom-6 sm:left-6"
        >
          <p className="leading-relaxed">
            We use analytics cookies to understand how visitors use this site, so we can improve it. No advertising cookies.
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => choose("granted")} className="bg-oxblood text-cream h-10 rounded-full px-4 font-medium">
              Accept analytics
            </button>
            <button type="button" onClick={() => choose("denied")} className="border-ink/15 h-10 rounded-full border px-4">
              Decline
            </button>
          </div>
        </div>
      )}

      {consent === "granted" && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {consent === "granted" && HOTJAR_ID && (
        <Script id="hotjar" strategy="afterInteractive">
          {`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${Number(HOTJAR_ID)},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
        </Script>
      )}
    </>
  );
}
