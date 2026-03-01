"use client";

import { useState, useCallback } from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import type { WeddingContent } from "@/lib/wedding-defaults";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

type Props = {
  weddingId: string;
  initialContent: WeddingContent;
  section?: string;
  onUnsaved?: () => void;
  onSaved?: () => void;
};

export function ContentForm({ weddingId, initialContent, onUnsaved, onSaved }: Props) {
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
        const msg = data.error ?? "Failed to save";
        setError(msg);
        toast.error(msg);
        return;
      }
      const data = await res.json();
      setContent(data.content ?? content);
      setSaved(true);
      toast.success("Content saved.");
      onSaved?.();
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
    (next.couple[side] as unknown as Record<string, string>)[field] = value;
    setContent(next);
    onUnsaved?.();
  };

  const updateEvent = (index: number, field: string, value: string | undefined) => {
    const events = [...(content.events ?? [])];
    while (events.length <= index) events.push({ title: "", date: "", time: "", location: "", address: "" });
    (events[index] as unknown as Record<string, string | undefined>)[field] = value;
    setContent({ ...content, events });
    onUnsaved?.();
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

  const inputClass =
    "min-h-[32px] w-full rounded border border-input bg-white/5 px-2.5 py-1.5 text-[12px] text-foreground placeholder:text-tertiary-foreground outline-none transition-all duration-150 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card aria-invalid:border-destructive/50 aria-invalid:ring-destructive/20";
  const labelClass = "block text-[11px] font-medium text-tertiary-foreground mb-1";

  function EventDatePicker({
    value,
    onChange,
    id,
  }: {
    value: string;
    onChange: (date: string) => void;
    id: string;
  }) {
    const date = value && isValid(parseISO(value)) ? parseISO(value) : undefined;
    const [open, setOpen] = useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            id={id}
            variant="outline"
            className={cn(
              "min-h-[44px] w-full justify-start text-left font-normal border-white/10 bg-white/5 text-neutral-100 hover:bg-white/10",
              !date && "text-neutral-500"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? format(date, "PPP") : "Pick date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              if (d) {
                onChange(format(d, "yyyy-MM-dd"));
                setOpen(false);
              }
            }}
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <h2 className="text-lg font-semibold text-neutral-50">Content</h2>

      {error && (
        <div className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-[11px] text-destructive" role="alert">
          {error}
        </div>
      )}
      {fieldErrors.couple && (
        <p id="content-couple-error" className="text-[11px] text-destructive mt-1" role="alert">
          {fieldErrors.couple}
        </p>
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

      <fieldset className="space-y-4" aria-describedby={fieldErrors.couple ? "content-couple-error" : undefined}>
        <legend className="text-base font-medium text-neutral-200">Couple</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-neutral-400">Bride</h3>
            {(["name", "username", "parentInfo", "location", "image"] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`bride-${field}`} className={labelClass}>
                  {field === "parentInfo" ? "Parent info" : field === "image" ? "Photo" : field}
                </label>
                {field === "image" ? (
                  <ImageUpload
                    id={`bride-${field}`}
                    value={bride.image ?? ""}
                    onChange={(url) => updateCouple("bride", "image", url)}
                    uploadUrl={`/api/weddings/${weddingId}/upload`}
                  />
                ) : (
                  <input
                    id={`bride-${field}`}
                    name={`bride-${field}`}
                    type="text"
                    value={bride[field] ?? ""}
                    onChange={(e) => updateCouple("bride", field, e.target.value)}
                    className={inputClass}
                    autoComplete={field === "name" ? "name" : "off"}
                    spellCheck={field !== "username"}
                    aria-invalid={fieldErrors.couple ? "true" : "false"}
                    aria-describedby={fieldErrors.couple ? "content-couple-error" : undefined}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-neutral-400">Groom</h3>
            {(["name", "username", "parentInfo", "location", "image"] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`groom-${field}`} className={labelClass}>
                  {field === "parentInfo" ? "Parent info" : field === "image" ? "Photo" : field}
                </label>
                {field === "image" ? (
                  <ImageUpload
                    id={`groom-${field}`}
                    value={groom.image ?? ""}
                    onChange={(url) => updateCouple("groom", "image", url)}
                    uploadUrl={`/api/weddings/${weddingId}/upload`}
                  />
                ) : (
                  <input
                    id={`groom-${field}`}
                    name={`groom-${field}`}
                    type="text"
                    value={groom[field] ?? ""}
                    onChange={(e) => updateCouple("groom", field, e.target.value)}
                    className={inputClass}
                    autoComplete={field === "name" ? "name" : "off"}
                    spellCheck={field !== "username"}
                    aria-invalid={fieldErrors.couple ? "true" : "false"}
                    aria-describedby={fieldErrors.couple ? "content-couple-error" : undefined}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-medium text-neutral-200">Events</legend>
        {events.map((ev, i) => (
          <div key={i} className="rounded-md border border-white/10 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-400">Event {i + 1}</span>
              <button
                type="button"
                onClick={() => removeEvent(i)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm text-red-400 hover:text-red-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] rounded"
                aria-label={`Remove event ${i + 1}`}
              >
                Remove
              </button>
            </div>
            {(["title", "date", "time", "location", "address", "mapsUrl"] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`ev-${i}-${field}`} className={labelClass}>
                  {field === "mapsUrl" ? "Maps URL" : field}
                </label>
                {field === "date" ? (
                  <EventDatePicker
                    id={`ev-${i}-${field}`}
                    value={ev.date ?? ""}
                    onChange={(v) => updateEvent(i, "date", v)}
                  />
                ) : (
                  <input
                    id={`ev-${i}-${field}`}
                    name={`ev-${i}-${field}`}
                    type={field === "mapsUrl" ? "url" : "text"}
                    value={ev[field] ?? ""}
                    onChange={(e) => updateEvent(i, field, e.target.value)}
                    className={inputClass}
                    autoComplete="off"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={addEvent}
          className="min-h-[44px] px-4 py-2 rounded-md border border-dashed border-white/10 text-sm font-medium text-neutral-200 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416] transition-colors duration-200"
        >
          Add event
        </button>
      </fieldset>

      <div className="flex gap-3">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="h-8 rounded border border-border bg-primary px-3 text-[11px] font-medium text-primary-foreground transition-all duration-150 hover:border-border/20 hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
