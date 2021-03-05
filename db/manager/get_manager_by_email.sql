select m.id as managerid, m.landlordid, m.firstname, m.lastname, m.password, m.phone, m.email, p.name, p.id as propertyid
from managers m
join properties p on p.id = m.propertyid
where m.email = $1