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

    app.get("/portfolio:id", function(req, res, next) {
        res.send('This is where is being developed right now, because all other parts are done.')   
    });
}

module.exports = SiteController;