-- Run this once in the Supabase dashboard: Project > SQL Editor > New query > paste > Run

create table if not exists public.invitees (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null,
  full_name text not null,
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'attending', 'declined')),
  dietary_requirements text,
  song_request text,
  message text,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.invitees enable row level security;
-- Deliberately no direct anon select/update policies — guests only ever
-- reach this table through the SECURITY DEFINER functions below, so they
-- can never browse or edit the full guest list directly.

-- Look up invitees by (partial) name match. Returns only name/party id.
create or replace function public.search_invitees(query text)
returns table (id uuid, party_id uuid, full_name text)
language sql
security definer
set search_path = public
as $$
  select id, party_id, full_name
  from invitees
  where full_name ilike '%' || query || '%'
  limit 10;
$$;

grant execute on function public.search_invitees(text) to anon;

-- Everyone travelling in the same party as the given invitee.
create or replace function public.get_party(invitee_id uuid)
returns table (id uuid, full_name text, rsvp_status text)
language sql
security definer
set search_path = public
as $$
  select i.id, i.full_name, i.rsvp_status
  from invitees i
  where i.party_id = (select party_id from invitees where id = invitee_id);
$$;

grant execute on function public.get_party(uuid) to anon;

-- Submit an RSVP response for one invitee.
create or replace function public.submit_rsvp(
  invitee_id uuid,
  p_status text,
  p_dietary text default null,
  p_song text default null,
  p_message text default null
)
returns void
language sql
security definer
set search_path = public
as $$
  update invitees
  set rsvp_status = p_status,
      dietary_requirements = p_dietary,
      song_request = p_song,
      message = p_message,
      responded_at = now()
  where id = invitee_id;
$$;

grant execute on function public.submit_rsvp(uuid, text, text, text, text) to anon;

-- ---------------------------------------------------------------------
-- Seed your guest list below, one row per person. Group households/couples
-- with the same party_id (any shared uuid — gen_random_uuid() per party).
-- Example:
--
-- insert into invitees (party_id, full_name) values
--   ('11111111-1111-1111-1111-111111111111', 'Jane Smith'),
--   ('11111111-1111-1111-1111-111111111111', 'John Smith'),
--   ('22222222-2222-2222-2222-222222222222', 'Priya Nair');
-- ---------------------------------------------------------------------
