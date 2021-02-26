insert into workorders
(landlordid,	managerid,	propertyid,	tenantid,	staffid,	title,	description,	status,	datecreated, lastupdated)
values
($1, $2, $3, $4, $5, $6, $7, 'Open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

select * from workorders where tenantid = $4 and title =$6 and description = $7;