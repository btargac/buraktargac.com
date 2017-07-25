var path = require('path'),
    fs = require('fs'),
    formidable = require('formidable');

AdminLoggedInController = function (app, mongoose, config, sendgrid, recaptcha) {

    var SiteConfiguration = mongoose.model('SiteConfiguration'),
        User = mongoose.model('User'),
        base64data = [];

    app.get("/adminloggedin", function(req, res, next) {
        if(req.session.user){
            SiteConfiguration.findOne({}, function(err, data) {
                res.render("adminloggedin", {
                    //these parameters can vary according to your sites needs
                    data:data
                });
            });
        }
        else {
            res.redirect('/admin');
        }
    });

    app.post("/siteconf/create", function(req, res, next) {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

            var siteConfiguration = new SiteConfiguration(fields);

            siteConfiguration.save(function(err) {
                if (err) {
                    res.json({error:true, result: false, message: "Error occured: " + err});
                } else {
                    res.json({error:false, result: true, message: "Successfully created!"});
                }
            });

        });

    });

    app.post("/siteconf/addTestimonial", function(req, res, next) {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

            SiteConfiguration.findOne({_id: fields._id}, function(err, data) {

                if (err) {
                    res.json({error:true, result: false, message: "Error occured: " + err});
                } else {

                    data.testimonials.push({
                        author: fields.author,
                        text: fields.text
                    });

                    data.save(function(err) {
                        if (err) {
                            res.json({error:true, result: false, message: "Error occured: " + err});
                        }
                        else {
                            res.json({error:false, result: true, message: "Testimonial successfully added."});
                        }
                    });

                }
            });

        });
     
    });

    app.post("/siteconf/removeTestimonial", function(req, res, next) {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

            SiteConfiguration.update({'testimonials._id': fields._id}, {$pull: {'testimonials': {'_id': fields._id}}}).exec(function(err){
                if (err) {
                    res.json({error:true, result: false, message: "Error occured: " + err});
                } else {

                    res.json({error:false, result: true, message: "Testimonial successfully removed."});
                }
            });

        });
     
    });

    app.post("/siteconf/updateTestimonial", function(req, res, next) {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

            SiteConfiguration.update({'testimonials._id': fields._id},
                {
                    $set:{
                        'testimonials.$.author' : fields.author,
                        'testimonials.$.text' : fields.text
                    }
                },
                function(err) {

                    if (err) {
                        res.json({error:true, result: false, message: "Error occured: " + err});
                    } else {
                        res.json({error:false, result: true, message: "Testimonial successfully updated."});
                    }
                });

        });
     
    });


    app.post("/siteconf/uploadImage", function(req, res, next) {
        
        var tmp_path,
            type,
            file;

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

            //empty the array before pushing new base64 datas
            base64data = [];

            //we loop the incoming files and push each one with the arriving order to the items array
            for(file in files) {
                if(files.hasOwnProperty(file)) {

                    // get the temporary location of the file
                    tmp_path = files[file].path;
                    type = files[file].type;
                    //read the file and convert it to base64 encoded string value
                    fs.readFile(tmp_path, function(err, original_data){
                        if (err) res.json({error:true, result: false, message: "Error occured @converting tmp_path to base64: " + err });
                        var base64Image = new Buffer(original_data, 'binary').toString('base64');
                        base64data.push( "data:" + type + ";base64," + base64Image );
                    });

                }
            }

            res.json({error:false, result: true, message: "Image successfully added."});

        });

    });

    app.post("/siteconf/addPortfolio", function(req, res, next) {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

            SiteConfiguration.findOne({_id: fields._id}, function(err, data) {

                if (err) {
                    res.json({error:true, result: false, message: "Error occured: " + err});
                }
                else {

                    data.portfolios.push({
                        company: fields.company,
                        definition: fields.definition,
                        detailPageUrl: fields.detailPageUrl,
                        detailPageImages: base64data
                    });

                    data.save(function(err) {
                        if (err) {
                            res.json({error:true, result: false, message: "Error occured: " + err});
                        }
                        else {
                            //adding detail images
                            res.json({error:false, result: true, message: "Portfolio successfully added."});
                        }
                    });

                }
            });
        });
     
    });

    app.post("/siteconf/removePortfolio", function(req, res, next) {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

            SiteConfiguration.update({'portfolios._id': fields._id}, {$pull: {'portfolios': {'_id': fields._id}}}).exec(function(err){
                if (err) {
                    res.json({error:true, result: false, message: "Error occured: " + err});
                } else {
                    res.json({error:false, result: true, message: "Portfolio successfully removed."});
                }
            });

        });

    });

    app.post("/siteconf/updatePortfolio", function(req, res, next) {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

            SiteConfiguration.update({'portfolios._id': fields._id},
            {
                $set:{
                    'portfolios.$.company' : fields.company,
                    'portfolios.$.definition' : fields.definition,
                    'portfolios.$.detailPageUrl' : fields.detailPageUrl
                }
            },
            function(err) {

                if (err) {
                    res.json({error:true, result: false, message: "Error occured: " + err});
                } else {

                    res.json({error:false, result: true, message: "Portfolio successfully updated."});
                }
            });

        });
     
    });


    app.post("/siteconf/update", function(req, res, next) {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

            SiteConfiguration.findOne({_id: fields._id}, function(err, data) {

                if (err) {
                    res.json({error:true, result: false, message: "Error occured: " + err});
                } else {
                    data.title = fields.title;
                    data.fblink = fields.fblink;
                    data.twlink = fields.twlink;
                    data.gplink = fields.gplink;
                    data.lilink = fields.lilink;
                    data.ytlink = fields.ytlink;
                    data.portfolio = fields.portfolio;
                    data.testimonial = fields.testimonial;

                    data.save(function(err) {
                        if (err) {
                            res.json({error:true, result: false, message: "Error occured: " + err});
                        }
                        else {
                            res.json({error:false, result: true, message: "Your configurations are successfully updated."});
                        }
                    });

                }
            });

        });

    });
};

module.exports = AdminLoggedInController;