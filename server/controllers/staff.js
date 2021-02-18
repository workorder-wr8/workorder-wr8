const bcrypt = require('bcryptjs')

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const db = req.app.get('db')

    const userExists = await db.staff.get_staff(email)
    const staff = userExists[0]
    if (!staff) {
      return res.status(401).send('this email is not with an account. please register before logging in');
    }

    const isAuthenticated = bcrypt.compareSync(password, staff.password)
    if (!isAuthenticated) {
      return res.status(409).send('Incorrect password');
    }

    delete staff.password
    req.session.user = staff

    return res.status(202).send(req.session.user)
  },
  register: async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    const db = req.app.get('db')

    const [userExists] = await db.staff.get_staff(email)
    if (userExists) {
      return res.status(400).send('User already exists. Please log in')
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const createdStaff = await db.staff.create_staff(firstName, lastName, hash, email, phone)
    const staffSesh = createdStaff[0]

    req.session.user = staffSesh
    return res.status(201).send(req.session.user)
  },
  getStaff: async (req, res) => {
    if (req.session.user) {
      return res.send(req.session.user)
    }
    return res.status(404).send('No user found');
  },
  logout: async (req, res) => {
    req.session.destroy()
    return res.sendStatus(200);
  }
}