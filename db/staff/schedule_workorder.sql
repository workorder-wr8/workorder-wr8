update workorders
set status = $2
where id = $1;

select 
t.firstname, 
t.lastname, 
t.email, 
t.phone,
w.id,
w.title, 
w.description, 
w.status, 
w.datecreated, 
w.lastupdated, 
w.datecompleted
from workorders w
join tenants t on t.id = w.tenantid
where staffid = $3; 