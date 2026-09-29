-- WARNING: superseded by rsvp-postcode-check.sql. If you ever re-run this file,
-- run rsvp-postcode-check.sql straight after, or RSVPs won't need a postcode.

-- Wedding RSVP: table + guest list in one go. Paste into the Supabase SQL Editor and click Run.
-- Safe to run more than once.

-- ===== 1. Table and functions =====
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
-- Also returns each member's saved answers (dietary, and the shared email /
-- bus_pickup / message fields) so that if a party has already responded,
-- the RSVP page can show what's on file instead of sending them through a
-- blank form again.
drop function if exists public.get_party(uuid);
create or replace function public.get_party(invitee_id uuid)
returns table (
  id uuid,
  full_name text,
  rsvp_status text,
  dietary text,
  email text,
  bus_pickup text,
  message text
)
language sql
security definer
set search_path = public
as $$
  select i.id, i.full_name, i.rsvp_status, i.dietary, i.email, i.bus_pickup, i.message
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

-- ===== 2. Guest list =====
-- Guest list, loaded 29 Sep 2026. One party_id per household.
-- Safe to re-run: skips anyone already in the table.
alter table public.invitees add column if not exists party_name text;

insert into public.invitees (party_id, party_name, full_name)
select v.party_id::uuid, v.party_name, v.full_name from (values
  ('b7bf6a90-5cde-4812-a48d-fb2717955110', 'Nicole & Alex Cann', 'Nicole Fernando'),
  ('b7bf6a90-5cde-4812-a48d-fb2717955110', 'Nicole & Alex Cann', 'Alex Cann'),
  ('9857dd24-feef-5f83-ac3a-679c79d75f48', 'Nita & Niranjan Fernando', 'Nita Fernando'),
  ('9857dd24-feef-5f83-ac3a-679c79d75f48', 'Nita & Niranjan Fernando', 'Niranjan Fernando'),
  ('30de9ed4-638e-5790-8b65-4aa50f4ab561', 'Nichelle Fernando & Edan Trevethick', 'Nichelle Fernando'),
  ('30de9ed4-638e-5790-8b65-4aa50f4ab561', 'Nichelle Fernando & Edan Trevethick', 'Edan Trevethick'),
  ('6fd8ecf0-39f3-53fc-afab-88833d0621bb', 'Judy, Hiran, Portia Fernando & Nicolas Chrisomalidis', 'Judy Fernando'),
  ('6fd8ecf0-39f3-53fc-afab-88833d0621bb', 'Judy, Hiran, Portia Fernando & Nicolas Chrisomalidis', 'Hiran Fernando'),
  ('6fd8ecf0-39f3-53fc-afab-88833d0621bb', 'Judy, Hiran, Portia Fernando & Nicolas Chrisomalidis', 'Portia Fernando'),
  ('6fd8ecf0-39f3-53fc-afab-88833d0621bb', 'Judy, Hiran, Portia Fernando & Nicolas Chrisomalidis', 'Nic Chrisomalidis'),
  ('fa1d1c77-3b9b-57a6-9b5f-868bbd2abed3', 'Aaron Fernando & Jess Lee', 'Aaron Fernando'),
  ('fa1d1c77-3b9b-57a6-9b5f-868bbd2abed3', 'Aaron Fernando & Jess Lee', 'Jess Lee'),
  ('c39f3c91-c4dc-5522-b7a6-5627134328de', 'Canice & Nimal Fernando', 'Canice Fernando'),
  ('c39f3c91-c4dc-5522-b7a6-5627134328de', 'Canice & Nimal Fernando', 'Nimal Fernando'),
  ('c33a363f-8ab0-5540-9765-3507fecf03c9', 'Rosie & Ranjith Fernando', 'Rosie Fernando'),
  ('c33a363f-8ab0-5540-9765-3507fecf03c9', 'Rosie & Ranjith Fernando', 'Ranjith Fernando'),
  ('7818e5ea-f601-58bf-85f6-69d827d76a1a', 'Shehan & Shya Fernando', 'Shehan Fernando'),
  ('7818e5ea-f601-58bf-85f6-69d827d76a1a', 'Shehan & Shya Fernando', 'Shya Fernando'),
  ('8fdadf9f-47e0-5286-bf67-9788ef5e619f', 'Maria, Sarita & Sienna Fernandes', 'Sarita Fernandes'),
  ('8fdadf9f-47e0-5286-bf67-9788ef5e619f', 'Maria, Sarita & Sienna Fernandes', 'Maria Fernandes'),
  ('8fdadf9f-47e0-5286-bf67-9788ef5e619f', 'Maria, Sarita & Sienna Fernandes', 'Sienna Fernandes'),
  ('a733a82f-95f0-5907-895a-56ea67ef59f6', 'Roy & Sherry Fernandes', 'Roy Fernandes'),
  ('a733a82f-95f0-5907-895a-56ea67ef59f6', 'Roy & Sherry Fernandes', 'Sherry Fernandes'),
  ('020318cf-da56-52df-9ae0-ad0bdf2c18e0', 'Lisa & Darrell Cann', 'Lisa Cann'),
  ('020318cf-da56-52df-9ae0-ad0bdf2c18e0', 'Lisa & Darrell Cann', 'Darrell Cann'),
  ('d774fb1b-d5c8-5547-9c35-db294e326237', 'Emma & Gavin Davies', 'Emma Davies'),
  ('d774fb1b-d5c8-5547-9c35-db294e326237', 'Emma & Gavin Davies', 'Gavin Davies'),
  ('e28212c5-f40b-5c4b-9bc8-8843c3e443a1', 'Ashlea & Daniel Cann', 'Ashlea Cann'),
  ('e28212c5-f40b-5c4b-9bc8-8843c3e443a1', 'Ashlea & Daniel Cann', 'Daniel Cann'),
  ('dcab1314-00f5-5def-9d68-a079d59eee9b', 'Sonia & Paul Milland', 'Sonia Milland'),
  ('dcab1314-00f5-5def-9d68-a079d59eee9b', 'Sonia & Paul Milland', 'Paul Milland'),
  ('f48338a4-2d57-53dc-a8dc-75d9e6073895', 'Brannon & Emisha McDonald', 'Brannon McDonald'),
  ('f48338a4-2d57-53dc-a8dc-75d9e6073895', 'Brannon & Emisha McDonald', 'Emisha McDonald'),
  ('eecde530-2f68-55ba-9151-1b2a254e0e6e', 'Liam & Jelisa McDonald', 'Liam McDonald'),
  ('eecde530-2f68-55ba-9151-1b2a254e0e6e', 'Liam & Jelisa McDonald', 'Jelisa McDonald'),
  ('ff4f840c-47a3-56d0-825d-826c09e4649e', 'Greg, Tracey, Maisey, Poppy Dawson & Alex Caruana', 'Greg Dawson'),
  ('ff4f840c-47a3-56d0-825d-826c09e4649e', 'Greg, Tracey, Maisey, Poppy Dawson & Alex Caruana', 'Tracey Dawson'),
  ('ff4f840c-47a3-56d0-825d-826c09e4649e', 'Greg, Tracey, Maisey, Poppy Dawson & Alex Caruana', 'Maisey Dawson'),
  ('ff4f840c-47a3-56d0-825d-826c09e4649e', 'Greg, Tracey, Maisey, Poppy Dawson & Alex Caruana', 'Poppy Dawson'),
  ('ff4f840c-47a3-56d0-825d-826c09e4649e', 'Greg, Tracey, Maisey, Poppy Dawson & Alex Caruana', 'Alex Caruana'),
  ('cf079042-7564-5a19-b6e6-2438b4fbce9a', 'Jenny, Raimy & Chaiya Casiro', 'Jenny Dawson'),
  ('cf079042-7564-5a19-b6e6-2438b4fbce9a', 'Jenny, Raimy & Chaiya Casiro', 'Raimy Casiro'),
  ('cf079042-7564-5a19-b6e6-2438b4fbce9a', 'Jenny, Raimy & Chaiya Casiro', 'Chaiya Casiro'),
  ('e7a0f7ec-b05b-5e10-bcc8-18eae5a6c9bc', 'Dorothy & Clive Smith', 'Dorothy Smith'),
  ('e7a0f7ec-b05b-5e10-bcc8-18eae5a6c9bc', 'Dorothy & Clive Smith', 'Clive Smith'),
  ('bdc80753-6d1e-5dce-9463-497c07928c7a', 'Graeme Dawson', 'Graeme Dawson'),
  ('b780a50f-48f4-5afa-92da-cbe631189102', 'Julia & Graeme Cann', 'Julia Cann'),
  ('b780a50f-48f4-5afa-92da-cbe631189102', 'Julia & Graeme Cann', 'Graeme Cann'),
  ('da3e9a3f-b80b-5c56-ab6e-5f0a1601104c', 'Warren, Michael & William Cann', 'Warren Cann'),
  ('da3e9a3f-b80b-5c56-ab6e-5f0a1601104c', 'Warren, Michael & William Cann', 'Michael Cann'),
  ('da3e9a3f-b80b-5c56-ab6e-5f0a1601104c', 'Warren, Michael & William Cann', 'William Cann'),
  ('9a344d07-be0c-5ed0-ad95-8e5ce0041847', 'Isaac Cann & Taryn Mangione', 'Isaac Cann'),
  ('9a344d07-be0c-5ed0-ad95-8e5ce0041847', 'Isaac Cann & Taryn Mangione', 'Taryn Mangione'),
  ('4a656832-b189-5c2b-b924-07c2e05f4263', 'Roger, Nerrelie, Joel, Susan & Gabrielle Cann', 'Roger Cann'),
  ('4a656832-b189-5c2b-b924-07c2e05f4263', 'Roger, Nerrelie, Joel, Susan & Gabrielle Cann', 'Nerrelie Cann'),
  ('4a656832-b189-5c2b-b924-07c2e05f4263', 'Roger, Nerrelie, Joel, Susan & Gabrielle Cann', 'Joel Cann'),
  ('4a656832-b189-5c2b-b924-07c2e05f4263', 'Roger, Nerrelie, Joel, Susan & Gabrielle Cann', 'Susan Cann'),
  ('4a656832-b189-5c2b-b924-07c2e05f4263', 'Roger, Nerrelie, Joel, Susan & Gabrielle Cann', 'Gabrielle Cann'),
  ('61380b6c-900c-5e3b-86ee-54a860278a21', 'Bhavya Mishra & Fallon Wanganeen', 'Bhavya Mishra'),
  ('61380b6c-900c-5e3b-86ee-54a860278a21', 'Bhavya Mishra & Fallon Wanganeen', 'Fallon Wanganeen'),
  ('6cd731fd-17f6-5307-a6de-cb80593e5b69', 'Damon Lawrence', 'Damon Lawrence'),
  ('959f15f9-5b7a-54e8-ad2f-becc9cf8736e', 'Shreya Mishra & Jay Jhamb', 'Shreya Mishra'),
  ('959f15f9-5b7a-54e8-ad2f-becc9cf8736e', 'Shreya Mishra & Jay Jhamb', 'Jay Jhamb'),
  ('1842677f-fdcd-5637-b3e2-444c1ac2a778', 'Stephanie Cavar & Marcus Favrin', 'Stephanie Cavar'),
  ('1842677f-fdcd-5637-b3e2-444c1ac2a778', 'Stephanie Cavar & Marcus Favrin', 'Marcus Favrin'),
  ('5d23fca9-bf9e-570b-b3da-2f75781798b4', 'Ternelle & Emma Pini', 'Ternelle Pini'),
  ('5d23fca9-bf9e-570b-b3da-2f75781798b4', 'Ternelle & Emma Pini', 'Emma Pini'),
  ('7860598c-621a-50fa-adde-659ff8ae1c71', 'Davinia Prabakaran & Dharann Moganaraju', 'Davinia Prabakaran'),
  ('7860598c-621a-50fa-adde-659ff8ae1c71', 'Davinia Prabakaran & Dharann Moganaraju', 'Dharann Moganaraju'),
  ('a4744072-9d04-5548-bd28-eee572ebb08e', 'Dulanjan & Tahlia Fernando', 'Dulanjan Fernando'),
  ('a4744072-9d04-5548-bd28-eee572ebb08e', 'Dulanjan & Tahlia Fernando', 'Tahlia Fernando'),
  ('ed248359-860d-5e2c-8eae-3f993ef2399b', 'Cimona Fernandes & Garth D''Silva', 'Cimona Fernandes'),
  ('ed248359-860d-5e2c-8eae-3f993ef2399b', 'Cimona Fernandes & Garth D''Silva', 'Garth D''Silva'),
  ('37ed77ee-0232-522e-bb59-703fbd91407e', 'Gemma McDonald & Tom McCutchan', 'Gemma McDonald'),
  ('37ed77ee-0232-522e-bb59-703fbd91407e', 'Gemma McDonald & Tom McCutchan', 'Tom McCutchan'),
  ('95eaea46-5ff8-53c1-9918-db6d0c70eb12', 'Bianca & Matt Luck', 'Bianca Luck'),
  ('95eaea46-5ff8-53c1-9918-db6d0c70eb12', 'Bianca & Matt Luck', 'Matt Luck'),
  ('6ddee5f4-8eb0-5535-9382-88baec137166', 'Michael & Jacqueline Girolamo', 'Michael Girolamo'),
  ('6ddee5f4-8eb0-5535-9382-88baec137166', 'Michael & Jacqueline Girolamo', 'Jacqueline Girolamo'),
  ('92394058-9940-5bfd-b05e-92d47b745987', 'Jack & Tess Irons', 'Jack Irons'),
  ('92394058-9940-5bfd-b05e-92d47b745987', 'Jack & Tess Irons', 'Tess Irons'),
  ('7a4fc362-d6dc-57c6-b84a-0b0a25a49e07', 'Gabby & Ben Holland', 'Gabby Holland'),
  ('7a4fc362-d6dc-57c6-b84a-0b0a25a49e07', 'Gabby & Ben Holland', 'Ben Holland'),
  ('11d7792c-2825-5fb0-b66d-d3273d94cf1e', 'Emma & Jake Richardson', 'Emma Richardson'),
  ('11d7792c-2825-5fb0-b66d-d3273d94cf1e', 'Emma & Jake Richardson', 'Jake Richardson'),
  ('1a83f508-4914-5105-903c-d83247bb2b70', 'Claire Barley & Nathan Workman', 'Claire Barley'),
  ('1a83f508-4914-5105-903c-d83247bb2b70', 'Claire Barley & Nathan Workman', 'Nathan Workman'),
  ('dde65a1e-703d-596a-be25-db16e09c5319', 'Teagan & Rob Oates', 'Teagan Oates'),
  ('dde65a1e-703d-596a-be25-db16e09c5319', 'Teagan & Rob Oates', 'Rob Oates'),
  ('00d989d6-f369-5dc0-8abb-ad9d46b3bb2f', 'Abigail & Mitchell Conway', 'Abigail Conway'),
  ('00d989d6-f369-5dc0-8abb-ad9d46b3bb2f', 'Abigail & Mitchell Conway', 'Mitchell Conway'),
  ('ca664a80-5c9b-50bd-b327-065f190a0854', 'Matthew Stainer', 'Matthew Stainer'),
  ('1e3ddd99-bad8-5d84-8342-e5af2ef9c8c9', 'Steph Bruders & Mitchell Lonie', 'Steph Bruders'),
  ('1e3ddd99-bad8-5d84-8342-e5af2ef9c8c9', 'Steph Bruders & Mitchell Lonie', 'Mitchell Lonie'),
  ('a62399d4-4d5a-5cd0-bf7b-e915480aa62e', 'Katie Mitchell & Matthew Stevenson', 'Katie Mitchell'),
  ('a62399d4-4d5a-5cd0-bf7b-e915480aa62e', 'Katie Mitchell & Matthew Stevenson', 'Matthew Stevenson'),
  ('7ca45425-43ec-5086-887f-201752932833', 'Katie Koulouris & Ryan Johnson', 'Katie Koulouris'),
  ('7ca45425-43ec-5086-887f-201752932833', 'Katie Koulouris & Ryan Johnson', 'Ryan Johnson'),
  ('46ca9040-861a-547c-a96c-f64bd59c2e98', 'Zoe Manoussakis & Lucas Holland', 'Lucas Holland'),
  ('46ca9040-861a-547c-a96c-f64bd59c2e98', 'Zoe Manoussakis & Lucas Holland', 'Zoe Manoussakis'),
  ('c2e78771-3440-512f-badb-c253cb617e06', 'Pramedi & Dillon De Silva', 'Pramedi De Silva'),
  ('c2e78771-3440-512f-badb-c253cb617e06', 'Pramedi & Dillon De Silva', 'Dillon De Silva'),
  ('f1fbb061-0a78-5549-8151-af908a3ece2a', 'Chloe & Tasman Perrin', 'Chloe Perrin'),
  ('f1fbb061-0a78-5549-8151-af908a3ece2a', 'Chloe & Tasman Perrin', 'Tasman Perrin'),
  ('848816e2-57b5-516f-9252-de41e3344e20', 'Georgie Costa & Ethan Baade', 'Georgie Costa'),
  ('848816e2-57b5-516f-9252-de41e3344e20', 'Georgie Costa & Ethan Baade', 'Ethan Baade'),
  ('6ddc7c4c-b4e7-5189-bbf9-e42493ab0230', 'Georgia Wilson & Bailen Clarke', 'Georgia Wilson'),
  ('6ddc7c4c-b4e7-5189-bbf9-e42493ab0230', 'Georgia Wilson & Bailen Clarke', 'Bailen Clarke'),
  ('39f84c9c-b61e-53ad-a142-682ea4652f59', 'Brodie Symons', 'Brodie Symons'),
  ('5a77f9cd-9b81-5a22-9445-b5910239576d', 'Rafferty Dall', 'Rafferty Dall'),
  ('429f7eae-761b-5aa1-82b7-727480aa5585', 'Himali & Kumar Shanmugaratnam', 'Himali Shanmugaratnam'),
  ('429f7eae-761b-5aa1-82b7-727480aa5585', 'Himali & Kumar Shanmugaratnam', 'Kumar Shanmugaratnam'),
  ('5c6e56d6-378c-51e2-adcb-ec3fa374ad62', 'Kajal & Himanshu Mishra', 'Kajal Mishra'),
  ('5c6e56d6-378c-51e2-adcb-ec3fa374ad62', 'Kajal & Himanshu Mishra', 'Himanshu Mishra'),
  ('99fc8a08-676a-5c69-9520-170ced9c49e2', 'Melissa Meirun & Tom Lewis', 'Tom Lewis'),
  ('99fc8a08-676a-5c69-9520-170ced9c49e2', 'Melissa Meirun & Tom Lewis', 'Melissa Meirun'),
  ('a704fdab-9a90-59ae-bb7f-209117fe5608', 'Alcina & Joseph DeSouza', 'Alcina DeSouza'),
  ('a704fdab-9a90-59ae-bb7f-209117fe5608', 'Alcina & Joseph DeSouza', 'Joseph DeSouza'),
  ('3ebcebf9-6af7-5d45-8e97-08612334c979', 'Livia & Herbert Bothello', 'Livia Bothello'),
  ('3ebcebf9-6af7-5d45-8e97-08612334c979', 'Livia & Herbert Bothello', 'Herbert Bothello'),
  ('82300aaf-ce54-5486-8461-a5c1c99bef2a', 'Glenda & Hillary Rebeiro', 'Glenda Rebeiro'),
  ('82300aaf-ce54-5486-8461-a5c1c99bef2a', 'Glenda & Hillary Rebeiro', 'Hillary Rebeiro'),
  ('b195cfea-415e-5d8a-8326-7b4a3add4df7', 'Olpha & Frank Andris', 'Olpha Andris'),
  ('b195cfea-415e-5d8a-8326-7b4a3add4df7', 'Olpha & Frank Andris', 'Frank Andris'),
  ('a202a569-9a63-5c63-ad53-e69cc81ce22a', 'Sarah & Arnaldo Ribeiro', 'Sarah Ribeiro'),
  ('a202a569-9a63-5c63-ad53-e69cc81ce22a', 'Sarah & Arnaldo Ribeiro', 'Arnaldo Ribeiro'),
  ('5a889df4-4cbb-5c9b-88ab-5f3bd815c195', 'Romina & Winston Vaz', 'Romina Vaz'),
  ('5a889df4-4cbb-5c9b-88ab-5f3bd815c195', 'Romina & Winston Vaz', 'Winston Vaz'),
  ('8229fbe7-182a-53d9-a37a-0e76a4f427ab', 'Sandra & David Mariadas', 'Sandra Mariadas'),
  ('8229fbe7-182a-53d9-a37a-0e76a4f427ab', 'Sandra & David Mariadas', 'David Mariadas'),
  ('87ab9a86-75c3-5eaf-8ee0-d643ba33a246', 'Yolande & Darrell De Silva', 'Yolande De Silva'),
  ('87ab9a86-75c3-5eaf-8ee0-d643ba33a246', 'Yolande & Darrell De Silva', 'Darrell De Silva'),
  ('f18b250b-4774-5081-af66-b228d76fa632', 'Rehana & Graham DeJong', 'Rehana DeJong'),
  ('f18b250b-4774-5081-af66-b228d76fa632', 'Rehana & Graham DeJong', 'Graham DeJong'),
  ('668c726a-7867-5194-bb3a-9f8315db1a19', 'Corryne & Vernon DeGama', 'Corryne DeGama'),
  ('668c726a-7867-5194-bb3a-9f8315db1a19', 'Corryne & Vernon DeGama', 'Vernon DeGama'),
  ('1dded87d-1fff-56ac-a03b-21f03dcae1b5', 'Anjali & Carl Gonsalves', 'Anjali Gonsalves'),
  ('1dded87d-1fff-56ac-a03b-21f03dcae1b5', 'Anjali & Carl Gonsalves', 'Carl Gonsalves'),
  ('0ac14706-f0c3-5415-8c76-3f3f6e0f21df', 'Charmaine & Roshan Ameen', 'Charmaine Ameen'),
  ('0ac14706-f0c3-5415-8c76-3f3f6e0f21df', 'Charmaine & Roshan Ameen', 'Roshan Ameen'),
  ('04731aca-aa8b-52b9-a25f-5954894606d3', 'Melissa & Agnelo Soares', 'Melissa Soares'),
  ('04731aca-aa8b-52b9-a25f-5954894606d3', 'Melissa & Agnelo Soares', 'Agnelo Soares'),
  ('0f837f93-11bd-50a2-866f-0f218a00e89d', 'Samantha & Viraj Perera', 'Samantha Perera'),
  ('0f837f93-11bd-50a2-866f-0f218a00e89d', 'Samantha & Viraj Perera', 'Viraj Perera'),
  ('678d3638-0244-529d-9c24-d2441b121973', 'Natalie & Jerome Ephraums', 'Natalie Ephraums'),
  ('678d3638-0244-529d-9c24-d2441b121973', 'Natalie & Jerome Ephraums', 'Jerome Ephraums'),
  ('b4201354-27e5-5b85-abf4-6fdaed1d36f5', 'Rosaine & Chris Rodrigues', 'Rosaine Rodrigues'),
  ('b4201354-27e5-5b85-abf4-6fdaed1d36f5', 'Rosaine & Chris Rodrigues', 'Chris Rodrigues'),
  ('4805bff7-2ad8-5f89-bfd4-3d10e10c8829', 'Janice & Quentin Fernandes', 'Janice Fernandes'),
  ('4805bff7-2ad8-5f89-bfd4-3d10e10c8829', 'Janice & Quentin Fernandes', 'Quentin Fernandes'),
  ('6b69d7a9-82b2-5184-b8ca-fd1efacaedf2', 'Debra & Darryl Lewis', 'Debra Lewis'),
  ('6b69d7a9-82b2-5184-b8ca-fd1efacaedf2', 'Debra & Darryl Lewis', 'Darryl Lewis'),
  ('bc322022-7d10-5c2a-93e1-a687ac602235', 'Veera & Jude Sodder', 'Veera Sodder'),
  ('bc322022-7d10-5c2a-93e1-a687ac602235', 'Veera & Jude Sodder', 'Jude Sodder'),
  ('41cc7235-daab-5871-bdc7-835c22ab8fae', 'Shalon, Adrian, Lachlan & Jaden De Zilwa', 'Adrian De Zilwa'),
  ('41cc7235-daab-5871-bdc7-835c22ab8fae', 'Shalon, Adrian, Lachlan & Jaden De Zilwa', 'Shalon De Zilwa'),
  ('41cc7235-daab-5871-bdc7-835c22ab8fae', 'Shalon, Adrian, Lachlan & Jaden De Zilwa', 'Lachlan De Zilwa'),
  ('41cc7235-daab-5871-bdc7-835c22ab8fae', 'Shalon, Adrian, Lachlan & Jaden De Zilwa', 'Jaden De Zilwa')
) as v(party_id, party_name, full_name)
where not exists (select 1 from public.invitees i where i.full_name = v.full_name);

-- Backfill the label on the Nicole & Alex rows seeded earlier.
update public.invitees set party_name = 'Nicole & Alex Cann' where party_id = 'b7bf6a90-5cde-4812-a48d-fb2717955110' and party_name is null;

select count(*) as guests, count(distinct party_id) as parties from public.invitees;
