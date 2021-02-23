const bcrypt = require('bcryptjs')

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const db = req.app.get('db')

    const userExists = await db.landlord.get_landlord(email)
    const landlord = userExists[0]
    if (!landlord) {
      return res.status(401).send('this email is not with an account. please register before logging in');
    }

    const isAuthenticated = bcrypt.compareSync(password, landlord.password)
    if (!isAuthenticated) {
      return res.status(409).send('Incorrect password');
    }

    delete landlord.password
    req.session.user = landlord

    return res.status(202).send(req.session.user)
  },
  register: async (req, res) => {
    const { firstname, lastname, email, password, phone } = req.body;
    const db = req.app.get('db')

    const [userExists] = await db.landlord.get_landlord(email)
    if (userExists) {
      return res.status(400).send('User already exists. Please log in')
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const [createdLandlord] = await db.landlord.create_landlord(hash, firstname, lastname, email, phone)

    const landlordSesh = createdLandlord;

    req.session.user = landlordSesh
    return res.status(201).send(req.session.user)
  },
  getLandlord: async (req, res) => {
    if (req.session.user) {
      return res.send(req.ression.user)
    }

    return res.status(404).send('No user found');
  },
  getProperties: async (req, res) => {
    const { id } = req.params
    const db = req.app.get('db')
    const properties = await db.landlord.get_properties(id)
    return res.status(200).send(properties)
  },
  addProperty: async (req, res) => {
    const db = req.app.get('db')
    const { landlordid, name, address1, address2, city, state, zip, email, phone, passcode } = req.body;

    const newProperty = await db.landlord.add_property(landlordid, name, address1, address2, city, state, zip, email, phone, passcode)

    return res.status(201).send(newProperty)
  }
}