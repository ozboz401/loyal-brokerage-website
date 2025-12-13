import { createClient } from "@supabase/supabase-js";
import fs from 'fs';
import path from 'path';

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyQuoteSubmission() {
    console.log("Verifying quote submission...");

    // Mock payload matching RequestQuote.jsx
    const payload = {
        company_name: "Test Company",
        contact_name: "Test Contact",
        email: "test@example.com",
        phone: "555-0199",
        pickup_city: "Test City",
        pickup_state: "TS",
        delivery_city: "Dest City",
        delivery_state: "DS",
        weight: "1000",
        pallets: "2",
        equipment_type: "Dry Van",
        special_notes: "This is a test submission from verification script.",
        attachment_url: null,
        commodity: "Test Commodity",
        pickup_date: "2023-01-01",
        delivery_date: "2023-01-05"
    };

    console.log("Payload:", payload);

    try {
        const { data, error } = await supabase
            .from("quotes")
            .insert([payload])
            .select();

        if (error) {
            console.error("❌ Submission failed:", error.message);
            // Check if it's a schema mismatch
            if (error.code === '42703') {
                console.error("Potential column mismatch. Check schema.sql vs table.");
            }
        } else {
            console.log("✅ Quote request submitted successfully via script.");
            console.log("Inserted Record:", data);

            // Clean up (optional, if we want to keep test data or not)
            // console.log("Cleaning up...");
            // await supabase.from("quotes").delete().match({ id: data[0].id });
        }

    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

verifyQuoteSubmission();
