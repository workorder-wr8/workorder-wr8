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
 },
  addCommentByTenant: (req, res) => {
      const db = req.app.get('db');
      const { tenantid } = req.session.user;
      const { workorderid, content } = req.body;
      db.comments.add_comment_tenant({ tenantid, workorderid, content, sender_id: tenantid })
          .then(() => res.sendStatus(201))
          .catch(err => {
              res.status(500).send(err);
              console.log(`Error: ${err.message}`)
          });
  },

  addCommentByStaff: (req, res) => {
    const db = req.app.get('db');
    const { staffid } = req.session.user;
    const { workorderid, content } = req.body;
    db.comments.add_comment_staff({ staffid, workorderid, content, sender_id: staffid })
        .then(() => res.sendStatus(201))
        .catch(err => {
            res.status(500).send(err);
            console.log(`Error: ${err.message}`)
        });
},

  getCommentsById: async (req, res) => {
      const { id } = req.body;
      const db = req.app.get('db');

      const comments = await db.comments.get_comments_by_id_tenant({ id });

      if (!comments[0]) {
          return res.status(404).send('No comments to display');
      }

      res.status(200).send(comments);

  }
}

