select DDC, DC, C, PN, WS, ATTC
from (select to_char(w.datecreated,'Day') as DDC, count(w.datecreated) as DC  from workorders w join properties p on p.id = w.propertyid where p.id = $1 group by DDC order by DDC asc limit 7) a
cross join (select count(*) as C, p.name as PN, w.status as WS from workorders w join properties p on p.id = w.propertyid where p.id = $1 group by w.status, p.name) b
cross join (select avg(w.datecompleted-w.datecreated) as ATTC from workorders w join properties p on p.id = w.propertyid where p.id = $1 AND datecompleted IS NOT NULL) c