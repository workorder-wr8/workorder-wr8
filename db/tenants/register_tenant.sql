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
)

RETURNING id, firstname, lastname, email, unitnumber;