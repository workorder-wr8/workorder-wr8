select s.id as staffid, s.firstname, s.lastname, s.password, s.email, s.phone, p.name, p.id as propertyid, p.address1 as propaddress, p.city as propcity, p.state as propstate, p.zip as propzip, p.email as propemail, p.phone as propphone
from staff s
join properties p on p.id = s.propertyid
where s.email = $1