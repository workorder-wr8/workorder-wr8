insert into managers
(landlordid, propertyid, firstname, lastname, password, email, phone)
values
($1, $2, $3, $4, $5, $6, $7);

select m.id as managerid, m.landlordid, m.firstname, m.lastname, p.name, p.id as propertyid, p.address1 as propaddress, p.city as propcity, p.state as propstate, p.zip as propzip, p.email as propemail, p.phone as propphone
from managers m
join properties p on p.id = m.propertyid
where m.email = $6;