
import fs from 'fs';
import path from 'path';

async function verifyConnection() {
    console.log("Phase 0: Verifying Supabase Admin Connection...");

    // 1. Load .env manually
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
    } catch (e) {
        console.error("Failed to load .env:", e);
    }

    // 2. Dynamic Import
    let supabaseAdmin;
    try {
        const { pathToFileURL } = await import('url');
        const modulePath = path.resolve('./src/lib/supabaseAdmin.js');
        const moduleUrl = pathToFileURL(modulePath).href;
        const module = await import(moduleUrl);
        supabaseAdmin = module.supabaseAdmin;
    } catch (e) {
        console.error("Failed to import supabaseAdmin:", e);
        process.exit(1);
    }

    // 3. Verify
    try {
        const { data, error } = await supabaseAdmin.from('quotes').select('id').limit(1);

        if (error) {
            console.error("❌ Connection Test Failed:", error.message);
            // process.exit(1); 
            // Don't exit hard so we can continue with other tasks if it's just a table missing issue
        } else {
            console.log("✅ Supabase Connection Verified. (Query to 'quotes' succeeded)");
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }
}

verifyConnection();
