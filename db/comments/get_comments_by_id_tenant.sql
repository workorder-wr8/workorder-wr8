SELECT 
m.message_id,
m.workorderid,
m.managerid,
m.staffid,
m.content,
m.timesent,
m.sender_id
FROM messages m
WHERE m.workorderid = ${id};