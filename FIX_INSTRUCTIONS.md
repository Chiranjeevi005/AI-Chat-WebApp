# Database Policy Fix Instructions

## Issue
You're experiencing 500 server errors when trying to access the `room_members` table. This is caused by an infinite recursion in the Row Level Security (RLS) policy for the `room_members` table.

## Root Cause
The current `room_members_select` policy has a circular dependency:
```sql
CREATE POLICY "room_members_select" ON room_members
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM room_members rm2 
      WHERE rm2.room_id = room_members.room_id AND rm2.user_id = auth.uid()
    )
  );
```

This policy requires a user to be a member of a room to see memberships for that room, creating an infinite loop.

## Solution
Replace the problematic policy with a simpler one that allows users to see only their own memberships.

## Manual Fix Instructions

1. Go to your Supabase Dashboard
2. Navigate to "SQL Editor" in the left sidebar
3. Create a new query and paste the following SQL:

```sql
-- Fix the room_members policy
DROP POLICY IF EXISTS "room_members_select" ON room_members;

CREATE POLICY "room_members_select" ON room_members
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    user_id = auth.uid()
  );

-- Reload the schema to apply changes immediately
NOTIFY pgrst, 'reload schema';
```

4. Click "Run" to execute the query

## Verification
After applying the fix, restart your development server:
```bash
npm run dev
```

The 500 errors should no longer occur when accessing chat rooms.

## Why This Fix Works
The new policy is much simpler and more direct:
- Users can only see room memberships where they are the user (`user_id = auth.uid()`)
- This eliminates the circular dependency that was causing the infinite recursion
- It still maintains security by ensuring users can only see their own memberships