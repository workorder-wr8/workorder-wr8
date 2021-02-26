INSERT INTO messages
( managerid, tenantid, staffid, workorderid, content, timesent, sender_id)
VALUES(
    null,
    ${tenantid},
    null,
    ${workorderid},
    ${content},
    CURRENT_TIMESTAMP,
    ${sender_id}
);

update workorders set lastupdated=CURRENT_TIMESTAMP where id=${workorderid};