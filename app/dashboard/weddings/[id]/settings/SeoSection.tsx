"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import type { WeddingSettingsSeo } from "@/lib/wedding-defaults";

type Props = {
  weddingId: string;
  initialData: WeddingSettingsSeo | undefined;
  onChange: (data: WeddingSettingsSeo) => void;
  disabled?: boolean;
};

export function SeoSection({ weddingId, initialData, onChange, disabled = false }: Props) {
  const [pageTitle, setPageTitle] = useState(initialData?.pageTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage ?? "");

  const handlePageTitleChange = (value: string) => {
    const trimmed = value.trim();
    setPageTitle(trimmed);
    onChange({ pageTitle: trimmed, metaDescription, ogImage });
  };

  const handleMetaDescriptionChange = (value: string) => {
    const trimmed = value.trim();
    setMetaDescription(trimmed);
    onChange({ pageTitle, metaDescription: trimmed, ogImage });
  };

  const handleOgImageChange = (url: string) => {
    setOgImage(url);
    onChange({ pageTitle, metaDescription, ogImage: url });
  };

  const PAGE_TITLE_MAX = 60;
  const META_DESC_MAX = 160;

  const inputClass =
    "min-h-[32px] w-full rounded border border-input bg-white/5 px-3 py-1.5 text-[12px] text-foreground placeholder:text-tertiary-foreground outline-none transition-all duration-150 hover:border-border/20 hover:bg-white/[0.08] focus:border-primary focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass = "block text-[11px] font-medium text-foreground mb-1";
  const descriptionClass = "text-[10px] text-tertiary-foreground mt-0.5";
  const counterClass = (current: number, max: number) => {
    const percentage = current / max;
    const colorClass =
      percentage > 0.9 ? "text-destructive"
      : percentage > 0.75 ? "text-yellow-400"
      : "text-muted-foreground";
    return `text-[10px] ${colorClass} ml-auto tabular-nums`;
  };

  return (
    <div className="-mx-1 -my-1 px-4 py-4 sm:px-6 sm:py-6 space-y-5">
      <div className="space-y-1">
        <h3 className="text-[13px] font-semibold text-foreground">SEO & Metadata</h3>
        <p className="text-[10px] text-tertiary-foreground">
          Customize how your wedding site appears in search results and social media shares.
        </p>
      </div>

      {/* SEO Inputs Card */}
      <div className="rounded border border-border bg-card/50 p-4 space-y-4">
        {/* Page Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="seo-page-title" className={labelClass}>
              Page Title
            </label>
            <span className={counterClass(pageTitle.length, PAGE_TITLE_MAX)}>
              {pageTitle.length}/{PAGE_TITLE_MAX}
            </span>
          </div>
          <input
            id="seo-page-title"
            name="pageTitle"
            type="text"
            value={pageTitle}
            onChange={(e) => handlePageTitleChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. Jane & John's Wedding Celebration"
            maxLength={PAGE_TITLE_MAX}
            autoComplete="off"
            className={inputClass}
          />
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="seo-meta-desc" className={labelClass}>
              Meta Description
            </label>
            <span className={counterClass(metaDescription.length, META_DESC_MAX)}>
              {metaDescription.length}/{META_DESC_MAX}
            </span>
          </div>
          <textarea
            id="seo-meta-desc"
            name="metaDescription"
            value={metaDescription}
            onChange={(e) => handleMetaDescriptionChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. Join us for Jane and John's beautiful wedding ceremony on June 15, 2026."
            maxLength={META_DESC_MAX}
            rows={3}
            className={inputClass}
          />
        </div>

        {/* OG Image */}
        <div className="space-y-2">
          <label htmlFor="seo-og-image" className={labelClass}>
            Social Share Image
          </label>
          <ImageUpload
            id="seo-og-image"
            value={ogImage}
            onChange={handleOgImageChange}
            uploadUrl={`/api/weddings/${weddingId}/upload`}
            disabled={disabled}
          />
          <p className={descriptionClass}>
            Recommended size: 1200×630px. Max file size: 2MB.
          </p>
        </div>
      </div>

      {/* Social Share Preview Card */}
      {(pageTitle || metaDescription || ogImage) && (
        <div className="rounded border border-border bg-card/50 overflow-hidden">
          <div className="px-4 py-2 border-b border-border/20">
            <p className="text-[10px] font-medium text-tertiary-foreground">
              Social Share Preview
            </p>
          </div>
          <div className="max-w-md">
            <div className="relative aspect-video bg-neutral-900">
              {ogImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ogImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-600 text-[10px] gap-2">
                  <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>No image set</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-[13px] font-semibold text-foreground truncate">
                {pageTitle || "Your page title will appear here"}
              </p>
              {metaDescription ? (
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                  {metaDescription}
                </p>
              ) : (
                <p className="text-[10px] text-muted-foreground mt-1">
                  Your meta description will appear here
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
