-- ============================================================
-- Mannat Events — Phase 3 CMS Migration Schema
-- Run this in your Supabase SQL Editor to initialize the tables
-- ============================================================

-- 1. Extend wedding_functions if needed to support lunch vs dinner filter
alter table public.wedding_functions 
  add column if not exists type text not null default 'both' check (type in ('lunch', 'dinner', 'both'));

-- 2. CREATE TABLE: menu_categories
create table if not exists public.menu_categories (
  id          text        not null,
  label       text        not null,
  emoji       text        not null,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (id)
);

alter table public.menu_categories enable row level security;

create policy "menu_categories: public read"
  on public.menu_categories for select using (true);

create policy "menu_categories: admin all"
  on public.menu_categories for all using (public.is_admin()) with check (public.is_admin());

-- 3. CREATE TABLE: menu_items
create table if not exists public.menu_items (
  id          uuid        not null default gen_random_uuid(),
  name        text        not null,
  sub_label   text,
  type        text        not null check (type in ('veg', 'non-veg')),
  is_active   boolean     not null default true,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (id)
);

alter table public.menu_items enable row level security;

create policy "menu_items: public read"
  on public.menu_items for select using (is_active = true);

create policy "menu_items: admin all"
  on public.menu_items for all using (public.is_admin()) with check (public.is_admin());

-- 4. CREATE TABLE: banquet_packages
create table if not exists public.banquet_packages (
  id             text        not null,
  name           text        not null,
  meal_type      text        not null check (meal_type in ('veg', 'non-veg')),
  price_per_head int         not null,
  tagline        text        not null,
  is_active      boolean     not null default true,
  sort_order     int         not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  primary key (id)
);

alter table public.banquet_packages enable row level security;

create policy "banquet_packages: public read"
  on public.banquet_packages for select using (is_active = true);

create policy "banquet_packages: admin all"
  on public.banquet_packages for all using (public.is_admin()) with check (public.is_admin());

-- 5. CREATE TABLE: package_categories (defines categories and limits per package)
create table if not exists public.package_categories (
  package_id  text        not null references public.banquet_packages (id) on delete cascade,
  category_id text        not null references public.menu_categories (id) on delete cascade,
  limit_count int,        -- null = unlimited
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  primary key (package_id, category_id)
);

alter table public.package_categories enable row level security;

create policy "package_categories: public read"
  on public.package_categories for select using (true);

create policy "package_categories: admin all"
  on public.package_categories for all using (public.is_admin()) with check (public.is_admin());

-- 6. CREATE TABLE: package_items (dishes mapped to specific package categories)
create table if not exists public.package_items (
  package_id  text        not null,
  category_id text        not null,
  item_id     uuid        not null references public.menu_items (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (package_id, category_id, item_id),
  foreign key (package_id, category_id) references public.package_categories (package_id, category_id) on delete cascade
);

alter table public.package_items enable row level security;

create policy "package_items: public read"
  on public.package_items for select using (true);

create policy "package_items: admin all"
  on public.package_items for all using (public.is_admin()) with check (public.is_admin());

-- 7. CREATE TABLE: live_stations
create table if not exists public.live_stations (
  id          text        not null,
  label       text        not null,
  is_active   boolean     not null default true,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (id)
);

alter table public.live_stations enable row level security;

create policy "live_stations: public read"
  on public.live_stations for select using (is_active = true);

create policy "live_stations: admin all"
  on public.live_stations for all using (public.is_admin()) with check (public.is_admin());

-- 8. CREATE TABLE: live_station_items
create table if not exists public.live_station_items (
  id          uuid        not null default gen_random_uuid(),
  station_id  text        not null references public.live_stations (id) on delete cascade,
  name        text        not null,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  primary key (id)
);

alter table public.live_station_items enable row level security;

create policy "live_station_items: public read"
  on public.live_station_items for select using (true);

create policy "live_station_items: admin all"
  on public.live_station_items for all using (public.is_admin()) with check (public.is_admin());

-- 9. CREATE TABLE: package_live_stations
create table if not exists public.package_live_stations (
  package_id  text        not null references public.banquet_packages (id) on delete cascade,
  station_id  text        not null references public.live_stations (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (package_id, station_id)
);

alter table public.package_live_stations enable row level security;

create policy "package_live_stations: public read"
  on public.package_live_stations for select using (true);

create policy "package_live_stations: admin all"
  on public.package_live_stations for all using (public.is_admin()) with check (public.is_admin());

-- 10. CREATE TABLE: menu_addons
create table if not exists public.menu_addons (
  name        text        not null,
  is_active   boolean     not null default true,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  primary key (name)
);

alter table public.menu_addons enable row level security;

create policy "menu_addons: public read"
  on public.menu_addons for select using (is_active = true);

create policy "menu_addons: admin all"
  on public.menu_addons for all using (public.is_admin()) with check (public.is_admin());

-- 11. CREATE TABLE: package_addons
create table if not exists public.package_addons (
  package_id  text        not null references public.banquet_packages (id) on delete cascade,
  addon_name  text        not null references public.menu_addons (name) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (package_id, addon_name)
);

alter table public.package_addons enable row level security;

create policy "package_addons: public read"
  on public.package_addons for select using (true);

create policy "package_addons: admin all"
  on public.package_addons for all using (public.is_admin()) with check (public.is_admin());

-- 12. CREATE TABLE: decoration_packages
create table if not exists public.decoration_packages (
  id             text        not null,
  title          text        not null,
  subtitle       text        not null,
  badge          text        not null,
  features       jsonb       not null default '[]'::jsonb,
  image_url      text        not null,
  price          int         not null,
  is_active      boolean     not null default true,
  sort_order     int         not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  primary key (id)
);

alter table public.decoration_packages enable row level security;

create policy "decoration_packages: public read"
  on public.decoration_packages for select using (is_active = true);

create policy "decoration_packages: admin all"
  on public.decoration_packages for all using (public.is_admin()) with check (public.is_admin());

-- 13. Auto set updated_at triggers
drop trigger if exists set_categories_updated_at on public.menu_categories;
create trigger set_categories_updated_at before update on public.menu_categories for each row execute procedure public.set_updated_at();

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at before update on public.menu_items for each row execute procedure public.set_updated_at();

drop trigger if exists set_banquet_packages_updated_at on public.banquet_packages;
create trigger set_banquet_packages_updated_at before update on public.banquet_packages for each row execute procedure public.set_updated_at();

drop trigger if exists set_live_stations_updated_at on public.live_stations;
create trigger set_live_stations_updated_at before update on public.live_stations for each row execute procedure public.set_updated_at();

drop trigger if exists set_decoration_packages_updated_at on public.decoration_packages;
create trigger set_decoration_packages_updated_at before update on public.decoration_packages for each row execute procedure public.set_updated_at();

-- 14. Grants
grant select on public.menu_categories to anon, authenticated;
grant select on public.menu_items to anon, authenticated;
grant select on public.banquet_packages to anon, authenticated;
grant select on public.package_categories to anon, authenticated;
grant select on public.package_items to anon, authenticated;
grant select on public.live_stations to anon, authenticated;
grant select on public.live_station_items to anon, authenticated;
grant select on public.package_live_stations to anon, authenticated;
grant select on public.menu_addons to anon, authenticated;
grant select on public.package_addons to anon, authenticated;
grant select on public.decoration_packages to anon, authenticated;
