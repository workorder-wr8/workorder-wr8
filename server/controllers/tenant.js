const bcrypt = require('bcryptjs');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const db = req.app.get('db');

    const findTenant = await db.tenants.check_tenant({ email });
    const result = findTenant[0];

    if (!result) {
      return res.status(404).sned(`Tenant not found!`);
    }

    const authenticated = bcrypt.compareSync(password, result.password);
    if (!authenticated) {
      return res.status(401).send(`Incorrect password for ${result.email}`);
    }

    delete result.password;

    req.session.tenant = result;

    res.status(200).send(req.session.tenant);
  },

  register: async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      property,
      address1,
      city,
      state,
      zip,
      unitNumber,
      landlord,
      manager
    } = req.body;

    const db = req.app.get('db');

    const findTenant = await db.tenants.check_tenant({ email });
    const result = findTenant[0];

    if (result) {
      return res.status(400).send(`Email already in use`);
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newTenant = await db.tenants.register_tenant(
      {
        landlord,
        manager,
        property,
        firstName,
        lastName,
        password: hash,
        email,
        phone,
        address1,
        unitNumber,
        city,
        state,
        zip
      });

    req.session.tenant = newTenant[0];
    res.status(201).send(req.session.tenant);
  },

  getTenant: async (req, res) => {
    if (req.session.tenant) {
      return res.send(req.session.tenant);
    }

    res.status(404).send(`No user found`);
  }
}