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
    req.session.user = {
      id: manager.id,
      landlordid: manager.landlordid,
      firstname: manager.firstname,
      lastname: manager.lastname,
      email: manager.email,
      phone: manager.phone
    }
    return res.send(req.session.user);
  },
  register: async (req, res) => {
    const { landlordid, propertyid, firstname, lastname, password, email, phone } = req.body;
    const db = req.app.get('db');
    const check = await db.manager.get_manager_by_email([email]);
    const manager = check[0];
    if (manager)
      return res.status(409).send('email taken')

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredManager = await db.manager.create_manager([landlordid, propertyid, firstname, lastname, hash, email, phone]);
    const newManager = registeredManager[0];
    console.log('AFTER registeredManager', registeredManager);
    req.session.user = {
      landlordid: newManager.landlordid,
      propertyid: newManager.propertyid,
      firstname: newManager.firstname,
      lastname: newManager.lastname,
      password: newManager.password,
      email: newManager.email,
      phone: newManager.phone
    }

    return res.status(200).send(req.session.user);
  },
  getManager: async (req, res) => {
    return res.status(200);
  }
}