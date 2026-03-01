# Dashboard Vercel-Style Design

**Date:** 2026-03-01
**Status:** Approved

## Overview

Refactor the Attimo Studios dashboard to adopt Vercel-inspired patterns while maintaining the existing Attimo dark theme (#0E0E10). The design focuses on dense information presentation, minimal borders, and snappy interactions.

## Architecture

### Global Layout
- Full-width content with 4px outer padding
- Sticky top header with: logo, project switcher, search, user avatar
- Breadcrumbs in header: "Dashboard > Project Name" (wedding detail view only)
- Subtle border-bottom on main container

### Color System
- Background: `#0E0E10` (Charcoal)
- Panel backgrounds: `#141416` (Soft Black)
- Borders: White at 6% opacity (`border-border`)
- Accent/Gold: `#BFA14A` (`bg-primary`, `text-primary`)
- Text primary: `#F5F4F1` (`text-foreground`)
- Text secondary: `#CFCFD2` (`text-secondary-foreground`)
- Text tertiary: `#6B6B6E` (`text-tertiary-foreground`)
- Error: `#B91C1C`

### Typography
- Inter font family throughout
- SFMono/Consolas for code, slugs, IDs (`font-mono`)
- 11px body text, 13-14px headings
- 16px numbers in summary cards
- Tabular numbers for comparisons (`tabular-nums`)

## Components

### Projects List (Dashboard Home)

**Structure:**
1. Summary cards row (Projects, Drafts, Released) - above table
2. Toolbar: heading, filter chips, search, "New Wedding" button
3. Table with columns: Project, Slug, Status, Last edited, Actions
4. Empty state with centered message and CTA

**Table Specs:**
- Row height: 40px
- Hover: 2% white opacity (`hover:bg-white/[0.02]`)
- Columns dense-packed, minimal padding (px-4)
- Slug column: mono font, tertiary text

**Status Badges:**
- Draft: Gray badge, no dot, muted text
- Released: Gold badge (#BFA14A) with filled dot
- Saving: Spinner + "Saving..." text
- Saved: Checkmark + brief "Saved" text

### Wedding Detail Page

**Accordion Pattern:**
- Single-page with all sections expandable
- Only one section open at a time
- Each section has:
  - Header: section name, save indicator, collapse chevron
  - Left gold border accent when active
  - "Save Changes" button at bottom right
  - Auto-collapse after save (configurable)

**Sections:** Couple, Events, Gallery, RSVP, Wishes, Gift, Music, Layout, Settings

**Wedding Header:**
- Title (h2)
- Status badge
- Toolbar: Preview, Settings, Visit (if released)

### Project Switcher

**Location:** Top header, between logo and search

**Dropdown contains:**
- List of all user's projects
- Each project: name, status badge, last edited time
- Search input for filtering
- "Create new project" action with + icon

**Behavior:**
- From dashboard: clicking project navigates to detail view
- From detail view: clicking other project switches context

### User Profile Dropdown

**Location:** Top-right corner, avatar button

**Contains:**
- User info section (name, email)
- Navigation links: Dashboard, Account Settings, New project
- Theme switcher (segmented control: System, Light, Dark)
- Home link, Sign out
- "Upgrade to Pro" button (outline style)

## Interactions

### Transitions
- Duration: 150-200ms
- Properties: background, border, opacity (no layout anims)
- Snappy, immediate feel

### Hover States
- Table rows: 2% white opacity
- Buttons: border brightness increase
- Links: underline on hover
- Focus rings: #BFA14A gold, 2px with offset

### Form Handling
- Inputs: 32px height, thin borders, gray placeholders
- Labels above fields, muted text
- Inline validation errors (red text, red border)
- Unsaved changes indicator in section header
- Warn on unsaved changes before navigation
- Enter submits focused text input
- `touch-action: manipulation` for mobile
- Target ≥44px mobile, ≥24px desktop

### Loading States
- Skeleton: gray bars with shimmer
- Matches expected content height
- Table skeleton rows while fetching
- Active section skeleton when loading

## Accessibility

- Full keyboard support (WAI-ARIA APG patterns)
- Visible focus rings (`:focus-visible`)
- Manage focus in accordions/modals
- Hit targets ≥24px (mobile ≥44px)
- Mobile input font-size ≥16px
- `touch-action: manipulation`
- Tab order follows visual flow
- No dead zones (checkbox/radio labels share target)
- `aria-live` for toasts/inline validation
- Ellipsis (`…`) for follow-up options
- `scroll-margin-top` on headings
- Redundant status cues (not color-only)
- Icon-only buttons have `aria-label`
- Native semantics (`button`, `a`, `table`)

## Edge Cases

- **Mobile:** Tables scroll horizontally, 44px minimum tap targets
- **Empty states:** Consistent messaging with clear CTAs
- **Error states:** Red accent (#B91C1C) for errors
- **Keyboard:** Full navigation, focus management
- **Reduced motion:** Respects `prefers-reduced-motion`

## Performance

- Animations on compositor props only (`transform`, `opacity`)
- Virtualize large lists if needed
- Skeleton loading prevents layout shift
- Fast transitions (≤200ms)

## Design Principles

- YAGNI: Remove unnecessary features
- 8px grid spacing
- Optical alignment over geometric
- Concentric nested radii
- Hue consistency toward background
- APCA contrast over WCAG 2
- Crisp edges via semi-transparent borders

## Files to Modify

- `app/dashboard/page.tsx` - Main dashboard with projects list
- `app/dashboard/weddings/[id]/page.tsx` - Wedding detail page
- `app/dashboard/UserProfileDropdown.tsx` - User menu (refined)
- `components/dashboard/ProjectsTable.tsx` - New component for table
- `components/dashboard/WeddingAccordion.tsx` - Accordion component
- `components/dashboard/ProjectSwitcher.tsx` - New component
- `components/dashboard/DashboardHeader.tsx` - New header component
- `app/dashboard/layout.tsx` - Dashboard layout wrapper
- `tailwind.config.ts` - Add theme tokens if needed

## AGENTS.md Alignment

All work follows Cursor Cloud specific instructions:
- Keyboard-first, full keyboard support
- Proper focus management and visible focus rings
- Hit target requirements (24px desktop, 44px mobile)
- `touch-action: manipulation` for touch
- Hydration-safe inputs
- Loading states with spinners
- Enter to submit, Cmd/Ctrl+Enter in textareas
- Inline validation errors, focus first error on submit
- Optimistic UI where applicable
- Confirm destructive actions
- Respect `prefers-reduced-motion`
- Compositor-friendly animations only
- No layout shift from animations
- 8px grid spacing
- `scroll-margin-top` for anchored links
- Tabular numbers for data
- Redundant status cues (not color-only)
- Proper `aria-label` for icon-only buttons
- Native semantics over ARIA where possible
