
import fs from 'fs';

// Mock Data
const data = {
    company_name: "Test Preview LLC",
    dba: "TPL",
    mc_number: "123456",
    dot_number: "789012",
    address_street: "123 Freight Lane",
    address_city: "Trucktown",
    address_state: "TX",
    address_zip: "75001",
    ein: "99-9999999",
    years_in_business: "5",
    primary_contact_name: "John Driver",
    primary_email: "john@example.com",
    primary_phone: "555-123-4567",
    dispatch_contact_name: "Jane Dispatch",
    dispatch_phone: "555-987-6543",
    billing_email: "billing@example.com",
    number_of_trucks: 10,
    number_of_drivers: 12,
    equipment_dryvan: true,
    equipment_reefer: false,
    operating_states: ["TX", "CA", "NY"],

    // Some missing fields to test fallbacks
    hazmat_certified: null,

    w9_url: "http://example.com/w9.pdf"
};

// Re-implement logic from Edge Function for local verification
const HTML_TEMPLATE = `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">

<div style="max-width: 650px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">

  <h2 style="color: #111;">New Carrier Signup Received</h2>
  <p style="font-size: 15px; color: #444;">
    A new carrier has submitted their onboarding application. Full details are below.
  </p>

  <h3 style="color: #222; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Business Information</h3>
  <p><strong>Company:</strong> {{company_name}}</p>
  <p><strong>DBA:</strong> {{dba}}</p>
  <p><strong>MC Number:</strong> {{mc_number}}</p>
  <p><strong>DOT Number:</strong> {{dot_number}}</p>
  <p><strong>Address:</strong> {{address_street}}, {{address_city}}, {{address_state}} {{address_zip}}</p>
  <p><strong>EIN:</strong> {{ein}}</p>
  <p><strong>Years in Business:</strong> {{years_in_business}}</p>

  <h3 style="color: #222; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Contact Information</h3>
  <p><strong>Primary Contact:</strong> {{primary_contact}}</p>
  <p><strong>Primary Email:</strong> {{primary_email}}</p>
  <p><strong>Primary Phone:</strong> {{primary_phone}}</p>
  <p><strong>Dispatch Contact:</strong> {{dispatch_contact}}</p>
  <p><strong>Dispatch Phone:</strong> {{dispatch_phone}}</p>
  <p><strong>Billing Email:</strong> {{billing_email}}</p>

  <h3 style="color: #222; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Fleet & Operations</h3>
  <p><strong>Number of Trucks:</strong> {{num_trucks}}</p>
  <p><strong>Number of Drivers:</strong> {{num_drivers}}</p>
  <p><strong>Equipment Types:</strong> {{equipment_types}}</p>
  <p><strong>Operating States:</strong> {{operating_states}}</p>
  <p><strong>Hazmat Certified:</strong> {{hazmat}}</p>
  <p><strong>Safety Rating:</strong> {{safety_rating}}</p>

  <h3 style="color: #222; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Insurance Details</h3>
  <p><strong>Liability Coverage:</strong> {{liability_coverage}}</p>
  <p><strong>Cargo Coverage:</strong> {{cargo_coverage}}</p>
  <p><strong>Insurance Company:</strong> {{insurance_company}}</p>
  <p><strong>Agent Name:</strong> {{agent_name}}</p>
  <p><strong>Agent Phone:</strong> {{agent_phone}}</p>
  <p><strong>Agent Email:</strong> {{agent_email}}</p>
  <p><strong>Policy Expiration:</strong> {{policy_expiration}}</p>

  <h3 style="color: #222; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Documents Uploaded</h3>
  <p><strong>W9 Form:</strong> {{w9_status}}</p>
  <p><strong>COI:</strong> {{coi_status}}</p>
  <p><strong>Insurance Coverage Doc:</strong> {{insurance_doc_status}}</p>
  <p><strong>Carrier Agreement:</strong> {{agreement_status}}</p>
  <p><strong>ACH / Voided Check:</strong> {{ach_status}}</p>

  <br>
  <p style="font-size: 14px; color: #777;">
    View in Database: <strong>carrier_applications</strong>
  </p>

</div>

</body>
</html>`;

const safe = (v) => (v && v !== "" && v !== null && v !== undefined) ? v : "—";
const safeBool = (v) => v === true ? "Yes" : "No";
const safeArr = (v) => Array.isArray(v) ? v.join(", ") : safe(v);

let html = HTML_TEMPLATE;

const replacements = {
    "{{company_name}}": safe(data.company_name),
    "{{dba}}": safe(data.dba),
    "{{mc_number}}": safe(data.mc_number),
    "{{dot_number}}": safe(data.dot_number),
    "{{address_street}}": safe(data.address_street),
    "{{address_city}}": safe(data.address_city),
    "{{address_state}}": safe(data.address_state),
    "{{address_zip}}": safe(data.address_zip),
    "{{ein}}": safe(data.ein),
    "{{years_in_business}}": safe(data.years_in_business),

    "{{primary_contact}}": safe(data.primary_contact_name || data.primary_contact),
    "{{primary_email}}": safe(data.primary_email),
    "{{primary_phone}}": safe(data.primary_phone),
    "{{dispatch_contact}}": safe(data.dispatch_contact_name || data.dispatch_contact),
    "{{dispatch_phone}}": safe(data.dispatch_phone),
    "{{billing_email}}": safe(data.billing_email),

    "{{num_trucks}}": safe(data.number_of_trucks || data.truck_count),
    "{{num_drivers}}": safe(data.number_of_drivers || data.driver_count),

    "{{operating_states}}": safeArr(data.operating_states),
    "{{hazmat}}": safeBool(data.hazmat_certified || data.hazmat),
    "{{safety_rating}}": safe(data.safety_rating),

    "{{liability_coverage}}": safe(data.liability_coverage || data.liability_amount),
    "{{cargo_coverage}}": safe(data.cargo_coverage || data.cargo_amount),
    "{{insurance_company}}": safe(data.insurance_company),
    "{{agent_name}}": safe(data.agent_name),
    "{{agent_phone}}": safe(data.agent_phone),
    "{{agent_email}}": safe(data.agent_email),
    "{{policy_expiration}}": safe(data.policy_expiration),

    "{{w9_status}}": data.w9_url ? "Uploaded" : "Pending",
    "{{coi_status}}": data.insurance_doc_url ? "Uploaded" : "Pending",
    "{{insurance_doc_status}}": data.insurance_doc_url ? "Uploaded" : "Pending",
    "{{agreement_status}}": data.signed_carrier_agreement_url ? "Uploaded" : "Pending",
    "{{ach_status}}": data.ach_voided_check_url ? "Uploaded" : "Pending"
};

let equipment = [];
if (data.equipment_dryvan) equipment.push("Dry Van");
if (data.equipment_reefer) equipment.push("Reefer");
if (Array.isArray(data.equipment_types)) equipment = equipment.concat(data.equipment_types);

replacements["{{equipment_types}}"] = equipment.length > 0 ? equipment.join(", ") : "—";

for (const [key, val] of Object.entries(replacements)) {
    html = html.replace(new RegExp(key, 'g'), String(val));
}

fs.writeFileSync('email_preview.html', html);
console.log("Generated email_preview.html");
