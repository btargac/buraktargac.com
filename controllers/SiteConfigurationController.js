const cacheViewFactory = require('../middlewares/cache.middleware');
const _generateResponseData = (res, data) => ({
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

SiteController = function (app, mongoose, config, sendgrid, recaptcha, mc) {

    const SiteConfiguration = mongoose.model('SiteConfiguration');

    app.get("/", recaptcha.middleware.render, function(req, res) {

        const cache_key = '_db_cache_SiteConfiguration';

        // Look in cache
        mc.get(cache_key, function(err, data) {
            if(!err && data) {
                res.render('index', _generateResponseData(res, JSON.parse(data)));
            }
            else {
                SiteConfiguration.findOne({}, function(err, data) {

                    // this mongo request takes long time so the result should be cached
                    mc.set(cache_key, JSON.stringify(data), {expires: 0}, function(err, val){
                        if(err) {
                            console.log('err occurred while caching the mongo db response', err);
                        }
                    });

                    res.render('index', _generateResponseData(res, data));
                });
            }
        })
    });

    app.get("/portfolio/:id", cacheViewFactory(mc), function(req, res) {
        
        const id = req.params.id;
        
        SiteConfiguration.findOne({'portfolios.detailPageUrl': id}, function(err, data) {
                
            if (err) {
                res.send({error:true, result: false, message: "Error occured: " + err});
            } else if (data) {
                
                const result = data.portfolios.filter(function(portfolio) {
                    return portfolio.detailPageUrl === id;
                }).reduce(function (prev, curr) {
                    return curr;
                }, null);

                //render the portfolio template with the required data coming from the filtered results
                res.render("portfolio", {
                    portfolio: result
                });
                
            } else {
                res.send({error:true, result: false, message: "Error occurred: " + err});
            }
        });
  
    });
};

module.exports = SiteController;
