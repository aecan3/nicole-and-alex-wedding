-- Adds a "response_type" column: 'new' for a household's first reply, 'updated' after that.
-- Paste into the Supabase SQL Editor and click Run. Safe to run more than once.
-- No website change is needed; Supabase fills it in itself on every RSVP.

alter table public.invitees add column if not exists response_type text;

-- Same as before, plus: works out new vs updated from the saved status before overwriting it.
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
  prev text;
begin
  select party_id, rsvp_status into pid, prev from public.invitees where id = invitee_id;
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
      response_type = case when prev = 'pending' then 'new' else 'updated' end,
      updated_at = now()
  where id = invitee_id;
  return 'ok';
end;
$$;

revoke all on function public.submit_rsvp(uuid, text, text, text, text, text, text) from public;
grant execute on function public.submit_rsvp(uuid, text, text, text, text, text, text) to anon;

-- Your own household has already updated once
update public.invitees set response_type = 'updated'
where party_name = 'Nicole & Alex Cann' and rsvp_status <> 'pending' and response_type is null;

-- Check: expect both of you as 'updated'
select full_name, rsvp_status, response_type from public.invitees where party_name = 'Nicole & Alex Cann';
