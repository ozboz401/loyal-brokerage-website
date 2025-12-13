
import { createClient } from "@supabase/supabase-js";
import fs from 'fs';
import path from 'path';

// Load Env
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

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.log("Missing Credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const ADMIN_EMAIL = 'ozan@loyalbrokerage.com';
const ADMIN_PASSWORD = 'admin_password_123'; // Temporary for testing/setup

async function setupUser() {
    console.log(`Setting up Admin User: ${ADMIN_EMAIL}`);

    // Check if user exists (by listing users, or just try query)
    // admin.listUsers() is easiest
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("List Users Failed:", listError);
        return;
    }

    const existingUser = users.find(u => u.email === ADMIN_EMAIL);

    if (existingUser) {
        console.log("Admin user already exists. Updating password...");
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: ADMIN_PASSWORD, email_confirm: true }
        );
        if (updateError) console.error("Update Failed:", updateError);
        else console.log("✅ Admin Password Updated.");
    } else {
        console.log("Creating Admin user...");
        const { data, error: createError } = await supabase.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true
        });
        if (createError) console.error("Create Failed:", createError);
        else console.log("✅ Admin User Created:", data.user.id);
    }
}

setupUser();
