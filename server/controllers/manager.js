const bcrypt = require('bcryptjs');

module.exports = {
  login: async (req,res) => {
    const {email, password} = req.body;
    const db = req.app.get('db');
    const check = await db.manager.get_manager_by_email([email]);
    const manager = check[0];
    if(!manager) {
      return res.status(401).send('this email is not with an account. please register before logging in');
    }
    const isAuthenticated = bcrypt.compareSync(password, manager.password);
    if(!isAuthenticated) {
      return res.status(409).send('Incorrect password');
    }
    req.session.manager = {
      landlordid: manager.landlordid,
      firstname: manager.firstname,
      lastname: manager.lastname,
      password: manager.password,
      email: manager.email,
      phone: manager.phone
    }
    return res.send(req.session.manager);
  },
  register: async (req,res) => {
    const {landlordid, firstname, lastname, password, email, phone} = req.body;
    const db = req.app.get('db');
    const check = await db.manager.find_manager_by_email([email]);
    const llcheck = await db.landlord.find_landlord_by_id([landlordid])
    const manager = check[0];
    if(manager)
      return res.status(409).send('email taken')
    if(!llcheck[0])
      return res.status(408).send('landlord doesn\'t exist');
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredManager = await db.manager.create_manager([landlordid, firstname, lastname, hash, email, phone]);
    const newManager = registeredManager[0];
    req.session.manager = {
      landlordid: newManager.landlordid,
      firstname: newManager.firstname,
      lastname: newManager.lastname,
      password: newManager.password,
      email: newManager.email,
      phone: newManager.phone
    }

    return res.status(200).send(req.session.newManager);
  },
  getManager: async(req,res) => {
    return res.status(200);
  },
  logout: async (req,res) => {
    return res.status(200);
  } 
}