select 
me.message_id,
me.managerid, 
me.sender_id,
CONCAT(ma.firstname, ' ', ma.lastname) as manager,
me.tenantid,
CONCAT(t.firstname, ' ', t.lastname) as tenant,
me.staffid,
CONCAT(s.firstname, ' ', s.lastname) as staff,
 me.workorderid, me.content, me.timesent from
messages me
left join managers ma on me.managerid = ma.id
left join tenants t on me.tenantid = t.id
left join staff s on me.staffid = s.id
where workorderid= ${id}
order by timesent asc