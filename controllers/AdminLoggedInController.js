var SiteConfiguration = require('../models/SiteConfiguration'),
    User = require('../models/User'),
    path = require('path'),
    fs = require('fs');


AdminLoggedInController = function (app, mongoose, config) {

    var SiteConfiguration = mongoose.model('SiteConfiguration'),
        User = mongoose.model('User');

        
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
        var tmp_path = req.files.imgInput.path; 
        // set where the file should actually exists - in this case it is in the "images" directory
        var target_path = __dirname + '/../public/img/portfolio/' + req.files.imgInput.name;

        fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err; 
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files 
            fs.unlink(tmp_path, function() {
                if (err) throw err;
            });
        });

        res.end();
        
        
    });

    app.post("/siteconf/addPortfolio", function(req, res, next) {

        var id = req.body._id;
        SiteConfiguration.findOne({_id: id}, function(err, data) {
                
            if (err) {
                res.json({error:true, result: false, message: "Error occured: " + err});
            } else {
                data.portfolios.push({
                    company: req.body.company,
                    definition: req.body.definition,
                    imgUrl: req.body.imgUrl
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