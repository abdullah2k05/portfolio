create extension if not exists pgcrypto;

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  sort_order integer not null default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_entries_section_check check (
    section in (
      'aboutParagraphs',
      'aboutStats',
      'aboutHighlights',
      'skills',
      'projects',
      'photoSlides',
      'events',
      'experience',
      'education'
    )
  )
);

create index if not exists content_entries_section_sort_idx
  on public.content_entries (section, sort_order, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_content_entries_updated_at on public.content_entries;
create trigger trg_content_entries_updated_at
before update on public.content_entries
for each row
execute function public.set_updated_at();

alter table public.content_entries enable row level security;

drop policy if exists "Public can read content entries" on public.content_entries;
create policy "Public can read content entries"
on public.content_entries
for select
using (true);

drop policy if exists "Authenticated users can insert content entries" on public.content_entries;
create policy "Authenticated users can insert content entries"
on public.content_entries
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update content entries" on public.content_entries;
create policy "Authenticated users can update content entries"
on public.content_entries
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete content entries" on public.content_entries;
create policy "Authenticated users can delete content entries"
on public.content_entries
for delete
to authenticated
using (true);
