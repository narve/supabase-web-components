-- drop view _me;
-- create or replace view public._me(id, email)
--     as
-- SELECT i.id,
--        i.email
-- FROM auth.users i
-- WHERE i.id = auth.uid()
-- OFFSET 0 -- to prevent updates
-- ;

set role postgres;

drop table if exists gift_wish;

drop function if exists row_modified;
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
    constraint fk_gift_wish_creator foreign key (created_by) references auth.users(id),
    constraint fk_gift_wish_updater foreign key (updated_by) references auth.users(id)
);

DROP TRIGGER IF EXISTS gift_wish_modified_trigger ON gift_wish;
CREATE TRIGGER gift_wish_modified_trigger BEFORE UPDATE OR INSERT ON gift_wish FOR EACH ROW EXECUTE FUNCTION row_modified();

-- select id from auth.users where email like '%narve%'

SET SESSION request.jwt.claims to '{"sub":"a2a47716-6149-4805-b631-67395b8fde74" }';
set role authenticated;
-- select auth.uid();

UPDATE auth.users
SET encrypted_password = crypt('asdf22asdf', gen_salt('bf'))
WHERE email = 'narve@dv8.no';


insert into gift_wish (name) values ( 'hei');



update gift_wish set id = 1, name =  where id = 1;

select * from gift_wish;