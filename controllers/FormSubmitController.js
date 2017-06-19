var formidable = require('formidable');
var helper = require('sendgrid').mail;

FormSubmitter = function (app, mongoose, config, sendgrid, recaptcha) {

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

                        var fromEmail = new helper.Email('btargac@gmail.com');
                        var toEmail = new helper.Email('btargac@gmail.com');
                        var subject = 'Buraktargac.com Web Form Message';
                        var content = new helper.Content('text/html', `<html><head><title></title></head><body>
                            <p><span style="font-family:verdana,geneva,sans-serif;">Hello <strong>Burak</strong>,</span></p>
                            <p><span style="font-family:verdana,geneva,sans-serif;">This message is sent to you from buraktargac.com, it seems that someone is interested in your contact form.</span></p>
                            <p><span style="font-family:verdana,geneva,sans-serif;">Here are the details of incoming message.</span></p>
                            <p><span style="font-family:verdana,geneva,sans-serif;"></span></p>
                            <p><span style="font-family:verdana,geneva,sans-serif;">Name: ${data.name}</span></p>
                            <p><span style="font-family:verdana,geneva,sans-serif;">Email: ${data.email}</span></p>
                            <p><span style="font-family:verdana,geneva,sans-serif;">Company: ${data.company}</span></p>
                            <p><span style="font-family:verdana,geneva,sans-serif;">Message: ${data.message}</span></p>
                            <p><em><span style="font-family:verdana,geneva,sans-serif;">Kindly Regards.</span></em></p>
                            <hr /><p><span style="font-family:verdana,geneva,sans-serif;">Burak Targaç</span></p>
                            <p><span style="font-family:verdana,geneva,sans-serif;"><a href="http://www.buraktargac.com" target="_blank" style="text-decoration:none;"><span style="color:#FF8C00;">www.buraktargac.com</span></a></span></p>
                            </body></html>`);
                        var mail = new helper.Mail(fromEmail, subject, toEmail, content);

                        var request = sendgrid.emptyRequest({
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