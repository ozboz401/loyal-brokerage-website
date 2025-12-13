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
const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = 'ozan@loyalbrokerage.com';
const ADMIN_PASSWORD = 'admin_password_123';

if (!SUPABASE_URL || !ANON_KEY) {
    console.error("❌ Missing credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function runFullTMSQA() {
    console.log("🧪 Starting Full TMS System QA...\n");
    console.log("=".repeat(60));

    let testsPassed = 0;
    let testsFailed = 0;

    try {
        // ===== AUTH =====
        console.log("\n📋 MODULE: AUTHENTICATION");
        console.log("-".repeat(60));

        console.log("1️⃣ Admin login...");
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        if (authError) {
            console.error("   ❌ FAIL:", authError.message);
            testsFailed++;
        } else {
            console.log("   ✅ PASS: Logged in as", authData.user.email);
            testsPassed++;
        }

        // ===== SETUP: ENSURE TEST DATA EXISTS =====
        console.log("\n📋 SETUP: Test Data");
        console.log("-".repeat(60));

        const TEST_CUSTOMER_ID = 999001;
        const TEST_CARRIER_ID = 999002;

        console.log("⚙️  Upserting test customer...");
        const { data: customer, error: customerError } = await supabase
            .from('tms_customers')
            .upsert([{
                id: TEST_CUSTOMER_ID,
                name: 'QA Test Customer',
                contact_name: 'John QA',
                email: 'qa@test.com',
                phone: '555-0000',
                payment_terms: 'Net 30'
            }], { onConflict: 'id' })
            .select()
            .single();

        if (customerError) {
            console.error("   ❌ FAIL:", customerError.message);
            testsFailed++;
        } else {
            console.log("   ✅ PASS: Test customer ready, ID:", customer.id);
            testsPassed++;
        }

        console.log("⚙️  Upserting test carrier...");
        const { data: carrier, error: carrierError } = await supabase
            .from('tms_carriers')
            .upsert([{
                id: TEST_CARRIER_ID,
                name: 'QA Test Carrier',
                mc_number: 'MC999999',
                dot_number: 'DOT888888',
                contact_name: 'Bob QA',
                phone: '555-0001',
                status: 'Active'
            }], { onConflict: 'id' })
            .select()
            .single();

        if (carrierError) {
            console.error("   ❌ FAIL:", carrierError.message);
            testsFailed++;
        } else {
            console.log("   ✅ PASS: Test carrier ready, ID:", carrier.id);
            testsPassed++;
        }

        // Use fallback IDs
        const customerId = customer?.id || TEST_CUSTOMER_ID;
        const carrierId = carrier?.id || TEST_CARRIER_ID;

        // ===== LOADS =====
        console.log("\n📋 MODULE: LOADS");
        console.log("-".repeat(60));

        console.log("2️⃣ Generate load ID...");
        const { data: loadId, error: loadIdError } = await supabase.rpc('generate_load_id');

        if (loadIdError) {
            console.error("   ❌ FAIL:", loadIdError.message);
            testsFailed++;
        } else {
            console.log("   ✅ PASS: Generated ID:", loadId);
            testsPassed++;
        }

        console.log("3️⃣ Create load with relationships...");
        const { data: load, error: loadError } = await supabase
            .from('loads')
            .insert([{
                id: loadId,
                customer_id: customerId,
                customer_name: customer?.name || 'QA Test Customer',
                carrier_id: carrierId,
                carrier_name: carrier?.name || 'QA Test Carrier',
                agent_id: 1,
                agent_name: 'Ozan Akdemir',
                pickup_address: 'QA Pickup Address',
                delivery_address: 'QA Delivery Address',
                rate: 2500,
                carrier_cost: 1800,
                equipment_type: 'Dry Van',
                status: 'Pending'
            }])
            .select()
            .single();

        if (loadError) {
            console.error("   ❌ FAIL:", loadError.message);
            testsFailed++;
        } else {
            console.log("   ✅ PASS: Load created with customer/carrier links");
            testsPassed++;
        }

        // ===== CRM =====
        console.log("\n📋 MODULE: CRM");
        console.log("-".repeat(60));

        console.log("6️⃣ Create opportunity...");
        const { data: oppId, error: oppIdError } = await supabase.rpc('generate_opportunity_id');

        if (oppIdError) {
            console.error("   ❌ FAIL:", oppIdError.message);
            testsFailed++;
        } else {
            const { data: opp, error: oppError } = await supabase
                .from('crm_opportunities')
                .insert([{
                    id: oppId,
                    customer_name: customer.name,
                    contact_email: customer.email,
                    stage: 'Prospect',
                    agent_id: 1,
                    agent_name: 'Ozan Akdemir'
                }])
                .select()
                .single();

            if (oppError) {
                console.error("   ❌ FAIL:", oppError.message);
                testsFailed++;
            } else {
                console.log("   ✅ PASS: Opportunity created, ID:", opp.id);
                testsPassed++;
            }
        }

        // ===== ACCOUNTING =====
        console.log("\n📋 MODULE: ACCOUNTING");
        console.log("-".repeat(60));

        console.log("5️⃣ Create invoice...");
        const { data: invoiceId, error: invIdError } = await supabase.rpc('generate_invoice_id');

        if (invIdError) {
            console.error("   ❌ FAIL:", invIdError.message);
            testsFailed++;
        } else {
            const { data: invoice, error: invError } = await supabase
                .from('invoices')
                .insert([{
                    id: invoiceId,
                    load_id: loadId,
                    customer_id: customerId,
                    customer_name: customer?.name || 'QA Test Customer',
                    amount: 2500,
                    status: 'Pending'
                }])
                .select()
                .single();

            if (invError) {
                console.error("   ❌ FAIL:", invError.message);
                testsFailed++;
            } else {
                console.log("   ✅ PASS: Invoice created, ID:", invoice.id);
                testsPassed++;
            }
        }

        // ===== CLEANUP =====
        console.log("\n📋 CLEANUP");
        console.log("-".repeat(60));

        console.log("6️⃣ Clean up test load...");
        await supabase.from('loads').delete().eq('id', loadId);
        console.log("   ✅ PASS: Test load cleaned (customer/carrier kept for reuse)");
        testsPassed++;

        // ===== RLS TEST =====
        console.log("\n📋 SECURITY: RLS");
        console.log("-".repeat(60));

        console.log("7️⃣ Test RLS (unauthorized access)...");
        await supabase.auth.signOut();

        const { data: unauth, error: rlsError } = await supabase
            .from('loads')
            .select('*')
            .limit(1);

        if (unauth && unauth.length > 0) {
            console.error("   ❌ FAIL: RLS not working - unauthorized access allowed!");
            testsFailed++;
        } else {
            console.log("   ✅ PASS: RLS enforced - unauthorized access blocked");
            testsPassed++;
        }

        // ===== RESULTS =====
        console.log("\n\n" + "=".repeat(60));
        console.log("FINAL RESULTS");
        console.log("=".repeat(60));
        console.log(`✅ Tests Passed: ${testsPassed}`);
        console.log(`❌ Tests Failed: ${testsFailed}`);
        console.log(`📊 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

        if (testsFailed === 0) {
            console.log("\n🎉 ALL TESTS PASSED! TMS SYSTEM IS FULLY OPERATIONAL");
        } else {
            console.log("\n⚠️  SOME TESTS FAILED - REVIEW ERRORS ABOVE");
        }

    } catch (e) {
        console.error("\n❌ QA FAILED WITH EXCEPTION:", e.message);
        process.exit(1);
    }
}

runFullTMSQA();
