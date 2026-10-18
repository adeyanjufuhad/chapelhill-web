"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { cn } from "@/lib/utils";

export type MapPoint = {
  slug: string;
  name: string;
  area: string;
  href?: string;
  lat: number;
  lng: number;
  approximate?: boolean;
};

// OpenStreetMap standard tiles: no API key, attribution required. Usage is light
// (a handful of map views per visit); move to a keyed provider if traffic grows.
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Leaflet map of developments. Leaflet loads only when the map scrolls near
 * the viewport, to keep it off the critical path on mobile data.
 */
export function DevelopmentsMap({
  points,
  zoom = 13,
  className,
  label = "Map of Chapelhill developments",
}: {
  points: MapPoint[];
  zoom?: number;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), {
      rootMargin: "300px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !ref.current) return;
    let map: LeafletMap | undefined;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19, className: "ch-map-tiles" }).addTo(map);

      const icon = L.divIcon({
        className: "ch-map-pin",
        html: '<span class="ch-map-pin__dot"></span>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const markers = points.map((p) => {
        const link = p.href ? `<a href="${p.href}" class="ch-map-popup__link">View development →</a>` : "";
        const note = p.approximate ? '<span class="ch-map-popup__note">Approximate location</span>' : "";
        return L.marker([p.lat, p.lng], { icon, title: p.name, keyboard: true })
          .bindPopup(
            `<div class="ch-map-popup"><strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(p.area)}</span>${note}${link}</div>`,
          )
          .addTo(map!);
      });

      if (points.length === 1) map.setView([points[0].lat, points[0].lng], zoom);
      else map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [48, 48], maxZoom: zoom });
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [visible, points, zoom]);

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      data-lenis-prevent
      className={cn("bg-stone relative z-0 h-[420px] w-full overflow-hidden rounded-sm", className)}
    />
  );
}
