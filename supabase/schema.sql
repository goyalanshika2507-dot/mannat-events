-- ============================================================
-- Mannat Events — Phase 1 Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with role management
-- ============================================================
create table if not exists public.profiles (
  id         uuid        not null references auth.users (id) on delete cascade,
  email      text        not null,
  full_name  text,
  role       text        not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (id)
);

-- Auto-create profile on new user sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
create table if not exists public.bookings (
  id          uuid        not null default gen_random_uuid(),
  booking_id  text        not null unique,          -- e.g. MNT-20260707-A1B2
  user_id     uuid        not null references public.profiles (id) on delete restrict,
  check_in    date        not null,
  check_out   date        not null,
  duration    int         not null check (duration > 0),
  guests      int         not null check (guests > 0),
  meals       jsonb       not null default '[]'::jsonb,
  status      text        not null default 'pending'
                          check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  primary key (id),
  constraint check_out_after_check_in check (check_out > check_in)
);

-- meals jsonb structure per element:
-- { "day": 1, "lunch": "skip"|"veg"|"non-veg", "dinner": "skip"|"veg"|"non-veg" }
-- Breakfast is always included (implicit, not stored in meals array)

-- ============================================================
-- UPDATED_AT TRIGGER (shared)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
  before update on public.bookings
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.bookings  enable row level security;

-- Helper function: check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---- PROFILES policies ----

-- Users can read their own profile
create policy "profiles: user can read own"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles
create policy "profiles: admin can read all"
  on public.profiles for select
  using (public.is_admin());

-- Users can update their own profile (except role)
create policy "profiles: user can update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = 'user');

-- Admins can update any profile (including role)
create policy "profiles: admin can update all"
  on public.profiles for update
  using (public.is_admin());

-- ---- BOOKINGS policies ----

-- Users can insert their own bookings
create policy "bookings: user can insert own"
  on public.bookings for insert
  with check (auth.uid() = user_id);

-- Users can read their own bookings
create policy "bookings: user can read own"
  on public.bookings for select
  using (auth.uid() = user_id);

-- Admins can read all bookings
create policy "bookings: admin can read all"
  on public.bookings for select
  using (public.is_admin());

-- Admins can update any booking (status changes)
create policy "bookings: admin can update all"
  on public.bookings for update
  using (public.is_admin());

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists bookings_user_id_idx   on public.bookings (user_id);
create index if not exists bookings_status_idx    on public.bookings (status);
create index if not exists bookings_check_in_idx  on public.bookings (check_in);
create index if not exists bookings_booking_id_idx on public.bookings (booking_id);

-- ============================================================
-- GRANT USAGE
-- ============================================================
grant usage on schema public to anon, authenticated;
grant all on public.profiles to authenticated;
grant all on public.bookings  to authenticated;
grant select on public.profiles to anon;
