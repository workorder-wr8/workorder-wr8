<<<<<<< HEAD
select m.id as managerid, m.landlordid, m.firstname, m.lastname, m.password, p.name, p.id as propertyid, p.address1 as propaddress, p.city as propcity, p.state as propstate, p.zip as propzip, p.email as propemail, p.phone as propphone
=======
select m.id as managerid, m.landlordid, m.firstname, m.lastname, m.password, m.phone, m.email, p.name, p.id as propertyid
>>>>>>> main
from managers m
join properties p on p.id = m.propertyid
where m.email = $1