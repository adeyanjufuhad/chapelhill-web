import { Fragment, type CSSProperties } from "react";

/**
 * Section heading whose words rise through a mask as it enters view
 * (DESIGN.md §7). Plain markup with real text (SEO, screen readers, LCP);
 * the shared `RevealObserver` flips `data-in` and CSS does the motion.
 */
export function SplitHeading({
  text,
  accent,
  accentBlock = false,
  as: Tag = "h2",
  id,
  className,
}: {
  text: string;
  accent?: string;
  accentBlock?: boolean;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
}) {
  const words = text.split(" ");
  const accentWords = accent ? accent.split(" ") : [];

  return (
    <Tag id={id} data-split className={className}>
      {/* Spaces sit between the inline-block words: inside one they collapse. */}
      {words.map((w, i) => (
        <Fragment key={`w${i}`}>
          <span className="split-word">
            <span style={{ "--i": i } as CSSProperties}>{w}</span>
          </span>{" "}
        </Fragment>
      ))}
      {accent && (
        <span className={`accent-italic ${accentBlock ? "block" : ""}`}>
          {accentWords.map((w, i) => (
            <Fragment key={`a${i}`}>
              <span className="split-word">
                <span style={{ "--i": words.length + i } as CSSProperties}>{w}</span>
              </span>
              {i < accentWords.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </span>
      )}
    </Tag>
  );
}
