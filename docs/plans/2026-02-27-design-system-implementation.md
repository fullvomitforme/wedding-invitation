# Attimo Design System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a comprehensive design token library for Attimo Studios, providing consistent colors, typography, spacing, motion, shadows, and radii across the platform.

**Architecture:** Add semantic CSS design tokens to `app/globals.css`, map them to Tailwind's `@theme inline`, and refactor components to use token-based classes instead of hardcoded values.

**Tech Stack:** CSS custom properties, Tailwind CSS 4, Next.js, shadcn/ui components

---

## Phase 1: globals.css Update

### Task 1: Add core brand color variables

**Files:**
- Modify: `app/globals.css:7-26`

**Step 1: Add brand colors to :root**

```css
/* Core Brand Colors (unchanged from VISUAL_DIRECTION.md) */
--color-charcoal: #0E0E10;
--color-soft-black: #141416;
--color-ivory: #F5F4F1;
--color-muted-silver: #CFCFD2;
--color-deep-gold: #BFA14A;

/* Backward compatibility - keep existing */
--background: #f5f4f1;
--foreground: #0e0e10;
--auth-surface: #0e0e10;
--muted: #e8e7e4;
--muted-foreground: #6b6b6e;
--primary: #bfa14a;
--primary-foreground: #0e0e10;
--accent: #e8e7e4;
--accent-foreground: #0e0e10;
--destructive: #b91c1c;
--destructive-foreground: #f5f4f1;
--border: #cfcfd2;
--input: #cfcfd2;
--ring: #bfa14a;
--card: #ffffff;
--card-foreground: #0e0e10;
--secondary: #e8e7e4;
--secondary-foreground: #0e0e10;
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without CSS errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add core brand color variables to globals.css"
```

---

### Task 2: Add semantic surface color tokens

**Files:**
- Modify: `app/globals.css:7-26`

**Step 1: Add semantic surface tokens to :root**

```css
/* Semantic Surface Tokens (light theme) */
--surface-primary: #F5F4F1;
--surface-secondary: #FFFFFF;
--surface-tertiary: #E8E7E4;
--surface-auth: #141416;
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add semantic surface color tokens"
```

---

### Task 3: Add semantic text color tokens

**Files:**
- Modify: `app/globals.css:7-26`

**Step 1: Add semantic text tokens to :root**

```css
/* Semantic Text Tokens (light theme) */
--text-primary: #0E0E10;
--text-secondary: #6B6B6E;
--text-tertiary: #CFCFD2;
--text-inverse: #F5F4F1;
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add semantic text color tokens"
```

---

### Task 4: Add border and interactive color tokens

**Files:**
- Modify: `app/globals.css:7-26`

**Step 1: Add border and interactive tokens to :root**

```css
/* Border Tokens (light theme) */
--border-default: #CFCFD2;
--border-subtle: #E8E7E4;

/* Interactive Tokens */
--action-primary: #BFA14A;
--action-hover: #A68A40;
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add border and interactive color tokens"
```

---

### Task 5: Add dark theme color tokens

**Files:**
- Modify: `app/globals.css:28-47`

**Step 1: Add semantic tokens to .dark**

```css
/* Semantic Surface Tokens (dark theme) */
--surface-primary: #141416;
--surface-secondary: #1A1A1C;
--surface-tertiary: #2A2A2E;
--surface-auth: #141416;

/* Semantic Text Tokens (dark theme) */
--text-primary: #F5F4F1;
--text-secondary: #CFCFD2;
--text-tertiary: #6B6B6E;
--text-inverse: #0E0E10;

/* Border Tokens (dark theme) */
--border-default: #3A3A3E;
--border-subtle: #2A2A2E;

/* Interactive Tokens (dark theme - same as light) */
--action-primary: #BFA14A;
--action-hover: #A68A40;
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add dark theme semantic color tokens"
```

---

### Task 6: Add typography scale tokens

**Files:**
- Modify: `app/globals.css:7-26`

**Step 1: Add typography scale to :root**

```css
/* Font Families */
--font-heading: var(--font-playfair);
--font-body: var(--font-inter);

/* Typography Scale */
--text-display-lg: 80px / 88px;
--text-display-md: 64px / 72px;
--text-h1: 48px / 56px;
--text-h2: 36px / 44px;
--text-h3: 28px / 36px;
--text-h4: 22px / 30px;
--text-h5: 18px / 26px;
--text-h6: 16px / 24px;
--text-body-lg: 18px / 28px;
--text-body: 16px / 24px;
--text-body-sm: 14px / 20px;
--text-caption: 12px / 16px;
--text-overline: 11px / 16px;
--text-label: 13px / 16px;

/* Font Weights */
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;

/* Letter Spacing */
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.1em;
--tracking-overline: 0.2em;
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add typography scale tokens"
```

---

### Task 7: Add spacing and border radius tokens

**Files:**
- Modify: `app/globals.css:7-26`

**Step 1: Add spacing and radius tokens to :root**

```css
/* Spacing Scale (8pt base) */
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add spacing and border radius tokens"
```

---

### Task 8: Add motion and shadow tokens

**Files:**
- Modify: `app/globals.css:7-26`

**Step 1: Add motion and shadow tokens to :root**

```css
/* Motion (per VISUAL_DIRECTION.md: 200-400ms, ease-in-out) */
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 400ms;
--easing-default: cubic-bezier(0.4, 0, 0.2, 1);

/* Shadows (minimal, depth through spacing) */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 18px 48px rgba(0, 0, 0, 0.15);

/* Z-Index Scale */
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add motion and shadow tokens"
```

---

### Task 9: Update Tailwind @theme inline mapping for colors

**Files:**
- Modify: `app/globals.css:49-73`

**Step 1: Replace @theme inline color mappings**

```css
@theme inline {
  /* Colors - Semantic Tokens */
  --color-surface-primary: var(--surface-primary);
  --color-surface-secondary: var(--surface-secondary);
  --color-surface-tertiary: var(--surface-tertiary);
  --color-surface-auth: var(--surface-auth);

  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  --color-text-inverse: var(--text-inverse);

  --color-border-default: var(--border-default);
  --color-border-subtle: var(--border-subtle);

  --color-action-primary: var(--action-primary);
  --color-action-hover: var(--action-hover);

  /* Backward compatibility */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-auth-surface: var(--auth-surface);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: update Tailwind theme mapping for semantic colors"
```

---

### Task 10: Update Tailwind @theme inline mapping for typography

**Files:**
- Modify: `app/globals.css:49-73`

**Step 1: Add typography mappings to @theme inline**

```css
  /* Typography */
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);

  --text-display-lg: var(--text-display-lg);
  --text-display-md: var(--text-display-md);
  --text-h1: var(--text-h1);
  --text-h2: var(--text-h2);
  --text-h3: var(--text-h3);
  --text-h4: var(--text-h4);
  --text-h5: var(--text-h5);
  --text-h6: var(--text-h6);
  --text-body-lg: var(--text-body-lg);
  --text-body: var(--text-body);
  --text-body-sm: var(--text-body-sm);
  --text-caption: var(--text-caption);
  --text-overline: var(--text-overline);
  --text-label: var(--text-label);
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: update Tailwind theme mapping for typography"
```

---

### Task 11: Update Tailwind @theme inline mapping for spacing, radius, shadows, z-index

**Files:**
- Modify: `app/globals.css:49-73`

**Step 1: Add spacing, radius, shadows, z-index mappings to @theme inline**

```css
  /* Spacing */
  --space-0: var(--space-0);
  --space-1: var(--space-1);
  --space-2: var(--space-2);
  --space-3: var(--space-3);
  --space-4: var(--space-4);
  --space-5: var(--space-5);
  --space-6: var(--space-6);
  --space-8: var(--space-8);
  --space-10: var(--space-10);
  --space-12: var(--space-12);
  --space-16: var(--space-16);
  --space-20: var(--space-20);
  --space-24: var(--space-24);

  /* Border Radius */
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-full: var(--radius-full);

  /* Shadows */
  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);

  /* Z-Index */
  --z-dropdown: var(--z-dropdown);
  --z-sticky: var(--z-sticky);
  --z-fixed: var(--z-fixed);
  --z-modal-backdrop: var(--z-modal-backdrop);
  --z-modal: var(--z-modal);
  --z-popover: var(--z-popover);
  --z-tooltip: var(--z-tooltip);
```

**Step 2: Verify dev server starts**

Run: `bun dev`
Expected: Server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: update Tailwind theme mapping for spacing, radius, shadows, z-index"
```

---

### Task 12: Verify Phase 1 - test token classes in browser

**Files:**
- None (manual verification)

**Step 1: Start dev server**

Run: `bun dev`
Expected: Server starts at http://localhost:3000

**Step 2: Open browser and verify**

1. Open http://localhost:3000
2. Open DevTools and inspect elements
3. Verify CSS variables are loaded on :root
4. Check that dark theme (.dark) has override values

**Step 3: Commit**

```bash
git add .
git commit -m "feat: complete Phase 1 - design tokens added to globals.css"
```

---

## Phase 2: UI Components Refactor

### Task 13: Refactor button.tsx to use semantic variants

**Files:**
- Modify: `components/ui/button.tsx:7-39`

**Step 1: Update buttonVariants cva**

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-action-primary text-text-inverse hover:bg-action-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border-default bg-transparent hover:bg-surface-tertiary hover:text-text-primary",
        secondary:
          "bg-surface-tertiary text-text-primary hover:bg-surface-tertiary/80",
        ghost:
          "hover:bg-surface-tertiary hover:text-text-primary",
        link: "text-action-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-sm px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

**Step 2: Verify TypeScript compiles**

Run: `bun run build`
Expected: Build succeeds without errors

**Step 3: Commit**

```bash
git add components/ui/button.tsx
git commit -m "refactor: update button component to use semantic color tokens"
```

---

### Task 14: Refactor input.tsx to use token-based borders and focus

**Files:**
- Modify: `components/ui/input.tsx:5-19`

**Step 1: Update Input component className**

```typescript
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-text-tertiary selection:bg-action-primary selection:text-text-inverse h-9 w-full min-w-0 rounded-md border border-border-default bg-surface-secondary px-3 py-1 text-base text-text-primary shadow-sm transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-action-primary focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "aria-invalid:ring-destructive aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}
```

**Step 2: Verify TypeScript compiles**

Run: `bun run build`
Expected: Build succeeds without errors

**Step 3: Commit**

```bash
git add components/ui/input.tsx
git commit -m "refactor: update input component to use semantic color tokens"
```

---

### Task 15: Create or update label.tsx with semantic colors

**Files:**
- Modify or Create: `components/ui/label.tsx`

**Step 1: Check if label.tsx exists**

Run: `ls components/ui/label.tsx`

If exists, read it first, otherwise continue to step 2.

**Step 2: Create/update label component**

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-primary",
        className
      )}
      {...props}
    />
  )
}

export { Label }
```

**Step 3: Verify TypeScript compiles**

Run: `bun run build`
Expected: Build succeeds without errors

**Step 4: Commit**

```bash
git add components/ui/label.tsx
git commit -m "feat: add/update label component with semantic tokens"
```

---

### Task 16: Refactor card components to use token-based shadows and radii

**Files:**
- Modify: `components/ui/card.tsx`

**Step 1: Read card.tsx to understand current implementation**

Run: `cat components/ui/card.tsx`

**Step 2: Update card components to use semantic tokens**

Replace hardcoded values with semantic tokens:
- Use `border-border-default` instead of hardcoded borders
- Use `bg-surface-secondary` instead of hardcoded backgrounds
- Use `text-text-primary` for card foreground
- Use `shadow-md` or `shadow-lg` instead of custom shadows
- Use `rounded-lg` for card radius (12px)

**Step 3: Verify TypeScript compiles**

Run: `bun run build`
Expected: Build succeeds without errors

**Step 4: Commit**

```bash
git add components/ui/card.tsx
git commit -m "refactor: update card components to use semantic tokens"
```

---

## Phase 3: Page Components Refactor

### Task 17: Refactor login page colors to use semantic tokens

**Files:**
- Modify: `app/(marketing)/login/page.tsx:68-161`

**Step 1: Replace hardcoded colors in login page**

```tsx
// Line 68: Replace hardcoded colors
<div className="flex min-h-screen flex-col bg-surface-auth px-4 py-8 text-text-inverse">

// Line 75: Replace card styling
<Card className="w-full max-w-md border border-border-subtle bg-surface-secondary text-text-primary backdrop-blur-sm shadow-lg">

// Line 77-78: Replace title colors
<CardTitle className="font-serif text-display-md tracking-tight text-text-primary">
  Access the Platform.
</CardTitle>

// Line 80: Replace description color
<CardDescription className="text-sm text-text-secondary">
  Structured systems for digital moments.
</CardDescription>

// Line 88: Replace error alert styling
<p
  className="rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive"
  role="alert"
>

// Line 104: Replace input className
className="border border-border-subtle bg-transparent text-text-primary placeholder:text-text-tertiary focus-visible:border-action-primary focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-action-primary"

// Line 117: Replace password input className - same as above

// Line 124: Replace button className
className="w-full bg-text-inverse text-text-primary hover:bg-text-secondary disabled:opacity-70 focus-visible:ring-action-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"

// Line 129: Replace divider text color
<div className="relative py-1 text-overline uppercase tracking-overline text-text-tertiary">
  <div className="absolute inset-y-1 left-0 right-0 border-t border-border-subtle" />
  <span className="relative mx-auto inline-block bg-surface-auth px-2">
    Or continue with
  </span>
</div>

// Line 139: Replace outline button className
className="flex w-full items-center justify-center gap-2 border border-border-subtle bg-transparent text-text-primary hover:bg-surface-tertiary disabled:opacity-70"

// Line 147: Replace footer text colors
<p className="text-center text-caption text-text-tertiary">
  Need access?{" "}
  <Link
    href="/signup"
    className="text-action-primary underline-offset-4 hover:underline focus-visible:ring-action-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
    Sign up
  </Link>
</p>
```

**Step 2: Verify page renders in browser**

Run: `bun dev`
Open http://localhost:3000/login and verify styling

**Step 3: Commit**

```bash
git add app/(marketing)/login/page.tsx
git commit -m "refactor: update login page to use semantic color tokens"
```

---

### Task 18: Refactor signup page colors to use semantic tokens

**Files:**
- Modify: `app/(marketing)/signup/page.tsx`

**Step 1: Apply same token replacements as login page**

Replace all instances of:
- `bg-neutral-900` → `bg-surface-auth`
- `bg-neutral-900/80` → `bg-surface-secondary/80`
- `text-neutral-200` → `text-text-inverse`
- `text-neutral-100` → `text-text-primary`
- `text-neutral-300` → `text-text-secondary`
- `text-neutral-500` → `text-text-tertiary`
- `border-white/10` → `border-border-subtle`
- `border-white/15` → `border-border-subtle`
- `bg-white/2` → `bg-transparent`
- `bg-white/5` → `bg-surface-tertiary`
- `placeholder:text-neutral-500` → `placeholder:text-text-tertiary`
- `text-[11px]` → `text-overline`
- `tracking-[0.18em]` → `tracking-overline`
- `tracking-tight` → keep if using proper semantic class, or use `tracking-overline`
- `duration-250` → remove, let transition utilities handle

Also update the modal at lines 267-321 to use semantic tokens.

**Step 2: Verify page renders in browser**

Run: `bun dev`
Open http://localhost:3000/signup and verify styling

**Step 3: Commit**

```bash
git add app/(marketing)/signup/page.tsx
git commit -m "refactor: update signup page to use semantic color tokens"
```

---

### Task 19: Find and refactor other pages with hardcoded colors

**Files:**
- Modify: Various page files

**Step 1: Search for hardcoded color patterns**

Run: `grep -rn "neutral-" app/ --include="*.tsx" | head -20`

This will show files using Tailwind neutral colors that should be replaced with semantic tokens.

**Step 2: For each file found, replace with semantic tokens**

Common replacements:
- `neutral-100` → `text-text-inverse` or `bg-text-inverse`
- `neutral-200` → `text-text-secondary`
- `neutral-300` → `text-text-secondary`
- `neutral-500` → `text-text-tertiary`
- `neutral-900` → `bg-surface-auth`
- `neutral-950` → `bg-surface-auth`
- `bg-white` → `bg-surface-secondary` (or keep `bg-white` where appropriate)

**Step 3: For each file, commit separately**

```bash
git add <file>
git commit -m "refactor: update <file> to use semantic color tokens"
```

---

### Task 20: Replace arbitrary values with token-based classes

**Files:**
- Various files with arbitrary values

**Step 1: Search for arbitrary values**

Run: `grep -rn "\[" app/ --include="*.tsx" | grep -E "(text-|tracking-|rounded-|shadow-|bg-)" | head -30`

**Step 2: Replace arbitrary values with semantic tokens**

Common replacements:
- `text-[11px]` → `text-overline` or `text-caption`
- `text-[13px]` → `text-label`
- `tracking-[0.18em]` → `tracking-overline`
- `tracking-[0.2em]` → `tracking-overline`
- `rounded-xl` → `rounded-lg` (12px)
- `shadow-[0_18px_60px_...]` → `shadow-xl` or remove for minimal shadows
- `duration-250` → remove, use Tailwind's default transition utilities
- `shadow-[0_24px_80px_...]` → `shadow-xl` or remove

**Step 3: For each file, verify and commit**

Run: `bun run build`
Expected: Build succeeds without errors

```bash
git add <files>
git commit -m "refactor: replace arbitrary values with semantic tokens"
```

---

## Phase 4: Verification

### Task 21: Audit remaining inline styles and arbitrary values

**Files:**
- Various files

**Step 1: Search for remaining issues**

```bash
# Find remaining arbitrary values
grep -rn "\[.*\]" app/ --include="*.tsx" | grep -v "^node_modules" | grep -E "(text-|bg-|tracking-|rounded-|shadow-|px-|py-)" | head -20

# Find inline styles
grep -rn "style={{" app/ --include="*.tsx" | head -20
```

**Step 2: Document any remaining issues**

Create a temporary note file if any non-critical issues remain:

```bash
echo "Remaining issues found:" > /tmp/design-system-issues.txt
```

**Step 3: Commit if any fixes were made**

```bash
git add .
git commit -m "refactor: cleanup remaining arbitrary values and inline styles"
```

---

### Task 22: Test light/dark mode toggle

**Files:**
- `app/dashboard/UserProfileDropdown.tsx`

**Step 1: Verify dark mode toggle works**

1. Run: `bun dev`
2. Open http://localhost:3000/login or any page
3. Open DevTools and toggle dark mode (add `dark` class to `<html>` or use system preference)
4. Verify colors switch correctly between light and dark themes

**Step 2: Check specific elements**

- Surfaces should switch from ivory to soft black
- Text should switch from charcoal to ivory
- Primary/gold color should remain consistent
- Borders should adjust for dark mode

**Step 3: Commit**

```bash
git add .
git commit -m "test: verify light/dark mode toggling works correctly"
```

---

### Task 23: Verify spacing consistency

**Files:**
- Various component files

**Step 1: Check spacing patterns**

```bash
# Find non-standard spacing values
grep -rn "space-\|p\|m\|px\|py\|mt\|mb\|gap-" app/ --include="*.tsx" | grep -E "[0-9]" | head -30
```

**Step 2: Verify 8pt spacing system**

Ensure spacing values align with the 8pt system:
- `gap-1` = 4px ✓
- `gap-2` = 8px ✓
- `gap-3` = 12px ✓
- `gap-4` = 16px ✓
- `gap-6` = 24px ✓
- `gap-8` = 32px ✓
- `gap-12` = 48px ✓
- Avoid: `gap-5` (20px), `gap-7` (28px), `gap-9` (36px), `gap-10` (40px), `gap-11` (44px), etc.

**Step 3: Commit if fixes were made**

```bash
git add .
git commit -m "refactor: align spacing with 8pt system"
```

---

### Task 24: Final verification and summary

**Files:**
- None

**Step 1: Run final build check**

Run: `bun run build`
Expected: Build succeeds without errors

**Step 2: Run lint check**

Run: `bun run lint`
Expected: No new lint errors introduced (pre-existing errors are acceptable)

**Step 3: Create summary of changes**

```bash
git log --oneline | head -20
```

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete Attimo design system implementation

- Added comprehensive design tokens for colors, typography, spacing, motion, shadows, and radii
- Updated Tailwind theme mappings to use semantic tokens
- Refactored UI components (button, input, card, label) to use token-based classes
- Refactored page components (login, signup) to use semantic colors
- Removed arbitrary values and hardcoded colors
- Aligned spacing with 8pt system
- Verified light/dark mode compatibility"
```

---

## Notes

- **Backward Compatibility:** Old CSS variables (`--primary`, `--background`, etc.) are retained during transition. They can be removed in a future cleanup phase once all components are migrated.
- **Visual Direction:** All tokens align with VISUAL_DIRECTION.md requirements (8pt spacing, 8-12px radius, minimal shadows, architectural motion).
- **Component Library:** The shadcn/ui components provide a solid foundation. New components should follow the same pattern using semantic tokens.
