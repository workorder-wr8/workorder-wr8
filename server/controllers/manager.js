const bcrypt = require('bcryptjs');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const db = req.app.get('db');
    const check = await db.manager.get_manager_by_email([email]);
    const manager = check[0];
    if (!manager) {
      return res.status(401).send('this email is not with an account. please register before logging in');
    }
    const isAuthenticated = bcrypt.compareSync(password, manager.password);
    if (!isAuthenticated) {
      return res.status(409).send('Incorrect password');
    }

    delete manager.password;

    req.session.user = manager;

    return res.send(req.session.user);
  },

  register: async (req, res) => {
    const { landlordid, propertyid, firstname, lastname, password, email, phone, passcode } = req.body;
    const db = req.app.get('db');
    const check = await db.manager.get_manager_by_email([email]);
    const manager = check[0];
    if (manager)
      return res.status(409).send('email taken')

    const [property] = await db.properties.get_property_for_passcode(propertyid)  
    const isAuthenticated = bcrypt.compareSync(passcode, property.passcode);
    if(!isAuthenticated)
      return res.status(401).send('Invalid Property Passcode'); 

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredManager = await db.manager.create_manager([landlordid, propertyid, firstname, lastname, hash, email, phone]);
    const newManager = registeredManager[0];
    req.session.user = {
      landlordid: newManager.landlordid,
      managerid: newManager.managerid,
      propertyid: newManager.propertyid,
      name: newManager.name,
      firstname: newManager.firstname,
      lastname: newManager.lastname,
      email: newManager.email,
      phone: newManager.phone
    }

    return res.status(200).send(req.session.user);
  },
  getManager: async (req, res) => {
    return res.status(200);
  },
  getStaffMembers: async (req, res) => {
    if (req.session.user) {
      const { propertyid } = req.session.user;
      const db = req.app.get('db');
      const staff = await db.manager.get_staff_by_property(propertyid)
      if (!staff[0]) {
        return res.status(404).send('No Staff Found')
      }
      return res.status(200).send(staff);
    }
  },
  assignWorkOrder: async (req, res) => {
    const { id, staffid } = req.body;
    const db = req.app.get('db');
    const member = await db.manager.update_staff_id(id, staffid)
    return res.status(200).send(member);
  }
}