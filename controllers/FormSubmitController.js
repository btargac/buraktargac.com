const formidable = require('formidable');
const helper = require('sendgrid').mail;

const FormSubmitter = function (app, mongoose, config, sendgrid, recaptcha) {

    app.post("/submitform", function(req, res, next) {

        const form = new formidable.IncomingForm();

        form.parse(req, function(err, fields) {
            let data = fields;

            // req.body is an empty object because of the formidable module so we need to set body's recaptcha response
            // manually before validating it with the express-recaptcha module
            req.body['g-recaptcha-response'] = data['g-recaptcha-response'];

            recaptcha.verify(req, function(error){

                if(!error) {

                    //validation must be improved
                    if(data.name && data.email && data.message){

                        //sendgrid integration

                        const fromEmail = new helper.Email('hello@buraktargac.com');
                        const toEmail = new helper.Email('btargac@gmail.com');
                        const subject = 'Buraktargac.com Web Form Message';
                        const textStyle = 'font-family:verdana,geneva,sans-serif;';
                        const content = new helper.Content('text/html', `<html><head><title></title></head><body>
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
                            <p><span style="${textStyle}"><a href="https://www.buraktargac.com" target="_blank" style="text-decoration:none;"><span style="color:#FF8C00;">www.buraktargac.com</span></a></span></p>
                            </body></html>`);
                        const mail = new helper.Mail(fromEmail, subject, toEmail, content);

                        const request = sendgrid.emptyRequest({
                            method: 'POST',
                            path: '/v3/mail/send',
                            body: mail.toJSON()
                        });

                        sendgrid.API(request, function (error, response) {
                            if (error) {
                                console.log('Error response received', error);
                                return res.json({
                                    success: false,
                                    data: error,
                                    sendgridError: true
                                });
                            }

                            res.json({
                                success: true,
                                data: response,
                                sendgridError: false
                            });
                        });

                    }

                    else{
                        res.json({success: false, data: data});
                    }
                }

                else {

                    // reCaptcha error
                    res.json({
                        success: false,
                        data: {
                            reCaptcha: 'error',
                            err: error
                        }
                    });

                }

            });

        });

    });

};

module.exports = FormSubmitter;
