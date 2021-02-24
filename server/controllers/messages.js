module.exports = {
    addMessage: (req, res) => {
        // const { tenantid: sender_id } = req.session.user;
        // const { id: work_order_id } = req.params;
        const { sender_name, message, id: work_order_id} = req.body;
        const db = req.app.get('db');
        console.log(`sender_id: ${sender_id} sender: ${sender_name} work id: ${work_order_id}`)
        db.messages.add_message({ work_order_id, sender_id, sender_name, message })
            .then(() => res.sendStatus(201))
            .catch(err => {
                res.status(500).send(err);
                console.log(`Error: ${err.message}`)
            });
    },

    getMessagesById: (req, res) => {

    }
}

