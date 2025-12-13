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

async function deploy() {
    console.log("Deploying Loads Module Schema...");

    try {
        const schema = fs.readFileSync('supabase/loads_schema.sql', 'utf-8');
        const result = await runSql(schema);
        console.log("✅ Schema Deployed Successfully.");
        console.log(" Result:", JSON.stringify(result).slice(0, 200));
    } catch (e) {
        console.error("❌ Deployment Failed:", e.message);
    }
}

deploy();
