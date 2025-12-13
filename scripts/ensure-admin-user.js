
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

// Try to load from .env, but fallback to process env if running in environment with injected vars
const env = await load({ envPath: './.env' }).catch(() => ({}));
const SUPABASE_URL = Deno.env.get('VITE_SUPABASE_URL') || env['VITE_SUPABASE_URL'];
const RELEASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !RELEASE_KEY) {
    console.error("Missing ENV vars");
    Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, RELEASE_KEY);

const EMAIL = 'ozan@adafleet.com';
const PASSWORD = 'Temp123!';

async function ensureUser() {
    console.log(`Checking user: ${EMAIL}`);
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error("List Users Error:", error);
        Deno.exit(1);
    }

    const existingUser = users.find(u => u.email === EMAIL);

    if (existingUser) {
        console.log("User exists. Updating password...");
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: PASSWORD, email_confirm: true }
        );
        if (updateError) {
            console.error("Update failed:", updateError);
            Deno.exit(1);
        }
        console.log("Password updated.");
    } else {
        console.log("User does not exist. Creating...");
        const { error: createError } = await supabase.auth.admin.createUser({
            email: EMAIL,
            password: PASSWORD,
            email_confirm: true,
            user_metadata: { role: 'admin' } // Ensure admin role if needed by RLS
        });
        if (createError) {
            console.error("Create failed:", createError);
            Deno.exit(1);
        }
        console.log("User created.");
    }
}

ensureUser();
