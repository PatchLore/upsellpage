create table upsells (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  product_name text not null,
  price text not null,
  headline text not null,
  description text not null,
  video_url text,
  cta_text text not null,
  cta_url text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table upsells enable row level security;

-- Allow public reads (upsell pages are public)
create policy "Public can read upsells"
  on upsells for select
  using (true);

-- Allow public inserts (no auth needed for MVP)
create policy "Anyone can create upsells"
  on upsells for insert
  with check (true);