
import fs from 'fs';
import path from 'path';

// 1. Load Env
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

if (!ACCESS_TOKEN || !PROJECT_URL) {
    console.error("Missing SUPABASE_ACCESS_TOKEN or SUPABASE_URL");
    process.exit(1);
}

const projectRef = PROJECT_URL.split('//')[1].split('.')[0];
const functionUrl = `${PROJECT_URL}/functions/v1/carrier-signup-email`;

// 2. Define SQL
const sql = `
-- Enable pg_net for http requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create Table
CREATE TABLE IF NOT EXISTS public.carrier_applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Business Information
    company_name text NOT NULL,
    dba text,
    business_type text,
    address_street text,
    address_city text,
    address_state text,
    address_zip text,
    mc_number text,
    dot_number text,
    ein text,
    years_in_business text,

    -- Contact Information
    primary_contact_name text,
    primary_phone text,
    primary_email text,
    dispatch_contact_name text,
    dispatch_phone text,
    after_hours_phone text,
    billing_email text,

    -- Fleet & Operations
    number_of_trucks integer,
    number_of_drivers integer,
    equipment_dryvan boolean,
    equipment_reefer boolean,
    equipment_flatbed boolean,
    equipment_stepdeck boolean,
    equipment_power_only boolean,
    operating_states text[],
    hazmat_certified boolean,
    safety_rating text,

    -- Insurance Info
    liability_coverage text,
    cargo_coverage text,
    insurance_company text,
    agent_name text,
    agent_phone text,
    agent_email text,
    policy_expiration date,

    -- Document Uploads
    w9_url text,
    insurance_doc_url text,
    mc_authority_letter_url text,
    signed_carrier_agreement_url text,
    ach_voided_check_url text,

    -- Legal Compliance
    agreed_all_info_correct boolean,
    agreed_insurance_verification boolean,
    agreed_fmcsa_rules boolean,
    agreed_llc_carrier_terms boolean,

    created_at timestamp with time zone default now()
);

-- Disable RLS (Access Policy: Public/Admin)
ALTER TABLE public.carrier_applications DISABLE ROW LEVEL SECURITY;

-- Trigger Function
CREATE OR REPLACE FUNCTION public.trigger_carrier_signup_email()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Use pg_net to send POST request
  SELECT net.http_post(
       url := '${functionUrl}',
       headers := jsonb_build_object('Content-Type','application/json', 'Authorization', 'Bearer ' || current_setting('request.jwt.claim.role', true)),
       body := jsonb_build_object('record', row_to_json(NEW))
   ) INTO request_id;
   
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger
DROP TRIGGER IF EXISTS on_carrier_signup ON public.carrier_applications;
CREATE TRIGGER on_carrier_signup
AFTER INSERT ON public.carrier_applications
FOR EACH ROW
EXECUTE FUNCTION public.trigger_carrier_signup_email();
`;

console.log("Deploying SQL to Project:", projectRef);

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

async function deploy() {
    try {
        console.log("Executing SQL...");
        const result = await runSql(sql);
        console.log("SQL Result:", JSON.stringify(result));

        console.log("✅ Carrier Signup automation fully deployed.");

        // Final Verification List
        const tables = await runSql("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Active Tables:", JSON.stringify(tables));

    } catch (e) {
        console.error("❌ Deployment Failed:", e.message);
        process.exit(1);
    }
}

deploy();
