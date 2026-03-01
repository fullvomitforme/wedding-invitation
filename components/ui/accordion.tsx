"use client";

import * as React from "react";
import { Collapsible } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AccordionItemProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  saveStatus?: "saved" | "unsaved" | null;
  onSave?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AccordionItem({
  id,
  title,
  children,
  defaultOpen = false,
  saveStatus,
  onSave,
  isOpen: controlledOpen,
  onOpenChange,
}: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <Collapsible.Root open={open} onOpenChange={handleOpenChange}>
      <div className="border-b border-border bg-card">
        <Collapsible.Trigger
          className={cn(
            "flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-all duration-150 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
            open && "border-l-2 border-l-primary"
          )}
        >
          <div className="flex flex-1 items-center gap-3">
            <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
            {saveStatus && (
              <span
                className={cn(
                  "text-[11px] font-medium transition-opacity duration-150",
                  saveStatus === "saved"
                    ? "text-tertiary-foreground"
                    : saveStatus === "unsaved"
                      ? "text-tertiary-foreground"
                      : "text-primary/70"
                )}
              >
                {saveStatus === "saved" ? "Saved" : saveStatus === "unsaved" ? "Unsaved changes" : "Saving…"}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-tertiary-foreground transition-transform duration-150",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </Collapsible.Trigger>
        <Collapsible.Content className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <div className="px-3 pb-3">{children}</div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
