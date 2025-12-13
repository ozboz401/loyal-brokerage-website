import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Validation
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            return new Response(
                JSON.stringify({ success: false, error: "Server Configuration Error" }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            )
        }

        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        const body = await req.json().catch(() => ({}))
        const {
            agentId,
            authUserId, // Optional, can lookup if missing logic
            fullName,
            email,
            phone,
            companyName,
            ein,
            address,
            city,
            state,
            zip,
            commission,
            bonus,
            status,
            password // Optional update
        } = body

        if (!agentId || !email) {
            return new Response(
                JSON.stringify({ success: false, error: "Missing required fields (agentId, email)" }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // 1. Get the Agent to find auth_user_id if not provided
        let targetAuthId = authUserId;
        if (!targetAuthId) {
            const { data: agentData, error: agentError } = await supabaseAdmin
                .from('agents')
                .select('auth_user_id')
                .eq('id', agentId)
                .single();

            if (agentError || !agentData) {
                return new Response(
                    JSON.stringify({ success: false, error: "Agent not found" }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
                )
            }
            targetAuthId = agentData.auth_user_id;
        }

        // 2. Update Auth User (Email / Password / Metadata)
        const authUpdates: any = {
            email: email,
            user_metadata: {
                full_name: fullName,
                company_name: companyName,
                role: 'agent'
            }
        }
        if (password && password.trim().length >= 6) {
            authUpdates.password = password;
        }

        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            targetAuthId,
            authUpdates
        )

        if (authError) {
            console.error("Auth Update Error:", authError)
            return new Response(
                JSON.stringify({ success: false, error: "Failed to update Auth User: " + authError.message }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // 3. Update DB Record
        const dbUpdates = {
            full_name: fullName,
            email: email,
            phone: phone,
            company_name: companyName,
            ein: ein,
            address: address,
            city: city,
            state: state,
            zip: zip,
            commission_percent: commission ? parseFloat(commission) : 50, // Ensure number
            is_active: status === 'Active',
            bonus: bonus
        }

        const { data: updatedAgent, error: dbError } = await supabaseAdmin
            .from('agents')
            .update(dbUpdates)
            .eq('id', agentId)
            .select()
            .single()

        if (dbError) {
            console.error("DB Update Error:", dbError)
            return new Response(
                JSON.stringify({ success: false, error: "Failed to update Database: " + dbError.message }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        return new Response(
            JSON.stringify({ success: true, data: updatedAgent }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (err: any) {
        console.error("Fatal Error:", err)
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
