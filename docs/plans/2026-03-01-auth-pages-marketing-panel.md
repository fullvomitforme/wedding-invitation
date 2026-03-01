# Auth Pages Marketing Panel Design

## Overview

Enhance the login and signup pages by transforming the empty left column into a rich brand experience with marketing content. The left panel displays brand identity, product benefits, and social proof to fill visual space and provide value before users engage with the form.

---

## Problem

The current auth pages have a two-column grid layout where the left column contains only the BrandMark and navigation link. This leaves significant empty space, making the pages feel incomplete and missing an opportunity to communicate the product's value proposition.

---

## Solution

Create a shared `AuthLeftPanel` component with three content sections:
- **Brand Tagline & Description** — Establishes brand voice and core value proposition
- **Benefit Bullets** — Lists 3-4 key benefits users receive, reassuring sign-up value
- **Social Proof** — Brief testimonial or stat to build credibility

A hybrid approach allows shared content between pages while enabling page-specific customization via props.

---

## Component Architecture

### AuthLeftPanel

**Location**: `components/auth/AuthLeftPanel.tsx`

**Props**:
```tsx
interface AuthLeftPanelProps {
  pageType: 'login' | 'signup';
}
```

**Structure**:
```tsx
<section className="flex flex-col justify-center px-4 py-8 min-h-[50vh] md:min-h-screen">
  <BrandTagline pageType={pageType} />
  <BenefitList />
  <SocialProof />
</section>
```

**Subcomponents**:
- `BrandTagline` — Serif headline and description, customized by page type
- `BenefitList` — 3-4 benefit items with checkmark icons, hover/focus states
- `SocialProof` — Short testimonial or stat at bottom

### Content

**Brand Tagline**:
- Login: "Welcome back" + re-engagement description
- Signup: "Create your account" + value proposition

**Benefits** (shared):
1. Create beautiful invitations in minutes
2. Share instantly with guests
3. Track RSVPs in real-time
4. Professional design templates

**Social Proof**:
- Example: "10,000+ invitations created" or brief user testimonial

---

## Animation Strategy

### Entrance Animations

Uses staggered reveal pattern with the existing `landing-reveal` animation from `globals.css`:
- Fades in with 12px upward translate
- 200-250ms duration per Attimo design system
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### Stagger Delays
```
Section container:     delay 0ms
First item:            delay 50ms
Second item:           delay 100ms
Third item:            delay 150ms
```

### Reduced Motion
- Honors `prefers-reduced-motion` media query
- Affected users see all elements immediately without animation

### Micro-interactions
- **Hover states** on benefit bullets: `bg-muted/20` background shift, subtle scale
- **Focus rings**: Use primary color (`text-primary`) for accessibility
- **Button states**: 250ms ease-out transition (refined from existing)

### AGENTS.md Compliance
- ✅ Honors `prefers-reduced-motion`
- ✅ Prefers CSS over JS libraries
- ✅ Animates compositor-friendly props only (`transform`, `opacity`)
- ✅ Animates for deliberate delight
- ✅ Proper easing matching change type
- ✅ Input-driven (page load trigger)
- ✅ Correct `transform-origin`

---

## Responsive Behavior

### Breakpoints
- **Mobile (<768px)**: Left panel full width above form
- **Desktop (≥768px)**: Two-column split, panel on left

### Mobile Considerations (per AGENTS.md)
- Touch targets ≥44px for all interactive elements
- No browser zoom blocking (viewport meta already configured)
- Autofocus disabled on mobile to prevent keyboard layout shift
- Input font-size ≥16px (satisfied by existing input styling)
- `touch-action: manipulation` on interactive elements
- `-webkit-tap-highlight-color` matches design colors

### Spacing
- `min-h-[50vh]` on mobile to balance vertical space
- `min-h-screen` on desktop for full viewport height
- All spacing follows Attimo 8pt scale
- `px-4` padding respects `env(safe-area-inset-*)`

### Typography Scale
| Element | Mobile | Desktop |
|---------|--------|---------|
| Headline | text-3xl | text-5xl |
| Body | text-sm | text-base |
| Benefits | text-xs | text-sm |

---

## Color & Theming

All colors use semantic shadcn variable classes per Attimo Design System:
- `text-foreground` — Primary headings
- `text-muted-foreground` — Body text, descriptions
- `hover:bg-muted/20` — Hover backgrounds
- `focus-visible:ring-primary` — Focus rings
- `bg-background dark` — Dark theme enforcement on auth pages

The existing dark theme pattern (`dark` class forced on auth pages) remains unchanged. Semantic classes automatically adapt to both light and dark themes.

---

## Integration

### Login Page

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-background dark px-4 py-8 min-h-screen text-muted-foreground">
  <div className="flex flex-col justify-between">
    {/* Header */}
    <div className="flex items-center justify-between gap-8">
      <Link href="/"><BrandMark /></Link>
      <Link href="/signup">Sign up</Link>
    </div>

    {/* New Left Panel */}
    <AuthLeftPanel pageType="login" />
  </div>

  {/* Existing Card with form */}
  <div className="flex flex-1 justify-center items-center">
    <Card>...</Card>
  </div>
</div>
```

### Signup Page

Same structure, with `pageType="signup"` and "Sign in" navigation link.

---

## Accessibility

### Keyboard Navigation
- All interactive elements have proper `tabindex`
- Focus rings via `:focus-visible`
- Follows WAI-ARIA APG patterns

### Screen Reader
- Benefit list announced as `<ul>`, not individual `<div>`s
- Proper semantic markup (native elements preferred over ARIA)

### Hit Targets
- Minimum 24px (44px on mobile)
- No dead zones — all hover states have proper hit areas

### Focus Management
- Desktop: Autofocus on first input after page load
- Mobile: No autofocus to prevent layout shift

---

## Dependencies

No new dependencies required:
- Icons: Use existing Lucide icons or inline SVGs
- Animations: CSS only, no JS libraries
- Styling: Tailwind CSS with existing design system variables

---

## Testing Checklist

### Visual Regression
- [ ] Light theme
- [ ] Dark theme
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1280px)
- [ ] Ultra-wide (1920px at 50% zoom)
- [ ] `prefers-reduced-motion` — animations disabled

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus rings visible on all interactive elements
- [ ] Screen reader announces content correctly
- [ ] Focus management (mobile no autofocus, desktop autofocus)

### Edge Cases
- [ ] Long benefit text wraps gracefully
- [ ] Empty social proof doesn't crash (renders nothing)
- [ ] No hydration mismatch
- [ ] CLS prevention (explicit min-h values)

### Performance
- [ ] No CLS from panel layout
- [ ] Animations use CSS only
- [ ] No external images/fonts loaded
- [ ] Measure with CPU/network throttling

---

## Files to Create/Modify

### New Files
- `components/auth/AuthLeftPanel.tsx` — Main component
- `components/auth/BrandTagline.tsx` — Brand tagline subcomponent
- `components/auth/BenefitList.tsx` — Benefits subcomponent
- `components/auth/SocialProof.tsx` — Social proof subcomponent

### Modified Files
- `app/(marketing)/login/page.tsx` — Integrate AuthLeftPanel
- `app/(marketing)/signup/page.tsx` — Integrate AuthLeftPanel
