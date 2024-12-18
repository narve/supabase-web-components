
Fake a user in SQL session
---

```postgresql
    select id, email, jsonb_build_object('sub', id::text) claims
    from auth.users
    where email = 'mrnarve@gmail.com';

    SET SESSION request.jwt.claims to '{"sub": "bd770cb8-8039-4c45-8fee-dd4a7ca23ecb"}';
    set role authenticated;

    select auth.uid();

    select id, created_by from public.snoke_request;
    select * from public.my_open_snoke_requests;
    select * from public.snoke_response;
    select * from public.open_snoke_requests;


```    


Revert to non-fake-user mode
---
```postgresql

    set role postgres;
    SET SESSION request.jwt.claims to '';


```

Reload cache
---

```postgresql
    NOTIFY pgrst, 'reload schema'


```

Creating id columns
---

    id       uuid primary key default gen_random_uuid(),


To create a function to set owner_id
---

```postgresql

truncate table snoke_request;
alter table snoke_request add column 
    created_by uuid not null references auth.users(id);
alter table snoke_request add column 
    modified_by uuid not null references auth.users(id);
alter table snoke_request add column 
    created_at timestamp not null default now();
alter table snoke_request add column 
    modified_at timestamp not null default now();


```


```postgresql

    create or replace function public.tg_before_insert() returns trigger
    language plpgsql
    as
    $$
    begin
    new.created_by = auth.uid();
    new.modified_by = auth.uid();
    new.created_at = now();
    new.modified_at = now();
    return new;
    end;
    $$;

```


Add trigger to a new table
---


```postgresql
    create trigger snoke_request_before_insert
    before insert
    on public.snoke_request
    for each row
    execute procedure public.tg_before_insert();


```


To set password for a user
---

```postgresql

    select crypt('my-password', gen_salt('bf'));
    update auth.users set encrypted_password = crypt('my-password', gen_salt('bf')) where email = 'mrnarve@gmail.com';


```


Add created/modified by/at
---

```postgresql

    alter table location drop column owner_id;
    delete from location;

    alter table location add column created_by uuid not null references auth.users (id);
    alter table location add column modified_by uuid not null references auth.users (id);
    alter table location add column created_at timestamp not null default now();
    alter table location add column modified_at timestamp not null default now();



```

Add policy to manage own records
---

````postgresql
alter table location enable row level security ;

drop policy if exists "CRUD OWN RECORDS" on location;
create policy "CRUD OWN RECORDS"

    on "public"."location"

    as PERMISSIVE

    for ALL

    to public

    using (
        created_by = auth.uid()
    );


````


Policy to view public todos
---

```postgresql

alter table todo rename column public to is_public;

update todo set is_public = false where title = 'mrnarves todo 2';

drop policy if exists "Read public items" on todo;
create policy "Read public items" on todo 
as permissive for select to public
using (is_public = true)


```

Snoke tables
---
```postgresql
create table snoke_request (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    county text,
    year_of_birth int4
)
```


E-mail notifications
===

```postgresql

drop table if exists outgoing_email;
create table outgoing_email (
    id uuid primary key default gen_random_uuid(),
    snoke_request_id uuid not null references snoke_response(id),
    recipient text not null,
    subject text not null,
    body text not null,
    created_at timestamp not null default now(),
    sent_at timestamp
);

alter table outgoing_email enable row level security;

-- create a trigger for email:
drop function if exists tg_after_insert_response; 
create or replace function public.tg_after_insert_response() returns trigger
    language plpgsql
    security definer
    as
    $$
    begin
        insert into outgoing_email (snoke_request_id, recipient, subject, body)
        select new.id, 
               req_creator.email, 
               'SNOKING utført', 
               'Du har fått et snoke-svar. Logg inn for å se det: https://snok.netflify.app'
        from auth.users req_creator inner join snoke_request req on req.created_by = req_creator.id
        where req.id = new.snoke_request_id;
        return new;
    end;
    $$;

drop trigger if exists snoke_response_after_insert on public.snoke_response;
create trigger snoke_response_after_insert
    after insert
    on public.snoke_response
    for each row
    execute procedure public.tg_after_insert_response();

insert into snoke_response (snoke_request_id, created_by, response)

select * from outgoing_email;

```

```postgresql
```