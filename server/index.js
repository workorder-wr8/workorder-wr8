require('dotenv').config()
const massive = require('massive')
const express = require('express')
const session = require('express-session')
const { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env
const app = express()

app.use(express.json())

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 }
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
}).then(db => {
    app.set('db', db)
    console.log('db connected')
})



app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))

