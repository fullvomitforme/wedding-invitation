"use client";

import { useState, useCallback } from "react";
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
};

export function SectionsForm({ weddingId, initialSections }: Props) {
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
        setError(data.error ?? "Failed to save");
        return;
      }
      const data = await res.json();
      setSections([...(data.sections ?? next)].sort((a: SectionConfig, b: SectionConfig) => a.order - b.order));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [weddingId]
  );

  const toggle = (index: number) => {
    const next = sections.map((s, i) =>
      i === index ? { ...s, enabled: !s.enabled } : s
    );
    setSections(next);
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
    save(reordered);
  };

  const btnClass =
    "min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416] transition-colors duration-200";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-50">Layout</h2>
      <p className="text-sm text-neutral-400">
        Turn sections on or off and change their order on the invitation.
      </p>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
          {error}
        </div>
      )}
      {saved && (
        <p className="text-sm text-neutral-400" role="status" aria-live="polite">
          Saved.
        </p>
      )}

      <ul className="space-y-0 rounded-md border border-white/6 divide-y divide-white/6 bg-[#0E0E10]/50">
        {sections.map((section, index) => (
          <li
            key={section.id}
            className="flex items-center gap-3 px-4 py-3 first:rounded-t-md last:rounded-b-md hover:bg-white/2"
          >
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className={btnClass}
                aria-label={`Move ${SECTION_LABELS[section.id] ?? section.id} up`}
              >
                <span aria-hidden>↑</span>
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === sections.length - 1}
                className={btnClass}
                aria-label={`Move ${SECTION_LABELS[section.id] ?? section.id} down`}
              >
                <span aria-hidden>↓</span>
              </button>
            </div>
            <label className="flex flex-1 min-h-[44px] items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={section.enabled}
                onChange={() => toggle(index)}
                className="size-5 rounded border-white/10 bg-white/5 text-[#BFA14A] outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416]"
                aria-describedby={`section-desc-${section.id}`}
              />
              <span id={`section-desc-${section.id}`} className="font-medium text-neutral-200">
                {SECTION_LABELS[section.id] ?? section.id}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {saving && (
        <p className="text-sm text-neutral-400 flex items-center gap-2" aria-live="polite">
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          Saving…
        </p>
      )}
    </div>
  );
}
