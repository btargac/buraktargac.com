SiteController = function (app, mongoose, config, sendgrid, recaptcha) {

    var SiteConfiguration = mongoose.model('SiteConfiguration');

    app.get("/", recaptcha.middleware.render, function(req, res, next) {
        SiteConfiguration.findOne({}, function(err, data) {
            res.render("index", {
                //these parameters can vary accourding to your sites needs
                title: data.title,
                githublink: data.githublink,
                fblink: data.fblink,
                twlink: data.twlink,
                gplink: data.gplink,
                lilink: data.lilink,
                ytlink: data.ytlink,
                portfolios: data.portfolios,
                testimonials: data.testimonials,
                captcha: res.recaptcha
            });
        });   
    });

    app.get("/portfolio/:id", function(req, res, next) {
        
        var id = req.params.id;
        
        SiteConfiguration.findOne({'portfolios.detailPageUrl': id}, function(err, data) {
                
            if (err) {
                res.send({error:true, result: false, message: "Error occured: " + err});
            } else if (data) {
                
                var result = data.portfolios.filter(function(portfolio) {
                    return portfolio.detailPageUrl === id;
                }).reduce(function (prev, curr) {
                    return curr;
                }, null);

                //render the portfolio template with the required data coming from the filtered results
                res.render("portfolio", {
                    portfolio: result
                });
                
            } else {
                res.send({error:true, result: false, message: "Error occured: " + err});
            }
        });
  
    });
};

module.exports = SiteController;