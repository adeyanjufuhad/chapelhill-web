"use client";

// Adapted from 21st.dev "Thumbnail image viewer" by ibrandify
// (https://21st.dev/@ibrandify/components/thumbnail-image-viewer): restyled to
// the Chapelhill tokens, next/image for the stage and thumbnails, render tag,
// and a click-to-enlarge hook for the lightbox. Tab semantics and keyboard
// handling (arrows, Home, End) are kept from the original.

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  src: string;
  alt: string;
  title?: string;
  render?: boolean;
};

export default function ThumbnailImageViewer({
  images,
  onOpen,
  className,
}: {
  images: GalleryImage[];
  onOpen?: (index: number) => void;
  className?: string;
}) {
  const [active, setActive] = React.useState(0);
  const tabs = React.useRef<HTMLDivElement>(null);
  const id = React.useId().replace(/:/g, "");
  const current = images[active];
  const many = images.length > 1;

  const choose = (n: number) => setActive((n + images.length) % Math.max(1, images.length));

  return (
    <div className={cn("w-full", className)}>
      <div
        id={`${id}-panel`}
        role={many ? "tabpanel" : undefined}
        aria-labelledby={many ? `${id}-tab-${active}` : undefined}
        className="bg-stone group relative isolate aspect-[16/10] overflow-hidden rounded-[22px]"
      >
        {current && (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            preload={active === 0}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="animate-in fade-in object-cover duration-500"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />

        {current?.render && (
          <span className="bg-ink/55 text-cream absolute top-4 left-4 rounded-full px-3 py-1 text-xs backdrop-blur-sm">
            Artist’s impression
          </span>
        )}

        {onOpen && (
          <button
            type="button"
            onClick={() => onOpen(active)}
            aria-label="View larger"
            className="bg-cream/90 text-ink absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full backdrop-blur-sm transition-transform hover:scale-105"
          >
            <Expand className="size-4" aria-hidden="true" />
          </button>
        )}

        {many && (
          <div className="absolute right-4 bottom-4 z-10 flex items-center gap-2">
            <span className="text-cream/90 mr-2 text-xs tabular-nums">
              {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            {[
              { label: "Previous image", d: -1, Icon: ChevronLeft },
              { label: "Next image", d: 1, Icon: ChevronRight },
            ].map(({ label, d, Icon }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => choose(active + d)}
                className="bg-cream/90 text-ink inline-flex size-10 items-center justify-center rounded-full backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
              >
                <Icon className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </div>

      {many && (
        <div
          ref={tabs}
          role="tablist"
          aria-label="Choose image"
          className="mt-3 flex gap-2.5 overflow-x-auto pb-1"
          onKeyDown={(e) => {
            let next = active;
            if (e.key === "ArrowRight") next = (active + 1) % images.length;
            else if (e.key === "ArrowLeft") next = (active - 1 + images.length) % images.length;
            else if (e.key === "Home") next = 0;
            else if (e.key === "End") next = images.length - 1;
            else return;
            e.preventDefault();
            choose(next);
            tabs.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
          }}
        >
          {images.map((im, i) => (
            <button
              key={im.src}
              type="button"
              id={`${id}-tab-${i}`}
              role="tab"
              aria-selected={active === i}
              aria-controls={`${id}-panel`}
              aria-label={im.title ?? im.alt}
              tabIndex={active === i ? 0 : -1}
              onClick={() => choose(i)}
              className={cn(
                "relative aspect-[3/2] w-24 shrink-0 overflow-hidden rounded-xl transition-all sm:w-32",
                active === i ? "ring-oxblood ring-offset-cream ring-2 ring-offset-2" : "opacity-55 hover:opacity-90",
              )}
            >
              <Image src={im.src} alt="" fill sizes="128px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
