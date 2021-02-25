-- avg time to completion 
select avg(datecompleted-datecreated) as avgtimetocompletion from workorders w
join properties p on p.id = w.propertyid
where p.id = $1 AND datecompleted IS NOT NULL;