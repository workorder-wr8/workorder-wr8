module.exports = {
    getProperties: async (req, res) => {
        const db = req.app.get('db');
            const properties = await db.properties.get_properties();

            if (!properties[0]) {
                return res.status(404).send(`No properties found`);
            }

            res.status(200).send(properties);
    },

    getProperty: async (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');

        const property = await db.properties.get_property({ id });

        res.status(200).send(property);
    }
}