"use client";

import { useState } from "react";
import ThumbnailImageViewer from "@/components/twentyfirst/ThumbnailImageViewer";
import { Lightbox } from "@/components/site/Lightbox";
import type { DevelopmentImage } from "@/content/developments";

export function DevelopmentGallery({ images }: { images: DevelopmentImage[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ThumbnailImageViewer images={images} onOpen={setOpen} />
      <Lightbox
        images={images.map((im) => ({ ...im, caption: im.render ? `${im.alt} (artist’s impression)` : im.alt }))}
        index={open}
        onIndexChange={setOpen}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
