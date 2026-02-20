-- Create RSVP table
CREATE TABLE IF NOT EXISTS rsvp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('yes', 'no', 'maybe')),
  guest_count INTEGER DEFAULT 0,
  message TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Wishes table
CREATE TABLE IF NOT EXISTS wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rsvp_submitted_at ON rsvp(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvp_attendance ON rsvp(attendance);

-- Enable Row Level Security (RLS)
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access
-- Allow anyone to read RSVP data
CREATE POLICY "Allow public read access to rsvp"
  ON rsvp FOR SELECT
  USING (true);

-- Allow anyone to insert RSVP data
CREATE POLICY "Allow public insert access to rsvp"
  ON rsvp FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read wishes
CREATE POLICY "Allow public read access to wishes"
  ON wishes FOR SELECT
  USING (true);

-- Allow anyone to insert wishes
CREATE POLICY "Allow public insert access to wishes"
  ON wishes FOR INSERT
  WITH CHECK (true);
