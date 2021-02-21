select s.id as staffid, s.landlordid, s.managerid, s.firstname, s.lastname, s.password, p.name
from staff s
join properties p on p.id = s.propertyid
where s.email = $1