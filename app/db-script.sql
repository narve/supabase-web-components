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

select *
from open_snoke_requests
