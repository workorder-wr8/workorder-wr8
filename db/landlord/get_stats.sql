select count(*), p.name, w.status from workorders w
join properties p on p.id = w.propertyid
where p.id = $1
group by w.status, p.name;