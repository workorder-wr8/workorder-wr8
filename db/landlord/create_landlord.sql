insert into landlords (password, firstname, lastname, email, phone)
VALUES ($1,$2,$3,$4,$5);

select id as landlordid, firstname, lastname, password, email, phone 
from landlords
where email = $4;

-- select l.id as landlordid, l.firstname, l.lastname, l.password, p.id, p.name, p.address1, p.city, p.state, p.zip, p.email, p.phone
-- from landlords l
-- join properties p on p.landlordid = l.id
-- where l.email = $4;