-- Create the carrier_applications table
CREATE TABLE carrier_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now(),
  
  -- Business Information
  company_name text,
  dba text,
  business_type text,
  address_street text,
  address_city text,
  address_state text,
  address_zip text,
  mc_number text,
  dot_number text,
  ein text,
  years_in_business int,
  
  -- Contact Information
  primary_contact text,
  primary_phone text,
  primary_email text,
  dispatch_contact text,
  dispatch_phone text,
  billing_email text,
  after_hours_phone text,
  
  -- Fleet / Operations
  truck_count int,
  driver_count int,
  equipment_types text[], -- Array of strings
  operating_states text[], -- Array of strings
  hazmat boolean,
  safety_rating text,
  
  -- Insurance Details
  liability_amount numeric,
  cargo_amount numeric,
  insurance_company text,
  agent_name text,
  agent_email text,
  agent_phone text,
  policy_expiration date,
  
  -- Document URLs
  w9_url text,
  coi_url text,
  insurance_doc_url text,
  authority_letter_url text,
  agreement_url text,
  ach_url text,
  
  -- Compliance
  compliance_certified boolean DEFAULT false
);

-- Set up storage
-- Bucket name: 'carrier_docs'
-- Structure: /carrier_docs/{carrier_id}/{filename}

-- Create the quotes table (Legacy, kept for reference or migration)
CREATE TABLE quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now(),
  company_name text,
  contact_name text,
  email text,
  phone text,
  pickup_city text,
  pickup_state text,
  delivery_city text,
  delivery_state text,
  pickup_date date,
  delivery_date date,
  equipment_type text,
  commodity text,
  weight text,
  pallets text,
  special_notes text,
  attachment_url text,
  status text DEFAULT 'New'
);

-- NEW: shipping_quotes table (Per specific requirements)
CREATE TABLE shipping_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now(),
  
  company_name text,
  contact_name text,
  email text,
  phone text,
  
  pickup_city text,
  pickup_state text,
  delivery_city text,
  delivery_state text,
  
  equipment_type text,
  commodity text,
  weight text,
  pallet_count text, -- Matches 'Pallet Count' requirement (mapped from form 'pallets')
  
  special_notes text,
  
  created_by text DEFAULT 'web_form',
  status text DEFAULT 'New'
);

-- Set up storage for attachments
-- Bucket name: 'attachments'
-- Structure: /quote_attachments/{filename}

-- Create table for logging notifications
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text,
  admin_email text,
  customer_email text,
  slack_sent boolean,
  discord_sent boolean,
  email_sent boolean,
  payload jsonb,
  created_at timestamp DEFAULT now()
);
