"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SectionConfig } from "@/lib/wedding-defaults";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  couple: "Couple",
  date: "Date",
  location: "Location",
  gallery: "Gallery",
  rsvp: "RSVP",
  wishes: "Wishes",
  gift: "Gift",
  music: "Music",
};

type Props = {
  weddingId: string;
  initialSections: SectionConfig[];
  onUnsaved?: () => void;
  onSaved?: () => void;
};

export function SectionsForm({ weddingId, initialSections, onUnsaved, onSaved }: Props) {
  const [sections, setSections] = useState<SectionConfig[]>(
    [...initialSections].sort((a, b) => a.order - b.order)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = useCallback(
    async (next: SectionConfig[]) => {
      setError(null);
      setSaving(true);
      const res = await fetch(`/api/weddings/${weddingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: next }),
        credentials: "include",
      });
      setSaving(false);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error ?? "Failed to save";
        setError(msg);
        toast.error(msg);
        return;
      }
      const data = await res.json();
      setSections([...(data.sections ?? next)].sort((a: SectionConfig, b: SectionConfig) => a.order - b.order));
      setSaved(true);
      toast.success("Layout saved.");
      onSaved?.();
      setTimeout(() => setSaved(false), 2000);
    },
    [weddingId]
  );

  const toggle = (index: number) => {
    const next = sections.map((s, i) =>
      i === index ? { ...s, enabled: !s.enabled } : s
    );
    setSections(next);
    onUnsaved?.();
    save(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...sections];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index].order, next[j].order] = [next[j].order, next[index].order];
    next.sort((a, b) => a.order - b.order);
    const reordered = next.map((s, i) => ({ ...s, order: i }));
    setSections(reordered);
    onUnsaved?.();
    save(reordered);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-[11px] text-destructive" role="alert">
          {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-1.5 text-[11px] text-tertiary-foreground" role="status" aria-live="polite">
          <svg
            className="size-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Saved
        </div>
      )}

      <div className="rounded border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex items-center gap-3 px-3 h-[40px] hover:bg-white/[0.02] transition-colors duration-150"
            >
              {/* Drag handle */}
              <button
                type="button"
                className="flex items-center gap-1 shrink-0 text-tertiary-foreground hover:text-foreground transition-colors duration-150 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded"
                aria-label={`Reorder ${SECTION_LABELS[section.id] ?? section.id}`}
                onMouseDown={(e) => {
                  // Simple drag-to-reorder could be added here
                  e.preventDefault();
                }}
              >
                <GripVertical className="size-4" aria-hidden />
              </button>

              {/* Section name */}
              <span className="flex-1 text-[12px] font-medium text-foreground truncate">
                {SECTION_LABELS[section.id] ?? section.id}
              </span>

              {/* Move buttons */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="h-6 w-6 inline-flex items-center justify-center rounded text-tertiary-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  aria-label={`Move ${SECTION_LABELS[section.id] ?? section.id} up`}
                >
                  <ChevronUp className="size-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === sections.length - 1}
                  className="h-6 w-6 inline-flex items-center justify-center rounded text-tertiary-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  aria-label={`Move ${SECTION_LABELS[section.id] ?? section.id} down`}
                >
                  <ChevronDown className="size-3.5" aria-hidden />
                </button>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={section.enabled}
                aria-label={`${section.enabled ? "Disable" : "Enable"} ${SECTION_LABELS[section.id] ?? section.id}`}
                onClick={() => toggle(index)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  section.enabled
                    ? "border-primary bg-primary"
                    : "border-border bg-white/5"
                )}
              >
                <span
                  className={cn(
                    "inline-block size-4 transform rounded-full bg-white transition-transform duration-150",
                    section.enabled ? "translate-x-4" : "translate-x-0.5"
                  )}
                  aria-hidden
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {saving && (
        <div className="flex items-center gap-1.5 text-[11px] text-primary/70" role="status" aria-live="polite">
          <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          Saving…
        </div>
      )}
    </div>
  );
}
