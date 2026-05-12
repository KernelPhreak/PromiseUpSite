-- Promise Up Supabase schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  who_it_helps text,
  how_to_participate text,
  icon text,
  image_url text,
  category text,
  "order" integer not null default 0,
  is_active boolean not null default true,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date,
  time text,
  location text,
  category text,
  image_url text,
  is_active boolean not null default true,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create table if not exists public.board_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  bio text,
  photo_url text,
  ask_me_about text,
  "order" integer not null default 0,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  reason text,
  message text not null,
  status text not null default 'new',
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create table if not exists public.donation_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  donation_type text,
  message text,
  status text not null default 'new',
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create or replace function public.set_updated_date()
returns trigger as $$
begin
  new.updated_date = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_date on public.profiles;
create trigger set_profiles_updated_date before update on public.profiles
for each row execute function public.set_updated_date();

drop trigger if exists set_services_updated_date on public.services;
create trigger set_services_updated_date before update on public.services
for each row execute function public.set_updated_date();

drop trigger if exists set_events_updated_date on public.events;
create trigger set_events_updated_date before update on public.events
for each row execute function public.set_updated_date();

drop trigger if exists set_board_members_updated_date on public.board_members;
create trigger set_board_members_updated_date before update on public.board_members
for each row execute function public.set_updated_date();

drop trigger if exists set_contact_messages_updated_date on public.contact_messages;
create trigger set_contact_messages_updated_date before update on public.contact_messages
for each row execute function public.set_updated_date();

drop trigger if exists set_donation_inquiries_updated_date on public.donation_inquiries;
create trigger set_donation_inquiries_updated_date before update on public.donation_inquiries
for each row execute function public.set_updated_date();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.events enable row level security;
alter table public.board_members enable row level security;
alter table public.contact_messages enable row level security;
alter table public.donation_inquiries enable row level security;

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Public website can read active content.
drop policy if exists "public read active services" on public.services;
create policy "public read active services" on public.services for select using (is_active = true or public.is_admin());

drop policy if exists "public read active events" on public.events;
create policy "public read active events" on public.events for select using (is_active = true or public.is_admin());

drop policy if exists "public read board members" on public.board_members;
create policy "public read board members" on public.board_members for select using (true);

-- Public forms can create messages/inquiries.
drop policy if exists "public create contact messages" on public.contact_messages;
create policy "public create contact messages" on public.contact_messages for insert with check (true);

drop policy if exists "public create donation inquiries" on public.donation_inquiries;
create policy "public create donation inquiries" on public.donation_inquiries for insert with check (true);

-- Users can read own profile. Admin can read all profiles.
drop policy if exists "read own profile or admin" on public.profiles;
create policy "read own profile or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());

drop policy if exists "update own profile or admin" on public.profiles;
create policy "update own profile or admin" on public.profiles for update using (id = auth.uid() or public.is_admin());

-- Admin full access.
drop policy if exists "admin all services" on public.services;
create policy "admin all services" on public.services for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all events" on public.events;
create policy "admin all events" on public.events for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all board members" on public.board_members;
create policy "admin all board members" on public.board_members for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all contact messages" on public.contact_messages;
create policy "admin all contact messages" on public.contact_messages for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all donation inquiries" on public.donation_inquiries;
create policy "admin all donation inquiries" on public.donation_inquiries for all using (public.is_admin()) with check (public.is_admin());

-- After your admin account signs up, run this once with your email:
-- update public.profiles set role = 'admin' where email = 'you@example.com';
