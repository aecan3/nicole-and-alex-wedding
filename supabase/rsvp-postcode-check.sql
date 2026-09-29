-- Postcode check for RSVPs. Paste into the Supabase SQL Editor and click Run.
-- Safe to run more than once. Run this BEFORE the site update goes live.

-- 1. Postcode per guest
alter table public.invitees add column if not exists postcode text;

update public.invitees i set postcode = v.postcode
from (values
  ('Nicole Fernando', '3204'),
  ('Alex Cann', '3204'),
  ('Nita Fernando', '3170'),
  ('Niranjan Fernando', '3170'),
  ('Nichelle Fernando', '3802'),
  ('Edan Trevethick', '3802'),
  ('Judy Fernando', '3111'),
  ('Hiran Fernando', '3111'),
  ('Portia Fernando', '3111'),
  ('Nic Chrisomalidis', '3111'),
  ('Aaron Fernando', '2900'),
  ('Jess Lee', '2900'),
  ('Canice Fernando', '3170'),
  ('Nimal Fernando', '3170'),
  ('Rosie Fernando', '3978'),
  ('Ranjith Fernando', '3978'),
  ('Shehan Fernando', '3978'),
  ('Shya Fernando', '3978'),
  ('Sarita Fernandes', '95124'),
  ('Maria Fernandes', '95124'),
  ('Sienna Fernandes', '95124'),
  ('Roy Fernandes', '1234'),
  ('Sherry Fernandes', '1234'),
  ('Lisa Cann', '3934'),
  ('Darrell Cann', '3934'),
  ('Emma Davies', '3810'),
  ('Gavin Davies', '3810'),
  ('Ashlea Cann', '3936'),
  ('Daniel Cann', '3936'),
  ('Sonia Milland', '3199'),
  ('Paul Milland', '3199'),
  ('Brannon McDonald', '4671'),
  ('Emisha McDonald', '4671'),
  ('Liam McDonald', '3352'),
  ('Jelisa McDonald', '3352'),
  ('Greg Dawson', '3146'),
  ('Tracey Dawson', '3146'),
  ('Maisey Dawson', '3146'),
  ('Poppy Dawson', '3146'),
  ('Alex Caruana', '3146'),
  ('Jenny Dawson', 'V6E 1X4'),
  ('Raimy Casiro', 'V6E 1X4'),
  ('Chaiya Casiro', 'V6E 1X4'),
  ('Dorothy Smith', '3922'),
  ('Clive Smith', '3922'),
  ('Graeme Dawson', '3139'),
  ('Julia Cann', '3810'),
  ('Graeme Cann', '3810'),
  ('Warren Cann', '3782'),
  ('Michael Cann', '3782'),
  ('William Cann', '3782'),
  ('Isaac Cann', '3207'),
  ('Taryn Mangione', '3207'),
  ('Roger Cann', '7315'),
  ('Nerrelie Cann', '7315'),
  ('Joel Cann', '7315'),
  ('Susan Cann', '7315'),
  ('Gabrielle Cann', '7315'),
  ('Bhavya Mishra', '3124'),
  ('Fallon Wanganeen', '3124'),
  ('Damon Lawrence', '3141'),
  ('Shreya Mishra', '3146'),
  ('Jay Jhamb', '3146'),
  ('Stephanie Cavar', '3089'),
  ('Marcus Favrin', '3089'),
  ('Ternelle Pini', '3148'),
  ('Emma Pini', '3148'),
  ('Davinia Prabakaran', '3190'),
  ('Dharann Moganaraju', '3190'),
  ('Dulanjan Fernando', '3806'),
  ('Tahlia Fernando', '3806'),
  ('Cimona Fernandes', '3150'),
  ('Garth D''Silva', '3150'),
  ('Gemma McDonald', '3136'),
  ('Tom McCutchan', '3136'),
  ('Bianca Luck', '3187'),
  ('Matt Luck', '3187'),
  ('Michael Girolamo', '3129'),
  ('Jacqueline Girolamo', '3129'),
  ('Jack Irons', '3805'),
  ('Tess Irons', '3805'),
  ('Gabby Holland', '3809'),
  ('Ben Holland', '3809'),
  ('Emma Richardson', '3196'),
  ('Jake Richardson', '3196'),
  ('Claire Barley', '3058'),
  ('Nathan Workman', '3058'),
  ('Teagan Oates', '3085'),
  ('Rob Oates', '3085'),
  ('Abigail Conway', '3123'),
  ('Mitchell Conway', '3123'),
  ('Matthew Stainer', '3936'),
  ('Steph Bruders', '3204'),
  ('Mitchell Lonie', '3204'),
  ('Katie Mitchell', '3183'),
  ('Matthew Stevenson', '3183'),
  ('Katie Koulouris', '3178'),
  ('Ryan Johnson', '3178'),
  ('Lucas Holland', '3056'),
  ('Zoe Manoussakis', '3056'),
  ('Pramedi De Silva', '3148'),
  ('Dillon De Silva', '3148'),
  ('Chloe Perrin', '4151'),
  ('Tasman Perrin', '4151'),
  ('Georgie Costa', '3073'),
  ('Ethan Baade', '3073'),
  ('Georgia Wilson', '3115'),
  ('Bailen Clarke', '3115'),
  ('Brodie Symons', '3931'),
  ('Rafferty Dall', '3204'),
  ('Himali Shanmugaratnam', '3150'),
  ('Kumar Shanmugaratnam', '3150'),
  ('Kajal Mishra', '3146'),
  ('Himanshu Mishra', '3146'),
  ('Tom Lewis', '3204'),
  ('Melissa Meirun', '3204'),
  ('Alcina DeSouza', '2170'),
  ('Joseph DeSouza', '2170'),
  ('Livia Bothello', '3977'),
  ('Herbert Bothello', '3977'),
  ('Glenda Rebeiro', '3150'),
  ('Hillary Rebeiro', '3150'),
  ('Olpha Andris', '3152'),
  ('Frank Andris', '3152'),
  ('Sarah Ribeiro', '3187'),
  ('Arnaldo Ribeiro', '3187'),
  ('Romina Vaz', '3170'),
  ('Winston Vaz', '3170'),
  ('Sandra Mariadas', '3104'),
  ('David Mariadas', '3104'),
  ('Yolande De Silva', '3178'),
  ('Darrell De Silva', '3178'),
  ('Rehana DeJong', '3105'),
  ('Graham DeJong', '3105'),
  ('Corryne DeGama', '3204'),
  ('Vernon DeGama', '3204'),
  ('Anjali Gonsalves', '3204'),
  ('Carl Gonsalves', '3204'),
  ('Charmaine Ameen', '3027'),
  ('Roshan Ameen', '3027'),
  ('Melissa Soares', '3104'),
  ('Agnelo Soares', '3104'),
  ('Samantha Perera', '3145'),
  ('Viraj Perera', '3145'),
  ('Natalie Ephraums', '3805'),
  ('Jerome Ephraums', '3805'),
  ('Rosaine Rodrigues', '3193'),
  ('Chris Rodrigues', '3193'),
  ('Janice Fernandes', '3027'),
  ('Quentin Fernandes', '3027'),
  ('Debra Lewis', '3172'),
  ('Darryl Lewis', '3172'),
  ('Veera Sodder', '3030'),
  ('Jude Sodder', '3030'),
  ('Adrian De Zilwa', '3805'),
  ('Shalon De Zilwa', '3805'),
  ('Lachlan De Zilwa', '3805'),
  ('Jaden De Zilwa', '3805')
) as v(full_name, postcode)
where i.full_name = v.full_name;

-- 2. Wrong-guess tracking: 5 wrong tries locks a household for 15 minutes
create table if not exists public.rsvp_attempts (
  party_id uuid primary key,
  fails int not null default 0,
  locked_until timestamptz
);
alter table public.rsvp_attempts enable row level security;
revoke all on public.rsvp_attempts from anon, authenticated;

-- Returns 'ok', 'wrong' or 'locked'. Only called by the two functions below.
create or replace function public.check_postcode(p_party uuid, p_postcode text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  cleaned text := upper(regexp_replace(coalesce(p_postcode, ''), '\s', '', 'g'));
  a public.rsvp_attempts%rowtype;
  new_fails int;
  had_row boolean;
begin
  select * into a from public.rsvp_attempts where party_id = p_party;
  had_row := found;
  if had_row and a.locked_until is not null and a.locked_until > now() then
    return 'locked';
  end if;

  if cleaned <> '' and exists (
    select 1 from public.invitees
    where party_id = p_party
      and upper(regexp_replace(coalesce(postcode, ''), '\s', '', 'g')) = cleaned
  ) then
    delete from public.rsvp_attempts where party_id = p_party;
    return 'ok';
  end if;

  new_fails := case when had_row and (a.locked_until is null or a.locked_until > now()) then a.fails + 1 else 1 end;
  if new_fails >= 5 then
    insert into public.rsvp_attempts (party_id, fails, locked_until)
    values (p_party, 0, now() + interval '15 minutes')
    on conflict (party_id) do update set fails = 0, locked_until = excluded.locked_until;
    return 'locked';
  end if;
  insert into public.rsvp_attempts (party_id, fails, locked_until)
  values (p_party, new_fails, null)
  on conflict (party_id) do update set fails = excluded.fails, locked_until = null;
  return 'wrong';
end;
$$;

-- 3. get_party now needs the postcode. Returns {status, members}.
drop function if exists public.get_party(uuid);
drop function if exists public.get_party(uuid, text);
create or replace function public.get_party(invitee_id uuid, p_postcode text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid;
  st text;
begin
  select party_id into pid from public.invitees where id = invitee_id;
  if pid is null then
    return jsonb_build_object('status', 'wrong');
  end if;
  st := public.check_postcode(pid, p_postcode);
  if st <> 'ok' then
    return jsonb_build_object('status', st);
  end if;
  return jsonb_build_object(
    'status', 'ok',
    'members', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', i.id, 'full_name', i.full_name, 'rsvp_status', i.rsvp_status,
        'dietary', i.dietary, 'email', i.email, 'bus_pickup', i.bus_pickup,
        'message', i.message
      ) order by i.full_name), '[]'::jsonb)
      from public.invitees i where i.party_id = pid
    )
  );
end;
$$;

-- 4. submit_rsvp now needs the postcode too. Returns 'ok', 'wrong' or 'locked'.
drop function if exists public.submit_rsvp(uuid, text, text, text, text, text);
drop function if exists public.submit_rsvp(uuid, text, text, text, text, text, text);
create or replace function public.submit_rsvp(
  invitee_id uuid,
  p_status text,
  p_dietary text,
  p_email text,
  p_bus_pickup text,
  p_message text,
  p_postcode text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid;
  st text;
begin
  select party_id into pid from public.invitees where id = invitee_id;
  if pid is null then
    return 'wrong';
  end if;
  st := public.check_postcode(pid, p_postcode);
  if st <> 'ok' then
    return st;
  end if;
  update public.invitees
  set rsvp_status = p_status,
      dietary = p_dietary,
      email = p_email,
      bus_pickup = p_bus_pickup,
      message = p_message,
      updated_at = now()
  where id = invitee_id;
  return 'ok';
end;
$$;

-- 5. Permissions: guests can only call search, get_party and submit_rsvp
revoke all on function public.check_postcode(uuid, text) from public, anon, authenticated;
revoke all on function public.get_party(uuid, text) from public;
revoke all on function public.submit_rsvp(uuid, text, text, text, text, text, text) from public;
grant execute on function public.get_party(uuid, text) to anon;
grant execute on function public.submit_rsvp(uuid, text, text, text, text, text, text) to anon;

-- Check: everyone should have a postcode (expect 0 rows)
select full_name from public.invitees where postcode is null or postcode = '';
