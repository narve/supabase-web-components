set role postgres;
set schema 'public';

drop  view if exists _me;
create or replace view public._me(id, email)
    as
SELECT i.id,
       i.email
FROM auth.users i
WHERE i.id = auth.uid()
OFFSET 0 -- to prevent updates
;

drop table if exists profiles cascade ;
create table profiles (
     id uuid not null references auth.users on delete cascade,
     first_name text,
     last_name text,

     primary key (id)
);

-- gotta handle the narve-user!
-- select users from auth into profiles:
insert into profiles (id, first_name, last_name)
select id, raw_user_meta_data ->> 'first_name', raw_user_meta_data ->> 'last_name'
from auth.users
where email like '%narve%';


alter table public.profiles enable row level security;

-- inserts a row into public.profiles
create or replace function public.handle_new_user()
    returns trigger
    language plpgsql
    security definer set search_path = ''
as $$
begin
    insert into public.profiles (id, first_name, last_name)
    values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
    return new;
end;
$$;

-- trigger the function every time a user is created
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();


drop table if exists gift_wish cascade;

drop function if exists row_modified cascade ;
CREATE or replace FUNCTION row_modified() RETURNS "trigger"
    LANGUAGE "plpgsql"
AS $$
BEGIN
    IF row (NEW.*) IS DISTINCT FROM row (OLD.*) THEN
        IF TG_OP = 'INSERT' THEN
--             IF attribute_exists('updated_at', OLD) THEN
                NEW.updated_at = CURRENT_TIMESTAMP(0);
                NEW.created_at = CURRENT_TIMESTAMP(0);

--             END IF;
--             IF attribute_exists('updated_by', OLD) THEN
                NEW.updated_by = auth.uid();
                NEW.created_by = auth.uid();
--             END IF;
            RETURN NEW;
        ELSIF TG_OP = 'UPDATE' THEN
--             IF attribute_exists('updated_at', OLD) THEN
                new.created_at = OLD.created_at;
                NEW.updated_at = CURRENT_TIMESTAMP(0);
--             END IF;
--             IF attribute_exists('updated_by', OLD) THEN
                NEW.updated_by = auth.uid();
                NEW.created_by = OLD.created_by;

--             END IF;
            RETURN NEW;
        END IF;
    ELSE
        RETURN OLD;
    END IF;
END;
$$;

drop table if exists gift_wish;
create table gift_wish
(
    id integer primary key generated always as identity,
    created_at timestamp not null default  CURRENT_TIMESTAMP ,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
    created_by uuid not null default auth.uid(),
    updated_by uuid not null default auth.uid(),
--     owner_id uuid not null,
    name text not null,
    constraint fk_gift_wish_creator foreign key (created_by) references profiles(id),
    constraint fk_gift_wish_updater foreign key (updated_by) references profiles(id)
);
comment on table gift_wish is 'Wishes\n\nA wish for a gift.';

DROP TRIGGER IF EXISTS gift_wish_modified_trigger ON gift_wish;
CREATE TRIGGER gift_wish_modified_trigger BEFORE UPDATE OR INSERT ON gift_wish FOR EACH ROW EXECUTE FUNCTION row_modified();



drop table if exists gift_comment;
create table gift_comment
(
    id integer primary key generated always as identity,
    created_at timestamp not null default  CURRENT_TIMESTAMP ,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
    created_by uuid not null default auth.uid(),
    updated_by uuid not null default auth.uid(),
--     owner_id uuid not null,
    gift_whish_id integer not null,
    text text not null,
    constraint fk_gift_wish_creator foreign key (created_by) references profiles(id),
    constraint fk_gift_wish_updater foreign key (updated_by) references profiles(id),
    constraint fk_gift_comment_wish foreign key (gift_whish_id) references gift_wish(id)
);
comment on table gift_comment is 'Wish comments';

DROP TRIGGER IF EXISTS gift_comment_modified_trigger ON gift_comment;
CREATE TRIGGER gift_comment_modified_trigger BEFORE UPDATE OR INSERT ON gift_comment FOR EACH ROW EXECUTE FUNCTION row_modified();

-- select id from auth.users where email like '%narve%'

SET SESSION request.jwt.claims to '{"sub":"a2a47716-6149-4805-b631-67395b8fde74" }';
set role authenticated;
select auth.uid();

-- UPDATE auth.users
-- SET encrypted_password = crypt('asdf22asdf', gen_salt('bf'))
-- WHERE email = 'narve@dv8.no';


insert into gift_wish (name) values ( 'hei 2');



select * from gift_wish;



