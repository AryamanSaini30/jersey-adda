create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone varchar(20) unique not null,
  name varchar(255) not null,
  address_line_1 text,
  address_line_2 text,
  city varchar(100),
  state varchar(100),
  postal_code varchar(20),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.jerseys (
  id uuid primary key default gen_random_uuid(),
  slug varchar(255) unique not null,
  name varchar(255) not null,
  team_name varchar(255) not null,
  league_name varchar(255),
  description text,
  price numeric(10,2) not null,
  image_url_1 text not null,
  image_url_2 text not null,
  is_national_team boolean default false,
  has_shorts boolean default false,
  sleeve_type varchar(20),
  version_type varchar(20),
  featured_club varchar(50),
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  constraint jerseys_sleeve_type_check check (sleeve_type is null or sleeve_type in ('HALF', 'FULL')),
  constraint jerseys_version_type_check check (version_type is null or version_type in ('FAN', 'PLAYER')),
  constraint jerseys_featured_club_check check (
    featured_club is null or featured_club in ('BARCELONA', 'REAL_MADRID', 'MAN_UNITED', 'AC_MILAN')
  ),
  constraint jerseys_price_non_negative_check check (price >= 0)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number varchar(30) unique not null,
  customer_id uuid references public.customers(id) on delete set null,
  jersey_id uuid references public.jerseys(id) on delete set null,
  size varchar(10) not null,
  quantity integer not null default 1,
  shipping_name varchar(255),
  shipping_phone varchar(20),
  shipping_address text,
  status varchar(30) default 'PENDING',
  created_at timestamp default now(),
  updated_at timestamp default now(),
  constraint orders_status_check check (status in ('PENDING', 'CONFIRMED', 'REJECTED', 'DELIVERED')),
  constraint orders_quantity_check check (quantity > 0)
);

create index if not exists idx_jerseys_slug on public.jerseys using btree (slug);
create index if not exists idx_jerseys_team_name on public.jerseys using btree (team_name);
create index if not exists idx_jerseys_price on public.jerseys using btree (price);
create index if not exists idx_jerseys_is_national_team on public.jerseys using btree (is_national_team);
create index if not exists idx_jerseys_featured_club on public.jerseys using btree (featured_club);

create index if not exists idx_orders_customer_id on public.orders using btree (customer_id);
create index if not exists idx_orders_jersey_id on public.orders using btree (jersey_id);
create index if not exists idx_orders_status on public.orders using btree (status);

drop trigger if exists trg_customers_updated_at on public.customers;
create trigger trg_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists trg_jerseys_updated_at on public.jerseys;
create trigger trg_jerseys_updated_at
before update on public.jerseys
for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();