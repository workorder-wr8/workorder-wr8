require('dotenv').config();
const massive = require('massive');
const express = require('express');
const session = require('express-session');
const landlordCtrl = require('./controllers/landlord');
const managerCtrl = require('./controllers/manager');
const staffCtrl = require('./controllers/staff');
const tenantCtrl = require('./controllers/tenant');
const workorderCtrl = require('./controllers/workorder');
const propertyCtrl = require('./controllers/properties');
const { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env;
const app = express();

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

//tenant endpoints
app.post('/api/tenant/login', tenantCtrl.login);
app.post('/api/tenant/register', tenantCtrl.register);
app.get('/api/tenant/me', tenantCtrl.getTenant);

//staff endpoints
app.post('/api/staff/login', staffCtrl.login);
app.post('/api/staff/register', staffCtrl.register);
app.get('/api/staff/me', staffCtrl.getStaff);

//manager endpoints
app.post('/api/manager/login', managerCtrl.login);
app.post('/api/manager/register', managerCtrl.register);
app.get('/api/manager/me', managerCtrl.getManager);

//landlord endpoints
app.post('/api/landlord/login', landlordCtrl.login);
app.post('/api/landlord/register', landlordCtrl.register);
app.get('/api/landlord/me', landlordCtrl.getLandlord);

//property endpoints
app.get('/api/properties', propertyCtrl.getProperties);
app.get('/api/properties/:id', propertyCtrl.getProperty);
//workorder endpoints
app.post('/api/workorder/create', workorderCtrl.create)


//logout
app.get('/api/logout', (req, res) => {
    req.session.destroy()
    return res.sendStatus(200);
})




app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))

