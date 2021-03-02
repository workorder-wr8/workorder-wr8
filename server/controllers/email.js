const nodemailer = require('nodemailer'),
    { EMAIL, PASSWORD } = process.env;

module.exports = {
    inviteManager: async (req, res) => {
        const { managerEmail, landlordfirst } = req.body;

        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: EMAIL,
                    pass: PASSWORD
                }
            });
            let info = await transporter.sendMail({
                from: `Jacob Orbach <${EMAIL}>`,
                to: managerEmail,
                subject: `${landlordfirst} made a property and invited you to manage it`,
                //text is for plain text support if the html cannot load
                text: 'Please continue to registration and finish signing up',
                //Body of Email
                html: `<h3>Welcome Manager!</h3> <p>${landlordfirst} invited you to manage his property. Please click on the link to continue to the registration page <a href="http://localhost:3000/#/admin/register/${managerEmail}">Link</a></p>`
            }, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    res.status(200).send(info)
                }
            })
        } catch (err) {
            res.status(500).send(err);
        }
    }
}