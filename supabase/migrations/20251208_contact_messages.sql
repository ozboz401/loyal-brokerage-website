-- ============================================================================
-- Contact Messages Table Migration
-- ============================================================================
-- Migration: contact_messages_table
-- Created: 2025-12-08
-- Description: Creates contact_messages table with RLS policies
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "allow_public_insert_contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "allow_admin_select_contact_messages" ON contact_messages;

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
-- Migration Complete
-- ============================================================================
