import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// Load environment variables
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
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!SUPABASE_URL) {
    console.error("❌ Missing SUPABASE_URL");
    process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.split('//')[1].split('.')[0];

async function deployViaPsql() {
    console.log("🚀 Deploying schema via psql...\n");

    try {
        // Check if we have DB password for direct connection
        if (!DB_PASSWORD) {
            console.log("⚠️  SUPABASE_DB_PASSWORD not set.");
            console.log("   Please set it in .env or execute SQL manually.\n");
            console.log("   Fallback: Use Supabase Studio SQL Editor");
            console.log("   File: supabase/loads_schema.sql\n");
            return;
        }

        const schemaPath = path.resolve('supabase/loads_schema.sql');
        const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.${projectRef}.supabase.co:5432/postgres`;

        console.log(`📄 Executing ${schemaPath}...`);

        const command = `psql "${connectionString}" -f "${schemaPath}"`;

        const { stdout, stderr } = await execAsync(command);

        if (stdout) console.log(stdout);
        if (stderr && !stderr.includes('NOTICE')) console.error(stderr);

        console.log("\n✅ Schema deployed via psql!");

    } catch (e) {
        console.error("\n❌ psql deployment failed:", e.message);
        console.log("\n📝 Manual deployment required:");
        console.log("   1. Open Supabase Studio → SQL Editor");
        console.log("   2. Copy contents of: supabase/loads_schema.sql");
        console.log("   3. Execute the SQL");
        process.exit(1);
    }
}

deployViaPsql();
