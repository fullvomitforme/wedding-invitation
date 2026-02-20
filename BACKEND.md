# Backend API Documentation

This wedding invitation website includes a backend API built with Next.js API Routes and **Supabase** as the database.

## Database

The project uses **Supabase** (PostgreSQL) for data storage. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for setup instructions.

## API Endpoints

### RSVP API

#### POST `/api/rsvp`
Submit an RSVP response.

**Request Body:**
```json
{
  "name": "John Doe",
  "attendance": "yes" | "no" | "maybe",
  "guestCount": 2,
  "message": "Looking forward to celebrating with you!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "RSVP submitted successfully",
  "data": {
    "name": "John Doe",
    "attendance": "yes",
    "guestCount": 2,
    "message": "Looking forward to celebrating with you!",
    "submittedAt": "2026-02-20T10:30:00.000Z"
  }
}
```

#### GET `/api/rsvp`
Get all RSVP responses and statistics.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "statistics": {
    "totalResponses": 50,
    "attending": 45,
    "totalGuests": 89
  }
}
```

### Wishes API

#### POST `/api/wishes`
Submit a wish/message.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "location": "Jakarta",
  "message": "Congratulations! Wishing you a lifetime of happiness!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Wish submitted successfully",
  "data": {
    "id": "1234567890",
    "name": "Jane Smith",
    "location": "Jakarta",
    "message": "Congratulations! Wishing you a lifetime of happiness!",
    "createdAt": "2026-02-20T10:30:00.000Z"
  }
}
```

#### GET `/api/wishes`
Get all wishes.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 25
}
```

### Music API

#### GET `/api/music`
Get available songs for the music player.

**Response:**
```json
{
  "success": true,
  "songs": [
    {
      "id": "1",
      "title": "A Thousand Years",
      "artist": "Christina Perri",
      "url": "/music/a-thousand-years.mp3",
      "cover": "/music/covers/a-thousand-years.jpg"
    }
  ]
}
```

## Data Storage

Data is stored in JSON files in the `data/` directory:
- `data/rsvp.json` - RSVP submissions
- `data/wishes.json` - Wishes/messages

## Adding Music Files

1. Place your music files in `public/music/`
2. Optionally add cover images in `public/music/covers/`
3. Update the song list in `lib/music.ts`

Example structure:
```
public/
  music/
    a-thousand-years.mp3
    perfect.mp3
    covers/
      a-thousand-years.jpg
      perfect.jpg
```

## Production Considerations

For production, consider:

1. ✅ **Database**: Using Supabase (PostgreSQL) ✅
2. **Authentication**: Add authentication for admin endpoints
3. **Rate Limiting**: Implement rate limiting to prevent spam (Supabase has built-in rate limiting)
4. **Validation**: Add more robust input validation
5. **File Upload**: Add file upload for music and images (Supabase Storage)
6. **CDN**: Use a CDN for music files
7. **Caching**: Add caching for frequently accessed data
8. **Backups**: Set up automatic backups in Supabase dashboard
9. **Monitoring**: Use Supabase dashboard to monitor database performance

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# Optional: Database URL (if using a database)
DATABASE_URL=postgresql://...

# Optional: API keys
GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Testing the API

You can test the API endpoints using curl or any HTTP client:

```bash
# Submit RSVP
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","attendance":"yes","guestCount":2}'

# Get RSVPs
curl http://localhost:3000/api/rsvp

# Submit Wish
curl -X POST http://localhost:3000/api/wishes \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","location":"Jakarta","message":"Congratulations!"}'

# Get Wishes
curl http://localhost:3000/api/wishes
```
