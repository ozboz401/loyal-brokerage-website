// using global fetch
const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = 'cfcrttsxeaugwfuoirod';

const sql = `
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

DO $$
BEGIN
    DROP POLICY IF EXISTS "allow_public_insert_contact_messages" ON contact_messages;
    DROP POLICY IF EXISTS "allow_admin_select_contact_messages" ON contact_messages;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

CREATE POLICY "allow_public_insert_contact_messages"
  ON contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_admin_select_contact_messages"
  ON contact_messages FOR SELECT TO authenticated
  USING (
    (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
    OR (auth.jwt()->>'email')::text = 'ozan@loyalbrokerage.com'
  );

GRANT INSERT ON contact_messages TO anon, authenticated, service_role;
GRANT SELECT ON contact_messages TO anon, authenticated, service_role;
`;

console.log("Deploying Schema via API...");
fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
}).then(async r => {
    console.log('Status:', r.status);
    const text = await r.text();
    console.log('Response:', text);
    if (!r.ok) {
        console.error("Deployment Failed!");
        process.exit(1);
    }
    console.log("Deployment Successful!");
});
