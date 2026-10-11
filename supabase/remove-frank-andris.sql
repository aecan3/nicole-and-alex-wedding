-- 11 Oct 2026: remove Frank Andris. Olpha Andris stays, as a household of one.
-- Safe to run twice.
delete from public.invitees
where party_id = 'b195cfea-415e-5d8a-8326-7b4a3add4df7' and full_name = 'Frank Andris';

update public.invitees set party_name = 'Olpha Andris'
where party_id = 'b195cfea-415e-5d8a-8326-7b4a3add4df7';

-- Check: should show one row, Olpha Andris
select party_name, full_name, rsvp_status, response_type, email, confirmation_status as email_sent
from public.invitees where party_id = 'b195cfea-415e-5d8a-8326-7b4a3add4df7';
