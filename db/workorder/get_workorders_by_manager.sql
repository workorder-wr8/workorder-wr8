select 
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
join properties p on p.id = w.propertyid
left join staff s on w.staffid = s.id
where w.propertyid = $1
order by datecreated asc;
