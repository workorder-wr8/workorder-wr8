SELECT 
w.id,
w.description,
w.status,
w.title,
w.datecreated,
w.lastupdated,
w.datecompleted
FROM workorders w
WHERE w.id = ${id};