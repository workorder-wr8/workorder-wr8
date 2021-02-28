select 
w.id,
w.title, 
w.description, 
w.status, 
w.datecreated, 
w.tenantid,
t.firstname as tenantfirstname,
t.lastname as tenantlastname,
w.lastupdated, 
w.datecompleted,
w.staffid,
t.firstname as tenantfirst,
t.lastname as tenantlast,
s.id as staffid,
s.firstname as stafffirst,
s.lastname as stafflast
from workorders w
left join tenants t on t.id = w.tenantid
join properties p on p.id = w.propertyid
left join staff s on w.staffid = s.id
where w.propertyid = $1
order by w.datecreated asc;
