var SiteConfiguration = require('../models/SiteConfiguration');


SiteController = function (app, mongoose, config) {

    var SiteConfiguration = mongoose.model('SiteConfiguration');

    app.get("/", function(req, res, next) {
        SiteConfiguration.findOne({}, function(err, data) {
            console.log(data);
            res.render("index", {
                //these parameters can vary accourding to your sites needs
                title: data.title,
                fblink: data.fblink,
                twlink: data.twlink,
                gplink: data.gplink,
                lilink: data.lilink,
                ytlink: data.ytlink,
                testimonials: data.testimonials
            });
        });   
    });
}

module.exports = SiteController;