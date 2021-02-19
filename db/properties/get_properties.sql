SELECT 
p.id,
p.name, 
p.address1,
p.city, 
p.state, 
p.zip, 
p.email, 
p.phone,
CONCAT( m.firstname, ' ',  m.lastname) AS manager, 
m.id AS manager_id,
CONCAT(l.firstname,' ', l.lastname) AS landlord,
l.id AS landlord_id
FROM properties p
JOIN managers m ON m.id = p.managerid
JOIN landlords l ON l.id = p.landlordid;