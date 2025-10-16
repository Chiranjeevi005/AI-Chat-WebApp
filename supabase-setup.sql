-- ==========================================
-- COMPLETE DATABASE SCHEMA SETUP FOR CHAT APP
-- ==========================================
-- This script creates all necessary tables with proper relationships and RLS policies
-- Organized in logical sections for easy understanding and maintenance

-- ==========================================
-- SECTION 1: TABLE STRUCTURE UPDATES
-- ==========================================

-- Add missing columns to existing rooms table
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure the profiles table has all necessary columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure the messages table has all necessary columns
ALTER TABLE messages ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES rooms(id) ON DELETE CASCADE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure the room_members table has all necessary columns
ALTER TABLE room_members ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES rooms(id) ON DELETE CASCADE;
ALTER TABLE room_members ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id);
ALTER TABLE room_members ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ DEFAULT NOW();

-- ==========================================
-- SECTION 2: DATABASE INDEXES FOR PERFORMANCE
-- ==========================================

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_rooms_created_by ON rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ==========================================
-- SECTION 3: DATA INITIALIZATION
-- ==========================================

-- Update existing rooms to have a default created_by value
-- This ensures all rooms have an owner for RLS policies
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Get the first user ID to use as default owner
    SELECT id INTO first_user_id FROM profiles LIMIT 1;
    
    -- If we found a user, assign them as owner of rooms without owners
    IF first_user_id IS NOT NULL THEN
        UPDATE rooms SET created_by = first_user_id WHERE created_by IS NULL;
    END IF;
END $$;

-- ==========================================
-- SECTION 4: ROW LEVEL SECURITY (RLS) SETUP
-- ==========================================

-- Enable RLS on all tables to control data access
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- 4.1: REMOVE EXISTING POLICIES (IF ANY)
-- ------------------------------------------
DROP POLICY IF EXISTS "profiles_owner" ON profiles;
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "rooms_select" ON rooms;
DROP POLICY IF EXISTS "rooms_insert" ON rooms;
DROP POLICY IF EXISTS "rooms_update" ON rooms;
DROP POLICY IF EXISTS "rooms_delete" ON rooms;
DROP POLICY IF EXISTS "messages_select" ON messages;
DROP POLICY IF EXISTS "messages_insert" ON messages;
DROP POLICY IF EXISTS "messages_update" ON messages;
DROP POLICY IF EXISTS "messages_delete" ON messages;
DROP POLICY IF EXISTS "room_members_select" ON room_members;
DROP POLICY IF EXISTS "room_members_insert" ON room_members;
DROP POLICY IF EXISTS "room_members_delete" ON room_members;

-- ------------------------------------------
-- 4.2: PROFILES TABLE POLICIES
-- ------------------------------------------
-- Users can only create their own profile
CREATE POLICY "profiles_owner" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Everyone can read profiles (needed for displaying user info)
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ------------------------------------------
-- 4.3: ROOMS TABLE POLICIES
-- ------------------------------------------
-- Users can only see rooms they are members of
CREATE POLICY "rooms_select" ON rooms 
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM room_members rm 
      WHERE rm.room_id = rooms.id AND rm.user_id = auth.uid()
    )
  );

-- Authenticated users can create rooms, but must be the creator
CREATE POLICY "rooms_insert" ON rooms 
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    created_by = auth.uid()
  );

-- Users can update rooms they created, or admins can update any room
CREATE POLICY "rooms_update" ON rooms 
  FOR UPDATE USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Users can delete rooms they created, or admins can delete any room
CREATE POLICY "rooms_delete" ON rooms 
  FOR DELETE USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ------------------------------------------
-- 4.4: MESSAGES TABLE POLICIES
-- ------------------------------------------
-- Users can only see messages in rooms they are members of
CREATE POLICY "messages_select" ON messages 
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM room_members rm 
      WHERE rm.room_id = messages.room_id AND rm.user_id = auth.uid()
    )
  );

-- Users can only send messages in rooms they are members of
CREATE POLICY "messages_insert" ON messages 
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM room_members rm 
      WHERE rm.room_id = room_id AND rm.user_id = auth.uid()
    )
  );

-- Users can update their own messages, admins can update any, room creators can update any in their room
CREATE POLICY "messages_update" ON messages 
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM rooms r 
      WHERE r.id = messages.room_id AND r.created_by = auth.uid()
    )
  );

-- Users can delete their own messages, admins can delete any, room creators can delete any in their room
CREATE POLICY "messages_delete" ON messages 
  FOR DELETE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM rooms r 
      WHERE r.id = messages.room_id AND r.created_by = auth.uid()
    )
  );

-- ------------------------------------------
-- 4.5: ROOM_MEMBERS TABLE POLICIES
-- ------------------------------------------
-- Users can see their own room memberships
CREATE POLICY "room_members_select" ON room_members
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    user_id = auth.uid()
  );

-- Authenticated users can add themselves to rooms
CREATE POLICY "room_members_insert" ON room_members
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    user_id = auth.uid()
  );

-- Users can remove themselves, admins can remove anyone, room creators can remove anyone from their room
CREATE POLICY "room_members_delete" ON room_members
  FOR DELETE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM rooms r 
      WHERE r.id = room_members.room_id AND r.created_by = auth.uid()
    )
  );

-- ==========================================
-- SECTION 5: AUTOMATION FUNCTIONS & TRIGGERS
-- ==========================================

-- ------------------------------------------
-- 5.1: REMOVE EXISTING FUNCTIONS & TRIGGERS
-- ------------------------------------------
DROP FUNCTION IF EXISTS add_room_creator_as_member() CASCADE;
DROP FUNCTION IF EXISTS add_message_sender_as_member() CASCADE;

-- ------------------------------------------
-- 5.2: ROOM CREATOR AUTO-MEMBERSHIP FUNCTION
-- ------------------------------------------
-- Automatically adds room creator as a member when room is created
CREATE OR REPLACE FUNCTION add_room_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if created_by is set
  IF NEW.created_by IS NOT NULL THEN
    INSERT INTO room_members (room_id, user_id)
    VALUES (NEW.id, NEW.created_by)
    ON CONFLICT (room_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for the above function
DROP TRIGGER IF EXISTS add_room_creator_as_member_trigger ON rooms;
CREATE TRIGGER add_room_creator_as_member_trigger
  AFTER INSERT ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION add_room_creator_as_member();

-- ------------------------------------------
-- 5.3: MESSAGE SENDER AUTO-MEMBERSHIP FUNCTION
-- ------------------------------------------
-- Automatically adds message sender as a room member when they send a message
CREATE OR REPLACE FUNCTION add_message_sender_as_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if both user_id and room_id are set
  IF NEW.user_id IS NOT NULL AND NEW.room_id IS NOT NULL THEN
    INSERT INTO room_members (room_id, user_id)
    VALUES (NEW.room_id, NEW.user_id)
    ON CONFLICT (room_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for the above function
DROP TRIGGER IF EXISTS add_message_sender_as_member_trigger ON messages;
CREATE TRIGGER add_message_sender_as_member_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION add_message_sender_as_member();

-- ==========================================
-- SECTION 6: PERMISSIONS & ACCESS CONTROL
-- ==========================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON rooms TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON room_members TO authenticated;

-- ==========================================
-- SECTION 7: SCHEMA REFRESH
-- ==========================================

-- Notify PostgREST to reload the schema
-- This ensures all changes take effect immediately
NOTIFY pgrst, 'reload schema';

-- ==========================================
-- SECTION 8: VALIDATION QUERIES
-- ==========================================
-- Run these queries to verify the setup was successful:

-- Check if all tables exist with correct columns:
-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name IN ('profiles', 'rooms', 'messages', 'room_members') 
-- ORDER BY table_name, ordinal_position;

-- Check if RLS is enabled on all tables:
-- SELECT tablename, relrowsecurity 
-- FROM pg_class c 
-- JOIN pg_namespace n ON c.relnamespace = n.oid 
-- WHERE n.nspname = 'public' 
-- AND tablename IN ('profiles', 'rooms', 'messages', 'room_members');

-- Check if all policies exist:
-- SELECT tablename, policyname 
-- FROM pg_policy pol 
-- JOIN pg_class pc ON pc.oid = pol.polrelid 
-- JOIN pg_namespace n ON n.oid = pc.relnamespace 
-- WHERE n.nspname = 'public' 
-- AND pc.relname IN ('profiles', 'rooms', 'messages', 'room_members');

-- Check if indexes exist:
-- SELECT indexname, tablename 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('profiles', 'rooms', 'messages', 'room_members');

-- Check if functions exist:
-- SELECT proname 
-- FROM pg_proc p 
-- JOIN pg_namespace n ON p.pronamespace = n.oid 
-- WHERE n.nspname = 'public' 
-- AND proname IN ('add_room_creator_as_member', 'add_message_sender_as_member');

-- ==========================================
-- SECTION 9: POLICY FIXES
-- ==========================================
-- Fix for room_members_select policy to prevent infinite recursion
-- This ensures users can only see their own room memberships

DROP POLICY IF EXISTS "room_members_select" ON room_members;
CREATE POLICY "room_members_select" ON room_members
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    user_id = auth.uid()
  );

-- Notify PostgREST to reload the schema
-- This ensures all changes take effect immediately
NOTIFY pgrst, 'reload schema';
