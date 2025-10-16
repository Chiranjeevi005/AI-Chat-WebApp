-- ==========================================
-- DIRECT POLICY FIX FOR ROOM_MEMBERS TABLE
-- ==========================================

-- This SQL script fixes the infinite recursion issue in the room_members table policy
-- Run this in your Supabase SQL Editor to apply the fix

-- Drop the problematic policy
DROP POLICY IF EXISTS "room_members_select" ON room_members;

-- Create the corrected policy that allows users to see only their own memberships
CREATE POLICY "room_members_select" ON room_members
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    user_id = auth.uid()
  );

-- Reload the schema to apply changes immediately
NOTIFY pgrst, 'reload schema';

-- Optional: Verify the policy was created
-- SELECT tablename, policyname 
-- FROM pg_policy pol 
-- JOIN pg_class pc ON pc.oid = pol.polrelid 
-- JOIN pg_namespace n ON n.oid = pc.relnamespace 
-- WHERE n.nspname = 'public' 
-- AND pc.relname = 'room_members';