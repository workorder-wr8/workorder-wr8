create table landlords
(id serial primary key,
password varchar not null,
firstname varchar(20),
lastname varchar(20),
email varchar(50),
phone varchar(12));


create table managers (
id serial primary key,
landlordid int,
foreign key (landlordid) references landlords(id),
firstname varchar(20),
lastname varchar(20),
password varchar not null,
email varchar(50),
phone varchar(12)
);

create table properties (
id serial primary key,
landlordid int,
foreign key (landlordid) references landlords(id),
managerid int,
foreign key (managerid) references managers(id),
name varchar(50),
address1 varchar(50),
address2 varchar(50),
city varchar(30),
state varchar(30),
zip varchar(10),
email varchar(50),
phone varchar(12),
passcode varchar(30)
);


create table staff (
id serial primary key,
landlordid int,
foreign key (landlordid) references landlords(id),
managerid int,
foreign key (managerid) references managers(id),
propertyid int,
foreign key (propertyid) references properties(id), 
firstname varchar(30),
lastname varchar(30),
password varchar not null,
email varchar(30),
phone varchar(12)
);


create table tenants (
id serial primary key,
landlordid int,
foreign key (landlordid) references landlords(id),
managerid int,
foreign key (managerid) references managers(id),
propertyid int,
foreign key (propertyid) references properties(id), 
firstname varchar(30),
lastname varchar(30),
password varchar not null,
email varchar(30),
phone varchar(12),
address1 varchar(50),
unitNumber varchar(30),
city varchar(30),
state varchar(30),
zip varchar(10)
);


create table workorders (
id serial primary key,
landlordid int,
foreign key (landlordid) references landlords(id),
managerid int,
foreign key (managerid) references managers(id),
propertyid int,
foreign key (propertyid) references properties(id),
tenantid int,
foreign key (tenantid) references tenants(id),
staffid int,
foreign key (staffid) references staff(id),
title varchar(50),
description varchar,
status varchar(20),
datecreated timestamp,
lastupdated timestamp,
datecompleted timestamp
);

create table messages (
message_id SERIAL PRIMARY KEY,
managerid int,
foreign key (managerid) references managers(id),
tenantid int,
foreign key (tenantid) references tenants(id),
staffid int,
foreign key (staffid) references staff(id),
workorderid int,
foreign key (workorderid) references workorders(id),
content varchar,
timesent timestamp,
sender_id INT
)
