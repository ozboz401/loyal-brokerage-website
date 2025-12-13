import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const agentHandler = async (req: Request) => {
    // 1. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const url = new URL(req.url)
        console.log("REQ URL:", url.pathname)

        // 2. Validate Environment Variables
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN')
        const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY')
        const MAILGUN_SENDER = Deno.env.get('MAILGUN_SENDER') || `no-reply@${MAILGUN_DOMAIN || 'loyalbrokerage.com'}`

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            console.error("CRITICAL: Missing Server Configuration")
            return new Response(
                JSON.stringify({ success: false, error: "Server Configuration Error" }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            )
        }

        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        // 3. Parse Body
        const body = await req.json().catch(() => ({}))
        const { email, password, fullName, companyName, phone, ein, address, city, state, zip, commission, bonus, status } = body

        if (!email || !password || !fullName || !companyName) {
            return new Response(
                JSON.stringify({ success: false, error: "Missing required fields" }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // STAGE 1: Create or Get Auth User
        console.log("STAGE: auth-create - starting for", email)
        let userId;

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'agent', full_name: fullName, company_name: companyName }
        })

        if (authError) {
            // Check if user already exists
            if (authError.message.includes("already registered") || authError.status === 422) {
                console.warn("User already exists. Fetching existing user...");
                // Fetch user by email to get ID
                // Note: listUsers requires pagination but search query support varies. filtering by email is not direct in listUsers options in older lib versions?
                // V2 admin.listUsers() doesn't filter perfectly by email? 
                // Actually we can try get user by email? No, 'getUserById'. 
                // We'll list users and filter? Or just assume we can't get it easily?
                // Faster way: attempt sign in? No admin context.
                // admin.listUsers()

                // Let's use listUsers filtering if supported, or iterate.
                const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
                if (listError) {
                    console.error("Failed to list users for duplicate check:", listError);
                    throw new Error("User exists but failed to retrieve account.");
                }

                const existingUser = listData.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
                if (existingUser) {
                    userId = existingUser.id;
                    console.log("Found existing user:", userId);
                    // Optional: Update password? No, existing user might have their own.
                    // But we should update metadata
                    await supabaseAdmin.auth.admin.updateUserById(userId, {
                        user_metadata: { role: 'agent', full_name: fullName, company_name: companyName }
                    });
                } else {
                    throw new Error("User reported as existing but not found in list.");
                }
            } else {
                console.error("Auth Error:", authError)
                return new Response(
                    JSON.stringify({ success: false, error: authError.message }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
                )
            }
        } else {
            userId = authData.user.id
        }

        // STAGE 2: Insert DB (Dynamic Schema Handling)
        console.log("STAGE: db-insert - starting")

        let dbError = null;
        let dbData = null;
        let schemaMode = 'v2';

        // Attempt 1: New Schema (commission_percent, is_active)
        const v2Payload = {
            auth_user_id: userId,
            full_name: fullName,
            email: email,
            phone: phone || null,
            company_name: companyName,
            ein: ein || null,
            address: address || null,
            city: city || null,
            state: state || null,
            zip: zip || null,
            commission_percent: commission ? parseInt(commission) : 50,
            is_active: status === 'Active',
            bonus: bonus || null,
            notes: null
        };

        const { data: d1, error: e1 } = await supabaseAdmin
            .from('agents')
            .insert([v2Payload])
            .select()
            .single();

        if (e1) {
            console.warn("V2 Insert Failed. Retrying with Legacy Schema...");

            // Attempt 2: Legacy Schema (commission, status as text)
            const notesContent = JSON.stringify({
                commission_percent: v2Payload.commission_percent,
                is_active: v2Payload.is_active,
                original_notes: null,
                v2_error: e1.message
            });


            const legacyPayload = {
                auth_user_id: userId,
                full_name: fullName,
                email: email,
                phone: phone || null,
                company_name: companyName,
                ein: ein || null,
                address: address || null,
                city: city || null,
                state: state || null,
                zip: zip || null,
                commission: commission ? commission.toString() : "50",
                status: status || 'Active',
                notes: `[MIGRATION_PENDING] ${notesContent}`
            };

            const { data: d2, error: e2 } = await supabaseAdmin
                .from('agents')
                .insert([legacyPayload])
                .select()
                .single();

            if (e2) {
                console.error("Legacy Insert Failed:", e2.message);

                // Attempt 3: Bare Minimum (Just ID and Names)
                const barePayload = {
                    auth_user_id: userId,
                    full_name: fullName,
                    email: email,
                    company_name: companyName,
                    notes: `[CRITICAL_MIGRATION] All Inserts Failed. Check Schema. Err2: ${e2.message}`
                };
                const { data: d3, error: e3 } = await supabaseAdmin
                    .from('agents')
                    .insert([barePayload])
                    .select()
                    .single();

                if (e3) {
                    dbError = e3;
                } else {
                    dbData = d3;
                    schemaMode = 'bare_minimum';
                }
            } else {
                dbData = d2;
                schemaMode = 'legacy';
            }
        } else {
            dbData = d1;
            schemaMode = 'v2';
        }

        if (dbError) {
            console.error("STAGE: db-insert error (Fatal)", dbError)
            // ROLLBACK AUTH
            await supabaseAdmin.auth.admin.deleteUser(userId)
            return new Response(
                JSON.stringify({ success: false, error: dbError.message }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // STAGE 3: Email
        let emailSent = false
        if (MAILGUN_API_KEY && MAILGUN_DOMAIN && !MAILGUN_API_KEY.includes('INSERT')) {
            try {
                const textBody = `Hi ${fullName},\n\nYour agent portal account has been created.\n\nEmail: ${email}\nTemporary Password: ${password}`
                const emailParams = new URLSearchParams({
                    from: `Loyal Brokerage <${MAILGUN_SENDER}>`,
                    to: email,
                    subject: 'Your Loyal Brokerage Agent Portal Access',
                    text: textBody
                })
                const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Basic ' + btoa('api:' + MAILGUN_API_KEY),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: emailParams,
                })
                if (res.ok) emailSent = true
                else console.error("Mailgun error", await res.text())
            } catch (e) {
                console.error("Mailgun exception", e)
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                agentId: dbData.id,
                authUserId: userId,
                emailSent: emailSent,
                schemaMode: schemaMode
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (fatalError: any) {
        console.error("STAGE: fatal-crash", fatalError)
        return new Response(
            JSON.stringify({
                success: false,
                error: fatalError.message || "Unknown Runtime Error"
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
}

if (import.meta.main) {
    serve(agentHandler)
}
