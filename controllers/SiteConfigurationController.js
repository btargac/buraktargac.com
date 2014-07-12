var SiteConfiguration = require('../models/SiteConfiguration');


SiteController = function (app, mongoose, config) {

    var SiteConfiguration = mongoose.model('SiteConfiguration');

    app.get("/", function(req, res, next) {
        SiteConfiguration.findOne({}, function(err, data) {
            res.render("index", {
                //these parameters can vary accourding to your sites needs
                title: data.title,
                fblink: data.fblink,
                twlink: data.twlink,
                gplink: data.gplink,
                lilink: data.lilink,
                ytlink: data.ytlink,
                portfolios: data.portfolios,
                testimonials: data.testimonials
            });
        });   
    });

    app.get("/portfolio/:id", function(req, res, next) {
        
        var id = req.params.id;
        
        SiteConfiguration.findOne({'portfolios.detailPageUrl': id}, function(err, data) {
                
            if (err) {
                res.send({error:true, result: false, message: "Error occured: " + err});
            } else if (data) {
                var result = data.portfolios.map(function(portfolio) {
                    if (portfolio.detailPageUrl == id) {
                        //render the portfolio template with the required data coming from the mapped results
                        res.render("portfolio", {
                            portfolio: portfolio
                        });

                    }                 
                });
                
            } else {
                res.send({error:true, result: false, message: "Error occured: " + err});
            }
        });
  
    });
}

module.exports = SiteController;