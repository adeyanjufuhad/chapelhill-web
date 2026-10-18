"use client";

import { useState } from "react";
import Masonry from "@/components/reactbits/Masonry";
import { cn } from "@/lib/utils";

export type GalleryProject = {
  id: string;
  src: string;
  width: number;
  height: number;
  title: string;
  alt: string;
  category: "completed" | "ongoing";
  render?: boolean;
};

const filters = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "ongoing", label: "In development" },
] as const;

// Masonry renders plain <img>; route images through the Next optimiser at a sensible width.
const optimised = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=75`;

export function ProjectGallery({ projects }: { projects: GalleryProject[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const shown = projects.filter((p) => filter === "all" || p.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "h-10 rounded-full border px-5 text-sm transition-colors",
              filter === f.value ? "bg-oxblood border-oxblood text-cream" : "border-ink/15 hover:border-ink/40",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-10" data-lenis-prevent-wheel>
        <Masonry
          key={filter}
          items={shown.map((p) => ({
            id: p.id,
            img: optimised(p.src),
            width: p.width,
            height: p.height,
            title: p.render ? `${p.title} (artist’s impression)` : p.title,
            alt: p.alt,
          }))}
          columns="auto"
          columnWidth={360}
          gap={16}
          radius={20}
          hoverEffect="zoom"
          captions="hover"
          draggable={false}
          blurToFocus={false}
          lightbox
        />
      </div>
    </div>
  );
}
