var SiteConfiguration = require('../models/SiteConfiguration'),
    User = require('../models/User');


AdminController = function (app, mongoose, config, passport) {

    var SiteConfiguration = mongoose.model('SiteConfiguration'),
        User = mongoose.model('User');

    app.get("/admin", function(req, res, next) {
        res.render("admin");   
    });

    app.post('/login',
        passport.authenticate('local', { successRedirect: '/adminloginned',
                                            failureRedirect: '/admin',
                                            failureFlash: false
                                        })
    );

    app.post("/siteconf/create", function(req, res, next) {
        var siteConfiguration = new SiteConfiguration(req.body);
        siteConfiguration.save(function(err) {
        	if (err) {
        		res.json({result: false, message: "Error occured: " + err});
        	} else {
        		res.json({result: true, message: "Successfully created!"});
        	}
        }); 
    });

    app.post("/siteconf/update", function(req, res, next) {
        
        var id = req.body._id;
        SiteConfiguration.findOne({_id: id}, function(err, data) {
        		
        	if (err) {
        		res.json({result: false, message: "Error occured: " + err});
        	} else {
        		data.title = req.body.title;
        		data.fblink = req.body.fblink;
        		data.twlink = req.body.twlink;
                data.gplink = req.body.gplink;
                data.lilink = req.body.lilink;
                data.ytlink = req.body.ytlink;
                data.testimonial = req.body.testimonial;

        		data.save(function(err) {
	        		if (err) {
	        		res.json({result: false, message: "Error occured: " + err});
	        		} 
	        		else {
        			res.json({result: true, message: "Successfully created!"});
        			}
        		});

        	}
        });
    });
}

module.exports = AdminController;