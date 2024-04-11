
To fake a user in SQL
---

    select id from auth.users where ...
    SET SESSION request.jwt.claims to '{"sub":"e2b4de4e-a6f2-4845-bac8-0305ed1c2d60" }';
    set role authenticated;
    select auth.uid();


To revert to non-fake-user mode
---

    set role postgres


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

    create trigger XXX_before_insert
    before insert
    on public.XXX
    for each row
    execute procedure public.tg_before_insert();


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