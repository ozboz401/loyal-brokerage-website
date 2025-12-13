
import fs from 'fs';
import path from 'path';

// Load .env manualy
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
} catch (e) { console.error("Env load error", e); }

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_URL = process.env.SUPABASE_URL;

if (!ACCESS_TOKEN || !PROJECT_URL) {
    console.error("Missing credentials.");
    process.exit(1);
}

// Extract Project Ref
// https://cfcrttsxeaugwfuoirod.supabase.co -> cfcrttsxeaugwfuoirod
const projectRef = PROJECT_URL.split('//')[1].split('.')[0];

console.log(`Connecting to Project: ${projectRef}`);

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
        throw new Error(`SQL Execution Failed: ${response.status} ${response.statusText} - ${text}`);
    }

    return await response.json();
}

async function verify() {
    try {
        // 1. SELECT 1
        console.log("1. Executing 'SELECT 1'...");
        const res1 = await runSql("SELECT 1 as check_val");
        console.log("   Result:", res1);

        // 2. List Tables
        console.log("2. Listing Tables...");
        const res2 = await runSql("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        // Result structure depends on API, usually { result: [ ... ] } or just array? 
        // Docs say keys are returned. output is usually a list of objects?
        // Let's create a formatted list.
        console.log("   Raw Table Response:", JSON.stringify(res2).substring(0, 200) + "...");

        let tables = [];
        if (Array.isArray(res2)) {
            tables = res2.map(r => r.table_name);
        } else if (res2.result) {
            tables = res2.result.map(r => r.table_name);
        }
        console.log("   Existing Tables:", tables.join(", "));

        // 3. Confirm Edge Functions (optional, just check if we can list them via management API if possible, or just assume SQL access is enough)
        // We verified SQL, which is the big one.
        console.log("3. SQL Capability Verified.");

        // Output for the agent to read
        console.log("FINAL_TABLE_LIST:", tables.join(", "));

    } catch (err) {
        console.error("❌ Verification Failed:", err.message);
        process.exit(1);
    }
}

verify();
