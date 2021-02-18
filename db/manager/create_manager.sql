insert into managers
(landlordid, propertyid, firstname, lastname, password, email, phone)
values
($1, $2, $3, $4, $5, $6, $7);

select * from managers where email = $6;