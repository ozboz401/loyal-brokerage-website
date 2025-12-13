-- ============================================================================
-- RBAC POLICIES FOR OPPORTUNITIES TABLE
-- ============================================================================
-- This script enables Row Level Security (RLS) on the opportunities table
-- and creates policies for role-based access control.
--
-- Roles:
--   - admin: Full access to all opportunities
--   - agent: Access only to their own opportunities (created_by = auth.uid())
--
-- Generated: 2025-12-08
-- ============================================================================

-- ============================================================================
-- STEP 1: Enable Row Level Security
-- ============================================================================

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Drop existing policies (if any) to ensure clean deployment
-- ============================================================================

DROP POLICY IF EXISTS "agent read own opportunities" ON opportunities;
DROP POLICY IF EXISTS "agent insert own opportunities" ON opportunities;
DROP POLICY IF EXISTS "agent update own opportunities" ON opportunities;
DROP POLICY IF EXISTS "agent delete own opportunities" ON opportunities;
DROP POLICY IF EXISTS "admin full access" ON opportunities;
DROP POLICY IF EXISTS "Admins have full access to opportunities" ON opportunities;
DROP POLICY IF EXISTS "Agents see only their own opportunities" ON opportunities;
DROP POLICY IF EXISTS "Agents can create their own opportunities" ON opportunities;
DROP POLICY IF EXISTS "Agents can update their own opportunities" ON opportunities;
DROP POLICY IF EXISTS "Agents can delete their own opportunities" ON opportunities;

-- ============================================================================
-- STEP 3: Create ADMIN policy (full access to all opportunities)
-- ============================================================================

CREATE POLICY "admin full access"
ON opportunities
FOR ALL
TO authenticated
USING (
    -- Admin has full access if role is 'admin' in user_metadata
    (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
    OR
    -- Fallback: specific admin email (for backwards compatibility)
    (auth.jwt()->>'email')::text = 'ozan@loyalbrokerage.com'
);

-- ============================================================================
-- STEP 4: Create AGENT policies (restricted to own opportunities)
-- ============================================================================

-- Agent SELECT policy: Read only their own opportunities
CREATE POLICY "agent read own opportunities"
ON opportunities
FOR SELECT
TO authenticated
USING (
    auth.uid() = created_by
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'agent'
);

-- Agent INSERT policy: Create only with their user_id as created_by
CREATE POLICY "agent insert own opportunities"
ON opportunities
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = created_by
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'agent'
);

-- Agent UPDATE policy: Modify only their own opportunities
CREATE POLICY "agent update own opportunities"
ON opportunities
FOR UPDATE
TO authenticated
USING (
    auth.uid() = created_by
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'agent'
)
WITH CHECK (
    auth.uid() = created_by
);

-- Agent DELETE policy: Delete only their own opportunities
CREATE POLICY "agent delete own opportunities"
ON opportunities
FOR DELETE
TO authenticated
USING (
    auth.uid() = created_by
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'agent'
);

-- ============================================================================
-- STEP 5: Revoke public access (security hardening)
-- ============================================================================

REVOKE ALL ON opportunities FROM anon;
REVOKE ALL ON opportunities FROM public;

-- ============================================================================
-- DEPLOYMENT COMPLETE
-- ============================================================================
-- 
-- Verify policies are active:
--   SELECT * FROM pg_policies WHERE tablename = 'opportunities';
--
-- Test as admin:
--   SELECT * FROM opportunities; -- Should return ALL opportunities
--
-- Test as agent:
--   SELECT * FROM opportunities; -- Should return only opportunities where created_by = agent's user_id
--
-- ============================================================================
