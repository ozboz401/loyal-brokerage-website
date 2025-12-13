
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

const ADMIN_EMAIL = 'ozan@loyalbrokerage.com';

const sql = `
-- 1. Enable RLS on carrier_applications
ALTER TABLE public.carrier_applications ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy for Admin Read Access
-- (Drop first to avoid conflicts)
DROP POLICY IF EXISTS "Admin Read Access" ON public.carrier_applications;

CREATE POLICY "Admin Read Access"
ON public.carrier_applications
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = '${ADMIN_EMAIL}');

-- 3. Block Insert/Update/Delete via API for now (unless purely server-side service role)
-- Service Role bypasses RLS, so this policy mainly affects Client usage.
-- We want Public to INSERT (Carrier Signup Form)! 
-- Wait! The carrier signup form uses the anon key. 
-- Schema says: "Enable RLS = off (table is admin-only; frontend does not write here directly)".
-- Actually, frontend inserts rows?
-- Re-reading CarrierSignup.jsx logic (it submits to 'submitCarrierApplication.js').
-- submitCarrierApplication.js uses 'supabase.from(...).insert()'. 
-- If we use the standard anon client (which we standardized to), RLS will block insert unless we allow it.

-- POLICY: Allow Public Insert (Anon)
DROP POLICY IF EXISTS "Public Insert Carrier Apps" ON public.carrier_applications;

CREATE POLICY "Public Insert Carrier Apps"
ON public.carrier_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- POLICY: Deny Update/Delete for Public (Implicit default deny, but good to be sure)
-- No policy = deny.

-- 4. Enable RLS on storage objects (carrier_docs) in case missed
-- (We did this in previous step, leniently. Let's tighten if needed, but 'Public Upload' is required for the form).
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

async function secureDatabase() {
    console.log("Securing Database (Row Level Security)...");
    try {
        const result = await runSql(sql);
        console.log("SQL Result (RLS Setup):", JSON.stringify(result));
        console.log(`✅ RLS Enabled. Admin Policy set for: ${ADMIN_EMAIL}`);
        console.log("✅ Public Insert Policy set (for signup form).");
    } catch (e) {
        console.error("Security Setup Failed:", e);
    }
}

secureDatabase();
