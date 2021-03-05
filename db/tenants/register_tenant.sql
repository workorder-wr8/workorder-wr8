INSERT INTO tenants 
(
    landlordid,
    managerid,
    propertyid,
    firstname,
    lastname,
    password,
    email,
    phone,
    address1,
    unitnumber,
    city,
    state,
    zip
) VALUES (
    ${landlord},
    ${manager},
    ${property},
    ${firstName},
    ${lastName},
    ${password},
    ${email},
    ${phone},
    ${address1},
    ${unitNumber},
    ${city},
    ${state},
    ${zip}
);

select t.id as tenantid, t.propertyid, t.firstname, t.lastname, t.password, t.email, t.phone, t.address1, t.unitNumber, t.city, t.state, t.zip, p.name, p.id as propertyid, p.address1 as propaddress, p.city as propcity, p.state as propstate, p.zip as propzip, p.email as propemail, p.phone as propphone
from tenants t
join properties p on p.id = t.propertyid
where t.email = ${email};