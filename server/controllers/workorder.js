
module.exports = {
  create: async (req, res) => {
    const landlordid = req.session.user.landlordid
    const managerid = req.session.user.managerid
    const propertyid = req.session.user.propertyid
    const tenantid = req.session.user.id
    const staffid = null
    const title = req.body.title
    const description = req.body.description
    const status = 'open'
    console.log(landlordid, managerid, propertyid, tenantid, staffid, title, description, status);
    await req.app.get('db').workorder.create_workorder(landlordid, managerid, propertyid, tenantid, staffid, title, description, status)
    return res.sendStatus(200);
  },
  getManager: async (req,res) => {
    if(req.session.user) {
      const {managerid} = req.session.user;
      console.log('MANAGERID: ', managerid);
      const workorders = await req.app.get('db').workorder.get_workorders_by_manager(managerid);

      if (!workorders[0]) {
        return res.status(404).send(`No workorders to display`);
      }

      return res.status(200).send(workorders);
    }
  },

  getWorkOrderByTenant: async (req, res) => {
    if(req.session.user) {
      const { id } = req.session.user;
      const db = req.app.get('db');

      const workOrders = await db.workorder.get_workorders_by_tenant({ id });

      if (!workOrders[0]) {
        return res.status(404).send(`No workorders to display`);
      }

      res.status(200).send(workOrders);
    }
  }
}