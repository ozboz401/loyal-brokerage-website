
import fs from 'fs';
import path from 'path';
import { createClient } from "@supabase/supabase-js";

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

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_URL || !SERVICE_KEY || !ACCESS_TOKEN) {
    console.error("Missing Credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const projectRef = SUPABASE_URL.split('//')[1].split('.')[0];
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/carrier-signup-email`;

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

// Expected Columns
const EXPECTED_COLS = [
    'company_name', 'dba', 'business_type', 'address_street', 'address_city',
    'address_state', 'address_zip', 'mc_number', 'dot_number', 'ein', 'years_in_business',
    'primary_contact_name', 'primary_phone', 'primary_email', 'dispatch_contact_name',
    'dispatch_phone', 'after_hours_phone', 'billing_email',
    'number_of_trucks', 'number_of_drivers',
    'equipment_dryvan', 'equipment_reefer', 'equipment_flatbed', 'equipment_stepdeck', 'equipment_power_only',
    'operating_states', 'hazmat_certified', 'safety_rating',
    'liability_coverage', 'cargo_coverage', 'insurance_company', 'agent_name', 'agent_phone', 'agent_email', 'policy_expiration',
    'w9_url', 'insurance_doc_url', 'mc_authority_letter_url', 'signed_carrier_agreement_url', 'ach_voided_check_url',
    'agreed_all_info_correct', 'agreed_insurance_verification', 'agreed_fmcsa_rules', 'agreed_llc_carrier_terms'
];

async function verifyAndRepair() {
    console.log("Starting Verification & Repair...");

    // 1. Schema Validation
    console.log("Phase 1: Validating Schema...");
    try {
        const colsRes = await runSql(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'carrier_applications';
        `);

        const key = colsRes.result ? 'result' : (Array.isArray(colsRes) ? null : 'error');
        const existingColsFormatted = Array.isArray(colsRes) ? colsRes : colsRes[key] || [];
        const existingColNames = existingColsFormatted.map(c => c.column_name);

        const missing = EXPECTED_COLS.filter(c => !existingColNames.includes(c));

        if (missing.length > 0) {
            console.log(`⚠️ Missing Columns Found: ${missing.join(', ')}. Repairing...`);
            let alterSql = "";
            missing.forEach(col => {
                let type = 'text';
                if (col.startsWith('number_')) type = 'integer';
                if (col.startsWith('agreed_') || col.startsWith('equipment_') || col.startsWith('hazmat_')) type = 'boolean';
                if (col === 'operating_states') type = 'text[]';
                if (col === 'policy_expiration') type = 'date';

                alterSql += `ALTER TABLE public.carrier_applications ADD COLUMN IF NOT EXISTS ${col} ${type};\n`;
            });
            await runSql(alterSql);
            console.log("✅ Schema Repaired.");
        } else {
            console.log("✅ Schema is Correct.");
        }
    } catch (e) {
        console.error("Schema Check Failed:", e.message);
    }

    // 2. Edge Function Direct Test
    console.log("\nPhase 3: Testing Edge Function Direct invocation...");
    try {
        const payload = {
            record: {
                company_name: "Verification Bot",
                primary_phone: "555-000-0000",
                primary_email: "test@loyalbrokerage.com"
            }
        };

        const funcRes = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SERVICE_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const funcText = await funcRes.text();
        console.log(`Edge Function Status: ${funcRes.status}`);
        console.log(`Edge Function Response: ${funcText}`);

        if (!funcRes.ok) {
            console.warn("⚠️ Edge Function returned error. Check logs/env vars.");
        } else {
            console.log("✅ Edge Function Reachable.");
        }

    } catch (e) {
        console.error("Edge Function Test Failed:", e);
    }

    // 4. End-to-End Insert
    console.log("\nPhase 4: End-to-End Database Insert...");
    try {
        const testRecord = {
            company_name: "Auto-Test Carrier",
            primary_contact_name: "Robot",
            primary_email: "ozan@loyalbrokerage.com", // Use admin email so we don't spam randoms
            primary_phone: "999-888-7777",
            mc_number: "999999",
            agreed_all_info_correct: true
        };

        const { data, error } = await supabase
            .from('carrier_applications')
            .insert([testRecord])
            .select();

        if (error) {
            console.error("❌ Insert Failed:", error.message);
        } else {
            console.log("✅ Insert Succeeded. ID:", data[0].id);
            console.log("Trigger should have fired.");
        }

    } catch (e) {
        console.error("Insert Execution Error:", e);
    }

    console.log("\n--- Verification Complete ---");
}

verifyAndRepair();
