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
