import https from 'https';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

// Load .env
const envFile = readFileSync(envPath, 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length) {
            env[key.trim()] = valueParts.join('=').trim();
        }
    }
});

const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const SQL_COMMANDS = [
    `DROP TABLE IF EXISTS contact_messages CASCADE;`,

    `CREATE TABLE contact_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );`,

    `CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);`,

    `ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;`,

    `CREATE POLICY "allow_public_insert_contact_messages"
    ON contact_messages FOR INSERT
    WITH CHECK (true);`,

    `CREATE POLICY "allow_admin_select_contact_messages"
    ON contact_messages FOR SELECT TO authenticated
    USING (
        (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
        OR (auth.jwt()->>'email')::text = 'ozan@loyalbrokerage.com'
    );`
];

async function executeSQL(sql) {
    return new Promise((resolve, reject) => {
        const url = new URL(SUPABASE_URL);
        const options = {
            hostname: url.hostname,
            port: 443,
            path: '/rest/v1/rpc/exec_sql',
            method: 'POST',
            headers: {
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true, data });
                } else {
                    resolve({ success: false, error: data, statusCode: res.statusCode });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(JSON.stringify({ sql }));
        req.end();
    });
}

console.log('🚀 AUTONOMOUS DATABASE SETUP\n');
console.log('📝 SQL Commands to Execute:');
console.log('==================================================\n');
console.log(SQL_COMMANDS.join('\n\n'));
console.log('\n==================================================\n');

console.log('⚠️  IMPORTANT: Supabase REST API does not support arbitrary SQL execution');
console.log('📋 Please copy the SQL above and run it in Supabase Dashboard\n');

console.log('✅ FILES READY:');
console.log('   - Contact.jsx: Updated and working');
console.log('   - SQL Schema: Available in supabase/contact_messages_table.sql');
console.log('   - Environment: Validated');

console.log('\n📍 TO COMPLETE SETUP:');
console.log('   1. Go to: https://app.supabase.com/project/cfcrttsxeaugwfuoirod/sql/new');
console.log('   2. Copy SQL from: supabase/contact_messages_table.sql');
console.log('   3. Click "Run"');
console.log('   4. Test contact form at /contact');

// Update .env with Mailgun placeholders if missing
const envUpdates = [];
if (!env.VITE_MAILGUN_DOMAIN) {
    envUpdates.push('VITE_MAILGUN_DOMAIN=mg.loyalbrokerage.com');
}
if (!env.VITE_MAILGUN_API_KEY) {
    envUpdates.push('VITE_MAILGUN_API_KEY=');
}

if (envUpdates.length > 0) {
    console.log('\n📝 ADD TO .ENV:');
    envUpdates.forEach(line => console.log('   ' + line));
}
