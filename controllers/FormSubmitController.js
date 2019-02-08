var formidable = require('formidable');
var helper = require('sendgrid').mail;

FormSubmitter = function (app, mongoose, config, sendgrid, recaptcha, mc) {

    app.post("/submitform", function(req, res, next) {

        var form = new formidable.IncomingForm(),
            data;

        form.parse(req, function(err, fields, files) {
            data = fields;
            // req.body is an empty object because of the formidable module so we need to set body's recaptcha response manually before
            // validating it with the express-recaptcha module
            req.body['g-recaptcha-response'] = data['g-recaptcha-response'];

            recaptcha.verify(req, function(error){

                if(!error) {

                    //validation must be improved
                    if(data.name && data.email && data.message){

                        //sendgrid integration

                        const fromEmail = new helper.Email('btargac@gmail.com');
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
                            <p><span style="${textStyle}"><a href="http://www.buraktargac.com" target="_blank" style="text-decoration:none;"><span style="color:#FF8C00;">www.buraktargac.com</span></a></span></p>
                            </body></html>`);
                        const mail = new helper.Mail(fromEmail, subject, toEmail, content);

                        const request = sendgrid.emptyRequest({
                            method: 'POST',
                            path: '/v3/mail/send',
                            body: mail.toJSON()
                        });

                        sendgrid.API(request, function (error, response) {
                            if (error) {
                                console.log('Error response received');
                                return res.send({
                                    success: false,
                                    returndata: error,
                                    sendgridError: true
                                });
                            }

                            console.log(response.statusCode);
                            console.log(response.body);
                            console.log(response.headers);
                            res.send({
                                success: true,
                                returndata: response,
                                sendgridError: false
                            });
                        });

                    }

                    else{
                        res.send({success: false, returndata: data});
                    }
                }

                else {

                    // reCaptcha error
                    res.send({
                        success: false,
                        returndata: {
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
