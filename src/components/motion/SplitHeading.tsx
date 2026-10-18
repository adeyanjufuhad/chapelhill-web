"use client";

import SplitText from "@/components/reactbits/SplitText";

/**
 * Section heading whose words rise through a mask as it enters view
 * (React Bits SplitText, DESIGN.md §7), with an optional Cormorant italic
 * accent phrase that fades in after the words.
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
  return (
    <Tag id={id} className={className}>
      <SplitText
        text={text}
        tag="span"
        splitType="words"
        effect="rise"
        textAlign="left"
        delay={70}
        duration={1}
        rootMargin="-60px"
        className="pb-[0.08em] align-bottom"
      />
      {accent && (
        <>
          {" "}
          <SplitText
            text={accent}
            tag="span"
            splitType="words"
            effect="fade"
            textAlign="left"
            delay={90}
            duration={1.2}
            rootMargin="-60px"
            className={`accent-italic pb-[0.12em] align-bottom ${accentBlock ? "block" : ""}`}
          />
        </>
      )}
    </Tag>
  );
}
