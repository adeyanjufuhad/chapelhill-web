// Shape of public/build/manifest.json, written by scripts/build-frames.
// The hero reads nothing else, so swapping the source video needs no code change.

export type FrameSet = { count: number; width: number; height: number };

export type BuildManifest = {
  source: "keyframes" | "video";
  desktop: FrameSet;
  mobile: FrameSet;
  poster?: string;
  final?: string;
  video?: string | null;
};

export type FrameSetName = "desktop" | "mobile";

export const frameUrl = (set: FrameSetName, index: number) =>
  `/build/${set}/frame_${String(index + 1).padStart(4, "0")}.webp`;

/**
 * Stage captions, as fractions of scroll progress through the pinned hero.
 * Timed against the 50 s Flow take (Phase 3). Adjust here if the video changes.
 */
export const buildStages = [
  { label: "Design & planning", detail: "Survey, setting out and approvals", from: 0, to: 0.08 },
  { label: "Foundation", detail: "Trenches, footings and ground beams", from: 0.08, to: 0.26 },
  { label: "Structure", detail: "Blockwork, columns and the first-floor slab", from: 0.26, to: 0.55 },
  { label: "Roofing & windows", detail: "Trusses, stone-coated roof and glazing", from: 0.55, to: 0.76 },
  { label: "Finishing", detail: "Plaster, paint, paving and landscaping", from: 0.76, to: 0.9 },
  { label: "Welcome home", detail: "Handover, with keys in hand", from: 0.9, to: 1.01 },
] as const;

export const heroCopy = {
  eyebrow: "From empty plot to finished home",
  headline: "Homes built with excellence.",
  headlineAccent: "Even while you’re abroad.",
  primaryCta: { label: "Explore developments", href: "/developments" },
  whatsappCta: {
    label: "Chat on WhatsApp",
    message: "Hello Chapelhill, I’d like to learn more about your homes.",
  },
};
