select l.id as landlordid, l.firstname, l.lastname, l.password, p.id, p.name, p.address1, p.city, p.state, p.zip, p.email, p.phone
from landlords l
join properties p on p.landlordid = l.id
where l.id = $1;