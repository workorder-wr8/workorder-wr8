const { default: userEvent } = require("@testing-library/user-event");

module.exports = {
  login: async (req,res) => {
    const {email, password} = req.body;
    const db = req.app.get('db');
    const check = await db.tenant.get_tenant_by_email([email]);
    const tenant = check[0];
    if(!tenant) {
      return res.status(401).send('this email is not with an account. please register before logging in');
    }
    const isAuthenticated = bcrypt.compareSync(password, tenant.password);
    if(!isAuthenticated) {
      return res.status(409).send('Incorrect password');
    }
    req.session.tenant = {
      landlordid: tenant.landlordid,
      managerid: tenant.managerid,
      propertyid: tenant.propertyid,
      firstname: tenant.firstname,
      lastname: tenant.lastname,
      password: tenant.password,
      email: tenant.email,
      phone: tenant.phone,
      address1: tenant.address1,
      unitnumber: tenant.unitnumber,
      city: tenant.city,
      state: tenant.state,
      zip: tenant.zip
    }
    return res.send(req.session.tenant);
  },
  register: async (req,res) => {
    return res.status(200);
  },
  getTenant: async(req,res) => {
    return res.status(200);
  },
  logout: async (req,res) => {
    return res.status(200);
  } 
}