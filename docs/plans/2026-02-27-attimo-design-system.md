# Attimo Design System

## Overview

A comprehensive design token library for Attimo Studios, providing consistent colors, typography, spacing, motion, shadows, and radii across the platform. This system aligns with VISUAL_DIRECTION.md and enforces the "architectural" brand ethos.

---

## Color Tokens

### Core Brand Colors

```css
Charcoal:      #0E0E10
Soft Black:    #141416
Ivory:         #F5F4F1
Muted Silver:  #CFCFD2
Deep Gold:     #BFA14A
```

### Shadcn Variable Mappings

The design system uses shadcn's standard CSS variable names, mapped to Attimo brand colors. This ensures compatibility with shadcn/ui components while maintaining brand consistency.

#### Light Theme (`:root`)

```css
/* Surfaces */
--background:   #F5F4F1;  /* Ivory - main bg */
--card:         #FFFFFF;    /* White - cards, panels */
--muted:        #E8E7E4;   /* Ivory darkened - accents, hover */
--secondary:    #E8E7E4;   /* Same as muted - secondary buttons */

/* Text */
--foreground:       #0E0E10;  /* Charcoal - headings, primary content */
--card-foreground:  #0E0E10;  /* Charcoal - text on cards */
--muted-foreground: #6B6B6E;  /* Gray - body, muted text */
--secondary-foreground: #0E0E10; /* Charcoal - text on secondary */

/* Interactive */
--primary:            #BFA14A;  /* Deep Gold - primary buttons, links */
--primary-foreground: #0E0E10;  /* Charcoal - text on primary */
--accent:             #E8E7E4;  /* Ivory darkened - accent surfaces */
--accent-foreground:  #0E0E10;  /* Charcoal - text on accent */
--ring:               #BFA14A;  /* Deep Gold - focus ring */

/* Destructive */
--destructive:           #b91c1c;
--destructive-foreground: #f5f4f1;

/* Borders */
--border: #CFCFD2;  /* Muted Silver - default borders */
--input:  #CFCFD2;  /* Muted Silver - input borders */
```

#### Dark Theme (`.dark`)

```css
/* Surfaces */
--background:   #141416;  /* Soft Black - main bg */
--card:         #1A1A1C;  /* Soft Black lightened - cards, panels */
--muted:        #2A2A2E;  /* Soft Black lightened - accents, hover */
--secondary:    #2A2A2E;  /* Same as muted - secondary buttons */

/* Text */
--foreground:       #F5F4F1;  /* Ivory - headings, primary content */
--card-foreground:  #F5F4F1;  /* Ivory - text on cards */
--muted-foreground: #CFCFD2;  /* Muted Silver - body, muted text */
--secondary-foreground: #F5F4F1; /* Ivory - text on secondary */

/* Interactive */
--primary:            #BFA14A;  /* Deep Gold - primary buttons, links */
--primary-foreground: #0E0E10;  /* Charcoal - text on primary */
--accent:             #2A2A2E;  /* Soft Black lightened - accent surfaces */
--accent-foreground:  #F5F4F1;  /* Ivory - text on accent */
--ring:               #BFA14A;  /* Deep Gold - focus ring */

/* Destructive */
--destructive:           #b91c1c;
--destructive-foreground: #f5f4f1;

/* Borders */
--border: #3A3A3E;  /* Dark gray - default borders */
--input:  #3A3A3E;  /* Dark gray - input borders */
```

#### Tailwind Class Usage

| Variable | Tailwind Class |
|----------|---------------|
| `--background` | `bg-background`, `ring-offset-background` |
| `--card` | `bg-card`, `ring-offset-card` |
| `--muted` | `bg-muted`, `bg-muted/*` |
| `--foreground` | `text-foreground`, `hover:text-foreground` |
| `--card-foreground` | `text-card-foreground` |
| `--muted-foreground` | `text-muted-foreground`, `placeholder:text-muted-foreground` |
| `--primary` | `bg-primary`, `text-primary`, `border-primary`, `ring-primary` |
| `--primary-foreground` | `text-primary-foreground` |
| `--accent` | `bg-accent`, `bg-accent/*` |
| `--accent-foreground` | `text-accent-foreground` |
| `--border` | `border-border`, `border-border/*` |
| `--ring` | `ring-ring`, `ring-ring/*` |

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

### Using Design System Colors

All shadcn color variables are mapped in `@theme inline` in `globals.css`:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
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
  /* ... typography, spacing, radius, etc. */
}
```

### Best Practices

- **Never use arbitrary hex colors** like `#0E0E10` or `#BFA14A`
- **Never use neutral colors** like `text-neutral-100`, `bg-neutral-900`
- **Use semantic variable classes** like `bg-primary`, `text-foreground`, `border-border`
- **For opacity variants**, use `bg-background/10`, `text-foreground/60`, etc.
- **Use `bg-muted/*`** for hover states and subtle backgrounds
- **Use `border-border/*`** for subtle borders with opacity

---

## Implementation Status

### ✅ Completed

- **globals.css** - Shadcn variables properly mapped to Attimo colors with light/dark themes
- **Auth pages** (`/login`, `/signup`) - All hardcoded colors replaced with semantic classes
- **Dashboard** (`layout.tsx`, `DashboardHeader.tsx`, `UserProfileDropdown.tsx`) - Updated to use design system colors
- **Landing components** - Updated to use semantic variable classes

### 🚧 Ongoing

- **Remaining pages/components** - Some files still contain `text-neutral-*`, `bg-neutral-*`, or arbitrary hex colors
- **UI components** - shadcn components use standard variables correctly (no changes needed)

### 📋 Implementation Guidelines

When adding new components or updating existing ones:

1. **Use shadcn variable classes** instead of arbitrary colors:
   - ❌ `text-neutral-100`, `bg-neutral-900`, `#0E0E10`
   - ✅ `text-foreground`, `bg-card`, `bg-primary`

2. **Use opacity variants for subtle effects**:
   - ❌ `border-white/10`, `bg-white/5`, `text-neutral-500`
   - ✅ `border-border/10`, `bg-muted/20`, `text-muted-foreground`

3. **Use semantic hover/focus states**:
   - ❌ `hover:bg-white/10`, `focus:ring-[#BFA14A]`
   - ✅ `hover:bg-muted/30`, `focus:ring-primary`

4. **Use `bg-card` for dark card backgrounds**:
   - Use `bg-card` for card components in both light and dark themes
   - Use `ring-offset-card` for ring offsets on card backgrounds

---

## Backward Compatibility

Shadcn standard variable names (`--primary`, `--background`, `--foreground`, etc.) are used throughout the codebase for compatibility with shadcn/ui components. The design system ensures these map to Attimo brand colors in both light and dark themes.
