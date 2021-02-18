insert into staff (firstname, lastname, password, email, phone)
values($1,$2,$3,$4,$5)

returning *;