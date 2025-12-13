import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing environment variables!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('--- STARTING EMAIL FORENSICS DIAGNOSIS ---');
    console.time('Execution Time');

    const payload = {
        name: "FORENSICS TEST",
        email: "forensics@loyalbrokerage.com",
        phone: "000-000-0000",
        message: "This is a FORENSICS MODE execution test."
    };

    console.log('1. Invoking function "send-contact-email"...');
    console.log('   Payload:', JSON.stringify(payload));

    try {
        const { data, error } = await supabase.functions.invoke('send-contact-email', {
            body: payload
        });

        console.timeEnd('Execution Time');

        if (error) {
            console.error('❌ FUNCTION ERROR DETECTED');
            console.error('   Error Object:', error);
            if (error instanceof Error) {
                console.error('   Message:', error.message);
                console.error('   Stack:', error.stack);
            }
            // Try to inspect context if available
            try { console.log('   Context:', JSON.stringify(error.context)); } catch { }

            // Specific check for HTML response (often 404 or 500 html page from Supabase)
            if (typeof error === 'string' && error.trim().startsWith('<')) {
                console.error('   Type: HTML Response (Likely 404/500)');
            }
        } else {
            console.log('✅ FUNCTION SUCCESS REPORTED');
            console.log('   Data:', JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error('❌ UNHANDLED EXCEPTION DURING INVOCATION');
        console.error(e);
    }
    console.log('--- DIAGNOSIS COMPLETE ---');
}

diagnose();
