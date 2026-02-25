# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Single Next.js 16 (App Router) wedding invitation website with TypeScript, Tailwind CSS 4, GSAP animations, and Supabase (PostgreSQL) backend. See `README.md` for full feature list.

### Running the app

- **Dev server**: `bun run dev` (runs on `http://localhost:3000`)
- **Lint**: `bun run lint` (ESLint 9)
- **Build**: `bun run build`
- Scripts are defined in `package.json`.

### Key caveats

- **Bun is required.** The lockfile is `bun.lock`; use `bun install` for dependency installation.
- **Supabase env vars**: The app requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. These are injected as environment secrets. Without real credentials, the frontend renders fully but RSVP and Wishes API calls (`/api/rsvp`, `/api/wishes`) will fail at runtime. The `/api/music` endpoint works without Supabase. To create `.env.local`, run: `printf 'NEXT_PUBLIC_SUPABASE_URL=%s\nNEXT_PUBLIC_SUPABASE_ANON_KEY=%s\n' "$NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_ANON_KEY" > .env.local`
- **No test framework**: The project has no automated test suite or test dependencies.
- **Existing lint issues**: The codebase has 1 `no-explicit-any` error and 10 warnings (unused vars, `<img>` vs `<Image />`, React hook deps). These are pre-existing.
- The Supabase client (`lib/supabase.ts`) is only imported in API routes, so the frontend pages load correctly with placeholder env vars (Supabase module is lazy-loaded on route hit).
- The Wishes/RSVP forms use optimistic UI updates (wishes appear in the local component state immediately), so form interaction appears to work even without a live Supabase connection.
