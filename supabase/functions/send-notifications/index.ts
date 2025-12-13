import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { type, customerEmail, slackWebhookUrl, discordWebhookUrl, data } = await req.json()
        const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'ozan@loyalbrokerage.com'
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
    }

        // 2. Send Slack Webhook
        if (slackWebhookUrl) {
        try {
            const slackMessage = {
                text: `🚨 New ${type} submission!`,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*🚨 New ${type} submission!*`
                        }
                    },
                    {
                        type: "section",
                        fields: [
                            { type: "mrkdwn", text: `*Company:*\n${data.company_name || 'N/A'}` },
                            { type: "mrkdwn", text: `*Contact:*\n${data.contact_name || data.primary_contact} / ${data.email || data.primary_email}` },
                            { type: "mrkdwn", text: `*Pickup:*\n${data.pickup_city || 'N/A'}, ${data.pickup_state || 'N/A'}` },
                            { type: "mrkdwn", text: `*Delivery:*\n${data.delivery_city || 'N/A'}, ${data.delivery_state || 'N/A'}` }
                        ]
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "Full payload stored in Supabase."
                        }
                    }
                ]
            }

            await fetch(slackWebhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(slackMessage)
            })
            slackSent = true
        } catch (e) {
            console.error("Slack error:", e)
        }
    }

    // 3. Send Discord Webhook
    if (discordWebhookUrl) {
        try {
            const discordMessage = {
                content: `🚨 New ${type} submission received!`,
                embeds: [{
                    title: "Submission Details",
                    description: `Company: ${data.company_name || 'N/A'}\nContact: ${data.contact_name || data.primary_contact || 'N/A'}`,
                    color: 5814783,
                    fields: [
                        { name: "Email", value: `${data.email || data.primary_email || 'N/A'}`, inline: true },
                        { name: "Phone", value: `${data.phone || data.primary_phone || 'N/A'}`, inline: true }
                    ]
                }]
            }

            await fetch(discordWebhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(discordMessage)
            })
            discordSent = true
        } catch (e) {
            console.error("Discord error:", e)
        }
    }

    // 4. Log to Supabase
    const { error: logError } = await supabase.from('notification_logs').insert({
        event_type: type,
        admin_email: adminEmail,
        customer_email: customerEmail,
        slack_sent: slackSent,
        discord_sent: discordSent,
        email_sent: emailSent,
        payload: data
    })

    if (logError) console.error("Log error:", logError)

    return new Response(
        JSON.stringify({ success: true, emailSent, slackSent, discordSent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

} catch (error) {
    return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
}
})
