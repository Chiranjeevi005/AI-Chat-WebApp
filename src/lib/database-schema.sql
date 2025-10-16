-- Database schema for Chat App with Supabase

-- Create profiles table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null,
  email text unique,
  username text unique,
  display_name text,
  avatar_url text,
  role text default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now(),
  primary key (id)
);

-- Create rooms table
create table rooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Create messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id),
  content text,
  created_at timestamptz default now()
);

-- Create room_members table for tracking room participation
create table room_members (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id),
  joined_at timestamptz default now(),
  unique(room_id, user_id)
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table rooms enable row level security;
alter table messages enable row level security;
alter table room_members enable row level security;

-- RLS Policies for profiles
create policy "profiles_owner" on profiles
  for insert with check (auth.uid() = id);

create policy "profiles_select" on profiles
  for select using (true);

create policy "profiles_update" on profiles
  for update using (auth.uid() = id);

-- RLS Policies for rooms
create policy "rooms_select" on rooms 
  for select using (
    auth.role() = 'authenticated' and
    exists (
      select 1 from room_members rm 
      where rm.room_id = rooms.id and rm.user_id = auth.uid()
    )
  );

create policy "rooms_insert" on rooms 
  for insert with check (
    auth.role() = 'authenticated' and
    -- Users can only create rooms for themselves
    created_by = auth.uid()
  );

create policy "rooms_update" on rooms 
  for update using (
    auth.uid() = created_by or
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "rooms_delete" on rooms 
  for delete using (
    auth.uid() = created_by or
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- RLS Policies for messages
create policy "messages_select" on messages 
  for select using (
    auth.role() = 'authenticated' and
    exists (
      select 1 from room_members rm 
      where rm.room_id = messages.room_id and rm.user_id = auth.uid()
    )
  );

create policy "messages_insert" on messages 
  for insert with check (
    auth.role() = 'authenticated' and
    user_id = auth.uid() and
    exists (
      select 1 from room_members rm 
      where rm.room_id = room_id and rm.user_id = auth.uid()
    )
  );

create policy "messages_update" on messages 
  for update using (
    auth.uid() = user_id or
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() and p.role = 'admin'
    ) or
    exists (
      select 1 from rooms r 
      where r.id = messages.room_id and r.created_by = auth.uid()
    )
  );

create policy "messages_delete" on messages 
  for delete using (
    auth.uid() = user_id or
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() and p.role = 'admin'
    ) or
    exists (
      select 1 from rooms r 
      where r.id = messages.room_id and r.created_by = auth.uid()
    )
  );

-- RLS Policies for room_members
create policy "room_members_select" on room_members
  for select using (
    auth.role() = 'authenticated' and
    exists (
      select 1 from room_members rm2 
      where rm2.room_id = room_members.room_id and rm2.user_id = auth.uid()
    )
  );

create policy "room_members_insert" on room_members
  for insert with check (
    auth.role() = 'authenticated' and
    user_id = auth.uid()
  );

create policy "room_members_delete" on room_members
  for delete using (
    user_id = auth.uid() or
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() and p.role = 'admin'
    ) or
    exists (
      select 1 from rooms r 
      where r.id = room_members.room_id and r.created_by = auth.uid()
    )
  );

-- Function to automatically add room creator as a member
create or replace function add_room_creator_as_member()
returns trigger as $$
begin
  insert into room_members (room_id, user_id)
  values (new.id, new.created_by)
  on conflict (room_id, user_id) do nothing;
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically add room creator as a member
create trigger add_room_creator_as_member_trigger
  after insert on rooms
  for each row
  execute function add_room_creator_as_member();

-- Function to automatically add message sender as a room member
create or replace function add_message_sender_as_member()
returns trigger as $$
begin
  insert into room_members (room_id, user_id)
  values (new.room_id, new.user_id)
  on conflict (room_id, user_id) do nothing;
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically add message sender as a room member
create trigger add_message_sender_as_member_trigger
  after insert on messages
  for each row
  execute function add_message_sender_as_member();

-- Security: Grant necessary permissions
grant usage on schema public to authenticated;
grant all on profiles to authenticated;
grant all on rooms to authenticated;
grant all on messages to authenticated;
grant all on room_members to authenticated;

-- Security: Create indexes for better performance
create index if not exists idx_messages_room_id on messages(room_id);
create index if not exists idx_messages_user_id on messages(user_id);
create index if not exists idx_rooms_created_by on rooms(created_by);
create index if not exists idx_room_members_room_id on room_members(room_id);
create index if not exists idx_room_members_user_id on room_members(user_id);
create index if not exists idx_profiles_email on profiles(email);
create index if not exists idx_profiles_role on profiles(role);