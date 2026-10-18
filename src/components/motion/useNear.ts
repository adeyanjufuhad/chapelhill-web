"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True once the element is within `margin` of the viewport. Below-the-fold
 * motion (scroll triggers, splitting, measuring) waits for this so the first
 * load only pays for what is on screen.
 */
export function useNear(ref: RefObject<Element | null>, margin = "100% 0px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin, near]);
  return near;
}
