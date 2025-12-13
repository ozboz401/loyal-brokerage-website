import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";

serve({
  "/": async (req: Request) => {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
        { status: 405 }
      );
    }

    try {
      const body = await req.json();
      const { to, name, company } = body;

      if (!to || !name || !company) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400 }
        );
      }

      const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
      const MAILGUN_DOMAIN = "mg.loyalbrokerage.com";
      const MAILGUN_BASE_URL = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

      if (!MAILGUN_API_KEY) {
        return new Response(
          JSON.stringify({ error: "MAILGUN_API_KEY missing" }),
          { status: 500 }
        );
      }

      // -----------------------------
      // 1) SEND EMAIL TO ADMIN
      // -----------------------------
      const adminData = new URLSearchParams({
        from: "Loyal Brokerage <postmaster@mg.loyalbrokerage.com>",
        to: "ozan@loyalbrokerage.com",
        subject: "New Carrier Application",
        text:
`A new carrier application has been submitted:

Name: ${name}
Email: ${to}
Company: ${company}

Please review the application and follow up accordingly.
`
      });

      const adminResponse = await fetch(MAILGUN_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa("api:" + MAILGUN_API_KEY),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: adminData,
      });

      // -----------------------------
      // 2) AUTO-REPLY TO CARRIER
      // -----------------------------
      const carrierData = new URLSearchParams({
        from: "Loyal Brokerage <postmaster@mg.loyalbrokerage.com>",
        to: to,
        subject: "Thank You For Your Application",
        text:
`Thank you for your interest in partnering with Loyal Brokerage!

We have received your carrier application and our team will review your information shortly.

If we need additional details, we will reach out directly.

Thank you,
Loyal Brokerage LLC`
      });

      const carrierResponse = await fetch(MAILGUN_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa("api:" + MAILGUN_API_KEY),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: carrierData,
      });

      return new Response(
        JSON.stringify({
          message: "Emails sent successfully",
          adminStatus: adminResponse.status,
          carrierStatus: carrierResponse.status,
        }),
        { status: 200 }
      );

    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500 }
      );
    }
  },
});

