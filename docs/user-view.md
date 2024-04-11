Create a view that references `auth.users`: 
---

    create view public.users as (select id, email from auth.users)


Create user references: 
---

    alter table public.todo add constraint todo_owner_id_fkey foreign key (owner_id references users (id))


Create a function to get owner of a todo or location:
---
    create or replace function owner(todo) returns setof public.users rows 1 as $$
    select id, email from public.users where id = $1.owner_id
        $$ stable language sql;
    
    create or replace function owner(location) returns setof public.users rows 1 as $$
    select id, email from public.users where id = $1.owner_id
        $$ stable language sql;


Reference the user-functions in PostGREST: 
---

    select id, owner(todo) from public.todo