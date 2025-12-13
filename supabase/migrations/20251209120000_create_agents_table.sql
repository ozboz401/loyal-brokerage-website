-- Create the agents table if it doesn't exist
create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id),
  full_name text not null,
  email text not null unique,
  phone text,
  company_name text not null,
  ein text,
  address text,
  city text,
  state text,
  zip text,
  commission_percent int default 50, -- Updated to match code
  bonus text,
  is_active boolean default true,    -- Updated to match code
  notes text,                        -- Added for fallback storage checks
  created_at timestamp default now()
);

alter table agents enable row level security;

DROP POLICY IF EXISTS "Enable read access for all users" ON agents;
create policy "Enable read access for all users" on agents for select using (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON agents;
create policy "Enable insert for authenticated users only" on agents for insert with check (auth.role() = 'authenticated' OR auth.role() = 'service_role'); -- Added service_role for Edge Function

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON agents;
create policy "Enable update for authenticated users only" on agents for update using (auth.role() = 'authenticated');

