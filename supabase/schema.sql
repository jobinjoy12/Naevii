create extension if not exists "uuid-ossp";
create table if not exists profiles (
  id uuid primary key,
  full_name text,
  email text not null,
  phone text,
  role text not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now()
);
create table if not exists collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  cover_image text,
  is_featured boolean not null default false,
  sort_order int not null default 0
);
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  collection_id uuid references collections(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price_inr numeric(10,2) not null,
  compare_at_price_inr numeric(10,2),
  status text not null default 'draft',
  featured boolean not null default false,
  handmade_days_min int not null default 3,
  handmade_days_max int not null default 7,
  created_at timestamptz not null default now()
);
