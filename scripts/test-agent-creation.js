import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define dirname manually in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load Env Vars (Manual Parse)
const envPath = path.resolve(__dirname, '../.env');

let env = {};
try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) env[key.trim()] = values.join('=').trim().replace(/"/g, '');
    });
} catch (e) {
    console.warn("Could not read local .env file. Relying on process.env");
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
// Use Service Role Key for Admin privileges (Deleting users)
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const FUNCTION_BASE_URL = process.env.VITE_SUPABASE_FUNCTION_URL || env.VITE_SUPABASE_FUNCTION_URL;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("❌ MISSING ENV VARS: Need VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

// 2. Initialize Client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function runLiveTest() {
    console.log("🚀 STARTING LIVE AGENT CREATION TEST");
    console.log(`Target Supabase: ${SUPABASE_URL}`);
    console.log(`Target Function Base: ${FUNCTION_BASE_URL || 'Default (Remote)'}`);

    const TEST_EMAIL = `auto_test_${Date.now()}@loyalbrokerage.com`;
    const AGENT_PAYLOAD = {
        fullName: "Automated Tester",
        email: TEST_EMAIL,
        password: "SecurePassword123!",
        companyName: "Test Corp LLC",
        commission: 45,
        status: "Active"
    };

    try {
        // --- STEP 1: INVOKE FUNCTION ---
        console.log("\n🔄 1. Invoking 'create-agent-user'...");
        let data, error;

        // If local, use Fetch to target specific port
        if (FUNCTION_BASE_URL && FUNCTION_BASE_URL.includes('localhost')) {
            console.log(`👉 Using Direct Fetch to ${FUNCTION_BASE_URL}/create-agent-user`);
            const res = await fetch(`${FUNCTION_BASE_URL}/create-agent-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
                },
                body: JSON.stringify(AGENT_PAYLOAD)
            });
            data = await res.json();
            if (!res.ok) error = data;
        } else {
            // Remote Invoke
            const res = await supabase.functions.invoke('create-agent-user', {
                body: AGENT_PAYLOAD
            });
            data = res.data;
            error = res.error;
        }

        if (error) {
            console.error("❌ INVOKE FAILED:", error);
            throw error;
        }

        if (!data.success) {
            console.error("❌ FUNCTION LOGIC FAILURE:", data);
            throw new Error(data.error || "Unknown function error");
        }

        console.log("✅ Function Success:", data);
        const { authUserId, agentId, emailSent } = data; // New Code Keys

        // --- STEP 2: VERIFY AUTH USER ---
        console.log("\n🔄 2. Verifying Auth User...");
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(authUserId);
        if (userError || !userData.user) {
            throw new Error("Auth user lookup failed: " + (userError?.message || "Not found"));
        }
        console.log("✅ Auth User Exists:", userData.user.email);

        // --- STEP 3: VERIFY DB ROW ---
        console.log("\n🔄 3. Verifying Database Row...");
        const { data: rowData, error: rowError } = await supabase
            .from('agents')
            .select('*')
            .eq('id', agentId)
            .single();

        if (rowError || !rowData) {
            throw new Error("DB Row lookup failed: " + (rowError?.message || "Not found"));
        }
        console.log("✅ Agent Row Exists:", rowData.company_name);

        // Check new fields
        if (rowData.commission_percent !== 45 || rowData.is_active !== true) {
            throw new Error("Schema Mismatch: commission_percent or is_active not set correctly");
        }
        console.log("✅ Schema Fields Verified (commission_percent, is_active)");

        // --- STEP 4: CLEANUP ---
        console.log("\n🔄 4. Cleaning Up...");
        // Delete Auth User (Cascades to DB usually? Need to check policy/trigger. But we do it manually to be sure)
        const { error: delError } = await supabase.auth.admin.deleteUser(authUserId);
        if (delError) console.warn("⚠️ User cleanup warning:", delError.message);
        else console.log("✅ Auth User Deleted");

        // Delete DB Row (if not cascaded)
        const { error: dbDelError } = await supabase.from('agents').delete().eq('id', agentId);
        if (dbDelError) console.warn("⚠️ DB cleanup warning (might be cascaded):", dbDelError.message);
        else console.log("✅ DB Row Cleaned");

        console.log("\n--------------------------------");
        console.log("🎉 TEST PASSED: SYSTEM OPERATIONAL");
        console.log("--------------------------------");

    } catch (e) {
        console.error("\n❌ TEST FAILED:", e.message);
        process.exit(1);
    }
}

runLiveTest();
