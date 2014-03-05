
FormSubmitter = function (app) {


    app.post("/submitform", function(req, res, next) {
        
        var data = req.body;
        //validation must be improved
        if(data.name && data.email && data.message && data.captcha && (data.captcha == data.hiddencaptcha) ){
            res.send({success: true, returndata: data});    
        }
        else{
            res.send({success: false, returndata: data});
        }
        

    });

}

module.exports = FormSubmitter;