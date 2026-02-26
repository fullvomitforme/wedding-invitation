# Wedding Invitation SaaS – Design Document

**Date:** 2025-02-26  
**Status:** Validated (brainstorming complete)

## 1. Product summary and user model

### What we're building

A SaaS where users (couples or planners) sign up and create **weddings**. Each wedding has:

- **Dashboard** – Edit all content (couple names, dates, locations, gallery, RSVP settings, wishes, music, etc.), choose a template, and control which sections are visible and in what order.
- **Public invitation** – A generated site (template + content + section config) at a **user-editable subdomain** (e.g. `jane-john.yourproduct.com`). Guests view, RSVP, leave wishes, and (optionally) upload photos.

### Users and ownership

- **Account** = one person (couple member or planner). No “organization” entity in v1.
- **Wedding** has one **owner** (creator). Owner can **invite collaborators** (e.g. partner or planner). Both owner and collaborators see the same dashboard and can edit content and section settings.
- **Flow:** Couple creates wedding → can invite partner or planner. Planner creates for clients → can invite couple. Either side can own the wedding; no separate “handoff” object, just invite and roles.

### Roles

- **Owner** – Full control; can delete wedding, manage collaborators.
- **Collaborator** – Can edit content and section config; cannot delete wedding or manage collaborators.

### Out of scope (this document)

Billing, subscriptions, and usage limits are not specified here.

---

## 2. Auth – Better Auth

- **Provider:** Better Auth for all authentication (no Supabase Auth for users).
- **Use for:** Sign-up/sign-in, session management, “current user” in the app. Users table (or Better Auth default) stores `id`, `email`, etc.; link to `wedding_collaborators` via `user_id`.
- **Scopes:** Invite flows (invite by email; user signs up or signs in and is linked to wedding). Dashboard and API protect routes with “logged in + has access to this wedding.”
- **Database:** Better Auth uses the same Postgres (e.g. Supabase) for its tables; `wedding_*` and `rsvp`/`wishes` stay in that DB.

---

## 3. Subdomain on release

- When the user **releases** (publishes) a wedding, the site goes live at `https://{slug}.yourproduct.com`.
- **Subdomain (slug)** is **user-editable**: chosen in dashboard, validated (format, uniqueness, reserved names), preview text: “Your site will be at `{slug}.yourproduct.com`.”
- **DNS:** Wildcard `*.yourproduct.com` points to the same host as the main app.
- **SSL:** Wildcard cert for `*.yourproduct.com`; no per-subdomain provisioning at release.
- **Release action:** Set `status = 'released'`; no DNS/SSL step at release time. Draft/preview remains at `yourproduct.com/preview/{wedding_id}`.

---

## 4. Data model and tenants

### Core entity: Wedding

- **Identity:** `id` (uuid), `slug` (user-editable subdomain segment: lowercase, alphanumeric + hyphens, unique).
- **Status:** `status`: `draft` | `released`.
- **Content:** Couple names, photos, event title; event date(s), times, locations (name, address, map link); gallery images; music playlist; gift/live-stream copy and links; hero and other copy.
- **Config:** `template_id`; `sections` (e.g. JSON: section id + `enabled` + `order`).

### Access

- **wedding_collaborators:** `wedding_id`, `user_id`, `role` (`owner` | `collaborator`), `invited_at`. One owner per wedding; multiple collaborators. Owner: full control including delete and manage collaborators. Collaborator: edit content and section config only.

### Guest-facing data (tenant-scoped)

- **RSVPs:** `wedding_id` on each response.
- **Wishes:** `wedding_id` on each wish.
- **Uploaded photos (if added):** Store with `wedding_id`; dashboard lists per wedding.

---

## 5. Dashboard scope and UI

### Entry and listing

- After login: dashboard home = list of weddings (own or collaborate). Each row: title/couple names, slug, status (Draft / Released), Edit, Preview, and if released, View site (subdomain).
- **New wedding:** Creates wedding with `status: draft`, current user as owner; redirect to edit. Slug can be set in Settings/Publish.

### Per-wedding dashboard

- **Content:** Couple (names, bios, photos); Events (date, time, venue, address, map link); Gallery (upload/reorder/delete); Music (playlist); Gift / Live stream / other copy; Wishes (read/moderate); RSVP (list, export, optional form config).
- **Layout:** Section toggles (on/off) and order; saved to wedding `sections` config.
- **Template:** Pick template (e.g. Classic, Minimal, Garden) → `template_id`.
- **Settings / Publish:** User-editable slug with validation and uniqueness; “Release” sets `status: released` and enables subdomain. “View site” opens `https://{slug}.yourproduct.com`.

### Collaboration

- Owner (and optionally collaborator) can invite by email; after sign-up/sign-in (Better Auth), user is linked as collaborator. List and remove collaborators (owner only).

---

## 6. Public site, subdomain routing, release flow

### Serving

- Same Next.js app serves main product and all wedding invitations.
- **Routing by host:** Middleware or layout reads `Host`: `yourproduct.com` → main app (landing, login, dashboard); `{slug}.yourproduct.com` → resolve wedding by `slug` and `status = 'released'`; not found → 404 or redirect.

### Rendering

- Load wedding by slug; fetch content + `template_id` + `sections`. One template component; for each section in order with `enabled`, render the block. RSVP/Wishes APIs use `wedding_id`. No static export per wedding.

### Release

- **Release:** Validate slug, set `status = 'released'`. Wildcard DNS and SSL already in place; no extra step. Show success and link to subdomain.

### Preview

- `yourproduct.com/preview/{wedding_id}` uses same render path, loads by `id`, does not require released or subdomain.

---

## 7. Error handling and security

- **Auth:** Dashboard and API require Better Auth session; check `wedding_collaborators` before any edit/delete; 401/403 when not allowed.
- **Slug:** Reserved slugs (`www`, `api`, `app`, `dashboard`, `admin`, etc.); uniqueness and format checks on create/update.
- **Uploads:** Validate type and size; store in Supabase Storage scoped by `wedding_id`; serve via signed or scoped public URLs.
- **RSVP/Wishes:** Rate limit by IP or wedding; validate input; escape output. Guest actions are unauthenticated; dashboard is authenticated.

---

## 8. Implementation notes

- **Templates:** Start with 1–2 themes (e.g. current site as “Classic”); add more later. Section list should match existing components (Hero, Couple, Date, Location, Gallery, RSVP, Wishes, Gift, Music, etc.).
- **Migration:** Current app uses `lib/data.ts` and `lib/music.ts`; RSVP/wishes in Supabase. SaaS version loads content from DB per wedding; APIs accept or infer `wedding_id` (e.g. from host/slug or preview token).
- **Existing types** (`types/index.ts`: Couple, Event, GalleryImage, Wish, RSVPResponse) can be reused; add `wedding_id` (and any ids) for DB persistence.
