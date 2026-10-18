"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, FileText, Gauge, Hammer, Inbox, Mail, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", Icon: Gauge },
  { href: "/admin/developments", label: "Developments", Icon: Building2 },
  { href: "/admin/progress", label: "Construction progress", Icon: Hammer },
  { href: "/admin/inquiries", label: "Enquiries", Icon: Inbox },
  { href: "/admin/requests", label: "Documents & inspections", Icon: FileText },
  { href: "/admin/clients", label: "Clients", Icon: Users },
  { href: "/admin/subscribers", label: "Subscribers", Icon: Mail },
  { href: "/admin/settings", label: "FX rates & stats", Icon: Settings },
];

export function AdminNav() {
  return <NavList pathname={usePathname()} />;
}

/** Rendered before the pathname is known (Suspense fallback): same links, no active state. */
export function AdminNavFallback() {
  return <NavList pathname={null} />;
}

function NavList({ pathname }: { pathname: string | null }) {
  const active = (href: string) => (pathname ? (href === "/admin" ? pathname === href : pathname.startsWith(href)) : false);

  return (
    <nav aria-label="Admin">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {items.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors",
                active(href) ? "bg-oxblood text-cream" : "hover:bg-ink/5",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

