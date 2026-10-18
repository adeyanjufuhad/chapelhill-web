import { cn } from "@/lib/utils";

// Line elevation of a two-storey duplex with a hip roof, drawn on with
// stroke-dashoffset. Every path uses pathLength={1}, so one dash pattern
// fits all of them. With reduced motion the global CSS shortens the
// animation to its end state, so the drawing simply appears.

const building = [
  "M40 340 H600", // ground line
  "M150 340 V230 H490 V340", // ground floor
  "M136 230 H504", // first-floor slab
  "M165 230 V140 H475 V230", // first floor
  "M128 140 L232 78 H408 L512 140 Z", // hip roof
  "M232 78 L262 140 M408 78 L378 140", // hips
  "M300 340 V268 H340 V340", // door
  "M184 266 H236 V310 H184 Z M404 266 H456 V310 H404 Z", // ground-floor windows
  "M190 164 H240 V204 H190 Z M400 164 H450 V204 H400 Z", // first-floor windows
  "M286 230 V206 H354 V230 M286 216 H354", // balcony
];

const annotations = [
  "M150 370 H490 M150 364 V376 M490 364 V376", // width dimension
  "M548 340 V78 M542 340 H554 M542 78 H554", // height dimension
  "M92 340 V318 M612 340 V318 M92 322 L150 322 M490 322 L612 322", // setting-out pegs and string line
];

export function BlueprintDrawing({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <svg
      viewBox="0 0 640 400"
      fill="none"
      aria-hidden="true"
      className={cn("blueprint", animate && "blueprint-animate", className)}
    >
      <defs>
        <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H0 V20" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="640" height="400" fill="url(#blueprint-grid)" />
      <g stroke="var(--cream)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {building.map((d, i) => (
          <path key={d} d={d} pathLength={1} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </g>
      <g stroke="var(--gold-light)" strokeWidth="1" strokeLinecap="round" opacity="0.85">
        {annotations.map((d, i) => (
          <path key={d} d={d} pathLength={1} style={{ "--i": building.length + i } as React.CSSProperties} />
        ))}
      </g>
    </svg>
  );
}
