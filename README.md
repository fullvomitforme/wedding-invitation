# Wedding Invitation Website

A beautiful, modern wedding invitation website built with Next.js, Bun, GSAP, and Tailwind CSS.

## Features

- 🎨 **Beautiful Design** - Modern, elegant design with smooth animations
- 📱 **Fully Responsive** - Works perfectly on all devices
- ✨ **GSAP Animations** - Smooth scroll-triggered animations
- 💑 **Couple Profiles** - Showcase bride and groom information
- 📸 **Photo Gallery** - Display precious moments
- ⏰ **Countdown Timer** - Real-time countdown to the big day
- 📍 **Location Maps** - Google Maps integration for event locations
- ✅ **RSVP System** - Guest response and attendance tracking with backend API
- 🎁 **Gift Section** - Digital gift/envelope feature
- 💬 **Wishes** - Guest wishes and messages with backend storage
- 📺 **Live Streaming** - Integration for live ceremony streaming
- 🎵 **Music Player** - Background music player with playlist support
- 🔌 **Backend API** - RESTful API for RSVP and wishes management

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Bun
- **Database**: Supabase (PostgreSQL)
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

## Project Structure

```
wedding-invitation/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── Navigation.tsx      # Navigation bar
│   ├── Hero.tsx            # Hero section
│   ├── CoupleSection.tsx   # Couple profiles
│   ├── GallerySection.tsx  # Photo gallery
│   ├── DateSection.tsx     # Countdown timer
│   ├── LocationSection.tsx # Event locations
│   ├── RSVPSection.tsx     # RSVP form
│   ├── LiveStreamingSection.tsx
│   ├── GiftSection.tsx     # Gift section
│   └── WishesSection.tsx   # Guest wishes
├── lib/
│   └── data.ts             # Sample data
└── types/
    └── index.ts            # TypeScript types
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

The project includes a backend API with the following endpoints:

- `POST /api/rsvp` - Submit RSVP responses
- `GET /api/rsvp` - Get RSVP statistics
- `POST /api/wishes` - Submit wishes
- `GET /api/wishes` - Get all wishes
- `GET /api/music` - Get music playlist

See [BACKEND.md](./BACKEND.md) for detailed API documentation.

## Music Setup

1. Add your music files to `public/music/`
2. Add cover images (optional) to `public/music/covers/`
3. Update the song list in `lib/music.ts`

## Features to Implement

- [x] Database integration (Supabase/PostgreSQL) ✅
- [ ] Image upload functionality
- [ ] Google Maps API integration
- [ ] Live streaming platform integration
- [ ] Payment gateway for gifts
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Rate limiting and spam protection

## License

MIT License - feel free to use this for your wedding!

## Credits

Built with ❤️ using Next.js, Bun, and GSAP
