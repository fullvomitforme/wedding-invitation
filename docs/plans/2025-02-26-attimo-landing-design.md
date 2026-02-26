# Attimo Studios — Dark Premium SaaS Landing Page

**Date:** 2025-02-26  
**Status:** Design  
**Aligns with:** README.md (Next.js 16, App Router, Tailwind 4, GSAP), VISUAL_DIRECTION.md

---

## 1. Purpose, scope, success criteria

**Purpose:** A dark, premium SaaS landing page that positions Attimo Studios as a digital experience systems platform. Tone: Apple event page meets modern SaaS (Linear / Vercel). No wedding clichés or decorative romance; focus on infrastructure, system, and modularity.

**Scope:** Single marketing page at the app root (`/`). Logged-in users continue to redirect to `/dashboard`. The page replaces the current minimal centered CTA with a full-screen, sectioned landing.

**Success criteria:**
- Immediate read: “This is a technical, scalable product company.”
- Strong hierarchy: one clear H1, scannable sections, obvious primary/secondary CTAs.
- Visual credibility: glass panels, restrained motion, dashboard preview mockup.
- Accessibility: keyboard, focus, reduced motion, semantic structure per AGENTS.md.
- Performance: compositor-friendly motion, no layout thrash, minimal JS.

**Out of scope for this design:** Navbar/footer (can be minimal or same as current), blog, pricing page, request-access backend (form can post or mailto for now).

---

## 2. Information architecture and page structure

**Section order (top to bottom):**

1. **Hero** — Left-aligned statement + primary/secondary CTAs; right side: dashboard preview mockup inside a subtle glass or device frame.
2. **Value / system** — One short block (e.g. “Structured for ceremony. Designed to scale.”) with 2–3 supporting lines; optional very subtle glass panel or just typography on dark bg.
3. **Product proof** — Dashboard preview or “builder” mockup emphasis: modular blocks, clear hierarchy. Reinforces “design tool meets event technology.”
4. **Trust / credibility** — Minimal: one line (e.g. “Built for scale. Deployed in minutes.”) or 2–3 short bullets (subdomains, multi-tenant, no lock-in). No logos unless real; avoid placeholder “As seen in.”
5. **Final CTA** — Repeat primary CTA (“Build with Attimo”) and secondary (“Request Access”) in a restrained strip.

**Navigation:** Minimal. Logo (wordmark “Attimo” or “Attimo Studios”) left; right: “Request Access” (secondary) and “Build with Attimo” (primary) or “Sign in” when appropriate. No mega-menu; single-level only.

---

## 3. Hero: layout, typography, CTAs, mockup

**Layout:** 12-column grid, large outer margins (e.g. max-width container, padding 24px–48px). Hero content left-aligned in roughly 5–6 columns; mockup in 6–7 columns, with more space on the outer edge than between text and mockup (asymmetric per VISUAL_DIRECTION).

**H1:** Large serif. One short line (e.g. “Engineer your moment.” or “Digital moments, built to last.”). VISUAL_DIRECTION: 64px / 72px line-height, tight letter-spacing. Prefer a modern high-contrast serif (e.g. Fraunces, Source Serif 4, or existing Playfair used with restraint) so it feels Apple/Linear, not romantic.

**Supporting line:** One sentence in clean sans, muted (e.g. `--muted-foreground`). ~18–20px, max-width ~28ch so it doesn’t stretch into the mockup area.

**CTAs:** Horizontal group, left-aligned.
- **Primary:** “Build with Attimo” → `/signup`. Solid primary (Deep Gold) or high-contrast (e.g. ivory on charcoal). Min height 44px, 8–12px radius, subtle hover (e.g. brightness or border glow).
- **Secondary:** “Request Access” → `/request-access` or mailto/link. Ghost or outline; same radius and hit target.

**Dashboard preview mockup:** Right side of hero. Options: (A) Screenshot of the actual dashboard (wedding list / builder) inside a simple browser or laptop frame; (B) Abstract UI blocks (sidebar + content grid) suggesting “modular system” without wedding imagery. Prefer (A) for credibility. Frame: thin border, optional very subtle glass (backdrop-blur + low-opacity fill) so it feels premium. No heavy shadow; depth from spacing and layering.

**Motion (hero):** On load: H1 and body opacity 0 → 1, slight translateY (e.g. 8–12px) over 300–400ms, ease-out. CTAs stagger 50–80ms after. Mockup can fade in last or with subtle scale. Honor `prefers-reduced-motion` (no or minimal motion).

---

## 4. Content sections: structure and hierarchy

**Section 2 (Value / system):** Single block. H2 in serif (e.g. 36px), one short line. Body 1–2 sentences, sans, muted. No cards if one block; if 2–3 short value props, use a single row of minimal “cards” (1px border, 8px radius, no heavy shadow) or just bold labels + one line each.

**Section 3 (Product proof):** Optional second mockup or enlarged detail of dashboard (e.g. “Modular blocks. Live preview.”). Left or right alignment alternate from hero to keep rhythm. Image or component with light glass border; caption in 12px uppercase, 0.2em tracking if needed.

**Section 4 (Trust):** Short bullets or one sentence. No decorative icons unless minimal (e.g. checkmark). Typography and spacing carry the weight.

**Section 5 (Final CTA):** Same primary + secondary buttons; can be centered or left-aligned. Slight background shift (e.g. one step darker or one step lighter) to separate from section 4.

**Spacing:** 8pt base. Sections: 80px–120px vertical padding (responsive). Between elements inside sections: 16–24px. Large outer margins so content doesn’t touch viewport edge on large screens.

---

## 5. Visual system: dark theme, glass, type, motion

**Background:** Dark for this page only. Use `--background: #141416` (Soft Black), `--foreground: #F5F4F1` (Ivory). Apply via a layout wrapper or `dark` class on a section-level container so the rest of the app (e.g. login/signup) can stay light if desired.

**Accent:** Deep Gold `#BFA14A` only. Use for primary button, focus rings, and optionally one small detail (e.g. line under H1 or dot). &lt; 10% of screen (per VISUAL_DIRECTION).

**Glass panels:** `backdrop-blur(12px–16px)` + `background: rgba(255,255,255,0.03)` or equivalent dark tint; 1px border `rgba(255,255,255,0.06)`. Use for mockup frame and optionally for one value block. No heavy opacity; keep readability and contrast.

**Typography:** Serif for H1 and H2 only. Sans for body, captions, nav, buttons. Scale: H1 64/72, H2 36, body 16–18, caption 12 uppercase. Tabular numbers if stats appear.

**Motion:** 200–400ms, ease-in-out or custom cubic-bezier. Opacity + translateY only for reveals. Optional very subtle parallax on scroll for mockup (e.g. 0.02–0.05). No bounce; honor `prefers-reduced-motion`.

---

## 6. Components and implementation notes

**Stack (per README):** Next.js 16 App Router, TypeScript, Tailwind CSS 4, GSAP (ScrollTrigger optional for section reveals). No new UI library required; use existing Tailwind + semantic HTML. If shadcn is present, Button/Link can use shadcn Button with dark variant.

**Suggested files:**
- `app/page.tsx` — Server component; session check and redirect to `/dashboard`; render `<AttimoLanding />` when unauthenticated.
- `components/landing/AttimoLanding.tsx` — Client wrapper if any client-only motion (e.g. GSAP) is used, or keep server and use CSS + minimal client for hero animation.
- `components/landing/HeroSection.tsx` — Left column (H1, supporting line, CTAs) + right column (mockup).
- `components/landing/DashboardMockup.tsx` — Image or composed UI in a frame (glass border).
- `components/landing/ValueSection.tsx`, `TrustSection.tsx`, `FinalCtaSection.tsx` — One component per section or one `Section` with variant prop.

**Assets:** One dashboard screenshot or a composed Figma/HTML mockup exported as image; optional device/browser frame as SVG or CSS. No stock couple or romantic imagery.

**SEO:** Update root layout `metadata` (title, description) for Attimo Studios when rendering this landing. No wedding-specific meta on this page.

---

## 7. Accessibility and performance

- **Focus:** Visible focus rings (`:focus-visible`) on all interactive elements; primary/secondary CTAs and nav links.
- **Semantics:** One `<h1>` per page; sections in `<section>` with `<h2>` where appropriate; CTAs as `<a>` or `<button>` with clear labels.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` — disable or shorten animations; instant opacity or no translateY.
- **Performance:** No large images above the fold without dimensions (avoid CLS); lazy-load below-fold images; use `transform`/`opacity` only for motion.

---

## 8. Copy and CTAs (reference)

- **Primary CTA:** “Build with Attimo” → `/signup`
- **Secondary CTA:** “Request Access” → `/request-access` or placeholder
- **H1 options:** “Engineer your moment.” / “Digital moments, built to last.” / “We engineer digital moments.”
- **Supporting:** One line about structured, scalable digital experiences (no “love story” or “celebrate”).
- **Value:** “Structured for ceremony. Designed to scale.” (or similar)
- **Trust:** “Built for scale. Deployed in minutes.”; bullets: subdomains, multi-tenant, full control.

---

## 9. Next steps

1. Confirm H1 and supporting copy.
2. Implement Hero (layout + mockup + motion).
3. Add sections 2–5 and nav.
4. Wire CTAs; add `/request-access` placeholder if needed.
5. Apply dark theme scoping and verify contrast (APCA/WCAG).
6. Test keyboard, reduced motion, and one narrow + one wide viewport.
