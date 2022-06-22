const formidable = require('formidable');

const FormSubmitter = function (app, mongoose, sendgrid) {

    app.post("/submitform", (req, res) => {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, data) => {
            //validation must be improved
            if(data.name && data.email && data.message && data.company !== 'google') {

                //sendgrid integration

                const from = 'hello@buraktargac.com';
                const to = 'btargac@gmail.com';
                const subject = 'BurakTargac Web Form Message';
                const textStyle = 'font-family:verdana,geneva,sans-serif;';
                const html = `
                    <html>
                        <head>
                            <title></title>
                        </head>
                        <body>
                            <p><span style="${textStyle}">Hello <strong>Burak</strong>,</span></p>
                            <p><span style="${textStyle}">This message is sent to you from buraktargac.com, it seems that someone is interested in your contact form.</span></p>
                            <p><span style="${textStyle}">Here are the details of incoming message.</span></p>
                            <p><span style="${textStyle}"></span></p>
                            <p><span style="${textStyle}">Name: ${data.name}</span></p>
                            <p><span style="${textStyle}">Email: ${data.email}</span></p>
                            <p><span style="${textStyle}">Company: ${data.company}</span></p>
                            <p><span style="${textStyle}">Message: ${data.message}</span></p>
                            <p><em><span style="${textStyle}">Kindly Regards.</span></em></p>
                            <hr /><p><span style="${textStyle}">Burak Targaç</span></p>
                            <p>
                                <span style="${textStyle}">
                                    <a href="https://www.buraktargac.com" target="_blank" style="text-decoration:none;">
                                    <span style="color:#FF8C00;">www.buraktargac.com</span>
                                    </a>
                                </span>
                            </p>
                        </body>
                    </html>`;
                const mail = {
                    from,
                    to,
                    subject,
                    text: data.message,
                    html
                };

                try {
                    await sendgrid.send(mail);

                    res.json({
                        success: true,
                        sendgridError: false
                    });
                } catch (error) {
                    console.error(error);

                    if (error.response) {
                        console.error(error.response.body);

                        res.json({
                            success: false,
                            data: error.response.body,
                            sendgridError: true
                        });
                    }
                }

            }

            else {
                res.json({success: false, data: data});
            }

        });

    });

};

module.exports = FormSubmitter;
