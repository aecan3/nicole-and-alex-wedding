-- Records whether each household's confirmation email went out.
-- Paste into the Supabase SQL Editor and click Run. Safe to run more than once.
-- Run this BEFORE the site update goes live.

alter table public.invitees add column if not exists confirmation_status text;  -- 'sent' or 'failed'
alter table public.invitees add column if not exists confirmation_at timestamptz;

-- Called by the site's email route after each send. Needs the household's
-- postcode, same as the RSVP itself. Returns 'ok', 'wrong', 'locked' or 'bad'.
create or replace function public.record_confirmation(invitee_id uuid, p_postcode text, p_status text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid;
  st text;
begin
  if p_status not in ('sent', 'failed') then
    return 'bad';
  end if;
  select party_id into pid from public.invitees where id = invitee_id;
  if pid is null then
    return 'wrong';
  end if;
  st := public.check_postcode(pid, p_postcode);
  if st <> 'ok' then
    return st;
  end if;
  update public.invitees
  set confirmation_status = p_status, confirmation_at = now()
  where party_id = pid;
  return 'ok';
end;
$$;

revoke all on function public.record_confirmation(uuid, text, text) from public;
grant execute on function public.record_confirmation(uuid, text, text) to anon;

-- Check: expect one row, the function name
select proname from pg_proc where proname = 'record_confirmation';
