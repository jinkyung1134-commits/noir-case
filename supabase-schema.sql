create table if not exists public.site_state (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_state enable row level security;

drop policy if exists "public read site state" on public.site_state;
create policy "public read site state"
on public.site_state for select
using (true);

drop policy if exists "public write site state demo" on public.site_state;
create policy "public write site state demo"
on public.site_state for insert
with check (true);

drop policy if exists "public update site state demo" on public.site_state;
create policy "public update site state demo"
on public.site_state for update
using (true)
with check (true);

-- 운영 전 권장:
-- 위 write/update policy는 데모용입니다.
-- 실제 운영에서는 Supabase Auth 관리자 계정 또는 서버 API에서만 쓰기 가능하도록 바꾸세요.

insert into storage.buckets (id, name, public)
values ('noir-case-assets', 'noir-case-assets', true)
on conflict (id) do nothing;

drop policy if exists "public read noir assets" on storage.objects;
create policy "public read noir assets"
on storage.objects for select
using (bucket_id = 'noir-case-assets');

drop policy if exists "public upload noir assets demo" on storage.objects;
create policy "public upload noir assets demo"
on storage.objects for insert
with check (bucket_id = 'noir-case-assets');

drop policy if exists "public update noir assets demo" on storage.objects;
create policy "public update noir assets demo"
on storage.objects for update
using (bucket_id = 'noir-case-assets')
with check (bucket_id = 'noir-case-assets');
