# Attimo Studios — Visual Direction System

## 1. Brand Core

**Archetype:** Architect + Storyteller  
**Tone:** Calm. Precise. Intentional. Never decorative.

**Brand Claim Direction:**  
> We engineer digital moments.

Attimo Studios is a digital experience systems company.  
We are not a wedding vendor. We build structured, interactive moments.

---

## 2. Visual Philosophy

### Avoid
- Floral ornaments
- Script calligraphy fonts
- Pink/pastel overload
- Template-style layouts
- Romantic clichés
- Stock hero couple images

### Embrace
- Editorial minimalism
- Cinematic framing
- Strong negative space
- Structured grid systems
- Micro-interactions
- Clear typographic hierarchy

---

## 3. Color System

### Primary Base
- Charcoal: `#0E0E10`
- Soft Black: `#141416`

### Secondary
- Ivory: `#F5F4F1`
- Muted Silver: `#CFCFD2`

### Accent (choose one only)
- Deep Gold: `#BFA14A`
or
- Cool Sapphire: `#3E5BF6`

**Rule:** Accent color must not exceed 10% of screen usage.

No pastel-heavy compositions.

---

## 4. Typography

### Heading
Modern high-contrast serif  
- Tight kerning  
- Large display scale  
- Confident spacing  

### Body
Neo-grotesk / clean sans-serif  
- Neutral  
- High legibility  
- Minimal personality  

### Hierarchy Example
- H1: 64px / 72px
- H2: 36px
- Body: 16px
- Caption: 12px uppercase with 0.2em tracking

Script fonts are never used in Attimo brand system.  
They may only appear inside client invitation themes.

---

## 5. Layout System

- 12-column grid
- 8pt spacing system
- Large outer margins
- Asymmetrical hero layout
- Depth created through spacing, not heavy shadow

### Hero Structure
Left: Statement  
Right: Motion preview / device mockup  

Never center everything by default.

---

## 6. Motion Language

Attimo motion is controlled and architectural.

### Motion Rules
- Duration: 200–400ms
- Easing: ease-in-out cubic-bezier
- Subtle parallax only
- Opacity + slight translateY for text reveals
- No bounce
- No playful easing curves

Movement should feel engineered, not animated for decoration.

---

## 7. UI Component Style

### Buttons
- 8–12px border radius
- Solid primary or ghost variant
- Minimal shadow
- Hover: subtle background shift or border glow

### Cards
- 1px soft border
- No heavy drop shadows
- Depth through layout spacing

### Inputs
- Thin outline or underline style
- Accent color for focus state
- No exaggerated highlight effects

---

## 8. Imagery Direction

No stock smiling couples on homepage.

Use:
- Cinematic still frames
- Black & white previews
- Soft film grain overlays
- Close-up texture shots
- UI mockups inside minimal device frames

Attimo should feel like a digital architecture firm.

---

## 9. Copywriting Guidelines

Avoid:
- “Celebrate your love story”
- Emotional clichés
- Decorative language

Use:
- Build your moment.
- Engineered presence.
- Structured for ceremony.
- Designed to be remembered.

Tone:
- Short sentences
- Direct
- High intention
- Zero fluff

---

## 10. Product UI (Builder Interface)

Even if the output is romantic, the system interface must be structured.

### Builder Layout
- Dark UI
- Command panel on left
- Live preview on right
- Modular block system
- Clear hierarchy of settings

Think:
Design tool meets event technology platform.

Not template marketplace.

---

## 11. Logo Direction

Logotype only.

- ATTIMO
or
- Attimo Studios

Rules:
- Tight kerning
- Subtle custom modification on A or O
- No wedding icons
- No rings symbol
- No decorative marks

If it looks like a wedding vendor logo, reject it.

---

## 12. Implementation (UI Library)

The product UI uses **shadcn/ui** (Button, Input, Card, Label, etc.) themed to this system:

- **Light (marketing):** Ivory background, charcoal text, Deep Gold primary.
- **Dark (builder/dashboard):** Soft Black background, ivory text, Deep Gold accent.
- CSS variables in `app/globals.css` map Attimo tokens to shadcn’s theme (primary, muted, border, etc.).
- Components use 8px radius, 1px borders, minimal shadow; no decorative flourishes.

Add new shadcn components as needed; keep them aligned with the rules above.

---

## 13. Scalability Test

Before approving any design decision, ask:

“Would this still work if Attimo pivoted to event tech or creator tools?”

If not, reject.

---

## 14. Strategic Positioning Reminder

Attimo is positioned as:
- A digital systems studio
- An experience engineering company
- A scalable product brand

Not a template seller.
Not a romantic design service.
Not a decorative studio.