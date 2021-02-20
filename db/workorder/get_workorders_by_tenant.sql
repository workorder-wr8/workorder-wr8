SELECT 
w.id,
w.description,
w.status,
w.title,
w.datecreated,
CONCAT(m.firstname, ' ', m.lastname) AS manager,
CONCAT(s.firstname, ' ', s.lastname) AS staffmember
FROM workorders w
JOIN managers m ON m.id = w.managerid
JOIN staff s ON s.id = w.staffid
WHERE tenantid = ${id};