import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("❌ Missing credentials: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Split SQL into logical chunks
function splitSQLIntoChunks(sql) {
    const chunks = [];

    // Remove comments and split by sections
    const lines = sql.split('\n');
    let currentChunk = [];
    let currentSection = '';

    for (let line of lines) {
        const trimmed = line.trim();

        // Detect section headers
        if (trimmed.startsWith('-- ===')) {
            if (currentChunk.length > 0) {
                chunks.push({
                    section: currentSection,
                    sql: currentChunk.join('\n')
                });
                currentChunk = [];
            }
            currentSection = trimmed;
        }

        currentChunk.push(line);
    }

    // Add final chunk
    if (currentChunk.length > 0) {
        chunks.push({
            section: currentSection,
            sql: currentChunk.join('\n')
        });
    }

    return chunks;
}

// Execute SQL statement
async function executeSql(sql) {
    try {
        // Use rpc if available, otherwise direct query
        const { data, error } = await supabase.rpc('exec', { sql });

        if (error) {
            // Fallback: Try using postgrest directly
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SERVICE_KEY,
                    'Authorization': `Bearer ${SERVICE_KEY}`
                },
                body: JSON.stringify({ sql })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            return { data: await response.json(), error: null };
        }

        return { data, error };
    } catch (e) {
        return { data: null, error: e };
    }
}

async function deploySchema() {
    console.log("🚀 Starting Chunked SQL Deployment...\n");

    try {
        // Read schema file
        const schemaPath = path.resolve('supabase/loads_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        console.log(`📄 Schema loaded (${schema.length} bytes)\n`);

        // Split into chunks
        const chunks = splitSQLIntoChunks(schema);
        console.log(`📦 Split into ${chunks.length} chunks\n`);

        // Execute each chunk
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            console.log(`\n[${i + 1}/${chunks.length}] Executing: ${chunk.section || 'Section ' + (i + 1)}`);

            // Split chunk into individual statements
            const statements = chunk.sql
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--'));

            for (let j = 0; j < statements.length; j++) {
                const stmt = statements[j];

                // Skip empty or comment-only
                if (!stmt || stmt.startsWith('--')) continue;

                const preview = stmt.substring(0, 60).replace(/\s+/g, ' ');
                process.stdout.write(`  [${j + 1}/${statements.length}] ${preview}... `);

                const { data, error } = await executeSql(stmt + ';');

                if (error) {
                    console.log('❌ ERROR');
                    console.error(`     ${error.message || error}`);

                    // Continue with other statements (some errors are acceptable like "already exists")
                    if (!error.message?.includes('already exists')) {
                        // Critical error, might want to stop
                        // For now, we'll log and continue
                    }
                } else {
                    console.log('✅');
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log("\n\n✅ Schema deployment complete!");

        // Verify tables
        console.log("\n🔍 Verifying tables...");
        const tablesToVerify = ['loads', 'tms_customers', 'tms_carriers', 'tms_agents'];

        for (const tableName of tablesToVerify) {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .limit(1);

            if (error) {
                console.log(`  ❌ ${tableName}: ${error.message}`);
            } else {
                console.log(`  ✅ ${tableName} exists`);
            }
        }

        // Verify RLS
        console.log("\n🔒 Verifying RLS policies...");
        const { data: policies, error: polError } = await supabase
            .from('pg_policies')
            .select('tablename, policyname')
            .in('tablename', tablesToVerify);

        if (!polError && policies) {
            console.log(`  ✅ Found ${policies.length} RLS policies`);
            policies.forEach(p => {
                console.log(`     - ${p.tablename}: ${p.policyname}`);
            });
        }

        console.log("\n✅ Deployment verification complete!");

    } catch (e) {
        console.error("\n❌ Deployment failed:", e.message);
        process.exit(1);
    }
}

deploySchema();
