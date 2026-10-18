import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsApp({ message = "Hello Chapelhill, I’d like to speak with your team." }: { message?: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Chapelhill on WhatsApp (opens in a new tab)"
      className="bg-oxblood text-cream ring-cream/15 hover:bg-oxblood-soft fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full shadow-[0_10px_30px_-10px_rgb(26_26_26/0.55)] ring-1 transition-[background-color,transform] duration-300 hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
