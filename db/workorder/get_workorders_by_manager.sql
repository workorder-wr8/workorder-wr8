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
w.datecompleted,
w.staffid,
s.id as staffid,
s.firstname as stafffirst,
s.lastname as stafflast
from workorders w
join managers m on m.id = w.managerid
left join staff s on w.staffid = s.id
where w.managerid = $1
order by datecreated asc;