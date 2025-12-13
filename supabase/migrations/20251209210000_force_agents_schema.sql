-- Force Re-creation of agents table to resolve sync issues
DROP TABLE IF EXISTS "public"."agents" CASCADE;

CREATE TABLE "public"."agents" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  "auth_user_id" uuid REFERENCES auth.users(id),
  "full_name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "phone" text,
  "company_name" text NOT NULL,
  "ein" text,
  "address" text,
  "city" text,
  "state" text,
  "zip" text,
  "commission_percent" integer DEFAULT 50,
  "bonus" text,
  "is_active" boolean DEFAULT true,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now()
);

-- RLS
ALTER TABLE "public"."agents" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for authenticated users" 
ON "public"."agents" FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated and service_role" 
ON "public"."agents" FOR INSERT 
TO authenticated, service_role 
WITH CHECK (true);

CREATE POLICY "Enable update for admins" 
ON "public"."agents" FOR UPDATE 
TO authenticated 
USING (
  (auth.jwt()->>'email')::text = 'ozan@loyalbrokerage.com' 
  OR (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
);

CREATE POLICY "Enable delete for admins" 
ON "public"."agents" FOR DELETE 
TO authenticated 
USING (
  (auth.jwt()->>'email')::text = 'ozan@loyalbrokerage.com' 
  OR (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
);

-- Grants
GRANT ALL ON TABLE "public"."agents" TO postgres;
GRANT ALL ON TABLE "public"."agents" TO anon;
GRANT ALL ON TABLE "public"."agents" TO authenticated;
GRANT ALL ON TABLE "public"."agents" TO service_role;
