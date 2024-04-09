
To fake a user in SQL
---

    select id from auth.users where ...
    SET SESSION request.jwt.claims to '{"sub":"e2b4de4e-a6f2-4845-bac8-0305ed1c2d60" }';
    set role authenticated;
    select auth.uid();


To revert to non-fake-user mode
---

    set role postgres


Creating id columns
---

    id       uuid primary key default gen_random_uuid(),


To create a function to set owner_id
---

    create function public.tg_before_insert() returns trigger
    language plpgsql
    as
    $$
    begin
    new.owner_id = auth.uid();
    return new;
    end;
    $$;


Add trigger to a new table
---

    create trigger XXX_before_insert
    before insert
    on public.XXX
    for each row
    execute procedure public.tg_before_insert();
