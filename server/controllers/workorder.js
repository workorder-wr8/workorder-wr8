module.exports = {
  create: async (req,res)=> {
    const landlordid = req.session.user.landlordid 	
    const managerid	=req.session.user.managerid
    const propertyid	=req.session.user.propertyid
    const tenantid	=req.session.user.id
    const staffid	 =null
    const title	=req.body.title
    const description	=req.body.description
    const status	= 'open'
    await req.app.get('db').workorder.create_workorder(landlordid, managerid, propertyid, tenantid, staffid, title, description, status)
    return res.sendStatus(200);
  },
  getManager: async (req,res) => {
    const {id} = req.session.user;
    await req.app.get('db').workorder.get_workorder_by_manager(id);
    return res.sendStatus(200);
  }
}