"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

const SLUG_REGEX = /^[a-z0-9-]+$/;
const SLUG_MIN = 2;
const SLUG_MAX = 63;
const BASE_DOMAIN = typeof window !== "undefined" ? window.location.hostname : "localhost";

type Props = {
  weddingId: string;
  initialSlug: string | null;
  initialStatus: string;
};

export function SettingsForm({ weddingId, initialSlug, initialStatus }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [released, setReleased] = useState(initialStatus === "released");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const slugTrimmed = slug.trim().toLowerCase();
  const slugValid =
    slugTrimmed.length >= SLUG_MIN &&
    slugTrimmed.length <= SLUG_MAX &&
    SLUG_REGEX.test(slugTrimmed);

  const checkSlug = useCallback(async () => {
    if (!slugTrimmed || !slugValid) {
      setSlugAvailable(null);
      return;
    }
    setSlugChecking(true);
    setError(null);
    try {
      const url = `/api/weddings/check-slug?slug=${encodeURIComponent(slugTrimmed)}&weddingId=${encodeURIComponent(weddingId)}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      setSlugAvailable(data.available === true);
      if (!res.ok && data.error) setError(data.error);
    } catch {
      setSlugAvailable(null);
      setError("Could not check slug");
    } finally {
      setSlugChecking(false);
    }
  }, [weddingId, slugTrimmed, slugValid]);

  useEffect(() => {
    if (!slugTouched || !slugTrimmed) return;
    const t = setTimeout(checkSlug, 400);
    return () => clearTimeout(t);
  }, [slugTrimmed, slugTouched, checkSlug]);

  const handleRelease = async () => {
    if (!slugValid || slugAvailable !== true) return;
    setError(null);
    setReleasing(true);
    try {
      const res = await fetch(`/api/weddings/${weddingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugTrimmed, status: "released" }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to release");
        setReleasing(false);
        return;
      }
      setReleased(true);
    } catch {
      setError("Failed to release");
    } finally {
      setReleasing(false);
    }
  };

  const slugError =
    slugTouched && slugTrimmed
      ? slugTrimmed.length < SLUG_MIN
        ? `At least ${SLUG_MIN} characters`
        : slugTrimmed.length > SLUG_MAX
          ? `At most ${SLUG_MAX} characters`
          : !SLUG_REGEX.test(slugTrimmed)
            ? "Only lowercase letters, numbers, and hyphens"
            : slugAvailable === false
              ? "This slug is already in use"
              : null
      : null;

  const canRelease = slugValid && slugAvailable === true && !released;

  const handleDelete = async () => {
    if (!window.confirm("This will permanently delete this wedding site and its data. Continue?")) {
      return;
    }
    setDeleteError(null);
    setDeleting(true);
    try {
      const res = await fetch(`/api/weddings/${weddingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.error ?? "Failed to delete wedding");
        setDeleting(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setDeleteError("Failed to delete wedding");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-foreground">Settings</h2>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <label htmlFor="settings-slug" className="block text-sm font-medium text-foreground">
          Subdomain (slug)
        </label>
        <input
          id="settings-slug"
          name="slug"
          type="text"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugAvailable(null);
          }}
          onBlur={() => setSlugTouched(true)}
          placeholder="e.g. jane-and-john"
          autoComplete="off"
          spellCheck={false}
          disabled={released}
          className="min-h-[44px] w-full max-w-md rounded-md border border-input bg-card px-3 py-2 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-60"
          aria-invalid={slugError ? true : undefined}
          aria-describedby={slugError ? "slug-error" : "slug-preview"}
        />
        {slugError && (
          <p id="slug-error" className="text-sm text-red-600" role="alert">
            {slugError}
          </p>
        )}
        {slugValid && slugTrimmed && !slugError && (
          <p id="slug-preview" className="text-sm text-foreground/70">
            Your site will be at{" "}
            <strong className="font-medium text-foreground">
              https://{slugTrimmed}.{BASE_DOMAIN === "localhost" ? "localhost:3000" : BASE_DOMAIN}
            </strong>
          </p>
        )}
        {slugChecking && (
          <p className="text-sm text-foreground/70" aria-live="polite">
            Checking availability…
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRelease}
          disabled={!canRelease || releasing}
          className="min-h-[44px] px-5 py-2 rounded bg-foreground text-background font-medium hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-foreground/30 focus-visible:ring-2 inline-flex items-center gap-2"
        >
          {releasing ? (
            <>
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              Releasing…
            </>
          ) : released ? (
            "Released"
          ) : (
            "Release"
          )}
        </button>
        {released && slugTrimmed && (
          <a
            href={`https://${slugTrimmed}.${BASE_DOMAIN === "localhost" ? "localhost:3000" : BASE_DOMAIN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 py-2 rounded-md border border-input font-medium text-foreground hover:bg-accent hover:text-accent-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] inline-flex items-center"
          >
            View site →
          </a>
        )}
      </div>

      <div className="space-y-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3">
        <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
        <p className="text-xs text-destructive/80">
          Delete this wedding site and its collaborators, RSVP, and wishes data. This action cannot be undone.
        </p>
        {deleteError && (
          <p className="text-xs text-destructive" role="alert">
            {deleteError}
          </p>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex min-h-[36px] items-center justify-center rounded-md border border-destructive/60 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/15 disabled:opacity-50 outline-none focus-visible:border-destructive focus-visible:ring-destructive/40 focus-visible:ring-[3px]"
        >
          {deleting ? "Deleting…" : "Delete wedding"}
        </button>
      </div>
    </div>
  );
}
