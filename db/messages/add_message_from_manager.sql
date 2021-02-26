insert into messages (managerid, workorderid, content, timesent, sender_id)
values
($1, $2, $3, CURRENT_TIMESTAMP, $1);

update workorders set lastupdated=CURRENT_TIMESTAMP where id=$2;
