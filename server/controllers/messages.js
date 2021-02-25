module.exports = {
    addCommentByTenant: (req, res) => {

        const { } = req.body;
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

