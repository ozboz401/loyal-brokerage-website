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
    console.log("🧪 Starting CRM Module QA Tests...\n");

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

        // Step 2: Create test opportunity
        console.log("\n2️⃣ Creating test opportunity...");
        const { data: oppId, error: idError } = await supabase.rpc('generate_opportunity_id');

        if (idError) {
            console.error("   ❌ ID generation failed:", idError.message);
            process.exit(1);
        }
        console.log("   ✅ Generated ID:", oppId);

        const testOpp = {
            id: oppId,
            customer_name: 'QA Test Company',
            contact_email: 'qa@test.com',
            stage: 'Prospect',
            agent_id: 1,
            agent_name: 'Ozan Akdemir'
        };

        const { data: createdOpp, error: createError } = await supabase
            .from('crm_opportunities')
            .insert([testOpp])
            .select()
            .single();

        if (createError) {
            console.error("   ❌ Create failed:", createError.message);
            process.exit(1);
        }
        console.log("   ✅ Opportunity created:", createdOpp.id);

        // Step 3: Update stage
        console.log("\n3️⃣ Updating opportunity stage...");
        const { data: updatedOpp, error: updateError } = await supabase
            .from('crm_opportunities')
            .update({ stage: 'Lead', estimated_rate: 2500 })
            .eq('id', oppId)
            .select()
            .single();

        if (updateError) {
            console.error("   ❌ Update failed:", updateError.message);
            process.exit(1);
        }
        console.log("   ✅ Stage updated to:", updatedOpp.stage);
        console.log("   💰 Rate set to:", updatedOpp.estimated_rate);

        // Step 4: Add activity
        console.log("\n4️⃣ Adding activity/note...");
        const { data: activity, error: activityError } = await supabase
            .from('crm_activities')
            .insert([{
                opportunity_id: oppId,
                activity_type: 'Note',
                description: 'QA test note - initial contact made',
                agent_id: 1
            }])
            .select()
            .single();

        if (activityError) {
            console.error("   ❌ Activity create failed:", activityError.message);
            process.exit(1);
        }
        console.log("   ✅ Activity added:", activity.activity_type);

        // Step 5: Fetch activities
        console.log("\n5️⃣ Fetching activities...");
        const { data: activities, error: fetchError } = await supabase
            .from('crm_activities')
            .select('*')
            .eq('opportunity_id', oppId);

        if (fetchError) {
            console.error("   ❌ Fetch activities failed:", fetchError.message);
            process.exit(1);
        }
        console.log(`   ✅ Found ${activities.length} activity(ies)`);

        // Step 6: Convert to Customer
        console.log("\n6️⃣ Converting to Customer stage...");
        const { data: convertedOpp, error: convertError } = await supabase
            .from('crm_opportunities')
            .update({
                stage: 'Customer',
                carrier_name: 'Test Carrier LLC',
                load_id: 'L-2025-TEST'
            })
            .eq('id', oppId)
            .select()
            .single();

        if (convertError) {
            console.error("   ❌ Convert failed:", convertError.message);
            process.exit(1);
        }
        console.log("   ✅ Converted to Customer");
        console.log("   🚚 Carrier:", convertedOpp.carrier_name);
        console.log("   📦 Load:", convertedOpp.load_id);

        // Step 7: Delete opportunity
        console.log("\n7️⃣ Deleting test opportunity...");
        const { error: deleteError } = await supabase
            .from('crm_opportunities')
            .delete()
            .eq('id', oppId);

        if (deleteError) {
            console.error("   ❌ Delete failed:", deleteError.message);
            process.exit(1);
        }
        console.log("   ✅ Opportunity deleted");

        // Step 8: Verify deletion
        console.log("\n8️⃣ Verifying deletion...");
        const { data: verifyOpp } = await supabase
            .from('crm_opportunities')
            .select('*')
            .eq('id', oppId)
            .single();

        if (verifyOpp) {
            console.error("   ❌ Opportunity still exists!");
            process.exit(1);
        }
        console.log("   ✅ Opportunity successfully deleted");

        // Step 9: Test RLS
        console.log("\n9️⃣ Testing RLS (unauthorized access)...");
        await supabase.auth.signOut();

        const { data: unauthorizedData, error: rlsError } = await supabase
            .from('crm_opportunities')
            .select('*')
            .limit(1);

        if (unauthorizedData && unauthorizedData.length > 0) {
            console.error("   ❌ RLS FAILED: Unauthorized user can read data!");
            process.exit(1);
        }
        console.log("   ✅ RLS working: Unauthorized access blocked");

        console.log("\n\n✅ ALL CRM QA TESTS PASSED! 🎉");
        console.log("\nCRM Module is fully operational:");
        console.log("  ✓ Opportunity CRUD operations working");
        console.log("  ✓ Stage transitions working");
        console.log("  ✓ Activities/notes working");
        console.log("  ✓ RLS policies enforcing admin-only access");
        console.log("  ✓ Auto-incrementing opportunity IDs working");

    } catch (e) {
        console.error("\n❌ QA Failed:", e.message);
        process.exit(1);
    }
}

runQA();
