select t.id as tenantid, t.propertyid, t.firstname, t.lastname, t.password, p.name
from tenants t
join properties p on p.id = t.propertyid
where t.email = ${email};