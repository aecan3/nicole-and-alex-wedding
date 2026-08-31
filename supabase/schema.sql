-- Wedding RSVP schema
--
-- Run this in the Supabase SQL Editor for the wedding-website project
-- (ijuiqrujquyeakvhfrso.supabase.co) — paste the whole file and hit Run.
-- Safe to re-run any time, including on top of an earlier version of this
-- file: every statement is idempotent and nothing here ever deletes rows,
-- so re-running won't touch existing RSVPs.
--
-- This creates the `invitees` table plus the three SECURITY DEFINER
-- functions the RSVP page calls through the public anon key — see
-- src/lib/supabase.ts and src/app/rsvp/page.tsx for the exact calls
-- (search_invitees, get_party, submit_rsvp). The anon key is never granted
-- direct access to the table itself, only to these three functions, so a
-- guest can only ever search names, read their own party, and submit their
-- own party's RSVP — never browse or edit anyone else's row directly.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.invitees (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null,
  full_name text not null,
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'attending', 'declined')),
  dietary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bus pickup: dropped from an earlier "song request" column to make room
-- for the fields the couple actually asked for.
alter table public.invitees drop column if exists song;
alter table public.invitees add column if not exists email text;
alter table public.invitees add column if not exists bus_pickup text;
alter table public.invitees add column if not exists message text;

alter table public.invitees drop constraint if exists invitees_bus_pickup_check;
alter table public.invitees add constraint invitees_bus_pickup_check
  check (bus_pickup is null or bus_pickup in (
    'macedon_ranges_hotel_spa',
    'black_forest_motel',
    'gisborne_motel',
    'no',
    'not_booked_yet'
  ));

create index if not exists invitees_party_id_idx on public.invitees (party_id);
create index if not exists invitees_full_name_trgm_idx on public.invitees using gin (full_name gin_trgm_ops);

alter table public.invitees enable row level security;
-- No RLS policies are added on purpose — the table is only ever reached
-- through the SECURITY DEFINER functions below, never directly by the
-- anon key (see the revoke/grant block at the bottom).

-- Used by the RSVP page's search box. Requires at least 2 characters so the
-- guest list can't be scraped by calling this with an empty/one-letter
-- query. Tries an exact substring match first; if that comes back empty
-- (a typo, a missing/extra letter — the kind of thing ILIKE won't catch),
-- it falls back to a trigram similarity search so a guest still finds
-- themselves without needing to spell their name exactly right.
create or replace function public.search_invitees(query text)
returns table (id uuid, party_id uuid, full_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  exact_count int;
  cleaned text := trim(query);
begin
  if cleaned is null or length(cleaned) < 2 then
    return;
  end if;

  select count(*) into exact_count
  from public.invitees i
  where i.full_name ilike '%' || cleaned || '%';

  if exact_count > 0 then
    return query
      select i.id, i.party_id, i.full_name
      from public.invitees i
      where i.full_name ilike '%' || cleaned || '%'
      order by i.full_name
      limit 10;
  else
    return query
      select i.id, i.party_id, i.full_name
      from public.invitees i
      where similarity(i.full_name, cleaned) > 0.25
      order by similarity(i.full_name, cleaned) desc
      limit 5;
  end if;
end;
$$;

-- Returns every invitee sharing a party_id with the given invitee — this is
-- how selecting yourself in search also pulls in the rest of your party,
-- and what the RSVP page shows the guest to confirm before they respond.
create or replace function public.get_party(invitee_id uuid)
returns table (id uuid, full_name text, rsvp_status text)
language sql
security definer
set search_path = public
as $$
  select i.id, i.full_name, i.rsvp_status
  from public.invitees i
  where i.party_id = (select party_id from public.invitees where id = invitee_id)
  order by i.full_name;
$$;

-- Records one invitee's response. The RSVP page calls this once per party
-- member; email, bus_pickup and message are asked once for the whole
-- household and sent the same for every member's row, same pattern the
-- shared message field already used.
drop function if exists public.submit_rsvp(uuid, text, text, text, text);
create or replace function public.submit_rsvp(
  invitee_id uuid,
  p_status text,
  p_dietary text,
  p_email text,
  p_bus_pickup text,
  p_message text
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.invitees
  set rsvp_status = p_status,
      dietary = p_dietary,
      email = p_email,
      bus_pickup = p_bus_pickup,
      message = p_message,
      updated_at = now()
  where id = invitee_id;
$$;

-- The anon key may only call these three functions — never touch the
-- table directly.
revoke all on public.invitees from anon, authenticated;
grant execute on function public.search_invitees(text) to anon;
grant execute on function public.get_party(uuid) to anon;
grant execute on function public.submit_rsvp(uuid, text, text, text, text, text) to anon;

-- ---------------------------------------------------------------------
-- Seed your guest list below, one row per person. Group households/couples
-- with the same party_id (any shared uuid — gen_random_uuid() per party).
-- Example:
--
-- insert into public.invitees (party_id, full_name) values
--   ('11111111-1111-1111-1111-111111111111', 'Jane Smith'),
--   ('11111111-1111-1111-1111-111111111111', 'John Smith'),
--   ('22222222-2222-2222-2222-222222222222', 'Priya Nair');
-- ---------------------------------------------------------------------

-- Case study: Nicole Fernando and Alex Cann as one household
insert into public.invitees (party_id, full_name)
select 'b7bf6a90-5cde-4812-a48d-fb2717955110', v.full_name
from (values ('Nicole Fernando'), ('Alex Cann')) as v(full_name)
where not exists (
  select 1 from public.invitees where full_name = v.full_name
);
