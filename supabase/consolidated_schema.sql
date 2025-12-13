
-- Forces table creation if missing
CREATE TABLE IF NOT EXISTS public.agents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    company_name text,
    ein text,
    address text,
    city text,
    state text,
    zip text,
    commission_percent int DEFAULT 50,
    bonus text,
    is_active boolean DEFAULT true,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Allow Service Role full access (backend)
CREATE POLICY "Service Role Full Access" ON public.agents
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Deny Anon/Auth (Explicitly managed via Edge Function for creation)
-- Read access might be needed for admin dashboard users
CREATE POLICY "Admins can view agents" ON public.agents
    FOR SELECT
    TO authenticated
    USING (true);

-- TMS Customers Table
CREATE TABLE IF NOT EXISTS public.tms_customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    contact_name text,
    email text,
    phone text,
    address text,
    payment_terms text DEFAULT 'Net 30',
    credit_status text DEFAULT 'Approved',
    avg_rate numeric,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- CRM Opportunities Table
CREATE TABLE IF NOT EXISTS public.crm_opportunities (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name text NOT NULL,
    contact_email text,
    contact_phone text,
    company_name text,
    carrier_name text,
    load_id uuid,
    stage text DEFAULT 'Prospect',
    estimated_rate numeric,
    agent_id uuid, -- Link to agents if desired
    agent_name text,
    notes text,
    next_follow_up timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- CRM Activities Table
CREATE TABLE IF NOT EXISTS public.crm_activities (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id uuid REFERENCES public.crm_opportunities(id) ON DELETE CASCADE,
    activity_type text NOT NULL,
    description text,
    agent_id uuid,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS for new tables
ALTER TABLE public.tms_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

-- Allow access (Simplified for now - can be refined)
CREATE POLICY "Enable all access for authenticated users" ON public.tms_customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.crm_opportunities FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.crm_activities FOR ALL TO authenticated USING (true);

