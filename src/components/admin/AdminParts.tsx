import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminHeading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl tracking-[-0.04em] sm:text-4xl">{title}</h1>
        {description && <p className="text-muted-foreground mt-2 max-w-2xl text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-[var(--stone)] bg-white p-5 sm:p-6", className)}>
      {title && <h2 className="mb-5 text-lg font-medium tracking-[-0.02em]">{title}</h2>}
      {children}
    </section>
  );
}

const tones: Record<string, string> = {
  new: "bg-oxblood text-cream",
  requested: "bg-oxblood text-cream",
  in_progress: "bg-gold/25 text-ink",
  contacted: "bg-gold/25 text-ink",
  fulfilled: "bg-forest/15 text-forest",
  closed: "bg-ink/10 text-ink",
  declined: "bg-ink/10 text-ink",
  for_sale: "bg-forest/15 text-forest",
  coming_soon: "bg-gold/25 text-ink",
  sold_out: "bg-ink/10 text-ink",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", tones[status] ?? "bg-ink/10")}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function AdminSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading">
      <div className="bg-stone h-10 w-64 rounded-lg" />
      <div className="bg-stone h-48 rounded-2xl" />
      <div className="bg-stone h-48 rounded-2xl" />
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground rounded-xl border border-dashed border-[var(--stone)] p-6 text-center text-sm">{children}</p>;
}

export const dateTime = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const dateOnly = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
