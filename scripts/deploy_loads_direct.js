import { createClient } from '@supabase/supabase-js';
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
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.log("Missing Credentials: Need SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

async function deploySchema() {
    console.log("Deploying TMS Loads Schema...");

    try {
        // Read schema file
        const schemaPath = path.resolve('supabase/loads_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        console.log(`Schema loaded (${schema.length} bytes)`);

        // Split into statements and execute individually
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`Executing ${statements.length} SQL statements...`);

        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i] + ';';

            // Skip comment-only lines
            if (stmt.trim().startsWith('--')) continue;

            try {
                const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: stmt });

                if (error) {
                    console.log(`Statement ${i + 1}/${statements.length}: ERROR`);
                    console.error(error);
                } else {
                    console.log(`Statement ${i + 1}/${statements.length}: OK`);
                }
            } catch (e) {
                console.log(`Statement ${i + 1}/${statements.length}: EXCEPTION`);
                console.error(e.message);
            }
        }

        // Verify tables
        const { data: tables, error: verifyError } = await supabaseAdmin
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['loads', 'tms_customers', 'tms_carriers', 'tms_agents']);

        if (!verifyError && tables) {
            console.log("✅ Verified Tables Created:", tables.map(t => t.table_name));
        }

        console.log("Schema deployment complete!");

    } catch (e) {
        console.error("❌ Deployment Failed:", e.message);
        process.exit(1);
    }
}

deploySchema();
