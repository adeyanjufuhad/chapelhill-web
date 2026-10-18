"use client";

import { useRef } from "react";
import Counter from "@/components/reactbits/Counter";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { useNear } from "@/components/motion/useNear";

const statementClass = "font-display text-[clamp(1.9rem,4.6vw,4.4rem)] leading-[1.06] font-medium tracking-[-0.04em] text-ink";

/** The statement renders as plain text until near, then React Bits ScrollReveal takes over. */
export function StatementText({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNear(ref);
  return (
    <div ref={ref} className="mt-8 max-w-6xl">
      {near ? (
        <ScrollReveal baseOpacity={0.14} enableBlur={false} baseRotation={0} containerClassName="!my-0" textClassName={statementClass}>
          {children}
        </ScrollReveal>
      ) : (
        <h2 className={statementClass}>{children}</h2>
      )}
    </div>
  );
}

/** Static figure until near, then the React Bits odometer rolls it in. */
export function StatCounter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const near = useNear(ref, "0px 0px -10% 0px");
  return (
    <span ref={ref}>
      {near ? (
        <Counter value={value} locale="en-GB" suffix={suffix || undefined} fontSize="1em" motionBlur={false} duration={1.1} />
      ) : (
        <span className="tabular-nums">
          {value.toLocaleString("en-GB")}
          {suffix}
        </span>
      )}
    </span>
  );
}
