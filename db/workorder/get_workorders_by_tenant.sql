SELECT 
w.id,
w.description,
w.status,
w.title,
w.datecreated
-- CONCAT(m.firstname, ' ', m.lastname) AS manager,
-- CONCAT(t.firstname, ' ', t.lastname) AS tenant
FROM workorders w
-- JOIN managers m ON m.id = w.managerid
-- JOIN tenants t ON t.id = w.tenantid
WHERE tenantid = $1;