import Image from "next/image";
import { readBuildManifest } from "@/lib/build-manifest.server";
import { BuildSequenceScrub, StaticBuildHero } from "./BuildSequenceScrub";

/**
 * Scroll-scrubbed construction hero. Everything it needs comes from
 * public/build/manifest.json (frame counts, sizes, poster, MP4 fallback).
 * With no manifest yet, it renders the static hero with a blueprint drawing.
 */
export function BuildSequenceHero() {
  const manifest = readBuildManifest();
  if (!manifest) return <StaticBuildHero />;

  return (
    <BuildSequenceScrub
      manifest={manifest}
      poster={
        <Image
          src={manifest.poster ?? "/build/poster.webp"}
          alt="An empty fenced plot of red laterite soil in a gated estate at golden hour, before construction begins"
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
