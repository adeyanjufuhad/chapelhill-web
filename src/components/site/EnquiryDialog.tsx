"use client";

import { useState, type ReactNode } from "react";
import type { InquiryTopic } from "@/app/actions/inquiry";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InquiryForm } from "./InquiryForm";

/** A button that opens the enquiry form in a dialog, pre-filled with context. */
export function EnquiryDialog({
  trigger,
  title,
  description,
  topic,
  development,
  service,
  defaultMessage,
  submitLabel,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  topic: InquiryTopic;
  development?: string;
  service?: string;
  defaultMessage?: string;
  submitLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent data-lenis-prevent className="bg-cream max-h-[92svh] overflow-y-auto rounded-[24px] p-6 sm:max-w-2xl sm:p-10">
        <DialogHeader className="text-left">
          <DialogTitle className="text-3xl tracking-[-0.04em]">{title}</DialogTitle>
          {description && <DialogDescription className="text-base">{description}</DialogDescription>}
        </DialogHeader>
        <InquiryForm
          topic={topic}
          development={development}
          service={service}
          defaultMessage={defaultMessage}
          submitLabel={submitLabel}
          className="mt-4"
        />
      </DialogContent>
    </Dialog>
  );
}
