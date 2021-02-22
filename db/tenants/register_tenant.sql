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

select t.id as tenantid, t.firstname, t.lastname, t.email, t.unitnumber, p.name
from tenants t
join properties p on p.id = t.propertyid
where t.email = ${email};