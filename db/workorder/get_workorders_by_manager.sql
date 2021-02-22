select 
m.firstname, 
m.lastname, 
m.email, 
m.phone,
w.id,
w.title, 
w.description, 
w.status, 
w.datecreated, 
w.lastupdated, 
w.datecompleted
from workorders w
join managers m on m.id = w.managerid
where w.managerid = $1;