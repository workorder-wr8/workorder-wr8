SELECT 
p.id,
p.name, 
p.address1,
p.city, 
p.state, 
p.zip, 
p.email, 
p.phone,
CONCAT(l.firstname,' ', l.lastname) AS landlord,
l.id AS landlord_id
FROM properties p
JOIN landlords l ON l.id = p.landlordid
WHERE p.id= ${id};