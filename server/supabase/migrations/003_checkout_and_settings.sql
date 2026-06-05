-- 1. Add available_sizes to jerseys
alter table public.jerseys
add column if not exists available_sizes text[] default array['S', 'M', 'L', 'XL', 'XXL'];

-- 2. Create settings table
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text not null,
  updated_at timestamp default now()
);

-- Insert default row if not exists
insert into public.settings (whatsapp_number)
select '+919876543210'
where not exists (select 1 from public.settings);

-- Add trigger for settings updated_at
drop trigger if exists trg_settings_updated_at on public.settings;
create trigger trg_settings_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

-- 3. Refactor orders table
-- Add total_amount
alter table public.orders
add column if not exists total_amount numeric(10,2) default 0;

-- Drop index
drop index if exists idx_orders_jersey_id;

-- Drop constraints
alter table public.orders drop constraint if exists orders_jersey_id_fkey;
alter table public.orders drop constraint if exists orders_quantity_check;

-- Drop columns
alter table public.orders 
drop column if exists jersey_id,
drop column if exists size,
drop column if exists quantity;

-- 4. Create order_items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  jersey_id uuid references public.jerseys(id) on delete set null,
  jersey_name text not null,
  size text not null,
  quantity integer not null default 1,
  price numeric(10,2) not null,
  created_at timestamp default now(),
  constraint order_items_quantity_check check (quantity > 0)
);

create index if not exists idx_order_items_order_id on public.order_items using btree (order_id);
create index if not exists idx_order_items_jersey_id on public.order_items using btree (jersey_id);
