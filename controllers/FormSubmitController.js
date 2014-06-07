
FormSubmitter = function (app, mongoose, config, sendgrid) {

    var params = {
      to:       'btargac@gmail.com',
      toname:   'Burak Targaç',
      from:     'btargac@gmail.com',
      fromname: 'Burak Targaç.com web form',
      subject:  'Buraktargac.com Web Form Message'
    };

    app.post("/submitform", function(req, res, next) {
        
        var data = req.body;
        //validation must be improved
        if(data.name && data.email && data.message && data.captcha && (data.captcha == data.hiddencaptcha) ){
            
            //sendgrid integration
            params.text = data.name + '\n\n' + data.email + '\n\n' + data.company + '\n\n' + data.message;
            params.html = '<html><head><title></title></head><body>'+
            '<p><span style="font-family:verdana,geneva,sans-serif;">Hello <strong>Burak</strong>,</span></p>'+
            '<p><span style="font-family:verdana,geneva,sans-serif;">This message is sent to you from buraktargac.com, it seems that someone is interested in your contact form.</span></p>'+
            '<p><span style="font-family:verdana,geneva,sans-serif;">Here are the details of incoming message.</span></p>'+
            '<p><span style="font-family:verdana,geneva,sans-serif;"></span></p>'+
            '<p><span style="font-family:verdana,geneva,sans-serif;">Name: '+data.name+'</span></p>'+
            '<p><span style="font-family:verdana,geneva,sans-serif;">Email: '+data.email+'</span></p>'+
            '<p><span style="font-family:verdana,geneva,sans-serif;">Company: '+data.company+'</span></p>'+
            '<p><span style="font-family:verdana,geneva,sans-serif;">Message: '+data.message+'</span></p>'+
            '<p><em><span style="font-family:verdana,geneva,sans-serif;">Kindly Regards.</span></em></p>'+
            '<hr /><p><span style="font-family:verdana,geneva,sans-serif;">Burak Targaç</span></p>'+
            '<p><span style="font-family:verdana,geneva,sans-serif;"><a href="http://www.buraktargac.com" target="_blank" style="text-decoration:none;"><span style="color:#FF8C00;">www.buraktargac.com</span></a></span></p>'+
            '</body></html>';
            
            var email = new sendgrid.Email(params);

            sendgrid.send(email, function(err, json) {
              if (err) { return res.send({success: false, returndata: err, sendgridError: true}); }
              res.send({success: true, returndata: json, sendgridError: false});
            });
 
        }
        else{
            res.send({success: false, returndata: data});
        }
        

    });

}

module.exports = FormSubmitter;