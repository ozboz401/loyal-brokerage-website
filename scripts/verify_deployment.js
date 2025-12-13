import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || !serviceKey) {
    console.error("Missing environment variables!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const adminSupabase = createClient(supabaseUrl, serviceKey);

async function verify() {
    console.log('--- Verifying Deployment ---');

    // 1. Test Insert (Public Anon)
    console.log('1. Testing Public Insert...');
    const testData = {
        name: 'Deployment Robot',
        email: 'deploy@robot.com',
        message: 'Deployment verification test message ' + new Date().toISOString(),
        phone: '555-0101'
    };

    const { error: insertError } = await supabase
        .from('contact_messages')
        .insert([testData]);

    if (insertError) {
        console.error('❌ Insert failed:', insertError);
        process.exit(1);
    }
    console.log('✅ Insert successful (Write-Only)');

    // 2. Test Query (Admin Select)
    console.log('2. Testing Admin Select...');
    const { data: selectData, error: selectError } = await adminSupabase
        .from('contact_messages')
        .select('*')
        .eq('email', 'deploy@robot.com')
        .order('created_at', { ascending: false })
        .limit(1);

    if (selectError) {
        console.error('❌ Admin Select failed:', selectError);
        process.exit(1);
    }

    if (selectData && selectData.length > 0) {
        console.log('✅ Admin verification successful. Found record:', selectData[0].email);
    } else {
        console.error('❌ Admin verification failed. Record not found.');
        process.exit(1);
    }

    console.log('--- Deployment Verification COMPLETE ---');
}

verify();
