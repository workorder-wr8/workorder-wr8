
module.exports = {
  create: async (req, res) => {
    if (req.session.user) {
      const landlordid = req.session.user.landlordid
      const managerid = req.session.user.managerid
      const propertyid = req.session.user.propertyid
      const tenantid = req.session.user.tenantid
      const staffid = null
      const title = req.body.title
      const description = req.body.description
      await req.app.get('db').workorder.create_workorder(landlordid, managerid, propertyid, tenantid, staffid, title, description)
      return res.sendStatus(200);
    }
  },
  getManager: async (req, res) => {
    if (req.session.user) {
      const { propertyid } = req.session.user;
      const workorders = await req.app.get('db').workorder.get_workorders_by_manager(propertyid);

      if (!workorders[0]) {
        return res.status(404).send(`No workorders to display`);
      }

      return res.status(200).send(workorders);
    }
  },

  getWorkOrderByTenant: async (req, res) => {
    const { tenantid } = req.session.user;
    const db = req.app.get('db');

    const workOrders = await db.workorder.get_workorders_by_tenant(tenantid);

    if (!workOrders[0]) {
      return res.status(404).send(`No workorders to display`);
    }

    res.status(200).send(workOrders);
  },

  getWorkOrderById: (req, res) => {
    const { id } = req.params;
    const db = req.app.get('db');

    db.workorder.get_workorder_by_id({ id })
      .then(wo => res.status(200).send(wo))
      .catch(err => console.log(`Error: ${err.message}`))
  }
}