create trigger snoke_request_before_insert
    before insert
    on public.snoke_request
    for each row
execute procedure public.tg_before_insert();

drop table snoke_response cascade;
create table snoke_response
(
    id               uuid primary key   default gen_random_uuid(),
    created_by       uuid      not null references auth.users (id),
    modified_by      uuid      not null references auth.users (id),
    created_at       timestamp not null default now(),
    modified_at      timestamp not null default now(),

    snoke_request_id uuid      not null references snoke_request (id),
    full_name        text      not null,
    year_of_birth    int2      not null,
    county           text      not null,

    wealth           int8      not null,
    income           int8      not null,
    tax              int8      not null
);

create trigger snoke_response_before_insert
    before insert
    on public.snoke_response
    for each row
execute procedure public.tg_before_insert();


create or replace view open_snoke_requests
    with ( security_barrier = true, security_invoker = false)
as
select req.id snoke_request_id,
       req.created_at,
       req.full_name,
       req.year_of_birth,
       req.county
from snoke_request req
         left outer join snoke_response resp on req.id = resp.snoke_request_id
where resp.id is null
order by random();

alter table snoke_request enable row level security;
create policy snoke_request_select_policy
    on snoke_request
    for all
    using (auth.uid() = created_by);

alter table snoke_response enable row level security;
create policy snoke_response_select_policy
    on snoke_response
    for all
    using (auth.uid() = created_by);

select auth.uid()

select *
from open_snoke_requests;

create schema private;

CREATE TABLE IF NOT EXISTS private.keys (
                                            key text primary key not null,
                                            value text
);
REVOKE ALL ON TABLE private.keys FROM PUBLIC;

INSERT INTO private.keys (key, value) values ('MAILERSEND_API_TOKEN', 'asdf');

-- Do not allow this function to be called by public users (or called at all from the client)
REVOKE EXECUTE on function public.send_email_mailersend FROM PUBLIC;



CREATE TABLE if not exists public.messages
(
    id uuid primary key default gen_random_uuid(),
    recipient text,
    sender text,
    cc text,
    bcc text,
    subject text,
    text_body text,
    html_body text,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status text,
    deliveryresult jsonb,
    deliverysignature jsonb,
    log jsonb
);
ALTER TABLE public.messages OWNER TO postgres;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- Turn off all access to the messages table by default
CREATE POLICY "messages delete policy" ON public.messages FOR DELETE USING (false);
CREATE POLICY "messages insert policy" ON public.messages FOR INSERT WITH CHECK (false);
CREATE POLICY "messages select policy" ON public.messages FOR SELECT USING (false);
CREATE POLICY "messages update policy" ON public.messages FOR UPDATE USING (false) WITH CHECK (false);

select send_email_message('{
  "sender": "sender@trial-pr9084z1708gw63d.mlsender.net",
  "recipient": "mrnarve+mailersend@gmail.com",
  "subject": "This is a test message 2 from my Supabase app!",
  "html_body": "<html><body>This message was sent from <a href=\"https://postgresql.org\">PostgreSQL</a> using <a href=\"https://supabase.io\">Supabase</a> and <a href=\"https://mailersend.com\">Mailersend</a>.</body></html>"
}');

select send_email_message('{
  "sender": "sender@trial-pr9084z1708gw63d.mlsender.net",
  "recipient": "mrnarve+mailersend@gmail.com",
  "subject": "This is a test message 2 from my Supabase app!",
  "html_body": "<html><body>This message was sent from <a href=\"https://postgresql.org\">PostgreSQL</a> using <a href=\"https://supabase.io\">Supabase</a> and <a href=\"https://mailersend.com\">Mailersend</a>.</body></html>"
}');

    SET SESSION request.jwt.claims to '{"sub": "bd770cb8-8039-4c45-8fee-dd4a7ca23ecb"}';
    set role authenticated;

INSERT INTO public.snoke_response (id, created_by, modified_by, created_at, modified_at, snoke_request_id, full_name, year_of_birth, county, wealth, income, tax)
VALUES (gen_random_uuid(), 'bd770cb8-8039-4c45-8fee-dd4a7ca23ecb', 'bd770cb8-8039-4c45-8fee-dd4a7ca23ecb', '2024-04-25 05:33:30.353676', '2024-04-25 05:33:30.353676', '04e65197-e8e4-4be9-9eb3-33a1e8ac6e35', 'En person', 1980, 'Bærum', 6, 6, 6);

select id, created_at from snoke_response order by created_at desc;


/************************************************************
*
* Function:  create_email_message(message JSON)
*
* create a message in the messages table
*
{
  recipient: "", -- REQUIRED
  sender: "", -- REQUIRED
  cc: "",
  bcc: "",
  subject: "", -- REQUIRED
  text_body: "", -- one of: text_body OR html_body is REQUIRED
  html_body: "" -- both can be sent but one of them is REQUIRED
}
returns:  uuid (as text) of newly inserted message
************************************************************/
create or replace function public.create_email_message(message JSON)
   returns text
   language plpgsql
  -- Set a secure search_path: trusted schema(s), then 'pg_temp'.
  -- SET search_path = admin, pg_temp;
  as
$$
declare
-- variable declaration
recipient text;
sender text;
cc text;
bcc text;
subject text;
text_body text;
html_body text;
retval text;
begin
  /*
  if not exists (message->>'recipient') then
    RAISE INFO 'messages.recipient missing';
  end if
  */
  select  message->>'recipient',
          message->>'sender',
          message->>'cc',
          message->>'bcc',
          message->>'subject',
          message->>'text_body',
          message->>'html_body' into recipient, sender, cc, bcc, subject, text_body, html_body;

  if coalesce(sender, '') = '' then
    -- select 'no sender' into retval;
    RAISE EXCEPTION 'message.sender missing';
  elseif coalesce(recipient, '') = '' then
    RAISE EXCEPTION 'message.recipient missing';
  elseif coalesce(subject, '') = '' then
    RAISE EXCEPTION 'message.subject missing';
  elseif coalesce(text_body, '') = '' and coalesce(html_body, '') = '' then
    RAISE EXCEPTION 'message.text_body and message.html_body are both missing';
  end if;

  if coalesce(text_body, '') = '' then
    select html_body into text_body;
  elseif coalesce(html_body, '') = '' then
    select text_body into html_body;
  end if;

  insert into public.messages(recipient, sender, cc, bcc, subject, text_body, html_body, status, log)
  values (recipient, sender, cc, bcc, subject, text_body, html_body, 'ready', '[]'::jsonb) returning id into retval;

  return retval;
end;
$$;

select create_email_message('{
  "sender": "sender@trial-pr9084z1708gw63d.mlsender.net",
  "recipient": "mrnarve+sendermail2@gmail.com",
  "subject": "This is a test message from my Supabase app!",
  "html_body": "<html><body>This message was originally created as \"ready\" in the messages table, then sent later from <a href=\"https://supabase.io\">Supabase</a> using <a href=\"https://mailersend.com\">Mailersend</a>.</body></html>"
}');

select send_email_message('{
  "messageid": "f8e2d266-373c-45d0-8f52-8fc964f7724f"
}');

select * from messages;