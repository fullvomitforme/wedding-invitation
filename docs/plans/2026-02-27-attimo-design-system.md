# Attimo Design System

## Overview

A comprehensive design token library for Attimo Studios, providing consistent colors, typography, spacing, motion, shadows, and radii across the platform. This system aligns with VISUAL_DIRECTION.md and enforces the "architectural" brand ethos.

---

## Color Tokens

### Core Brand Colors

```css
--color-charcoal: #0E0E10;
--color-soft-black: #141416;
--color-ivory: #F5F4F1;
--color-muted-silver: #CFCFD2;
--color-deep-gold: #BFA14A;
```

### Semantic Color Tokens (Light Theme)

```css
/* Surfaces */
--surface-primary: #F5F4F1;      /* main bg */
--surface-secondary: #FFFFFF;    /* cards, panels */
--surface-tertiary: #E8E7E4;     /* accents, hover */
--surface-auth: #141416;         /* auth pages bg */

/* Text */
--text-primary: #0E0E10;         /* headings, primary content */
--text-secondary: #6B6B6E;       /* body, muted */
--text-tertiary: #CFCFD2;        /* captions, placeholders */
--text-inverse: #F5F4F1;          /* text on dark surfaces */

/* Borders & Dividers */
--border-default: #CFCFD2;
--border-subtle: #E8E7E4;

/* Interactive */
--action-primary: #BFA14A;       /* primary buttons, links */
--action-hover: #A68A40;
```

### Semantic Color Tokens (Dark Theme)

```css
/* Surfaces */
--surface-primary: #141416;
--surface-secondary: #1A1A1C;
--surface-tertiary: #2A2A2E;
--surface-auth: #141416;

/* Text */
--text-primary: #F5F4F1;
--text-secondary: #CFCFD2;
--text-tertiary: #6B6B6E;
--text-inverse: #0E0E10;

/* Borders & Dividers */
--border-default: #3A3A3E;
--border-subtle: #2A2A2E;

/* Interactive */
--action-primary: #BFA14A;
--action-hover: #A68A40;
```

---

## Typography Tokens

### Font Families

```css
--font-heading: var(--font-playfair);
--font-body: var(--font-inter);
```

### Type Scale

```css
/* Display - hero, major statements */
--text-display-lg: 80px / 88px;
--text-display-md: 64px / 72px;

/* Headings */
--text-h1: 48px / 56px;
--text-h2: 36px / 44px;
--text-h3: 28px / 36px;
--text-h4: 22px / 30px;
--text-h5: 18px / 26px;
--text-h6: 16px / 24px;

/* Body */
--text-body-lg: 18px / 28px;
--text-body: 16px / 24px;
--text-body-sm: 14px / 20px;

/* Utility */
--text-caption: 12px / 16px;
--text-overline: 11px / 16px;    /* uppercase, 0.2em tracking */
--text-label: 13px / 16px;
```

### Weights & Tracking

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;

--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.1em;
--tracking-overline: 0.2em;
```

---

## Spacing Scale (8pt Base)

```css
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
```

---

## Border Radius

```css
--radius-sm: 4px;   /* small elements, badges */
--radius-md: 8px;   /* default, buttons, inputs */
--radius-lg: 12px;  /* cards, panels */
--radius-full: 9999px;  /* pills, avatars */
```

---

## Motion

Per VISUAL_DIRECTION.md: 200–400ms, ease-in-out cubic-bezier

```css
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 400ms;

--easing-default: cubic-bezier(0.4, 0, 0.2, 1);  /* ease-in-out */
```

---

## Shadows

Minimal shadows; depth primarily through spacing.

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 18px 48px rgba(0, 0, 0, 0.15);  /* floating elements only */
```

---

## Z-Index Scale

```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

---

## Tailwind Integration

All tokens are mapped in `@theme inline` in `globals.css`, enabling semantic class names:

- `bg-surface-primary`, `bg-surface-secondary`, `bg-surface-tertiary`
- `text-primary`, `text-secondary`, `text-tertiary`, `text-inverse`
- `text-display-lg`, `text-display-md`, `text-h1`, `text-h2`, `text-body`, `text-caption`, `text-overline`
- `space-1` through `space-24`
- `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`
- `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`

---

## Implementation Phases

### Phase 1: globals.css Update
- Add all design tokens to `:root`
- Define dark theme token overrides in `.dark`
- Update `@theme inline` mappings
- Keep old tokens for backward compatibility

### Phase 2: UI Components (components/ui/*)
- Refactor `button.tsx` to use semantic variants
- Refactor `input.tsx` to use token-based borders, focus rings
- Update `card.tsx` shadows and radii
- Update other shadcn components as needed

### Phase 3: Page Components (app/**/*)
- Replace hardcoded colors with token classes
- Remove arbitrary values (`tracking-[0.18em]`, `text-[11px]`, etc.)
- Replace custom shadows with token-based shadows
- Standardize radii
- Remove custom durations, use token-based transitions

### Phase 4: Verification
- Audit remaining inline styles and arbitrary values
- Test light/dark mode toggle
- Verify spacing consistency
- Ensure all tokens are used correctly

---

## Backward Compatibility

Old CSS variables (`--primary`, `--background`, `--foreground`, etc.) are retained during transition to prevent breaking changes.
