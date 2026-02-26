ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE;
ALTER TABLE wishes ADD COLUMN IF NOT EXISTS wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_rsvp_wedding_id ON rsvp(wedding_id);
CREATE INDEX IF NOT EXISTS idx_wishes_wedding_id ON wishes(wedding_id);
