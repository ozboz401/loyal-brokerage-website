// File: request-quote-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ENV Keys
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");

const mailgunUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

// --- Mail Sender Helper ---
async function sendEmail(to: string, subject: string, html: string) {
  const body = new FormData();
  body.append("from", "Loyal Brokerage <no-reply@mg.loyalbrokerage.com>");
  body.append("to", to);
  body.append("subject", subject);
  body.append("html", html);

  const res = await fetch(mailgunUrl, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`api:${MAILGUN_API_KEY}`),
    },
    body,
  });

  const data = await res.text();
  console.log("Mailgun response:", data);
  return res.ok;
}

// --- MAIN FUNCTION ---
serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record ?? {};

    // -------------------------
    // INTERNAL EMAIL (TO YOU)
    // -------------------------
    const internalHtml = `
      <h2>📦 New Freight Quote Request</h2>

      <h3>Contact Information</h3>
      <p><strong>Company:</strong> ${record.company_name ?? "-"}</p>
      <p><strong>Contact:</strong> ${record.contact_name ?? "-"}</p>
      <p><strong>Email:</strong> ${record.email ?? "-"}</p>
      <p><strong>Phone:</strong> ${record.phone ?? "-"}</p>

      <h3>Pickup</h3>
      <p><strong>City:</strong> ${record.pickup_city ?? "-"}</p>
      <p><strong>State:</strong> ${record.pickup_state ?? "-"}</p>
      <p><strong>Date:</strong> ${record.pickup_date ?? "-"}</p>

      <h3>Delivery</h3>
      <p><strong>City:</strong> ${record.delivery_city ?? "-"}</p>
      <p><strong>State:</strong> ${record.delivery_state ?? "-"}</p>
      <p><strong>Date:</strong> ${record.delivery_date ?? "-"}</p>
      
      <h3>Load Details</h3>
      <p><strong>Equipment:</strong> ${record.equipment_type ?? "-"}</p>
      <p><strong>Commodity:</strong> ${record.commodity ?? "-"}</p>
      <p><strong>Weight:</strong> ${record.weight ?? "-"}</p>
      <p><strong>Pallets:</strong> ${record.pallets ?? "-"}</p>
      <p><strong>Notes:</strong> ${record.special_notes ?? "-"}</p>
    `;

    await sendEmail(
      "ozan@loyalbrokerage.com",
      "New Freight Quote Request",
      internalHtml
    );

    // -------------------------
    // CUSTOMER CONFIRMATION EMAIL
    // -------------------------
    const customerHtml = `
      <h2>Thank You for Your Freight Quote Request!</h2>
      <p>Hello ${record.contact_name ?? ""},</p>

      <p>We have received your request and our team is reviewing the details.</p>

      <p><strong>Summary of Your Request:</strong></p>
      <ul>
        <li><strong>Pickup:</strong> ${record.pickup_city ?? "-"}, ${
          record.pickup_state ?? "-"
        }</li>
        <li><strong>Delivery:</strong> ${record.delivery_city ?? "-"}, ${
          record.delivery_state ?? "-"
        }</li>
        <li><strong>Equipment Needed:</strong> ${
          record.equipment_type ?? "-"
        }</li>
        <li><strong>Weight:</strong> ${record.weight ?? "-"}</li>
      </ul>

      <p>We will reach out to you shortly with pricing and additional details.</p>

      <br/>
      <p>Best regards,</p>
      <p><strong>Loyal Brokerage Team</strong></p>
    `;

    if (record.email) {
      await sendEmail(record.email, "We Received Your Quote Request", customerHtml);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("Function error:", err);
    return new Response("Internal Error", { status: 500 });
  }
});

