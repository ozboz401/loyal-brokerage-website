-- ============================================================================
-- CONTACT MESSAGES TABLE - CORRECTED VERSION
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at 
ON contact_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone (including anonymous) to insert messages
CREATE POLICY "allow_public_insert_contact_messages"
ON contact_messages
FOR INSERT
WITH CHECK (true);

-- Policy: Only admins can SELECT messages
CREATE POLICY "allow_admin_select_contact_messages"
ON contact_messages
FOR SELECT
TO authenticated
USING (
    (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
    OR (auth.jwt()->>'email')::text = 'ozan@loyalbrokerage.com'
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Run this to verify table exists:
-- SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 10;
-- ============================================================================
