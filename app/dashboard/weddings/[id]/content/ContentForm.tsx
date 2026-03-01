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

export function ContentForm({ weddingId, initialContent, section, onUnsaved, onSaved }: Props) {
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
    onUnsaved?.();
  };

  const removeEvent = (index: number) => {
    const events = (content.events ?? []).filter((_, i) => i !== index);
    setContent({ ...content, events });
    onUnsaved?.();
  };

  const updateGalleryImage = (index: number, field: string, value: string) => {
    const gallery = [...(content.gallery ?? [])];
    while (gallery.length <= index) gallery.push({ id: crypto.randomUUID(), url: "", alt: "" });
    (gallery[index] as unknown as Record<string, string>)[field] = value;
    setContent({ ...content, gallery });
    onUnsaved?.();
  };

  const addGalleryImage = () => {
    setContent({
      ...content,
      gallery: [...(content.gallery ?? []), { id: crypto.randomUUID(), url: "", alt: "" }],
    });
    onUnsaved?.();
  };

  const removeGalleryImage = (index: number) => {
    const gallery = (content.gallery ?? []).filter((_, i) => i !== index);
    setContent({ ...content, gallery });
    onUnsaved?.();
  };

  const updateSong = (index: number, field: string, value: string) => {
    const music = [...(content.music ?? [])];
    while (music.length <= index) music.push({ id: crypto.randomUUID(), title: "", artist: "", url: "" });
    (music[index] as unknown as Record<string, string>)[field] = value;
    setContent({ ...content, music });
    onUnsaved?.();
  };

  const addSong = () => {
    setContent({
      ...content,
      music: [...(content.music ?? []), { id: crypto.randomUUID(), title: "", artist: "", url: "" }],
    });
    onUnsaved?.();
  };

  const removeSong = (index: number) => {
    const music = (content.music ?? []).filter((_, i) => i !== index);
    setContent({ ...content, music });
    onUnsaved?.();
  };

  const bride = content.couple?.bride ?? { name: "", username: "", parentInfo: "", location: "" };
  const groom = content.couple?.groom ?? { name: "", username: "", parentInfo: "", location: "" };
  const events = content.events ?? [];
  const gallery = content.gallery ?? [];
  const music = content.music ?? [];

  const inputClass =
    "min-h-[32px] w-full rounded border border-input bg-white/5 px-2.5 py-1.5 text-[12px] text-foreground placeholder:text-tertiary-foreground outline-none transition-all duration-150 hover:border-border/20 hover:bg-white/[0.08] focus:border-primary focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card aria-invalid:border-destructive/50 aria-invalid:ring-destructive/20";
  const labelClass = "block text-[11px] font-medium text-foreground mb-1";
  const descriptionClass = "text-[10px] text-tertiary-foreground mt-0.5";

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
              "min-h-[32px] w-full justify-start text-left font-normal border-input bg-white/5 text-[12px] text-foreground transition-all duration-150 hover:border-border/20 hover:bg-white/[0.08] focus:border-primary focus:bg-white/[0.08]",
              !date && "text-tertiary-foreground"
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

  const getFieldDescription = (field: string, side: "bride" | "groom") => {
    const descriptions: Record<string, string> = {
      name: "Full name as it will appear on the invitation",
      username: "Social media handle or username (e.g., @username)",
      parentInfo: "Parents' names for traditional ceremonies",
      location: "Hometown or current location",
      image: "Profile photo URL or upload",
    };
    return descriptions[field] || "";
  };

  const getFieldPlaceholder = (field: string) => {
    const placeholders: Record<string, string> = {
      name: "e.g., Jane Smith",
      username: "e.g., @janesmith",
      parentInfo: "e.g., Daughter of John & Mary Smith",
      location: "e.g., New York, NY",
    };
    return placeholders[field] || "";
  };

  const renderCoupleSection = () => (
    <fieldset className="space-y-6" aria-describedby={fieldErrors.couple ? "content-couple-error" : undefined}>
      <div className="space-y-1">
        <legend className="text-[13px] font-semibold text-foreground">Couple Information</legend>
        <p className="text-[10px] text-tertiary-foreground">
          Add details about the bride and groom that will appear on your invitation.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="pb-2 border-b border-border">
            <h3 className="text-[12px] font-semibold text-foreground">Bride</h3>
          </div>
          {(["name", "username", "parentInfo", "location", "image"] as const).map((field) => (
            <div key={field} className="space-y-1.5">
              <label htmlFor={`bride-${field}`} className={labelClass}>
                {field === "parentInfo" ? "Parent info" : field === "image" ? "Photo" : field.charAt(0).toUpperCase() + field.slice(1)}
                {field === "name" && <span className="text-destructive ml-0.5">*</span>}
              </label>
              {field === "image" ? (
                <div className="space-y-1.5">
                  <ImageUpload
                    id={`bride-${field}`}
                    value={bride.image ?? ""}
                    onChange={(url) => updateCouple("bride", "image", url)}
                    uploadUrl={`/api/weddings/${weddingId}/upload`}
                  />
                  <p className={descriptionClass}>
                    Upload a profile photo. Recommended: square image, at least 400×400px.
                  </p>
                </div>
              ) : (
                <>
                  <input
                    id={`bride-${field}`}
                    name={`bride-${field}`}
                    type="text"
                    value={bride[field] ?? ""}
                    onChange={(e) => updateCouple("bride", field, e.target.value)}
                    className={inputClass}
                    placeholder={getFieldPlaceholder(field)}
                    autoComplete={field === "name" ? "name" : "off"}
                    spellCheck={field !== "username"}
                    aria-invalid={fieldErrors.couple ? "true" : "false"}
                    aria-describedby={fieldErrors.couple ? "content-couple-error" : `bride-${field}-desc`}
                  />
                  <p id={`bride-${field}-desc`} className={descriptionClass}>
                    {getFieldDescription(field, "bride")}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="pb-2 border-b border-border">
            <h3 className="text-[12px] font-semibold text-foreground">Groom</h3>
          </div>
          {(["name", "username", "parentInfo", "location", "image"] as const).map((field) => (
            <div key={field} className="space-y-1.5">
              <label htmlFor={`groom-${field}`} className={labelClass}>
                {field === "parentInfo" ? "Parent info" : field === "image" ? "Photo" : field.charAt(0).toUpperCase() + field.slice(1)}
                {field === "name" && <span className="text-destructive ml-0.5">*</span>}
              </label>
              {field === "image" ? (
                <div className="space-y-1.5">
                  <ImageUpload
                    id={`groom-${field}`}
                    value={groom.image ?? ""}
                    onChange={(url) => updateCouple("groom", "image", url)}
                    uploadUrl={`/api/weddings/${weddingId}/upload`}
                  />
                  <p className={descriptionClass}>
                    Upload a profile photo. Recommended: square image, at least 400×400px.
                  </p>
                </div>
              ) : (
                <>
                  <input
                    id={`groom-${field}`}
                    name={`groom-${field}`}
                    type="text"
                    value={groom[field] ?? ""}
                    onChange={(e) => updateCouple("groom", field, e.target.value)}
                    className={inputClass}
                    placeholder={getFieldPlaceholder(field)}
                    autoComplete={field === "name" ? "name" : "off"}
                    spellCheck={field !== "username"}
                    aria-invalid={fieldErrors.couple ? "true" : "false"}
                    aria-describedby={fieldErrors.couple ? "content-couple-error" : `groom-${field}-desc`}
                  />
                  <p id={`groom-${field}-desc`} className={descriptionClass}>
                    {getFieldDescription(field, "groom")}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </fieldset>
  );

  const getEventFieldDescription = (field: string) => {
    const descriptions: Record<string, string> = {
      title: "Event name (e.g., Ceremony, Reception, Cocktail Hour)",
      date: "Date of the event",
      time: "Start time (e.g., 4:00 PM)",
      location: "Venue name",
      address: "Full street address",
      mapsUrl: "Google Maps link for directions",
    };
    return descriptions[field] || "";
  };

  const getEventFieldPlaceholder = (field: string) => {
    const placeholders: Record<string, string> = {
      title: "e.g., Wedding Ceremony",
      time: "e.g., 4:00 PM",
      location: "e.g., Grand Ballroom",
      address: "e.g., 123 Main St, City, State 12345",
      mapsUrl: "https://maps.google.com/...",
    };
    return placeholders[field] || "";
  };

  const renderEventsSection = () => (
    <fieldset className="space-y-4">
      <div className="space-y-1">
        <legend className="text-[13px] font-semibold text-foreground">Wedding Events</legend>
        <p className="text-[10px] text-tertiary-foreground">
          Add all events for your wedding day. Guests will see these in chronological order.
        </p>
      </div>
      <div className="space-y-3">
        {events.map((ev, i) => (
          <div key={i} className="rounded border border-border bg-card/50 p-4 space-y-3 hover:border-border/20 transition-colors duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-[12px] font-medium text-foreground">Event {i + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => removeEvent(i)}
                className="h-7 px-2.5 inline-flex items-center justify-center text-[11px] text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                aria-label={`Remove event ${i + 1}`}
              >
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["title", "date", "time", "location", "address", "mapsUrl"] as const).map((field) => (
                <div key={field} className={field === "address" || field === "mapsUrl" ? "sm:col-span-2" : ""}>
                  <label htmlFor={`ev-${i}-${field}`} className={labelClass}>
                    {field === "mapsUrl" ? "Maps URL" : field.charAt(0).toUpperCase() + field.slice(1)}
                    {field === "title" && <span className="text-destructive ml-0.5">*</span>}
                  </label>
                  {field === "date" ? (
                    <div className="space-y-1.5">
                      <EventDatePicker
                        id={`ev-${i}-${field}`}
                        value={ev.date ?? ""}
                        onChange={(v) => updateEvent(i, "date", v)}
                      />
                      <p className={descriptionClass}>
                        {getEventFieldDescription(field)}
                      </p>
                    </div>
                  ) : (
                    <>
                      <input
                        id={`ev-${i}-${field}`}
                        name={`ev-${i}-${field}`}
                        type={field === "mapsUrl" ? "url" : "text"}
                        value={ev[field] ?? ""}
                        onChange={(e) => updateEvent(i, field, e.target.value)}
                        className={inputClass}
                        placeholder={getEventFieldPlaceholder(field)}
                        autoComplete="off"
                        aria-describedby={`ev-${i}-${field}-desc`}
                      />
                      <p id={`ev-${i}-${field}-desc`} className={descriptionClass}>
                        {getEventFieldDescription(field)}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addEvent}
          className="w-full min-h-[36px] px-4 py-2 rounded border border-dashed border-border text-[11px] font-medium text-foreground transition-all duration-150 hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center justify-center gap-2"
        >
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add event
        </button>
      </div>
    </fieldset>
  );

  const renderGallerySection = () => (
    <fieldset className="space-y-4">
      <div className="space-y-1">
        <legend className="text-[13px] font-semibold text-foreground">Photo Gallery</legend>
        <p className="text-[10px] text-tertiary-foreground">
          Add photos to showcase your relationship. Images will appear in a grid layout on your invitation.
        </p>
      </div>
      <div className="space-y-3">
        {gallery.map((img, i) => (
          <div key={img.id || i} className="rounded border border-border bg-card/50 p-4 space-y-3 hover:border-border/20 transition-colors duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-[12px] font-medium text-foreground">Image {i + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                className="h-7 px-2.5 inline-flex items-center justify-center text-[11px] text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                aria-label={`Remove image ${i + 1}`}
              >
                Remove
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor={`gallery-${i}-url`} className={labelClass}>
                  Image URL
                </label>
                <ImageUpload
                  id={`gallery-${i}-url`}
                  value={img.url ?? ""}
                  onChange={(url) => updateGalleryImage(i, "url", url)}
                  uploadUrl={`/api/weddings/${weddingId}/upload`}
                />
                <p className={descriptionClass}>
                  Upload or paste an image URL. Recommended: landscape orientation, at least 1200px wide.
                </p>
              </div>
              <div className="space-y-1.5">
                <label htmlFor={`gallery-${i}-alt`} className={labelClass}>
                  Alt text
                </label>
                <input
                  id={`gallery-${i}-alt`}
                  name={`gallery-${i}-alt`}
                  type="text"
                  value={img.alt ?? ""}
                  onChange={(e) => updateGalleryImage(i, "alt", e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Couple at sunset beach"
                  autoComplete="off"
                  aria-describedby={`gallery-${i}-alt-desc`}
                />
                <p id={`gallery-${i}-alt-desc`} className={descriptionClass}>
                  Descriptive text for accessibility and SEO. Keep it concise and meaningful.
                </p>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addGalleryImage}
          className="w-full min-h-[36px] px-4 py-2 rounded border border-dashed border-border text-[11px] font-medium text-foreground transition-all duration-150 hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center justify-center gap-2"
        >
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add image
        </button>
      </div>
    </fieldset>
  );

  const getMusicFieldDescription = (field: string) => {
    const descriptions: Record<string, string> = {
      title: "Song title",
      artist: "Artist or band name",
      url: "Streaming URL (Spotify, Apple Music, YouTube, etc.)",
      cover: "Album cover or artwork image",
    };
    return descriptions[field] || "";
  };

  const getMusicFieldPlaceholder = (field: string) => {
    const placeholders: Record<string, string> = {
      title: "e.g., At Last",
      artist: "e.g., Etta James",
      url: "https://open.spotify.com/track/...",
    };
    return placeholders[field] || "";
  };

  const renderMusicSection = () => (
    <fieldset className="space-y-4">
      <div className="space-y-1">
        <legend className="text-[13px] font-semibold text-foreground">Music Playlist</legend>
        <p className="text-[10px] text-tertiary-foreground">
          Add songs to create a playlist for your wedding. Guests can listen to your favorite tracks.
        </p>
      </div>
      <div className="space-y-3">
        {music.map((song, i) => (
          <div key={song.id || i} className="rounded border border-border bg-card/50 p-4 space-y-3 hover:border-border/20 transition-colors duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-[12px] font-medium text-foreground">Song {i + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => removeSong(i)}
                className="h-7 px-2.5 inline-flex items-center justify-center text-[11px] text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                aria-label={`Remove song ${i + 1}`}
              >
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["title", "artist", "url", "cover"] as const).map((field) => (
                <div key={field} className={field === "url" || field === "cover" ? "sm:col-span-2" : ""}>
                  <label htmlFor={`music-${i}-${field}`} className={labelClass}>
                    {field === "cover" ? "Cover image" : field.charAt(0).toUpperCase() + field.slice(1)}
                    {field === "title" && <span className="text-destructive ml-0.5">*</span>}
                  </label>
                  {field === "cover" ? (
                    <div className="space-y-1.5">
                      <ImageUpload
                        id={`music-${i}-${field}`}
                        value={song.cover ?? ""}
                        onChange={(url) => updateSong(i, "cover", url)}
                        uploadUrl={`/api/weddings/${weddingId}/upload`}
                      />
                      <p className={descriptionClass}>
                        {getMusicFieldDescription(field)}
                      </p>
                    </div>
                  ) : (
                    <>
                      <input
                        id={`music-${i}-${field}`}
                        name={`music-${i}-${field}`}
                        type={field === "url" ? "url" : "text"}
                        value={song[field] ?? ""}
                        onChange={(e) => updateSong(i, field, e.target.value)}
                        className={inputClass}
                        placeholder={getMusicFieldPlaceholder(field)}
                        autoComplete="off"
                        aria-describedby={`music-${i}-${field}-desc`}
                      />
                      <p id={`music-${i}-${field}-desc`} className={descriptionClass}>
                        {getMusicFieldDescription(field)}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addSong}
          className="w-full min-h-[36px] px-4 py-2 rounded border border-dashed border-border text-[11px] font-medium text-foreground transition-all duration-150 hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center justify-center gap-2"
        >
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add song
        </button>
      </div>
    </fieldset>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Status messages */}
      <div className="space-y-2">
        {error && (
          <div className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-[11px] text-destructive flex items-center gap-2" role="alert">
            <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        {fieldErrors.couple && section === "couple" && (
          <p id="content-couple-error" className="text-[11px] text-destructive flex items-center gap-2" role="alert">
            <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
      </div>

      {/* Section content */}
      {section === "couple" && renderCoupleSection()}
      {section === "events" && renderEventsSection()}
      {section === "gallery" && renderGallerySection()}
      {section === "music" && renderMusicSection()}

      {/* Save button */}
      <div className="flex justify-end pt-2 border-t border-border">
        <button
          type="submit"
          disabled={saving}
          className="h-8 rounded border border-border bg-primary px-3 text-[11px] font-medium text-primary-foreground transition-all duration-150 hover:border-border/20 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              Saving…
            </>
          ) : (
            <>
              <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
