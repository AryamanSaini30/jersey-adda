-- Migration: Add jersey_images table and migrate existing image_url_1/image_url_2
-- Run in Supabase SQL editor after taking a DB backup.

begin;

-- 1) Create flexible images table
create table if not exists public.jersey_images (
  id uuid primary key default gen_random_uuid(),
  jersey_id uuid not null references public.jerseys(id) on delete cascade,
  url text not null,
  public_id text,
  position integer not null default 0,
  created_at timestamp default now()
);
create index if not exists idx_jersey_images_jersey_id on public.jersey_images(jersey_id);

-- 2) Prevent more than 5 images per jersey
create or replace function public.jersey_images_limit()
returns trigger language plpgsql as $$
declare cnt int;
begin
  select count(*) into cnt from public.jersey_images where jersey_id = NEW.jersey_id;
  if cnt >= 5 then
    raise exception 'jersey_images: max 5 images per jersey';
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_jersey_images_limit on public.jersey_images;
create trigger trg_jersey_images_limit
before insert on public.jersey_images
for each row execute function public.jersey_images_limit();

-- 3) Migrate existing image_url_1/2 into the new table
insert into public.jersey_images (jersey_id, url, position)
select id, image_url_1, 0 from public.jerseys where image_url_1 is not null;

insert into public.jersey_images (jersey_id, url, position)
select id, image_url_2, 1 from public.jerseys where image_url_2 is not null;

-- 4) (Optional) drop legacy columns once you verify migration
-- alter table public.jerseys
--   drop column if exists image_url_1,
--   drop column if exists image_url_2;

commit;
