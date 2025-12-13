import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing environment variables!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyEmail() {
    console.log('--- Verifying Email Function ---');

    const testPayload = {
        name: 'Email Verification Bot',
        email: 'ozan@loyalbrokerage.com', // Send to admin to verify delivery
        phone: '555-0000',
        message: 'This is a test message from the verification bot at ' + new Date().toISOString()
    };

    console.log('Invoking send-contact-email...');
    const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: testPayload
    });

    if (error) {
        console.error('❌ Function Invocation Failed:', error);
        if (error instanceof Error) {
            console.error('Message:', error.message);
        }
        // Try to decode if it is a function error response
        try {
            // context is usually hidden, but let's see.
        } catch (e) { }
    } else {
        console.log('✅ Function Response OK:', data);
    }
}

verifyEmail();
