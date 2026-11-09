-- Bus answer for every household that has RSVP'd, most recent first.
-- Paste into the Supabase SQL Editor and click Run.
select
  party_name,
  string_agg(full_name || ' (' || rsvp_status || ')', ', ' order by full_name) as guests,
  coalesce(max(bus_pickup), '(blank)') as bus_answer,
  max(updated_at) at time zone 'Australia/Melbourne' as last_updated
from public.invitees
where rsvp_status <> 'pending'
group by party_name
order by max(updated_at) desc;
