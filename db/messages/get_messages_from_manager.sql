select me.managerid, ma.firstname as managerfirstname, ma.lastname as managerlastname, 
me.tenantid, t.firstname as tenantfirstname, t.lastname as tenantlastname, 
me.staffid, s.firstname as stafffirstname, s.lastname as stafflastname, me.workorderid, me.content, me.timesent from
messages me
left join managers ma on me.managerid = ma.id
left join tenants t on me.tenantid = t.id
left join staff s on me.staffid = s.id
where workorderid=$1
order by timesent asc