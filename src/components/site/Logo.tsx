import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Current logo is a 238×47 PNG (SVG requested, see CONTENT-NEEDED.md).
// On dark backgrounds it is reversed to cream with a CSS filter.

export function Logo({ reversed = false, className }: { reversed?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Chapelhill Multicompany International, home" className={cn("inline-flex shrink-0", className)}>
      <Image
        src="/brand/chapelhill-logo.png"
        alt="Chapelhill Multicompany International"
        width={238}
        height={47}
        className={cn(
          "h-8 w-auto transition-[filter] duration-500 sm:h-9",
          reversed && "brightness-0 invert-[0.96] sepia-[0.08]",
        )}
      />
    </Link>
  );
}
