-- shows tickets submitted over last 7 days
select DATE(datecreated), count(datecreated)  from workorders w
join properties p on p.id = w.propertyid
where p.id = $1
group by date(datecreated)
order by date desc
limit 7;