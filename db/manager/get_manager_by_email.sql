select m.id as managerid, m.landlordid, m.firstname, m.lastname, m.password, p.name
from managers m
join properties p on p.id = m.propertyid
where m.email = $1