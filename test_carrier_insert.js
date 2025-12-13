
import fs from 'fs';
import path from 'path';

// Load .env
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

// Dynamic import
async function runTest() {
    let supabaseAdmin;
    try {
        const module = await import('./src/lib/supabaseAdmin.js');
        supabaseAdmin = module.supabaseAdmin;
    } catch (e) {
        console.error("Import failed:", e);
        return;
    }

    console.log("Phase 4: Running End-to-End Test Insert...");

    const testCarrier = {
        company_name: "Test Carrier LLC",
        primary_contact: "John Doe",
        primary_email: "test_carrier@example.com",
        primary_phone: "555-123-4567",
        mc_number: "123456",
        dot_number: "765432",
        truck_count: "5",
        equipment_types: ["Dry Van", "Reefer"],
        compliance_certified: true
    };

    const { data, error } = await supabaseAdmin
        .from('carrier_applications')
        .insert([testCarrier])
        .select();

    if (error) {
        console.error("❌ Test Insert Failed:", error.message);
        console.log("Note: If error is 'relation does not exist', the table hasn't been created yet.");
    } else {
        console.log("✅ Test Insert Success!");
        console.log("Inserted Record:", data);
        console.log("Waiting for Trigger/Edge Function (check Supabase logs for email delivery)...");
    }
}

runTest();
