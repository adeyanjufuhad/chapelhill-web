"use client";

import ScrollStack, { ScrollStackItem } from "@/components/reactbits/ScrollStack";
import { processSteps } from "@/content/services";

/** "How we work": the client's six steps as stacking cards (React Bits ScrollStack, window scroll). */
export function ProcessStack() {
  return (
    <ScrollStack useWindowScroll smoothScroll={false} itemDistance={90} itemStackDistance={22} stackPosition="18%" baseScale={0.86} dimAmount={0.08}>
      {processSteps.map((s, i) => (
        <ScrollStackItem
          key={s.title}
          itemClassName="h-auto! min-h-64 sm:min-h-72 [background:var(--ivory)]! [color:var(--ink)]! border border-[var(--stone)] p-8! sm:p-12!"
        >
          <div className="grid h-full gap-6 sm:grid-cols-[auto_1fr] sm:gap-14">
            <span className="text-oxblood text-[clamp(3rem,7vw,6rem)] leading-none font-medium tracking-[-0.05em] tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="self-end">
              <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] leading-tight tracking-[-0.04em]">{s.title}</h3>
              <p className="text-muted-foreground mt-3 max-w-xl text-base leading-relaxed sm:text-lg">{s.body}</p>
            </div>
          </div>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
