select s.id as staffid, s.firstname, s.lastname, s.password, s.email, s.phone, p.name, p.id as propertyid
from staff s
join properties p on p.id = s.propertyid
where s.email = $1