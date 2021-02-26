update workorders set staffid=$2, status='Unread' where id=$1;

update workorders set lastupdated=CURRENT_TIMESTAMP where id=$1;