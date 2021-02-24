select * from workorders
where propertyid = $1
order by datecreated asc;