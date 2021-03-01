select "day", "workorders", "status", "count", "attc"
from (select to_char(w.datecreated,'DD Day') as "day", count(w.datecreated) as "workorders"  from workorders w join properties p on p.id = w.propertyid where p.id = $1 group by "day" order by "day" asc) a
cross join (select count(*) as "count", w.status as "status" from workorders w join properties p on p.id = w.propertyid where p.id = $1 group by w.status, p.name) b
cross join (select avg(w.datecompleted-w.datecreated) as "attc" from workorders w join properties p on p.id = w.propertyid where p.id = $1 AND datecompleted IS NOT NULL) c