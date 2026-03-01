# Template System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a template system allowing users to select from 4 wedding invitation templates (Classic, Modern, Minimalist, Floral) via a thumbnail selector in the dashboard, with live preview and proper integration with the existing content configuration.

**Architecture:** Template registry pattern with a central `lib/templates.ts` that maps template IDs to components. The invitation and preview pages resolve `template_id` from the wedding database record to the appropriate template component. Each template wraps sections with template-specific styling providers.

**Tech Stack:** Next.js 16 (App Router), React, TypeScript, Supabase (PostgreSQL), Tailwind CSS, GSAP for animations

---

## Phase 1: Template Registry & Interface

### Task 1: Create template registry and types

**Files:**
- Create: `lib/templates.ts`

**Step 1: Write the template registry file**

```typescript
// lib/templates.ts
import { ClassicTemplate } from "@/app/invitation/ClassicTemplate";
import type { WeddingContent } from "./wedding-defaults";
import type { SectionConfig } from "./wedding-defaults";

export interface TemplateProps {
  weddingId: string;
  content: WeddingContent;
  sections: SectionConfig[];
}

export interface WeddingTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "traditional" | "modern" | "minimalist" | "decorative";
  component: React.ComponentType<TemplateProps>;
}

export const TEMPLATES: WeddingTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Elegant serif typography with rose accents and traditional layout",
    thumbnail: "/templates/classic-thumb.jpg",
    category: "traditional",
    component: ClassicTemplate,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold dark mode with gradient accents and asymmetric grid",
    thumbnail: "/templates/modern-thumb.jpg",
    category: "modern",
    component: null as any, // Will be set after ModernTemplate is created
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean black and white with lots of whitespace",
    thumbnail: "/templates/minimalist-thumb.jpg",
    category: "minimalist",
    component: null as any, // Will be set after MinimalistTemplate is created
  },
  {
    id: "floral",
    name: "Floral",
    description: "Organic shapes with soft pastel colors and decorative elements",
    thumbnail: "/templates/floral-thumb.jpg",
    category: "decorative",
    component: null as any, // Will be set after FloralTemplate is created
  },
];

export function getTemplate(id: string): WeddingTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplateComponent(id: string): React.ComponentType<TemplateProps> {
  const template = getTemplate(id);
  return template?.component || ClassicTemplate;
}
```

**Step 2: Commit**

```bash
git add lib/templates.ts
git commit -m "feat: add template registry and interface types"
```

---

## Phase 2: Create Template Components

### Task 2: Create ModernTemplate component

**Files:**
- Create: `app/invitation/templates/ModernTemplate.tsx`

**Step 1: Write the ModernTemplate component**

```typescript
"use client";

import { InvitationProvider } from "@/components/InvitationContext";
import Hero from "@/components/Hero";
import CoupleSection from "@/components/CoupleSection";
import DateSection from "@/components/DateSection";
import LocationSection from "@/components/LocationSection";
import GallerySection from "@/components/GallerySection";
import RSVPSection from "@/components/RSVPSection";
import WishesSection from "@/components/WishesSection";
import GiftSection from "@/components/GiftSection";
import MusicPlayer from "@/components/MusicPlayer";
import type { WeddingContent } from "@/lib/wedding-defaults";
import type { SectionConfig } from "@/lib/wedding-defaults";

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Hero,
  couple: CoupleSection,
  date: DateSection,
  location: LocationSection,
  gallery: GallerySection,
  rsvp: RSVPSection,
  wishes: WishesSection,
  gift: GiftSection,
  music: MusicPlayer,
};

interface ModernTemplateProps {
  weddingId: string;
  content: WeddingContent;
  sections: SectionConfig[];
}

export function ModernTemplate({ weddingId, content, sections }: ModernTemplateProps) {
  const sorted = [...sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <InvitationProvider value={{ weddingId, content, sections }}>
      <div className="min-h-screen bg-slate-950 text-white">
        {sorted.map((section) => {
          const Component = SECTION_COMPONENTS[section.id];
          if (!Component) return null;
          return <Component key={section.id} />;
        })}
      </div>
    </InvitationProvider>
  );
}
```

**Step 2: Update template registry to reference ModernTemplate**

Modify `lib/templates.ts` - update the Modern entry:

```typescript
import { ClassicTemplate } from "@/app/invitation/ClassicTemplate";
import { ModernTemplate } from "@/app/invitation/templates/ModernTemplate";
// ... other imports

export const TEMPLATES: WeddingTemplate[] = [
  // ... classic entry
  {
    id: "modern",
    name: "Modern",
    description: "Bold dark mode with gradient accents and asymmetric grid",
    thumbnail: "/templates/modern-thumb.jpg",
    category: "modern",
    component: ModernTemplate,
  },
  // ... other entries
];
```

**Step 3: Commit**

```bash
git add app/invitation/templates/ModernTemplate.tsx lib/templates.ts
git commit -m "feat: add ModernTemplate component"
```

---

### Task 3: Create MinimalistTemplate component

**Files:**
- Create: `app/invitation/templates/MinimalistTemplate.tsx`

**Step 1: Write the MinimalistTemplate component**

```typescript
"use client";

import { InvitationProvider } from "@/components/InvitationContext";
import Hero from "@/components/Hero";
import CoupleSection from "@/components/CoupleSection";
import DateSection from "@/components/DateSection";
import LocationSection from "@/components/LocationSection";
import GallerySection from "@/components/GallerySection";
import RSVPSection from "@/components/RSVPSection";
import WishesSection from "@/components/WishesSection";
import GiftSection from "@/components/GiftSection";
import MusicPlayer from "@/components/MusicPlayer";
import type { WeddingContent } from "@/lib/wedding-defaults";
import type { SectionConfig } from "@/lib/wedding-defaults";

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Hero,
  couple: CoupleSection,
  date: DateSection,
  location: LocationSection,
  gallery: GallerySection,
  rsvp: RSVPSection,
  wishes: WishesSection,
  gift: GiftSection,
  music: MusicPlayer,
};

interface MinimalistTemplateProps {
  weddingId: string;
  content: WeddingContent;
  sections: SectionConfig[];
}

export function MinimalistTemplate({ weddingId, content, sections }: MinimalistTemplateProps) {
  const sorted = [...sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <InvitationProvider value={{ weddingId, content, sections }}>
      <div className="min-h-screen bg-white text-neutral-900">
        {sorted.map((section) => {
          const Component = SECTION_COMPONENTS[section.id];
          if (!Component) return null;
          return <Component key={section.id} />;
        })}
      </div>
    </InvitationProvider>
  );
}
```

**Step 2: Update template registry to reference MinimalistTemplate**

Modify `lib/templates.ts` - add import and update entry:

```typescript
import { MinimalistTemplate } from "@/app/invitation/templates/MinimalistTemplate";

// Update Minimalist entry:
{
  id: "minimalist",
  name: "Minimalist",
  description: "Clean black and white with lots of whitespace",
  thumbnail: "/templates/minimalist-thumb.jpg",
  category: "minimalist",
  component: MinimalistTemplate,
},
```

**Step 3: Commit**

```bash
git add app/invitation/templates/MinimalistTemplate.tsx lib/templates.ts
git commit -m "feat: add MinimalistTemplate component"
```

---

### Task 4: Create FloralTemplate component

**Files:**
- Create: `app/invitation/templates/FloralType.tsx`

**Step 1: Write the FloralTemplate component**

```typescript
"use client";

import { InvitationProvider } from "@/components/InvitationContext";
import Hero from "@/components/Hero";
import CoupleSection from "@/components/CoupleSection";
import DateSection from "@/components/DateSection";
import LocationSection from "@/components/LocationSection";
import GallerySection from "@/components/GallerySection";
import RSVPSection from "@/components/RSVPSection";
import WishesSection from "@/components/WishesSection";
import GiftSection from "@/components/GiftSection";
import MusicPlayer from "@/components/MusicPlayer";
import type { WeddingContent } from "@/lib/wedding-defaults";
import type { SectionConfig } from "@/lib/wedding-defaults";

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Hero,
  couple: CoupleSection,
  date: DateSection,
  location: LocationSection,
  gallery: GallerySection,
  rsvp: RSVPSection,
  wishes: WishesSection,
  gift: GiftSection,
  music: MusicPlayer,
};

interface FloralTemplateProps {
  weddingId: string;
  content: WeddingContent;
  sections: SectionConfig[];
}

export function FloralTemplate({ weddingId, content, sections }: FloralTemplateProps) {
  const sorted = [...sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <InvitationProvider value={{ weddingId, content, sections }}>
      <div className="min-h-screen bg-stone-50 text-stone-800">
        {sorted.map((section) => {
          const Component = SECTION_COMPONENTS[section.id];
          if (!Component) return null;
          return <Component key={section.id} />;
        })}
      </div>
    </InvitationProvider>
  );
}
```

**Step 2: Update template registry to reference FloralTemplate**

Modify `lib/templates.ts` - add import and update entry:

```typescript
import { FloralTemplate } from "@/app/invitation/templates/FloralType";

// Update Floral entry:
{
  id: "floral",
  name: "Floral",
  description: "Organic shapes with soft pastel colors and decorative elements",
  thumbnail: "/templates/floral-thumb.jpg",
  category: "decorative",
  component: FloralTemplate,
},
```

**Step 3: Commit**

```bash
git add app/invitation/templates/FloralType.tsx lib/templates.ts
git commit -m "feat: add FloralTemplate component"
```

---

## Phase 3: Template Selector Dashboard UI

### Task 5: Create TemplateForm component

**Files:**
- Create: `app/dashboard/weddings/[id]/template/TemplateForm.tsx`

**Step 1: Write the TemplateForm component**

```typescript
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

type Props = {
  weddingId: string;
  initialTemplateId: string;
  onUnsaved?: () => void;
  onSaved?: () => void;
};

export function TemplateForm({ weddingId, initialTemplateId, onUnsaved, onSaved }: Props) {
  const [selectedId, setSelectedId] = useState(initialTemplateId);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSelect = async (templateId: string) => {
    setSelectedId(templateId);
    setHasChanges(true);
    onUnsaved?.();
    setSaving(true);

    try {
      const res = await fetch(`/api/weddings/${weddingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: templateId }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error ?? "Failed to update template";
        toast.error(msg);
        setHasChanges(true);
        return;
      }

      toast.success("Template updated.");
      setHasChanges(false);
      onSaved?.();
    } catch {
      toast.error("Failed to update template");
      setHasChanges(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATES.map((template) => {
          const isSelected = selectedId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => handleSelect(template.id)}
              disabled={saving}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-border/50"
              } ${saving ? "opacity-50 pointer-events-none" : ""}`}
              type="button"
              aria-pressed={isSelected}
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e5e5' width='100' height='100'/%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="p-3 bg-card">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-semibold text-sm text-foreground">{template.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                  </div>
                  {hasChanges && isSelected && (
                    <span className="text-[10px] text-amber-500">Unsaved</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {saving && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Saving template selection...</span>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/dashboard/weddings/[id]/template/TemplateForm.tsx
git commit -m "feat: add TemplateForm component for template selection"
```

---

### Task 6: Add Template accordion item to WeddingAccordion

**Files:**
- Modify: `app/dashboard/weddings/[id]/WeddingAccordion.tsx`

**Step 1: Add TemplateForm import and state**

```typescript
import { TemplateForm } from "./template/TemplateForm";
// ... other imports

type WeddingAccordionProps = {
  weddingId: string;
  initialContent: WeddingContent;
  initialSections: SectionConfig[];
  initialSlug: string | null;
  initialStatus: string;
  initialTemplateId: string;
};

// Add template to saveStates
const [saveStates, setSaveStates] = useState<Record<string, "saved" | "unsaved" | null>>({
  couple: null,
  events: null,
  gallery: null,
  music: null,
  layout: null,
  settings: null,
  template: null,
});
```

**Step 2: Add template handlers**

```typescript
const handleTemplateUnsaved = () => {
  setSaveStates((prev) => ({ ...prev, template: "unsaved" }));
};

const handleTemplateSaved = () => {
  setSaveStates((prev) => ({ ...prev, template: "saved" }));
  setTimeout(() => {
    setSaveStates((prev) => ({ ...prev, template: null }));
  }, 2000);
};
```

**Step 3: Add Template accordion item in JSX**

Add this accordion item after "music" and before "layout":

```typescript
<AccordionItem
  id="template"
  title="Template"
  isOpen={openSection === "template"}
  onOpenChange={(open) => handleSectionChange("template", open)}
  saveStatus={saveStates.template}
>
  <TemplateForm
    weddingId={weddingId}
    initialTemplateId={initialTemplateId}
    onUnsaved={handleTemplateUnsaved}
    onSaved={handleTemplateSaved}
  />
</AccordionItem>
```

**Step 4: Commit**

```bash
git add app/dashboard/weddings/[id]/WeddingAccordion.tsx
git commit -m "feat: add Template accordion item to WeddingAccordion"
```

---

## Phase 4: Integrate Template Registry into Pages

### Task 7: Update invitation page to use template registry

**Files:**
- Modify: `app/invitation/page.tsx`

**Step 1: Import template registry and update component resolution**

```typescript
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { getTemplateComponent } from "@/lib/templates";
import type { SectionConfig } from "@/components/InvitationContext";

export default async function InvitationPage() {
  const headersList = await headers();
  const slug = headersList.get("x-wedding-slug");
  if (!slug) notFound();

  const supabase = createServerClient();
  const { data: wedding, error } = await supabase
    .from("weddings")
    .select("id, slug, status, template_id, sections, content")
    .eq("slug", slug)
    .eq("status", "released")
    .single();

  if (error || !wedding) notFound();

  const sections = (Array.isArray(wedding.sections) ? wedding.sections : []) as SectionConfig[];
  const content = (wedding.content ?? {}) as any;
  const TemplateComponent = getTemplateComponent(wedding.template_id ?? "classic");

  return (
    <TemplateComponent
      weddingId={wedding.id}
      content={content}
      sections={sections}
    />
  );
}
```

**Step 2: Commit**

```bash
git add app/invitation/page.tsx
git commit -m "feat: update invitation page to use template registry"
```

---

### Task 8: Update preview page to use template registry

**Files:**
- Modify: `app/preview/[id]/page.tsx`

**Step 1: Import template registry and update component resolution**

```typescript
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { getTemplateComponent } from "@/lib/templates";
import type { SectionConfig } from "@/components/InvitationContext";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const supabase = createServerClient();
  const { data: membership } = await supabase
    .from("wedding_collaborators")
    .select("wedding_id")
    .eq("wedding_id", id)
    .eq("user_id", session.user.id)
    .single();
  if (!membership) notFound();

  const { data: wedding, error } = await supabase
    .from("weddings")
    .select("id, slug, status, template_id, sections, content")
    .eq("id", id)
    .single();
  if (error || !wedding) notFound();

  const sections = (Array.isArray(wedding.sections) ? wedding.sections : []) as SectionConfig[];
  const content = (wedding.content ?? {}) as any;
  const TemplateComponent = getTemplateComponent(wedding.template_id ?? "classic");

  return (
    <TemplateComponent
      weddingId={wedding.id}
      content={content}
      sections={sections}
    />
  );
}
```

**Step 2: Commit**

```bash
git add app/preview/[id]/page.tsx
git commit -m "feat: update preview page to use template registry"
```

---

## Phase 5: Template Thumbnails

### Task 9: Create thumbnail directory and placeholder images

**Files:**
- Create: `public/templates/.gitkeep`

**Step 1: Create templates directory**

```bash
mkdir -p public/templates
touch public/templates/.gitkeep
```

**Step 2: Create placeholder SVG thumbnails**

Create `public/templates/classic-thumb.jpg` (create a simple placeholder):

For now, we'll create a temporary placeholder using an inline approach. In production, replace these with actual screenshot thumbnails.

```bash
# Create a 400x225 placeholder image for each template
# You can use any image tool or replace with actual screenshots later
```

**Note:** For actual implementation, you should:
1. Take screenshots of each template (400x225 or 16:9 aspect ratio)
2. Save as `public/templates/{template-id}-thumb.jpg`
3. Or use an automated screenshot service

**Step 3: Commit**

```bash
git add public/templates/
git commit -m "feat: add templates directory for thumbnails"
```

---

## Phase 6: Testing & Verification

### Task 10: Manual testing checklist

**Test the template selection in dashboard:**

1. Start dev server: `bun dev`
2. Navigate to `/dashboard/weddings/[id]`
3. Open "Template" accordion
4. Click on different template cards
5. Verify:
   - Selected template gets highlighted border and checkmark
   - Toast shows "Template updated" on success
   - Save indicator shows briefly

**Test preview page:**

1. After selecting a template in dashboard
2. Click "Preview" or visit `/preview/[id]`
3. Verify correct template renders (background colors change)
4. Try all 4 templates

**Test public invitation:**

1. Publish a wedding with a selected template
2. Visit via subdomain: `{slug}.localhost:3000`
3. Verify correct template renders

**Test error handling:**

1. Test with invalid `template_id` (should fallback to Classic)
2. Test with missing thumbnails (should show placeholder)
3. Test API errors (should show error toast)

---

## Summary of Files Changed/Created

| File | Action |
|------|--------|
| `lib/templates.ts` | Create - Template registry and types |
| `app/invitation/templates/ModernTemplate.tsx` | Create - Modern template |
| `app/invitation/templates/MinimalistTemplate.tsx` | Create - Minimalist template |
| `app/invitation/templates/FloralType.tsx` | Create - Floral template |
| `app/dashboard/weddings/[id]/template/TemplateForm.tsx` | Create - Template selector UI |
| `app/dashboard/weddings/[id]/WeddingAccordion.tsx` | Modify - Add template accordion item |
| `app/invitation/page.tsx` | Modify - Use template registry |
| `app/preview/[id]/page.tsx` | Modify - Use template registry |
| `public/templates/` | Create - Thumbnail images directory |

---

## Optional Future Enhancements

- [ ] Add template-specific styling providers for theme colors
- [ ] Add template-specific animation profiles
- [ ] Add full-screen preview in template selector
- [ ] Add template customization (accent color picker per template)
- [ ] Add template ratings and featured badges
- [ ] Add template filtering by category
