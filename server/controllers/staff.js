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
    const { firstname, lastname, email, password, phone, propertyid } = req.body;
    const db = req.app.get('db')

    const [userExists] = await db.staff.get_staff(email)
    if (userExists) {
      return res.status(400).send('User already exists. Please log in')
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const createdStaff = await db.staff.create_staff(propertyid, firstname, lastname, hash, email, phone)
    // console.log(userExists)
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
  getworkorders: async (req, res) => {
    const { id } = req.params
    // console.log('id:', id)
    const db = req.app.get('db')

    const workorders = await db.staff.get_workorders(id)

    res.status(200).send(workorders)
  },
  updateworkorders: async (req, res) => {
    const { id, status, staffid } = req.body
    console.log('staffid:', staffid)
    const db = req.app.get('db')

    const updatedStatus = await db.staff.schedule_workorder(id, status, staffid)
    console.log(updatedStatus)

    return res.status(200).send(updatedStatus);
  }
}