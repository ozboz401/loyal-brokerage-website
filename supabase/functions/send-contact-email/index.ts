import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, phone, message } = await req.json()

    // Validate input
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN')
    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY')
    const MAILGUN_SENDER = Deno.env.get('MAILGUN_SENDER') || `no-reply@${MAILGUN_DOMAIN}`
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'ozan@loyalbrokerage.com'

    if (!MAILGUN_DOMAIN || !MAILGUN_API_KEY) {
      console.error('Missing Mailgun configuration')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // 1. Send Admin Notification
    const adminRes = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa('api:' + MAILGUN_API_KEY),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Loyal Contact Form <${MAILGUN_SENDER}>`,
          to: ADMIN_EMAIL,
          'h:Reply-To': email,
          subject: `New Contact Form Submission: ${name}`,
          text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}

Message:
${message}
          `,
        }),
      }
    )

    if (!adminRes.ok) {
      const errorText = await adminRes.text()
      console.error('Mailgun Admin Error:', errorText)
      throw new Error('Failed to send admin notification')
    }

    // 2. Send Auto-Response to User
    const userRes = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa('api:' + MAILGUN_API_KEY),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Loyal Brokerage <${MAILGUN_SENDER}>`,
          to: email,
          subject: 'We received your message – Loyal Brokerage',
          text: `Hi ${name}, 
Thank you for contacting Loyal Brokerage. Our team will get back to you shortly.`,
        }),
      }
    )

    if (!userRes.ok) {
      const errorText = await userRes.text()
      console.error('Mailgun Auto-Response Error:', errorText)
      // We don't fail the whole request if auto-response fails, but we log it
    }

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
