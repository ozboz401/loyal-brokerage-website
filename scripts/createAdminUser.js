import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
const envFile = readFileSync(envPath, 'utf-8');

const env = {};
envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length) {
            env[key.trim()] = valueParts.join('=').trim();
        }
    }
});

// Configuration
const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ ERROR: Missing Supabase credentials');
    console.error('SUPABASE_URL:', SUPABASE_URL ? '✓ Found' : '✗ Missing');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓ Found' : '✗ Missing');
    process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const ADMIN_USER = {
    email: 'ozan@loyalbrokerage.com',
    password: 'Gunabel2011*',
    role: 'admin'
};

async function createAdminUser() {
    console.log('🔐 Creating Admin User...\n');
    console.log('Email:', ADMIN_USER.email);
    console.log('Role:', ADMIN_USER.role);
    console.log('-'.repeat(50));

    try {
        // Check if user exists
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            throw new Error(`Failed to list users: ${listError.message}`);
        }

        const userExists = existingUsers.users.find(u => u.email === ADMIN_USER.email);

        if (userExists) {
            console.log('\n⚠️  User already exists with ID:', userExists.id);

            // Update password and metadata
            const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
                userExists.id,
                {
                    password: ADMIN_USER.password,
                    user_metadata: {
                        role: ADMIN_USER.role,
                        name: 'Ozan Akdemir'
                    }
                }
            );

            if (updateError) {
                throw new Error(`Failed to update user: ${updateError.message}`);
            }

            console.log('✅ User updated successfully');
            console.log('User ID:', updatedUser.user.id);
            console.log('Email:', updatedUser.user.email);
            console.log('Role:', updatedUser.user.user_metadata?.role);
            console.log('\n✨✨✨ ADMIN USER READY ✨✨✨');
            console.log('\n🔑 Login at /admin with:');
            console.log('   Email:', ADMIN_USER.email);
            console.log('   Password: Gunabel2011*');
            return;
        }

        // Create new user
        const { data, error } = await supabase.auth.admin.createUser({
            email: ADMIN_USER.email,
            password: ADMIN_USER.password,
            email_confirm: true,
            user_metadata: {
                role: ADMIN_USER.role,
                name: 'Ozan Akdemir'
            }
        });

        if (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }

        console.log('\n✅ Admin user created successfully!');
        console.log('User ID:', data.user.id);
        console.log('Email:', data.user.email);
        console.log('Role:', data.user.user_metadata.role);
        console.log('\n✨✨✨ ADMIN USER READY ✨✨✨');
        console.log('\n🔑 Login at /admin with:');
        console.log('   Email:', ADMIN_USER.email);
        console.log('   Password: Gunabel2011*');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

createAdminUser();
