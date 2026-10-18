"use client";

import Image from "next/image";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export type LightboxImage = { src: string; alt: string; width: number; height: number; caption?: string };

export function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const current = open ? images[index] : null;
  const many = images.length > 1;

  useEffect(() => {
    if (!open || !many) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, many, index, images.length, onIndexChange]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent
        className="bg-ink/96 text-cream max-w-[min(96vw,1400px)] border-0 p-0 shadow-none sm:max-w-[min(96vw,1400px)]"
      >
        {current && (
          <figure className="relative flex flex-col">
            <DialogTitle className="sr-only">{current.alt}</DialogTitle>
            <DialogDescription className="sr-only">
              Image {index! + 1} of {images.length}
            </DialogDescription>
            <div className="relative h-[min(78vh,900px)] w-full">
              <Image src={current.src} alt={current.alt} fill sizes="96vw" className="object-contain" />
            </div>
            <figcaption className="text-cream/80 flex items-center justify-between gap-4 px-5 py-4 text-sm">
              <span>{current.caption ?? current.alt}</span>
              {many && (
                <span className="tabular-nums">
                  {index! + 1} / {images.length}
                </span>
              )}
            </figcaption>
            {many && (
              <>
                <button
                  type="button"
                  onClick={() => onIndexChange((index! - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                  className="bg-ink/50 hover:bg-ink/80 absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full"
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onIndexChange((index! + 1) % images.length)}
                  aria-label="Next image"
                  className="bg-ink/50 hover:bg-ink/80 absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full"
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </>
            )}
            <DialogClose
              aria-label="Close"
              className="bg-ink/50 hover:bg-ink/80 absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-full"
            >
              <X aria-hidden="true" />
            </DialogClose>
          </figure>
        )}
      </DialogContent>
    </Dialog>
  );
}
