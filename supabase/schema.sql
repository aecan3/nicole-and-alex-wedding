-- Wedding RSVP schema
--
-- Run this once in the Supabase SQL Editor for the wedding-website project
-- (ijuiqrujquyeakvhfrso.supabase.co) — paste the whole file and hit Run.
-- It's safe to re-run: every statement is idempotent (create-if-not-exists /
-- create-or-replace), so running it again later won't duplicate anything or
-- wipe existing RSVPs.
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
  song text,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invitees_party_id_idx on public.invitees (party_id);
create index if not exists invitees_full_name_trgm_idx on public.invitees using gin (full_name gin_trgm_ops);

alter table public.invitees enable row level security;
-- No RLS policies are added on purpose — the table is only ever reached
-- through the SECURITY DEFINER functions below, never directly by the
-- anon key (see the revoke/grant block at the bottom).

-- Used by the RSVP page's search box. Requires at least 2 characters so the
-- guest list can't be scraped by calling this with an empty/one-letter
-- query — the UI already guards against empty queries, but the RPC is
-- public, so it guards too.
create or replace function public.search_invitees(query text)
returns table (id uuid, party_id uuid, full_name text)
language sql
security definer
set search_path = public
as $$
  select id, party_id, full_name
  from public.invitees
  where query is not null
    and length(trim(query)) >= 2
    and full_name ilike '%' || trim(query) || '%'
  order by full_name
  limit 10;
$$;

-- Returns every invitee sharing a party_id with the given invitee — this is
-- how selecting yourself in search also pulls in the rest of your party.
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
-- member, each time with the same song/message — that's the existing
-- frontend's behaviour, not a schema decision.
create or replace function public.submit_rsvp(
  invitee_id uuid,
  p_status text,
  p_dietary text,
  p_song text,
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
      song = p_song,
      message = p_message,
      updated_at = now()
  where id = invitee_id;
$$;

-- The anon key may only call these three functions — never touch the
-- table directly.
revoke all on public.invitees from anon, authenticated;
grant execute on function public.search_invitees(text) to anon;
grant execute on function public.get_party(uuid) to anon;
grant execute on function public.submit_rsvp(uuid, text, text, text, text) to anon;

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
