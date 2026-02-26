# Wedding Invitation Website

A beautiful, modern wedding invitation website built with Next.js, Bun, GSAP, and Tailwind CSS. **SaaS mode**: create multiple weddings, each with its own dashboard and public invitation at a custom subdomain.

## Features

### SaaS (multi-tenant)

- **Dashboard** – Create weddings, edit content (couple, events, gallery, music), toggle and reorder sections, choose template.
- **User-editable subdomain** – Release a wedding to get a live site at `https://{slug}.yourdomain.com`.
- **Better Auth** – Sign up, sign in, sessions. Invite collaborators (owner/collaborator) per wedding.
- **Preview** – Draft weddings are previewable at `/preview/[id]` for collaborators.
- **Tenant-scoped RSVP & Wishes** – Each invitation has its own RSVPs and wishes; APIs accept optional `wedding_id`.

### Invitation (per wedding)

- 🎨 **Beautiful Design** – Modern, elegant design with smooth animations
- 📱 **Fully Responsive** – Works on all devices
- ✨ **GSAP Animations** – Scroll-triggered animations
- 💑 **Couple Profiles** – Bride and groom information
- 📸 **Photo Gallery** – Precious moments
- ⏰ **Countdown Timer** – Countdown to the big day
- 📍 **Location** – Event locations and map links
- ✅ **RSVP System** – Guest responses and stats (scoped by wedding)
- 🎁 **Gift Section** – Digital gift/envelope
- 💬 **Wishes** – Guest messages (scoped by wedding)
- 📺 **Live Streaming** – Placeholder for streaming
- 🎵 **Music Player** – Playlist support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Bun
- **Database**: Supabase (PostgreSQL)
- **Auth**: Better Auth (email/password, same Postgres)
- **Styling**: Tailwind CSS 4
- **Animations**: GSAP with ScrollTrigger
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Bun installed on your system ([Install Bun](https://bun.sh))

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun dev

# Build for production
bun build

# Start production server
bun start
```

The app will be available at `http://localhost:3000`

### Environment variables

Create `.env.local` with:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | (Optional) For server-side DB access |
| `BETTER_AUTH_SECRET` | Secret for Better Auth (e.g. `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `DATABASE_URL` | Postgres connection string (for Better Auth; can use Supabase connection string) |

See `.env.example` for a template.

### Database migrations

1. **Supabase (weddings, RSVP, wishes)**  
   Run the SQL in `supabase/migrations/` in order (Supabase SQL Editor or `supabase db push` if linked):
   - `20250226000000_weddings_and_collaborators.sql`
   - `20250226000001_rsvp_wishes_wedding_id.sql`
   Plus the existing `supabase/schema.sql` for the initial `rsvp` and `wishes` tables if needed.

2. **Better Auth (user, session)**  
   Run: `bunx @better-auth/cli migrate` (or use the CLI `generate` and apply the SQL manually). Requires `DATABASE_URL` and the same Postgres instance.

### Subdomain (production)

- Point a **wildcard DNS** record for your domain (e.g. `*.yourdomain.com`) to your app host.
- Use a **wildcard TLS** certificate (e.g. `*.yourdomain.com`). No per-wedding DNS or cert steps at release time.

Design and implementation plan: [docs/plans/2025-02-26-wedding-saas-design.md](docs/plans/2025-02-26-wedding-saas-design.md).

## Project Structure

```
wedding-invitation/
├── app/
│   ├── layout.tsx
│   ├── page.tsx            # Landing (redirects to /dashboard if logged in)
│   ├── (marketing)/        # Login, signup (redirect if logged in)
│   ├── dashboard/          # Wedding list, create, edit (content, layout, settings)
│   ├── demo/               # Demo invitation (static content from lib/data)
│   ├── invitation/         # Public invitation by subdomain (ClassicTemplate)
│   ├── preview/[id]/       # Draft preview for collaborators
│   └── api/                # auth, weddings, rsvp, wishes, music
├── components/             # Hero, CoupleSection, etc. + InvitationContext
├── lib/                    # auth, auth-client, data, music, wedding-defaults, supabase
├── supabase/migrations/    # weddings, wedding_collaborators, wedding_id on rsvp/wishes
├── middleware.ts           # Subdomain → /invitation with x-wedding-slug
└── docs/plans/             # Design and implementation plan
```

## Customization

### Update Couple Information

Edit `lib/data.ts` to update:
- Couple names and details
- Event dates and locations
- Gallery images
- Blessing messages

### Styling

The project uses Tailwind CSS. Customize colors and styles in:
- `app/globals.css` - Global styles
- Component files - Component-specific styles

### Images

Add your images to the `public/` directory:
- `public/hero-bg.jpg` - Hero background
- `public/bride.jpg` - Bride photo
- `public/groom.jpg` - Groom photo
- `public/gallery/` - Gallery images

## Backend API

- `POST /api/rsvp` – Submit RSVP (body may include `wedding_id` for tenant scope)
- `GET /api/rsvp` – Get RSVP list and stats (optional `?wedding_id=` for tenant scope)
- `POST /api/wishes` – Submit wish (body may include `wedding_id`)
- `GET /api/wishes` – Get wishes (optional `?wedding_id=`)
- `GET /api/music` – Get music playlist
- `POST /api/weddings` – Create wedding (auth required)
- `GET /api/weddings/[id]` – Get wedding (auth + collaborator)
- `PATCH /api/weddings/[id]` – Update wedding (auth + collaborator)
- `GET /api/weddings/check-slug?slug=` – Check slug availability (auth required)

See [BACKEND.md](./BACKEND.md) for detailed API documentation.

## Music Setup

1. Add your music files to `public/music/`
2. Add cover images (optional) to `public/music/covers/`
3. Update the song list in `lib/music.ts`

## Features to Implement

- [x] Database integration (Supabase/PostgreSQL) ✅
- [x] Admin dashboard (SaaS) ✅
- [ ] Image upload (dashboard gallery/couple photos)
- [ ] Google Maps API integration
- [ ] Live streaming platform integration
- [ ] Payment gateway for gifts
- [ ] Email notifications
- [ ] Invite collaborators by email
- [ ] Rate limiting and spam protection

## License

MIT License - feel free to use this for your wedding!

## Credits

Built with ❤️ using Next.js, Bun, and GSAP
