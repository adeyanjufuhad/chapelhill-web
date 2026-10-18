"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";

/** Inline status dropdown that saves on change through a server action. */
export function StatusSelect({
  id,
  value,
  options,
  action,
  label,
}: {
  id: string;
  value: string;
  options: string[];
  action: (formData: FormData) => Promise<void>;
  label: string;
}) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label={label}
      defaultValue={value}
      disabled={pending}
      onChange={(e) => {
        const fd = new FormData();
        fd.set("id", id);
        fd.set("status", e.target.value);
        start(() => action(fd));
      }}
      className={cn("h-8 rounded-full border border-[var(--stone)] bg-white px-3 text-xs capitalize", pending && "opacity-60")}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}
