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
      //NEEDS TO BE DONE
    }

    return res.status(200);
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