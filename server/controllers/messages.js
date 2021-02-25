module.exports = {
  getMessagesFromManager: async(req,res)=>{
    const db = req.app.get('db');
    const {id} = req.params;
    const managermessages = await db.messages.get_messages_from_manager(id)
    return res.status(200).send(managermessages);
  },
  addMessageFromManager: async (req,res)=>{
    const db = req.app.get('db');
    const {id, content} = req.body
    const managerid = +req.session.user.managerid;
    const messageAdded = await db.messages.add_message_from_manager( +managerid, +id, content)
    res.sendStatus(200);
 }
}