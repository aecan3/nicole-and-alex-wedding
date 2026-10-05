-- Households that have RSVP'd but whose confirmation email didn't go out.
-- Paste into the Supabase SQL Editor and click Run.
select party_name, max(email) as email, max(confirmation_status) as status
from public.invitees
where rsvp_status <> 'pending'
group by party_name
having coalesce(max(confirmation_status), '') <> 'sent'
order by party_name;
