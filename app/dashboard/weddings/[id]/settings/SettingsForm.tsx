"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SeoSection } from "./SeoSection";
import { PrivacySection } from "./PrivacySection";
import { Dialog, DialogButton } from "@/components/ui/dialog";
import type { WeddingSettingsSeo, WeddingSettingsPrivacy, WeddingContent, WeddingContentCouple } from "@/lib/wedding-defaults";

const SLUG_REGEX = /^[a-z0-9-]+$/;
const SLUG_MIN = 2;
const SLUG_MAX = 63;
const BASE_DOMAIN = typeof window !== "undefined" ? window.location.hostname : "localhost";

type Props = {
  weddingId: string;
  initialSlug: string | null;
  initialStatus: string;
  initialSettings?: {
    seo?: WeddingSettingsSeo;
    privacy?: WeddingSettingsPrivacy;
  };
  initialContent?: WeddingContent;
  onUnsaved?: () => void;
  onSaved?: () => void;
};

type ActiveSection = "general" | "seo" | "privacy";

function getProjectName(content?: WeddingContent): string {
  const couple = content?.couple;
  if (!couple) return "this wedding site";
  const brideName = couple.bride?.name?.trim();
  const groomName = couple.groom?.name?.trim();
  if (brideName && groomName) {
    return `${brideName} & ${groomName}'s wedding`;
  }
  if (brideName) return `${brideName}'s wedding`;
  if (groomName) return `${groomName}'s wedding`;
  return "this wedding site";
}

export function SettingsForm({
  weddingId,
  initialSlug,
  initialStatus,
  initialSettings,
  initialContent,
  onUnsaved,
  onSaved,
}: Props) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveSection>("general");
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [released, setReleased] = useState(initialStatus === "released");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const projectName = getProjectName(initialContent);

  // Settings state
  const [seoSettings, setSeoSettings] = useState<WeddingSettingsSeo>(
    initialSettings?.seo ?? {}
  );
  const [privacySettings, setPrivacySettings] = useState<WeddingSettingsPrivacy>(
    initialSettings?.privacy ?? { accessType: "public" }
  );

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
        const msg = data.error ?? "Failed to release";
        setError(msg);
        toast.error(msg);
        setReleasing(false);
        return;
      }
      setReleased(true);
      toast.success("Project released.");
      onSaved?.();
    } catch {
      setError("Failed to release");
      toast.error("Failed to release");
    } finally {
      setReleasing(false);
    }
  };

  const handleSaveSettings = async () => {
    setError(null);
    setSettingsSaving(true);
    try {
      const res = await fetch(`/api/weddings/${weddingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            settings: {
              seo: seoSettings,
              privacy: privacySettings,
            },
          },
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error ?? "Failed to save settings";
        setError(msg);
        toast.error(msg);
        return;
      }
      toast.success("Settings saved.");
      onSaved?.();
    } catch {
      setError("Failed to save settings");
      toast.error("Failed to save settings");
    } finally {
      setSettingsSaving(false);
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
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteModalOpen(false);
    setDeleteError(null);
    setDeleting(true);
    try {
      const res = await fetch(`/api/weddings/${weddingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error ?? "Failed to delete wedding";
        setDeleteError(msg);
        toast.error(msg);
        setDeleting(false);
        return;
      }
      toast.success("Project deleted.");
      router.push("/dashboard");
    } catch {
      setDeleteError("Failed to delete wedding");
      toast.error("Failed to delete wedding");
      setDeleting(false);
    }
  };

  const tabClass = (section: ActiveSection) =>
    `px-3.5 py-2 text-[11px] font-medium rounded-md border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card relative ${
      activeSection === section
        ? "border-primary/50 bg-primary/10 text-foreground"
        : "border-transparent hover:border-border/20 hover:bg-white/5 text-muted-foreground"
    }${
      activeSection === section
        ? " after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-b-sm"
        : ""
    }`;

  return (
    <div className="-mx-1 -my-1 px-4 py-4 sm:px-6 sm:py-6 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <h2 className="text-[15px] font-semibold text-foreground">Settings</h2>
      </div>

      {error && (
        <div className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-[11px] text-destructive flex items-center gap-2" role="alert">
          <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveSection("general")}
          className={tabClass("general")}
          aria-selected={activeSection === "general"}
          role="tab"
        >
          General
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("seo")}
          className={tabClass("seo")}
          aria-selected={activeSection === "seo"}
          role="tab"
        >
          SEO
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("privacy")}
          className={tabClass("privacy")}
          aria-selected={activeSection === "privacy"}
          role="tab"
        >
          Privacy
        </button>
      </div>

      {/* General Section */}
      {activeSection === "general" && (
        <div className="space-y-6">
          {/* Subdomain Card */}
          <div className="rounded border border-border bg-card/50 p-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="settings-slug" className="text-[13px] font-semibold text-foreground">
                Subdomain (slug)
              </label>
              <p className="text-[10px] text-tertiary-foreground">
                Choose a unique address for your wedding site
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {BASE_DOMAIN === "localhost" ? "localhost:3000" : BASE_DOMAIN}
                </span>
                <span className="text-[11px] text-muted-foreground">/</span>
                <input
                  id="settings-slug"
                  name="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    onUnsaved?.();
                    setSlugAvailable(null);
                  }}
                  onBlur={() => setSlugTouched(true)}
                  placeholder="jane-and-john"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={released}
                  className="flex-1 min-h-[32px] rounded border border-input bg-white/5 px-3 py-1.5 text-[12px] text-foreground placeholder:text-tertiary-foreground outline-none transition-all duration-150 focus:border-primary focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-destructive/50 aria-invalid:ring-destructive/20"
                  aria-invalid={slugError ? true : undefined}
                  aria-describedby={slugError ? "slug-error" : "slug-preview"}
                />
                {slugChecking && (
                  <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                )}
                {slugAvailable === true && (
                  <svg className="size-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {slugAvailable === false && (
                  <svg className="size-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              {slugError && (
                <p id="slug-error" className="text-[10px] text-destructive flex items-center gap-1" role="alert">
                  <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {slugError}
                </p>
              )}

              {slugValid && slugTrimmed && !slugError && slugAvailable === true && (
                <div className="flex items-center gap-1.5 p-2 rounded bg-white/5 border border-border/20">
                  <svg className="size-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <a
                    href={`https://${slugTrimmed}.${BASE_DOMAIN === "localhost" ? "localhost:3000" : BASE_DOMAIN}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline"
                  >
                    https://{slugTrimmed}.{BASE_DOMAIN === "localhost" ? "localhost:3000" : BASE_DOMAIN}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Status Card */}
          <div className="rounded border border-border bg-card/50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[13px] font-semibold text-foreground">Publishing Status</h3>
                <p className="text-[10px] text-tertiary-foreground">
                  {released ? "Your site is live and accessible to visitors" : "Your site is in draft mode"}
                </p>
              </div>
              {released ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="size-2 rounded-full bg-primary" />
                  <span className="text-[11px] font-medium text-primary">Published</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-border/20">
                  <span className="size-2 rounded-full bg-muted-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground">Draft</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/20">
              {!released ? (
                <button
                  type="button"
                  onClick={handleRelease}
                  disabled={!canRelease || releasing}
                  className="h-9 px-4 rounded bg-primary text-primary-foreground text-[11px] font-medium transition-all duration-150 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center gap-2"
                >
                  {releasing ? (
                    <>
                      <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                      Publishing…
                    </>
                  ) : (
                    "Publish Site"
                  )}
                </button>
              ) : (
                <>
                  <a
                    href={`https://${slugTrimmed}.${BASE_DOMAIN === "localhost" ? "localhost:3000" : BASE_DOMAIN}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-4 rounded border border-border bg-white/5 text-foreground text-[11px] font-medium transition-all duration-150 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center gap-2"
                  >
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Site
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO Section */}
      {activeSection === "seo" && (
        <SeoSection
          weddingId={weddingId}
          initialData={seoSettings}
          onChange={(data) => {
            setSeoSettings(data);
            onUnsaved?.();
          }}
          disabled={released}
        />
      )}

      {/* Privacy Section */}
      {activeSection === "privacy" && (
        <PrivacySection
          initialData={privacySettings}
          onChange={(data) => {
            setPrivacySettings(data);
            onUnsaved?.();
          }}
          disabled={released}
        />
      )}

      {/* Save Settings Button */}
      {activeSection !== "general" && (
        <div className="flex justify-end pt-2 border-t border-border">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={settingsSaving || released}
            className="h-8 rounded border border-border bg-primary px-3 text-[11px] font-medium text-primary-foreground transition-all duration-150 hover:border-border/20 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center gap-2"
          >
            {settingsSaving ? (
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
      )}

      {/* Danger Zone */}
      <div className="rounded border border-destructive/30 bg-destructive/5 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <svg className="size-4 shrink-0 text-destructive mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-[13px] font-semibold text-destructive">Danger zone</h3>
            <p className="text-[11px] text-destructive/80 mt-0.5">
              Permanently delete this wedding site and all associated data. This action cannot be undone.
            </p>
          </div>
        </div>
        {deleteError && (
          <p className="text-[11px] text-destructive flex items-center gap-1" role="alert">
            <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {deleteError}
          </p>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="h-8 rounded border border-destructive/40 bg-destructive/15 px-3 text-[11px] font-medium text-destructive transition-all duration-150 hover:bg-destructive/20 hover:border-destructive/60 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center gap-2"
        >
          {deleting ? (
            <>
              <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              Deleting…
            </>
          ) : (
            "Delete Wedding"
          )}
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Wedding"
        footer={
          <>
            <DialogButton variant="default" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </DialogButton>
            <DialogButton variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </DialogButton>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-[11px] text-muted-foreground">
            Are you sure you want to delete <strong className="text-foreground">{projectName}</strong>? This action cannot be undone.
          </p>
          <p className="text-[10px] text-tertiary-foreground">
            This will permanently delete the wedding site and all associated data including:
          </p>
          <ul className="text-[10px] text-muted-foreground space-y-1 ml-4">
            <li>• Couple information</li>
            <li>• Events and locations</li>
            <li>• Gallery photos</li>
            <li>• RSVP responses</li>
            <li>• Guest wishes</li>
            <li>• Music playlist</li>
          </ul>
        </div>
      </Dialog>
    </div>
  );
}
