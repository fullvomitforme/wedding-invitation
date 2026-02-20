# Supabase Setup Guide

This project uses Supabase as the backend database. Follow these steps to set it up.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `wedding-invitation` (or your preferred name)
   - Database Password: Choose a strong password (save it!)
   - Region: Choose the closest region to your users
4. Wait for the project to be created (takes a few minutes)

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (optional, for admin operations) → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the SQL

This will create:

- `rsvp` table for RSVP submissions
- `wishes` table for guest wishes
- Indexes for better performance
- Row Level Security (RLS) policies for public access

## 5. Verify Tables Are Created

1. Go to **Table Editor** in your Supabase dashboard
2. You should see two tables: `rsvp` and `wishes`
3. Check that the columns match the schema

## 6. Test the Setup

1. Start your development server:

   ```bash
   bun dev
   ```

2. Test the API endpoints:
   - Submit an RSVP through the website
   - Submit a wish through the website
   - Check your Supabase dashboard → Table Editor to see the data

## Database Schema

### RSVP Table

- `id` (UUID, Primary Key)
- `name` (TEXT, Required)
- `attendance` (TEXT, Required: 'yes' | 'no' | 'maybe')
- `guest_count` (INTEGER, Default: 0)
- `message` (TEXT, Optional)
- `submitted_at` (TIMESTAMP, Auto-generated)

### Wishes Table

- `id` (UUID, Primary Key)
- `name` (TEXT, Required)
- `location` (TEXT, Required)
- `message` (TEXT, Required)
- `created_at` (TIMESTAMP, Auto-generated)

## Row Level Security (RLS)

The tables have RLS enabled with public read/write policies:

- Anyone can read RSVP and wishes data
- Anyone can insert RSVP and wishes data
- No authentication required (suitable for wedding invitations)

For production, consider:

- Adding rate limiting
- Adding spam protection
- Restricting write access to authenticated users only

## Troubleshooting

### "Missing Supabase environment variables"

- Make sure `.env.local` exists and has the correct variable names
- Restart your development server after adding environment variables

### "Failed to submit RSVP/Wish"

- Check that the tables exist in your Supabase dashboard
- Verify RLS policies are set correctly
- Check the browser console and server logs for detailed error messages

### "relation does not exist"

- Run the SQL schema from `supabase/schema.sql` in the SQL Editor
- Make sure you're connected to the correct database

## Next Steps

- Set up database backups in Supabase dashboard
- Consider adding email notifications when RSVPs are submitted
- Add admin dashboard to view/manage submissions
- Set up database functions for analytics
