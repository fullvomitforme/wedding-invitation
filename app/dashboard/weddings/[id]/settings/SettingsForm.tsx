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
      <h2 className="text-lg font-semibold text-neutral-50">Settings</h2>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <label htmlFor="settings-slug" className="block text-sm font-medium text-neutral-300">
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
          className="min-h-[44px] w-full max-w-md rounded-md border border-white/10 bg-white/5 px-3 py-2 text-base text-neutral-100 placeholder:text-neutral-500 outline-none focus-visible:border-[#BFA14A] focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416] disabled:opacity-60 transition-colors duration-200"
          aria-invalid={slugError ? true : undefined}
          aria-describedby={slugError ? "slug-error" : "slug-preview"}
        />
        {slugError && (
          <p id="slug-error" className="text-sm text-red-300" role="alert">
            {slugError}
          </p>
        )}
        {slugValid && slugTrimmed && !slugError && (
          <p id="slug-preview" className="text-sm text-neutral-400">
            Your site will be at{" "}
            <strong className="font-medium text-neutral-200">
              https://{slugTrimmed}.{BASE_DOMAIN === "localhost" ? "localhost:3000" : BASE_DOMAIN}
            </strong>
          </p>
        )}
        {slugChecking && (
          <p className="text-sm text-neutral-400" aria-live="polite">
            Checking availability…
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRelease}
          disabled={!canRelease || releasing}
          className="min-h-[44px] px-5 py-2 rounded-md bg-neutral-100 text-[#0E0E10] font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416] inline-flex items-center gap-2 transition-colors duration-200"
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
            className="min-h-[44px] px-4 py-2 rounded-md border border-white/10 font-medium text-neutral-200 hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416] inline-flex items-center transition-colors duration-200"
          >
            View site →
          </a>
        )}
      </div>

      <div className="space-y-3 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3">
        <h3 className="text-sm font-semibold text-red-300">Danger zone</h3>
        <p className="text-xs text-red-300/90">
          Delete this wedding site and its collaborators, RSVP, and wishes data. This action cannot be undone.
        </p>
        {deleteError && (
          <p className="text-xs text-red-300" role="alert">
            {deleteError}
          </p>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex min-h-[36px] items-center justify-center rounded-md border border-red-500/50 bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/25 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416] transition-colors duration-200"
        >
          {deleting ? "Deleting…" : "Delete wedding"}
        </button>
      </div>
    </div>
  );
}
