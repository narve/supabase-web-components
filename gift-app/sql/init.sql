drop view _me;
create or replace view public._me(id, email)
    as
SELECT i.id,
       i.email
FROM auth.users i
WHERE i.id = auth.uid()
OFFSET 0 -- to prevent updates
;

create