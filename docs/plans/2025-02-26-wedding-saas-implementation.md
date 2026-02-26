# Wedding Invitation SaaS – Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the wedding invitation SaaS from the design in `docs/plans/2025-02-26-wedding-saas-design.md`: dashboard (content + section toggles + template), Better Auth, user-editable subdomain on release, multi-tenant RSVP/wishes, and public invitation at `{slug}.yourproduct.com`.

**Architecture:** Same Next.js app serves the marketing/dashboard and all wedding sites. Host-based routing: main domain = app/dashboard; subdomain = resolve wedding by slug and render template + sections. Better Auth uses the existing Supabase Postgres for user/session tables; new tables for weddings and wedding_collaborators; rsvp/wishes get `wedding_id`. No test framework in project; verification is manual (run dev, curl, check DB).

**Tech Stack:** Next.js 16 (App Router), Bun, TypeScript, Tailwind CSS 4, Supabase (Postgres + Storage), Better Auth.

**Design reference:** `docs/plans/2025-02-26-wedding-saas-design.md`

---

## Phase 1 – Database and Better Auth

### Task 1: Add Better Auth dependency and env

**Files:**
- Modify: `package.json`
- Create: `.env.example` (optional; document new vars)

**Step 1: Install Better Auth**

Run: `bun add better-auth`

**Step 2: Document env vars**

Add to `.env.example` (create if missing) or README: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (e.g. `http://localhost:3000` for dev). Better Auth will use `DATABASE_URL` or Supabase connection; document the chosen approach (e.g. Supabase connection string for Better Auth).

**Step 3: Commit**

```bash
git add package.json .env.example
git commit -m "chore: add better-auth dependency and env docs"
```

---

### Task 2: Supabase migration – weddings and wedding_collaborators

**Files:**
- Create: `supabase/migrations/20250226000000_weddings_and_collaborators.sql`

**Step 1: Create migration file**

Create `supabase/migrations/20250226000000_weddings_and_collaborators.sql` with:

```sql
-- Weddings table (content + config stored as JSONB for flexibility; can normalize later)
CREATE TABLE IF NOT EXISTS weddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'released')),
  template_id TEXT NOT NULL DEFAULT 'classic',
  sections JSONB NOT NULL DEFAULT '[]',
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);
CREATE INDEX IF NOT EXISTS idx_weddings_status ON weddings(status);

-- wedding_collaborators: who can access which wedding
CREATE TABLE IF NOT EXISTS wedding_collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'collaborator')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wedding_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_wedding_collaborators_user ON wedding_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_wedding_collaborators_wedding ON wedding_collaborators(wedding_id);
```

**Step 2: Apply migration**

Run migration against your Supabase project (Supabase CLI: `supabase db push` or run the SQL in Supabase SQL Editor). Document in plan or README if using SQL Editor.

**Step 3: Commit**

```bash
git add supabase/migrations/20250226000000_weddings_and_collaborators.sql
git commit -m "feat(db): add weddings and wedding_collaborators tables"
```

---

### Task 3: Supabase migration – add wedding_id to rsvp and wishes

**Files:**
- Create: `supabase/migrations/20250226000001_rsvp_wishes_wedding_id.sql`

**Step 1: Create migration**

Content:

```sql
ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE;
ALTER TABLE wishes ADD COLUMN IF NOT EXISTS wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_rsvp_wedding_id ON rsvp(wedding_id);
CREATE INDEX IF NOT EXISTS idx_wishes_wedding_id ON wishes(wedding_id);
```

**Step 2: Apply migration** (same as Task 2).

**Step 3: Commit**

```bash
git add supabase/migrations/20250226000001_rsvp_wishes_wedding_id.sql
git commit -m "feat(db): add wedding_id to rsvp and wishes"
```

---

### Task 4: Configure Better Auth with Supabase adapter

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...all]/route.ts`

**Step 1: Implement Better Auth server config**

In `lib/auth.ts`: use `betterAuth` with database adapter for Postgres (Supabase). Configure session, user table, and (if needed) account table. Use env: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. See Better Auth docs for Supabase/Postgres adapter.

**Step 2: Create catch-all API route**

In `app/api/auth/[...all]/route.ts`: export the handler from the auth instance (e.g. `export const { GET, POST } = auth.handler`).

**Step 3: Verify**

Run `bun run dev`. Open `http://localhost:3000/api/auth/get-session` (or equivalent). Expect JSON (e.g. null when not logged in). No 500.

**Step 4: Commit**

```bash
git add lib/auth.ts app/api/auth/[...all]/route.ts
git commit -m "feat(auth): configure Better Auth with Supabase adapter"
```

---

### Task 5: Better Auth client and session helper

**Files:**
- Create: `lib/auth-client.ts`
- Create: `app/components/Providers.tsx` (optional; only if you need a client session provider)

**Step 1: Create auth client**

In `lib/auth-client.ts`: create and export the Better Auth client (e.g. `createAuthClient`) configured with the same base URL. Export `signIn`, `signOut`, `getSession` (or equivalent).

**Step 2: (Optional) Session provider**

If the dashboard needs client-side session, wrap with a provider that uses the client’s session. Otherwise skip and use server-side session only.

**Step 3: Commit**

```bash
git add lib/auth-client.ts app/components/Providers.tsx
git commit -m "feat(auth): add Better Auth client and optional session provider"
```

---

## Phase 2 – Auth UI and dashboard shell

### Task 6: Login and sign-up pages

**Files:**
- Create: `app/(marketing)/login/page.tsx`
- Create: `app/(marketing)/signup/page.tsx`
- Modify: `app/layout.tsx` (optional; add layout group if you introduce `(marketing)`)

**Step 1: Login page**

Simple form: email, password. On submit call Better Auth client `signIn` (e.g. credentials). On success redirect to `/dashboard`. Link to sign-up.

**Step 2: Sign-up page**

Form: email, password (and confirm if desired). On submit register via Better Auth. On success redirect to `/dashboard` or login.

**Step 3: Verify**

Run dev. Open `/login`, submit; open `/signup`, register. After login, redirect to dashboard (Task 7 will create it).

**Step 4: Commit**

```bash
git add app/\(marketing\)/login/page.tsx app/\(marketing\)/signup/page.tsx
git commit -m "feat(auth): add login and signup pages"
```

---

### Task 7: Dashboard layout and auth guard

**Files:**
- Create: `app/dashboard/layout.tsx`
- Create: `app/dashboard/page.tsx`

**Step 1: Dashboard layout**

In `app/dashboard/layout.tsx`: get session server-side (Better Auth server API). If no session, redirect to `/login`. Render children; add simple nav (e.g. “Dashboard”, “Log out” linking to signOut then redirect).

**Step 2: Dashboard home page**

In `app/dashboard/page.tsx`: fetch weddings where current user is in `wedding_collaborators` (join weddings + wedding_collaborators by user_id from session). Display list: title (from content or “Untitled”), slug, status (Draft/Released), links: Edit, Preview, View site (if released). “New wedding” button.

**Step 3: Wire “New wedding”**

“New wedding” can link to an API or page that creates a wedding (Task 8). For now a link or button is enough; implement create in Task 8.

**Step 4: Verify**

Run dev. Log in. Open `/dashboard`. See empty list (or seeded wedding). No redirect loop.

**Step 5: Commit**

```bash
git add app/dashboard/layout.tsx app/dashboard/page.tsx
git commit -m "feat(dashboard): layout and home with wedding list and auth guard"
```

---

### Task 8: Create wedding API and flow

**Files:**
- Create: `app/api/weddings/route.ts`
- Modify: `app/dashboard/page.tsx` (or add client action)

**Step 1: POST /api/weddings**

In `app/api/weddings/route.ts`: require session (Better Auth). Parse body (optional title/couple names for content). Insert into `weddings`: default `status: draft`, `template_id: classic`, `sections` default list (e.g. from design), `content: {}`. Insert into `wedding_collaborators`: current user, role `owner`. Return wedding id and slug (null).

**Step 2: Dashboard “New wedding”**

On “New wedding” click: POST to `/api/weddings`, then redirect to `/dashboard/weddings/[id]` (edit area).

**Step 3: Verify**

Create a wedding from dashboard. Confirm row in `weddings` and `wedding_collaborators`. Redirect to edit page (Task 9 will create edit shell).

**Step 4: Commit**

```bash
git add app/api/weddings/route.ts app/dashboard/page.tsx
git commit -m "feat(dashboard): create wedding API and new-wedding flow"
```

---

### Task 9: Dashboard wedding edit shell (single wedding)

**Files:**
- Create: `app/dashboard/weddings/[id]/layout.tsx`
- Create: `app/dashboard/weddings/[id]/page.tsx`

**Step 1: Edit layout**

In `app/dashboard/weddings/[id]/layout.tsx`: get session; load wedding by id; check user in `wedding_collaborators` for this wedding. If not found or no access, 404 or redirect to dashboard. Render sidebar or tabs: Content, Layout, Settings, Preview link. Pass wedding to children or context.

**Step 2: Edit page**

In `app/dashboard/weddings/[id]/page.tsx`: show wedding title/slug and link to sub-pages (e.g. content, layout, settings). For now a placeholder “Content” section is enough.

**Step 3: Verify**

Open `/dashboard/weddings/<uuid>`. See edit shell and placeholder. Owner can see it.

**Step 4: Commit**

```bash
git add app/dashboard/weddings/\[id\]/layout.tsx app/dashboard/weddings/\[id\]/page.tsx
git commit -m "feat(dashboard): wedding edit layout and placeholder page"
```

---

## Phase 3 – Wedding content and config

### Task 10: Default content and sections schema

**Files:**
- Create: `lib/wedding-defaults.ts`
- Modify: `app/api/weddings/route.ts` (use defaults on create)

**Step 1: Define defaults**

In `lib/wedding-defaults.ts`: export `defaultSections` (array of `{ id, enabled, order }` for Hero, Couple, Date, Location, Gallery, RSVP, Wishes, Gift, Music). Export `defaultContent` shape (couple: { bride, groom }, events: [], gallery: [], music: [], etc.) matching existing `types/index.ts` and `lib/data.ts` shape so existing components can consume it.

**Step 2: Use on create**

In `app/api/weddings/route.ts`: when inserting wedding, set `sections` and `content` from these defaults.

**Step 3: Commit**

```bash
git add lib/wedding-defaults.ts app/api/weddings/route.ts
git commit -m "feat(wedding): default content and sections schema"
```

---

### Task 11: PATCH /api/weddings/[id] for content and config

**Files:**
- Create: `app/api/weddings/[id]/route.ts`

**Step 1: GET wedding**

GET: require session; check wedding_collaborators; return wedding (id, slug, status, template_id, sections, content).

**Step 2: PATCH wedding**

PATCH: require session; check wedding_collaborators; accept body: optional `content`, `sections`, `template_id`, `slug`, `status`. Validate slug format and uniqueness (if slug provided). Update `weddings` set only provided fields; set `updated_at`. Return updated wedding.

**Step 3: Verify**

curl PATCH with session cookie (or from dashboard later). Confirm DB update.

**Step 4: Commit**

```bash
git add app/api/weddings/\[id\]/route.ts
git commit -m "feat(api): PATCH weddings for content, sections, template, slug"
```

---

### Task 12: Dashboard – Content form (couple + events)

**Files:**
- Create: `app/dashboard/weddings/[id]/content/page.tsx`
- Modify: `app/dashboard/weddings/[id]/page.tsx` (link to content)

**Step 1: Content page**

Load wedding (GET from API or server). Form fields for: bride name, username, parentInfo, location, image URL (or upload later); groom same; main event date; events array (title, date, time, location, address, mapsUrl). Save via PATCH `/api/weddings/[id]` with updated `content`.

**Step 2: Verify**

Edit couple and one event, save. Reload; data persists.

**Step 3: Commit**

```bash
git add app/dashboard/weddings/\[id\]/content/page.tsx
git commit -m "feat(dashboard): content form for couple and events"
```

---

### Task 13: Dashboard – Layout (section toggles and order)

**Files:**
- Create: `app/dashboard/weddings/[id]/layout-sections/page.tsx`

**Step 1: Sections page**

Load wedding sections. List sections with checkbox (enabled) and drag-handle or up/down for order. Save via PATCH with new `sections` array.

**Step 2: Verify**

Toggle a section off, reorder, save. PATCH returns updated sections.

**Step 3: Commit**

```bash
git add app/dashboard/weddings/\[id\]/layout-sections/page.tsx
git commit -m "feat(dashboard): section toggles and order"
```

---

### Task 14: Dashboard – Settings and Release

**Files:**
- Create: `app/dashboard/weddings/[id]/settings/page.tsx`

**Step 1: Settings page**

Show slug input (user-editable). Validation: format `^[a-z0-9-]+$`, length, reserved list (www, api, app, dashboard, admin). Check uniqueness via API (e.g. GET or dedicated endpoint). Preview text: “Your site will be at https://{slug}.yourproduct.com”. Button “Release”: only enabled when slug valid and unique; PATCH `status: released`. Link “View site” when released.

**Step 2: Slug uniqueness API**

Add GET `app/api/weddings/check-slug/route.ts`?slug=xxx (optional). Or handle in PATCH validation and return 409 if taken.

**Step 3: Verify**

Set slug, release. Wedding status = released. “View site” opens correct URL (subdomain routing in Phase 4).

**Step 4: Commit**

```bash
git add app/dashboard/weddings/\[id\]/settings/page.tsx app/api/weddings/check-slug/route.ts
git commit -m "feat(dashboard): settings, slug validation, release"
```

---

## Phase 4 – Public site and subdomain

### Task 15: Middleware – host to slug and layout routing

**Files:**
- Create: `middleware.ts` (at project root)

**Step 1: Implement middleware**

Read `Host` header. If host is main domain (e.g. `localhost:3000` or `yourproduct.com`), continue. If subdomain (e.g. `slug.localhost:3000` or `slug.yourproduct.com`), set header `x-wedding-slug` to the subdomain part and rewrite or continue to a route that handles invitations (e.g. `/invitation` with slug from header). Use Next.js `NextResponse.next()` and set request headers so the invitation route can read slug.

**Step 2: Invitation route**

Create `app/invitation/page.tsx` (or `app/(invitation)/invitation/page.tsx`). In this route, read `x-wedding-slug` from headers; fetch wedding by slug where status = released. If not found, 404. Render a placeholder “Invitation for {slug}” until Task 16.

**Step 3: Verify**

Run dev. For subdomain testing locally, use `slug.localhost:3000` (or document hosts file). Ensure middleware sets slug and invitation page loads (or 404 for unknown slug).

**Step 4: Commit**

```bash
git add middleware.ts app/invitation/page.tsx
git commit -m "feat(site): middleware subdomain to slug, invitation route placeholder"
```

---

### Task 16: Invitation page – load wedding and render template + sections

**Files:**
- Modify: `app/invitation/page.tsx`
- Create: `app/invitation/ClassicTemplate.tsx` (or under `components/invitation/`)

**Step 1: Fetch wedding**

In invitation page (server component): get slug from headers; query wedding by slug, status = released. Fetch content, template_id, sections. If draft or not found, 404.

**Step 2: Template component**

Create ClassicTemplate: accepts wedding (content, sections). Iterate sections in order; for each enabled section id, render the matching component (reuse or adapt from existing: Hero, CoupleSection, DateSection, LocationSection, GallerySection, RSVPSection, WishesSection, GiftSection, MusicPlayer). Pass content into each. Use existing `components/` where possible.

**Step 3: Wire RSVP/Wishes to wedding_id**

Invitation page or layout must provide wedding_id to client (e.g. data attribute or context) so RSVP and Wishes forms can send wedding_id in API calls. Task 17 updates APIs.

**Step 4: Verify**

Release a wedding with slug, open subdomain. See full invitation with sections. RSVP/Wishes still point to current API (single-tenant); Task 17 fixes.

**Step 5: Commit**

```bash
git add app/invitation/page.tsx app/invitation/ClassicTemplate.tsx
git commit -m "feat(invitation): render classic template with sections and content"
```

---

### Task 17: RSVP and Wishes APIs – tenant-scoped by wedding_id

**Files:**
- Modify: `app/api/rsvp/route.ts`
- Modify: `app/api/wishes/route.ts`

**Step 1: RSVP**

POST: require `wedding_id` in body (or header). Validate uuid; insert with wedding_id. GET: require `wedding_id` query param; filter by wedding_id; return list and stats for that wedding only.

**Step 2: Wishes**

POST: require `wedding_id` in body (or header). Insert with wedding_id. GET: require `wedding_id` query param; filter by wedding_id.

**Step 3: Invitation frontend**

Ensure invitation page sends wedding_id when calling POST/GET rsvp and wishes (from wedding id in page data).

**Step 4: Verify**

Open two weddings (different slugs). Submit RSVP and wish for each; confirm each invitation shows only its own data.

**Step 5: Commit**

```bash
git add app/api/rsvp/route.ts app/api/wishes/route.ts
git commit -m "feat(api): scope RSVP and wishes by wedding_id"
```

---

### Task 18: Preview route (draft invitation by id)

**Files:**
- Create: `app/preview/[id]/page.tsx`

**Step 1: Preview page**

Load wedding by id (not slug). Do not require status = released. Check that current user is in wedding_collaborators (session). If no access, 404 or redirect. Render same template + sections as invitation page (reuse component). Pass wedding_id to RSVP/Wishes so preview can test forms; optionally use a preview-only flag so data doesn’t mix with production (or use same wedding_id and accept test data).

**Step 2: Link from dashboard**

Edit shell “Preview” link points to `/preview/[id]`.

**Step 3: Verify**

Open `/preview/<uuid>` while logged in as owner. See invitation. Toggle sections in dashboard, preview again; sections update.

**Step 4: Commit**

```bash
git add app/preview/\[id\]/page.tsx
git commit -m "feat(site): preview route for draft weddings"
```

---

## Phase 5 – Polish and docs

### Task 19: Main app landing and redirects

**Files:**
- Modify: `app/page.tsx`
- Optional: `app/(marketing)/page.tsx`

**Step 1: Landing**

Current `app/page.tsx` is the single wedding invitation. For SaaS, root can be a landing/marketing page: “Create your wedding invitation”, Login, Sign up. Move current single-invitation content to a dedicated route (e.g. `app/demo/page.tsx`) or keep as default for backward compatibility and add a “Go to dashboard” for logged-in users. Choose one: (A) root = marketing, (B) root = existing invitation (demo), dashboard link in nav. Document choice.

**Step 2: Logged-in redirect**

If user is logged in and visits `/login` or `/`, redirect to `/dashboard`.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(app): landing and auth redirects"
```

---

### Task 20: README and env docs

**Files:**
- Modify: `README.md`
- Modify: `docs/plans/2025-02-26-wedding-saas-design.md` (optional: add “Implemented” section)

**Step 1: Update README**

Describe SaaS features: dashboard, multi-tenant, subdomain, Better Auth. List env: `NEXT_PUBLIC_SUPABASE_*`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and (if used) `SUPABASE_SERVICE_ROLE_KEY`. Document running migrations. Link to design doc.

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README and env for SaaS"
```

---

## Execution summary

- **Total tasks:** 20 (Phase 1: 5, Phase 2: 4, Phase 3: 5, Phase 4: 4, Phase 5: 2).
- **Verification:** No test suite; each task uses “run dev”, curl, or DB check. Add Vitest later if desired.
- **Order:** Follow phases; within a phase, tasks are sequential where noted (e.g. Task 8 before Task 9).

---

**Plan complete and saved to `docs/plans/2025-02-26-wedding-saas-implementation.md`.**

**Two execution options:**

1. **Subagent-driven (this session)** – Dispatch a fresh subagent per task (or per phase), review between tasks, fast iteration.
2. **Parallel session (separate)** – Open a new session in the same repo (or worktree), use executing-plans skill, batch execution with checkpoints.

Which approach do you want?
