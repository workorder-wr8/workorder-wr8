insert into staff (propertyid, firstname, lastname, password, email, phone)
values($1,$2,$3,$4,$5,$6);

select s.id as staffid, s.firstname, s.lastname, s.password, s.email, s.phone, p.name, p.id as propertyid
from staff s
join properties p on p.id = s.propertyid
where s.email = $5

