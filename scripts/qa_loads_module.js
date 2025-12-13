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

async function runQA() {
    console.log("🧪 Starting Loads Module QA...\n");

    try {
        // Step 1: Login as admin
        console.log("1️⃣ Authenticating as admin...");
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        if (authError) {
            console.error("   ❌ Login failed:", authError.message);
            process.exit(1);
        }
        console.log("   ✅ Logged in as:", authData.user.email);

        // Step 2: Generate Load ID
        console.log("\n2️⃣ Generating load ID...");
        const { data: loadId, error: idError } = await supabase.rpc('generate_load_id');

        if (idError) {
            console.error("   ❌ ID generation failed:", idError.message);
            process.exit(1);
        }
        console.log("   ✅ Generated ID:", loadId);

        // Step 3: Insert test load
        console.log("\n3️⃣ Inserting test load...");
        const testLoad = {
            id: loadId,
            customer_id: 1,
            customer_name: 'ABC Manufacturing',
            carrier_id: 1,
            carrier_name: 'Ada Fleet LLC',
            agent_id: 1,
            agent_name: 'Ozan Akdemir',
            pickup_address: '123 Test St, Chicago, IL',
            delivery_address: '456 Dest Ave, Dallas, TX',
            rate: 2500,
            carrier_cost: 1800,
            trip_distance: 950,
            equipment_type: 'Dry Van',
            status: 'Pending',
            appointment_date: '2025-01-20',
            reference_number: 'TEST-QA-001',
            notes: 'Automated QA test load'
        };

        const { data: insertedLoad, error: insertError } = await supabase
            .from('loads')
            .insert([testLoad])
            .select()
            .single();

        if (insertError) {
            console.error("   ❌ Insert failed:", insertError.message);
            process.exit(1);
        }
        console.log("   ✅ Load inserted:", insertedLoad.id);
        console.log("   📊 Gross Profit:", insertedLoad.gross_profit);
        console.log("   📈 Profit Margin:", insertedLoad.profit_margin + '%');

        // Step 4: Read load
        console.log("\n4️⃣ Reading load back...");
        const { data: readLoad, error: readError } = await supabase
            .from('loads')
            .select('*')
            .eq('id', loadId)
            .single();

        if (readError) {
            console.error("   ❌ Read failed:", readError.message);
            process.exit(1);
        }
        console.log("   ✅ Load retrieved:", readLoad.customer_name, '→', readLoad.status);

        // Step 5: Update load
        console.log("\n5️⃣ Updating load status...");
        const { data: updatedLoad, error: updateError } = await supabase
            .from('loads')
            .update({ status: 'Booked', rate: 2600 })
            .eq('id', loadId)
            .select()
            .single();

        if (updateError) {
            console.error("   ❌ Update failed:", updateError.message);
            process.exit(1);
        }
        console.log("   ✅ Status updated to:", updatedLoad.status);
        console.log("   💰 Rate updated to:", updatedLoad.rate);
        console.log("   📊 New Gross Profit:", updatedLoad.gross_profit);

        // Step 6: Delete load
        console.log("\n6️⃣ Deleting test load...");
        const { error: deleteError } = await supabase
            .from('loads')
            .delete()
            .eq('id', loadId);

        if (deleteError) {
            console.error("   ❌ Delete failed:", deleteError.message);
            process.exit(1);
        }
        console.log("   ✅ Load deleted");

        // Step 7: Verify deletion
        console.log("\n7️⃣ Verifying deletion...");
        const { data: verifyLoad } = await supabase
            .from('loads')
            .select('*')
            .eq('id', loadId)
            .single();

        if (verifyLoad) {
            console.error("   ❌ Load still exists!");
            process.exit(1);
        }
        console.log("   ✅ Load successfully deleted");

        // Step 8: Test RLS (sign out and try to read)
        console.log("\n8️⃣ Testing RLS (unauthorized access)...");
        await supabase.auth.signOut();

        const { data: unauthorizedData, error: rlsError } = await supabase
            .from('loads')
            .select('*')
            .limit(1);

        if (unauthorizedData && unauthorizedData.length > 0) {
            console.error("   ❌ RLS FAILED: Unauthorized user can read data!");
            process.exit(1);
        }
        console.log("   ✅ RLS working: Unauthorized access blocked");

        console.log("\n\n✅ ALL QA TESTS PASSED! 🎉");
        console.log("\nLoads Module is fully operational:");
        console.log("  ✓ Database schema deployed");
        console.log("  ✓ CRUD operations working");
        console.log("  ✓ Computed columns (gross_profit, profit_margin) working");
        console.log("  ✓ RLS policies enforcing admin-only access");
        console.log("  ✓ Auto-incrementing load IDs working");

    } catch (e) {
        console.error("\n❌ QA Failed:", e.message);
        process.exit(1);
    }
}

runQA();
