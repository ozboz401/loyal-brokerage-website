CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON contact_messages(created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_public_insert_contact_messages" ON contact_messages;
CREATE POLICY "allow_public_insert_contact_messages"
  ON contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "allow_admin_select_contact_messages" ON contact_messages;
CREATE POLICY "allow_admin_select_contact_messages"
  ON contact_messages FOR SELECT TO authenticated
  USING (
    (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
    OR (auth.jwt()->>'email')::text = 'ozan@loyalbrokerage.com'
  );

