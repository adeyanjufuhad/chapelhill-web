import { cn } from "@/lib/utils";

// Marks invented content awaiting the client (see CONTENT-NEEDED.md).
// Hide all tags for client demos with NEXT_PUBLIC_SHOW_PLACEHOLDERS=false.

const visible = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "false";

export function PlaceholderTag({ label = "Placeholder", className }: { label?: string; className?: string }) {
  if (!visible) return null;
  return (
    <span
      title="Placeholder content awaiting the client. See CONTENT-NEEDED.md"
      className={cn(
        "inline-flex items-center rounded-sm border border-dashed border-current px-1.5 py-0.5 align-middle font-sans text-[0.6rem] font-medium tracking-[0.14em] uppercase opacity-70",
        className,
      )}
    >
      {label}
    </span>
  );
}
