-- Chapelhill schema (Neon Postgres 18).
--
-- Access model: the Next.js server is the only client. It connects with the
-- database owner role and enforces authorisation in the data-access layer
-- (src/lib/db/*): public reads only see published rows, clients only see
-- their own units and requests, and admin actions require role = 'admin' on
-- the Managed Better Auth user (neon_auth."user".role).
--
-- RLS is enabled on every table with no policies, so if the Neon Data API is
-- ever turned on, anonymous and authenticated API roles get nothing by
-- default. The owner role bypasses RLS, so the server keeps working.
--
-- User ids reference neon_auth."user".id (uuid). No foreign keys are created
-- into the managed neon_auth schema.

create extension if not exists citext;

create type dev_status as enum ('for_sale', 'coming_soon', 'sold_out');
create type doc_type as enum ('allotment_letter', 'survey_plan', 'deed_of_assignment', 'receipt', 'other');
create type request_status as enum ('requested', 'in_progress', 'fulfilled', 'declined');
create type inquiry_status as enum ('new', 'contacted', 'closed');

create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Developments ---------------------------------------------------------------

create table developments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  area text not null,
  city text not null,
  state text not null,
  address text,
  lat double precision,
  lng double precision,
  location_approximate boolean not null default true,
  status dev_status not null default 'for_sale',
  property_type text not null,
  bedrooms int[] not null default '{}',
  baths text,
  sqm text,
  title_type text,
  price_from_ngn bigint not null check (price_from_ngn >= 0),
  headline text,
  summary text not null default '',
  description text[] not null default '{}',
  amenities text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger developments_touch before update on developments for each row execute function touch_updated_at();
create index developments_published_idx on developments (published, sort_order);

create table development_images (
  id uuid primary key default gen_random_uuid(),
  development_id uuid not null references developments (id) on delete cascade,
  -- Either a site path (/images/...) or an object key in the media bucket (media:<key>).
  src text not null,
  alt text not null,
  width int not null default 1600,
  height int not null default 1200,
  is_render boolean not null default false,
  kind text not null default 'gallery' check (kind in ('gallery', 'floorplan')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index development_images_dev_idx on development_images (development_id, sort_order);

create table unit_types (
  id uuid primary key default gen_random_uuid(),
  development_id uuid not null references developments (id) on delete cascade,
  label text not null,
  bedrooms int,
  baths int,
  sqm numeric,
  price_ngn bigint check (price_ngn >= 0),
  available int check (available >= 0),
  sort_order int not null default 0
);

create table payment_plans (
  id uuid primary key default gen_random_uuid(),
  -- Null development_id = a plan offered across all developments.
  development_id uuid references developments (id) on delete cascade,
  name text not null,
  deposit_pct numeric(5, 2) not null check (deposit_pct between 0 and 100),
  tenure_months int not null default 0 check (tenure_months >= 0),
  note text,
  is_placeholder boolean not null default false,
  sort_order int not null default 0
);

create table progress_updates (
  id uuid primary key default gen_random_uuid(),
  development_id uuid not null references developments (id) on delete cascade,
  title text not null,
  body text,
  stage text,
  percent_complete smallint not null check (percent_complete between 0 and 100),
  occurred_on date not null default current_date,
  created_by uuid,
  created_at timestamptz not null default now()
);
create index progress_updates_dev_idx on progress_updates (development_id, occurred_on desc);

create table progress_media (
  id uuid primary key default gen_random_uuid(),
  update_id uuid not null references progress_updates (id) on delete cascade,
  src text not null,
  alt text not null default '',
  kind text not null default 'image' check (kind in ('image', 'video')),
  sort_order int not null default 0
);

-- Clients (diaspora portal) ----------------------------------------------------

create table client_profiles (
  user_id uuid primary key,
  phone text,
  country text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger client_profiles_touch before update on client_profiles for each row execute function touch_updated_at();

create table client_units (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  development_id uuid not null references developments (id) on delete restrict,
  unit_type_id uuid references unit_types (id) on delete set null,
  unit_label text not null,
  purchased_on date,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);
create index client_units_user_idx on client_units (user_id);

create table document_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  client_unit_id uuid references client_units (id) on delete set null,
  doc doc_type not null,
  status request_status not null default 'requested',
  notes text,
  -- Object key in the private client-documents bucket, always under "<user_id>/".
  file_key text check (file_key is null or file_key like user_id::text || '/%'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger document_requests_touch before update on document_requests for each row execute function touch_updated_at();
create index document_requests_user_idx on document_requests (user_id, created_at desc);

create table inspection_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  development_id uuid references developments (id) on delete set null,
  development_name text,
  kind text not null default 'virtual' check (kind in ('virtual', 'video')),
  preferred_date date,
  preferred_time text,
  timezone text,
  name text not null,
  email citext not null,
  phone text,
  message text,
  status request_status not null default 'requested',
  created_at timestamptz not null default now()
);

-- Leads -------------------------------------------------------------------------

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  topic text not null check (topic in ('general', 'development', 'service', 'diaspora', 'inspection', 'calculator')),
  development text,
  service text,
  name text not null,
  email citext not null,
  phone text,
  country text,
  message text,
  preferred_contact text not null default 'whatsapp' check (preferred_contact in ('whatsapp', 'email', 'phone')),
  payload jsonb not null default '{}',
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);
create index inquiries_status_idx on inquiries (status, created_at desc);

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  source text,
  consented_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- Site settings -----------------------------------------------------------------

create table fx_rates (
  currency text primary key check (currency in ('USD', 'GBP')),
  ngn_per_unit numeric(12, 2) not null check (ngn_per_unit > 0),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  location text,
  development_id uuid references developments (id) on delete set null,
  published boolean not null default false,
  is_placeholder boolean not null default false,
  sort_order int not null default 0
);

create table site_stats (
  key text primary key,
  value numeric not null,
  suffix text not null default '',
  label text not null,
  is_placeholder boolean not null default false,
  sort_order int not null default 0
);

-- Defence in depth: no Data API access unless policies are added deliberately.
alter table developments enable row level security;
alter table development_images enable row level security;
alter table unit_types enable row level security;
alter table payment_plans enable row level security;
alter table progress_updates enable row level security;
alter table progress_media enable row level security;
alter table client_profiles enable row level security;
alter table client_units enable row level security;
alter table document_requests enable row level security;
alter table inspection_requests enable row level security;
alter table inquiries enable row level security;
alter table newsletter_subscribers enable row level security;
alter table fx_rates enable row level security;
alter table testimonials enable row level security;
alter table site_stats enable row level security;
