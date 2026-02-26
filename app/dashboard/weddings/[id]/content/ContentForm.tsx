"use client";

import { useState, useCallback } from "react";
import type { WeddingContent } from "@/lib/wedding-defaults";

type Props = {
  weddingId: string;
  initialContent: WeddingContent;
};

export function ContentForm({ weddingId, initialContent }: Props) {
  const [content, setContent] = useState<WeddingContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const patch = useCallback(
    async (updates: Partial<WeddingContent>) => {
      setError(null);
      setFieldErrors({});
      setSaving(true);
      const res = await fetch(`/api/weddings/${weddingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: { ...content, ...updates } }),
        credentials: "include",
      });
      setSaving(false);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save");
        return;
      }
      const data = await res.json();
      setContent(data.content ?? content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [weddingId, content]
  );

  const trimStrings = (obj: unknown): unknown => {
    if (typeof obj === "string") return obj.trim();
    if (Array.isArray(obj)) return obj.map(trimStrings);
    if (obj && typeof obj === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj)) out[k] = trimStrings(v);
      return out;
    }
    return obj;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const c = content.couple;
    if ((c?.bride?.name ?? "").trim() === "" && (c?.groom?.name ?? "").trim() === "") {
      errs["couple"] = "Add at least one name (bride or groom).";
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }
    const trimmed = trimStrings(content) as WeddingContent;
    setContent(trimmed);
    patch(trimmed);
  };

  const updateCouple = (side: "bride" | "groom", field: string, value: string) => {
    const next = { ...content };
    if (!next.couple) next.couple = { bride: { name: "", username: "", parentInfo: "", location: "" }, groom: { name: "", username: "", parentInfo: "", location: "" } };
    if (!next.couple[side]) next.couple[side] = { name: "", username: "", parentInfo: "", location: "" };
    (next.couple[side] as Record<string, string>)[field] = value;
    setContent(next);
  };

  const updateEvent = (index: number, field: string, value: string | undefined) => {
    const events = [...(content.events ?? [])];
    while (events.length <= index) events.push({ title: "", date: "", time: "", location: "", address: "" });
    (events[index] as Record<string, string | undefined>)[field] = value;
    setContent({ ...content, events });
  };

  const addEvent = () => {
    setContent({
      ...content,
      events: [...(content.events ?? []), { title: "", date: "", time: "", location: "", address: "" }],
    });
  };

  const removeEvent = (index: number) => {
    const events = (content.events ?? []).filter((_, i) => i !== index);
    setContent({ ...content, events });
  };

  const bride = content.couple?.bride ?? { name: "", username: "", parentInfo: "", location: "" };
  const groom = content.couple?.groom ?? { name: "", username: "", parentInfo: "", location: "" };
  const events = content.events ?? [];

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <h2 className="text-lg font-semibold text-foreground">Content</h2>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}
      {fieldErrors.couple && (
        <p id="content-couple-error" className="text-sm text-red-600" role="alert">
          {fieldErrors.couple}
        </p>
      )}
      {saved && (
        <p className="text-sm text-green-700" role="status" aria-live="polite">
          Saved.
        </p>
      )}

      <fieldset className="space-y-4" aria-describedby={fieldErrors.couple ? "content-couple-error" : undefined}>
        <legend className="text-base font-medium text-foreground">Couple</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground/80">Bride</h3>
            {(["name", "username", "parentInfo", "location", "image"] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`bride-${field}`} className="block text-sm font-medium text-foreground mb-1">
                  {field === "parentInfo" ? "Parent info" : field === "image" ? "Image URL" : field}
                </label>
                <input
                  id={`bride-${field}`}
                  name={`bride-${field}`}
                  type={field === "image" ? "url" : "text"}
                  value={bride[field] ?? ""}
                  onChange={(e) => updateCouple("bride", field, e.target.value)}
                  className="min-h-[44px] w-full rounded border border-gray-300 px-3 py-2 text-base text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus-visible:ring-2"
                  autoComplete={field === "name" ? "name" : "off"}
                  spellCheck={field !== "username" && field !== "image"}
                />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground/80">Groom</h3>
            {(["name", "username", "parentInfo", "location", "image"] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`groom-${field}`} className="block text-sm font-medium text-foreground mb-1">
                  {field === "parentInfo" ? "Parent info" : field === "image" ? "Image URL" : field}
                </label>
                <input
                  id={`groom-${field}`}
                  name={`groom-${field}`}
                  type={field === "image" ? "url" : "text"}
                  value={groom[field] ?? ""}
                  onChange={(e) => updateCouple("groom", field, e.target.value)}
                  className="min-h-[44px] w-full rounded border border-gray-300 px-3 py-2 text-base text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus-visible:ring-2"
                  autoComplete={field === "name" ? "name" : "off"}
                  spellCheck={field !== "username" && field !== "image"}
                />
              </div>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-medium text-foreground">Events</legend>
        {events.map((ev, i) => (
          <div key={i} className="rounded border border-gray-200 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground/80">Event {i + 1}</span>
              <button
                type="button"
                onClick={() => removeEvent(i)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500/30 focus-visible:ring-2 rounded"
                aria-label={`Remove event ${i + 1}`}
              >
                Remove
              </button>
            </div>
            {(["title", "date", "time", "location", "address", "mapsUrl"] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`ev-${i}-${field}`} className="block text-sm font-medium text-foreground mb-1">
                  {field === "mapsUrl" ? "Maps URL" : field}
                </label>
                <input
                  id={`ev-${i}-${field}`}
                  name={`ev-${i}-${field}`}
                  type={field === "date" ? "date" : field === "mapsUrl" ? "url" : "text"}
                  value={ev[field] ?? ""}
                  onChange={(e) => updateEvent(i, field, e.target.value)}
                  className="min-h-[44px] w-full rounded border border-gray-300 px-3 py-2 text-base text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus-visible:ring-2"
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={addEvent}
          className="min-h-[44px] px-4 py-2 rounded border border-dashed border-gray-400 text-sm font-medium text-foreground hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus-visible:ring-2"
        >
          Add event
        </button>
      </fieldset>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] px-5 py-2 rounded bg-foreground text-background font-medium hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-foreground/30 focus-visible:ring-2 inline-flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              Saving…
            </>
          ) : (
            "Save content"
          )}
        </button>
      </div>
    </form>
  );
}
