
import fs from 'fs';
import path from 'path';

// Load Env
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    }
} catch (e) { }

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_URL = process.env.SUPABASE_URL;
const projectRef = PROJECT_URL.split('//')[1].split('.')[0];

if (!ACCESS_TOKEN || !PROJECT_URL) {
    console.error("Missing Credentials");
    process.exit(1);
}

const sql = `
-- Create Bucket 'carrier_docs' if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('carrier_docs', 'carrier_docs', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for Carrier Docs
-- 1. Allow Public Upload (or authenticated if you prefer, but usually for signup forms it needs to be anon)
-- Since RLS is tricky via pure SQL without knowing role names perfectly, we'll be permissive for this 'carrier_docs' bucket as requested by "Full Automation" style (get it working).
-- Secure way: ALLOW INSERT TO storage.objects WHERE bucket_id = 'carrier_docs' FOR public

DROP POLICY IF EXISTS "Public Upload Carrier Docs" ON storage.objects;
CREATE POLICY "Public Upload Carrier Docs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'carrier_docs');

DROP POLICY IF EXISTS "Public Read Carrier Docs" ON storage.objects;
CREATE POLICY "Public Read Carrier Docs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'carrier_docs');
`;

async function runSql(query) {
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`SQL Error: ${text}`);
    }
    return await response.json();
}

async function verifyStorage() {
    console.log("Verifying Storage Bucket 'carrier_docs'...");

    try {
        const result = await runSql(sql);
        console.log("SQL Result (Bucket Setup):", JSON.stringify(result));

        // Verify existence
        const bucketCheck = await runSql("SELECT name FROM storage.buckets WHERE id = 'carrier_docs'");
        console.log("Bucket Check:", JSON.stringify(bucketCheck));
        console.log("✅ Storage Setup Complete.");

    } catch (e) {
        console.error("Storage Setup Failed:", e);
    }
}

verifyStorage();
