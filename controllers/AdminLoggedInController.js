var SiteConfiguration = require('../models/SiteConfiguration'),
    User = require('../models/User'),
    path = require('path'),
    fs = require('fs'),
    request = require('request').defaults({ encoding: null });


AdminLoggedInController = function (app, mongoose, config) {

    var SiteConfiguration = mongoose.model('SiteConfiguration'),
        User = mongoose.model('User'),
        base64data = [];

        
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
        
        var tmp_path,
            originalFilename,
            target_path,
            key,
            file;

        //we loop the incoming files and rename each one with the arriving order
        for(key in req.files) {
          if(req.files.hasOwnProperty(key)) {
            
            // get the temporary location of the file
            tmp_path = req.files[key].path,
            originalFilename = req.files[key].originalFilename,
            target_path = path.join(__dirname, "/../public/img/portfolio/", originalFilename);
            
            //here we rename the temporary image file with the original file name just because there is no way of finding the new
            //generated file name
            fs.rename(tmp_path, target_path, function(err) {
                if (err) res.json({error:true, result: false, message: "Error occured @ renaming: " + err});
                // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files 
                fs.unlink(tmp_path, function() {
                    if (err) res.json({error:true, result: false, message: "Error occured @unliking tmp_path: " + err});
                });
            });
          }
        }


        // Async task (for converting the uploaded images to base 64 and after deleting them all)
        function async(arg, callback) {
          setTimeout(function() {
                callback(arg); 
            }, 1000);
        }
        // Final task (same in all the examples)
        function final() { 
            //we return the answer as a json to the client side with a delay of 2 sec
            setTimeout(function () {
                res.json({error:false, result: true, message: "Image successfully added."});
            },2500);
        }

        var items = [];

        //empty the array before pushing new base64 datas
        base64data = [];

        //we loop the incoming files and push each one with the arriving order to the items array
        for(file in req.files) {
          if(req.files.hasOwnProperty(file)) {
            
            // get the temporary location of the file
            originalFilename = req.files[file].originalFilename;
            items.push(originalFilename);
          }
        }

        function series(item) {
          if(item) {
            async( item, function(result) {
                
                // get the base64 encoded version of images
                request.get(
                    //check if it's local or heroku
                    ( app.get('port') === 3000 ) ?  req.protocol+'://'+req._remoteAddress+':'+app.get('port')+'/img/portfolio/'+result :
                                                    req.protocol+'://'+'buraktargac.herokuapp.com'+'/img/portfolio/'+result
                    , function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        base64data.push( "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64') );
                    }
                    else {
                        res.json({error:true, result: false, message: "Image could not be added or not found at the folder."});
                    }
                });

                // delete the uploaded file with a 4 seconds delay, so that upload dir does not get filled with unwanted files
                setTimeout(function(){
                    fs.unlink( __dirname + '/../public/img/portfolio/' + result, function(err) {
                        if (err) res.json({error:true, result: false, message: "Error occured @ unliking uploaded detail image with the originalFilename: " + err});
                    });
                },4000);

              return series(items.shift());
            });
          } else {
            return final();
          }
        }
        series(items.shift());

    });

    app.post("/siteconf/addPortfolio", function(req, res, next) {

        var id = req.body._id;
        
        SiteConfiguration.findOne({_id: id}, function(err, data) {
                
            if (err) {
                res.json({error:true, result: false, message: "Error occured: " + err});
            } 
            else {
                
            data.portfolios.push({
                company: req.body.company,
                definition: req.body.definition,
                detailPageUrl: req.body.detailPageUrl,
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
                'portfolios.$.detailPageUrl' : req.body.detailPageUrl
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