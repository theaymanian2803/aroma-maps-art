-- R2 settings: single-row config readable/writable only via service role
create table if not exists public.r2_settings (
  id boolean primary key default true,
  account_id text,
  bucket_name text,
  access_key_id text,
  secret_access_key text,
  public_domain text,
  updated_at timestamptz not null default now(),
  constraint r2_settings_singleton check (id = true)
);

alter table public.r2_settings enable row level security;

-- No policies = no access for anon/authenticated.
-- Service role bypasses RLS, so the edge function can read/write.

insert into public.r2_settings (id) values (true) on conflict (id) do nothing;
