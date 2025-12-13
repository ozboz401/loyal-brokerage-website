
import { createClient } from "@supabase/supabase-js";
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

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
    console.log("Missing Credentials");
    process.exit(1);
}

const ADMIN_EMAIL = 'ozan@loyalbrokerage.com';
const ADMIN_PASSWORD = 'admin_password_123';

async function runQa() {
    console.log("--- RLS Enforcement QA ---");

    // Test 1: Anonymous Access (Should FAIL/Empty)
    console.log("1. Testing Anonymous Access...");
    const anonClient = createClient(SUPABASE_URL, ANON_KEY);
    const { data: anonData, error: anonError } = await anonClient.from('carrier_applications').select('*').limit(1);

    if (anonError) {
        console.log("   ✅ Blocked (Error):", anonError.message);
    } else if (anonData.length === 0) {
        console.log("   ✅ Blocked (Empty Result - RLS filtered).");
    } else {
        console.error("   ❌ FAILURE: Data visible to Anon!", anonData);
        process.exit(1);
    }

    // Test 2: Admin Access (Should PASS)
    console.log("2. Testing Admin Access...");
    const adminClient = createClient(SUPABASE_URL, ANON_KEY);
    const { error: loginError } = await adminClient.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
    });

    if (loginError) {
        console.error("   ❌ Admin Login Failed:", loginError.message);
        process.exit(1);
    }

    const { data: adminData, error: adminSelectError } = await adminClient.from('carrier_applications').select('*').limit(1);

    if (adminSelectError) {
        console.error("   ❌ Admin Select Failed:", adminSelectError.message);
    } else {
        console.log(`   ✅ Success: Admin sees ${adminData.length} records.`);
    }

    console.log("--- QA Complete ---");
}

runQa();
