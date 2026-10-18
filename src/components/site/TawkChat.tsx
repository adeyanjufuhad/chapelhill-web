"use client";

import { useEffect } from "react";

// Tawk.to live chat, injected only after the visitor first interacts with the
// page (keeps it off the critical path on mobile data). Placed bottom-left so
// it never covers the WhatsApp button on the right.

const PROPERTY = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID; // "propertyId/widgetId"

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>;
    Tawk_LoadStart?: Date;
  }
}

export function TawkChat() {
  useEffect(() => {
    if (!PROPERTY) return;
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      events.forEach((e) => window.removeEventListener(e, load));
      window.Tawk_API = window.Tawk_API || {
        customStyle: {
          visibility: {
            desktop: { position: "bl", xOffset: 24, yOffset: 24 },
            mobile: { position: "bl", xOffset: 12, yOffset: 12 },
          },
        },
      };
      window.Tawk_LoadStart = new Date();
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://embed.tawk.to/${PROPERTY}`;
      s.charset = "UTF-8";
      s.setAttribute("crossorigin", "*");
      document.body.appendChild(s);
    };

    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, load));
  }, []);

  return null;
}
