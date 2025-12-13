-- Carrier Applications Table Schema
-- Based on CarrierSignup.jsx form fields

CREATE TABLE IF NOT EXISTS public.carrier_applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),

    -- Business Info
    company_name text,
    dba text,
    business_type text, -- LLC, Corporation, Sole Proprietor, Partnership
    address_street text,
    address_city text,
    address_state text,
    address_zip text,
    mc_number text,
    dot_number text,
    ein text,
    years_in_business text, -- or int, using text to be safe with form string

    -- Contact Info
    primary_contact text,
    primary_phone text,
    primary_email text,
    dispatch_contact text,
    dispatch_phone text,
    billing_email text,
    after_hours_phone text,

    -- Fleet & Operations
    truck_count text, -- or int
    driver_count text, -- or int
    equipment_types text[], -- Array of strings
    operating_states text[], -- Array of strings
    hazmat boolean,
    safety_rating text, -- Satisfactory, Conditional, etc.

    -- Insurance
    liability_amount text,
    cargo_amount text,
    insurance_company text,
    agent_name text,
    agent_email text,
    agent_phone text,
    policy_expiration date,

    -- Documents (URLs)
    w9_url text,
    coi_url text,
    insurance_doc_url text,
    authority_letter_url text,
    agreement_url text,
    ach_url text,

    -- Compliance (Boolean checks)
    compliance_certified boolean DEFAULT false
);

-- Trigger Function
CREATE OR REPLACE FUNCTION public.trigger_carrier_signup_email()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'http://kong:8000/functions/v1/carrier-signup-email', -- Internal Kong URL for edge functions in Supabase
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('request.jwt.claim.role', true) || '"}',
      body := row_to_json(NEW)::jsonb
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_carrier_signup ON public.carrier_applications;
CREATE TRIGGER on_carrier_signup
AFTER INSERT ON public.carrier_applications
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_carrier_signup_email();

