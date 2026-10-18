import Image from "next/image";
import { readBuildManifest } from "@/lib/build-manifest.server";
import { BlueprintDrawing } from "./BlueprintDrawing";
import { BuildSequenceScrub, StaticHeroContent } from "./BuildSequenceScrub";

/**
 * Scroll-scrubbed construction hero. Everything it needs comes from
 * public/build/manifest.json (frame counts, sizes, poster, MP4 fallback).
 * With no manifest yet, it renders a static blueprint hero.
 */
export function BuildSequenceHero() {
  const manifest = readBuildManifest();

  if (!manifest) {
    return (
      <section aria-label="Chapelhill" className="theme-oxblood relative min-h-svh overflow-hidden">
        <BlueprintDrawing animate className="text-cream absolute top-1/2 right-[-10%] w-[min(110vw,900px)] -translate-y-1/2 opacity-40 md:right-0" />
        <StaticHeroContent />
      </section>
    );
  }

  const poster = manifest.poster ?? "/build/poster.webp";

  return (
    <BuildSequenceScrub
      manifest={manifest}
      poster={
        <Image
          src={poster}
          alt="An empty fenced plot of red laterite soil in a gated Lekki estate at golden hour, before construction begins"
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
      }
    />
  );
}
