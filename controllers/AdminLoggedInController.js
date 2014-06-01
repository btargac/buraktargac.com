var SiteConfiguration = require('../models/SiteConfiguration'),
    User = require('../models/User'),
    fs = require('fs'),
    request = require('request').defaults({ encoding: null });


AdminLoggedInController = function (app, mongoose, config) {

    var SiteConfiguration = mongoose.model('SiteConfiguration'),
        User = mongoose.model('User'),
        imagedata;

        
    app.get("/adminloggedin", function(req, res, next) {
        if(req.session.user)
        SiteConfiguration.findOne({}, function(err, data) {
            res.render("adminloggedin", {
                //these parameters can vary accourding to your sites needs
                data:data
            });
        });
        else
            res.redirect('/admin');
    });

    app.post("/siteconf/create", function(req, res, next) {
        var siteConfiguration = new SiteConfiguration(req.body);
        siteConfiguration.save(function(err) {
        	if (err) {
        		res.json({error:true, result: false, message: "Error occured: " + err});
        	} else {
        		res.json({error:false, result: true, message: "Successfully created!"});
        	}
        }); 
    });

    app.post("/siteconf/addTestimonial", function(req, res, next) {

        var id = req.body._id;
        SiteConfiguration.findOne({_id: id}, function(err, data) {
                
            if (err) {
                res.json({error:true, result: false, message: "Error occured: " + err});
            } else {
                
                data.testimonials.push({
                    author: req.body.author,
                    text: req.body.text
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

    app.post("/siteconf/removeTestimonial", function(req, res, next) {

        var id = req.body._id;

        SiteConfiguration.update({'testimonials._id': id}, {$pull: {'testimonials': {'_id': id}}}).exec(function(err){
              if (err) {
                res.json({error:true, result: false, message: "Error occured: " + err});
              } else {
                    
                    res.json({error:false, result: true, message: "Testimonial successfully removed."});
             }  
        });

     
    });

    app.post("/siteconf/updateTestimonial", function(req, res, next) {

        var id = req.body._id;
        SiteConfiguration.update({'testimonials._id': id},
        {
            $set:{
                'testimonials.$.author' : req.body.author,
                'testimonials.$.text' : req.body.text
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


    app.post("/siteconf/uploadImage", function(req, res, next) {
        // get the temporary location of the file
        var tmp_path = req.files.imgInput.path,
            originalFilename = req.files.imgInput.originalFilename,
            target_path = __dirname + '/../public/img/portfolio/' + originalFilename;
        
        //here we rename the temporary image file with the original file name just because there is no way of finding the new
        //generate file name
        fs.rename(tmp_path, target_path, function(err) {
            if (err) res.json({error:true, result: false, message: "Error occured @ renaming: " + err});
            // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files 
            fs.unlink(tmp_path, function() {
                if (err) res.json({error:true, result: false, message: "Error occured @unliking tmp_path: " + err});
            });
        });

        res.json({error:false, result: true, message: "Image successfully added."});

    });

    app.post("/siteconf/addPortfolio", function(req, res, next) {

        var id = req.body._id;
        
        SiteConfiguration.findOne({_id: id}, function(err, data) {
                
            if (err) {
                res.json({error:true, result: false, message: "Error occured: " + err});
            } 
            else {

                //we take the uploaded image and convert it to base64
                request.get(req.protocol+'://'+req._remoteAddress+':'+app.get('port')+'/img/portfolio/'+req.body.imgUrl, function (error, response, body) {
                    res.send(req.protocol+'://'+req._remoteAddress+':'+app.get('port')+'/img/portfolio/'+req.body.imgUrl);
                    if (!error && response.statusCode == 200) {
                        imagedata = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                        data.portfolios.push({
                            company: req.body.company,
                            definition: req.body.definition,
                            imgUrl: imagedata
                        });

                        // delete the uploaded file, so that upload dir does not get filled with unwanted files 
                        fs.unlink( __dirname + '/../public/img/portfolio/' + req.body.imgUrl, function() {
                            if (err) res.json({error:true, result: false, message: "Error occured @ unliking uploaded image with the originalFilename: " + err});
                        });

                        data.save(function(err) {
                            if (err) {
                                res.json({error:true, result: false, message: "Error occured: " + err});
                            } 
                            else {
                                res.json({error:false, result: true, message: "Portfolio successfully added."});
                            }
                        });
                    }
                    else {
                        res.json({'data':'base 64 failed', 'type': false, 'error': error});
                    }
                });

            }
        });
     
    });

    app.post("/siteconf/removePortfolio", function(req, res, next) {

        var id = req.body._id;

        SiteConfiguration.update({'portfolios._id': id}, {$pull: {'portfolios': {'_id': id}}}).exec(function(err){
              if (err) {
                res.json({error:true, result: false, message: "Error occured: " + err});
              } else {
                    
                    res.json({error:false, result: true, message: "Portfolio successfully removed."});
             }  
        });

     
    });

    app.post("/siteconf/updatePortfolio", function(req, res, next) {

        var id = req.body._id;
        SiteConfiguration.update({'portfolios._id': id},
        {
            $set:{
                'portfolios.$.company' : req.body.company,
                'portfolios.$.definition' : req.body.definition,
                'portfolios.$.imgUrl' : req.body.imgUrl
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


    app.post("/siteconf/update", function(req, res, next) {
        var id = req.body._id;
        SiteConfiguration.findOne({_id: id}, function(err, data) {
        		
        	if (err) {
        		res.json({error:true, result: false, message: "Error occured: " + err});
        	} else {
        		data.title = req.body.title;
        		data.fblink = req.body.fblink;
        		data.twlink = req.body.twlink;
                data.gplink = req.body.gplink;
                data.lilink = req.body.lilink;
                data.ytlink = req.body.ytlink;
                data.portfolio = req.body.portfolio;
                data.testimonial = req.body.testimonial;

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
}

module.exports = AdminLoggedInController;