const cacheViewFactory = require('../middlewares/cache.middleware');
const _generateResponseData = data => ({
    title: data.title,
    githublink: data.githublink,
    fblink: data.fblink,
    twlink: data.twlink,
    lilink: data.lilink,
    ytlink: data.ytlink,
    portfolios: data.portfolios,
    testimonials: data.testimonials,
    recaptchaKey: data.recaptchaKey
});

SiteController = function (app, mongoose, config, sendgrid, mc) {

    const SiteConfiguration = mongoose.model('SiteConfiguration');

    app.get("/", (req, res, next) => {

        const cache_key = '_db_cache_SiteConfiguration';

        // Look in cache to avoid querying from mongo everytime
        mc.get(cache_key, async (err, data) => {
            if(!err && data) {
                res.render('index', _generateResponseData(JSON.parse(data)));
            }
            else {
                try {
                    const siteData = await SiteConfiguration.findOne().lean();
                    const enhancedData = {...siteData, recaptchaKey: config.GOOGLE_RECAPTCHA_SITE_KEY}

                    // this mongo request takes long time so the result should be cached
                    mc.set(cache_key, JSON.stringify(enhancedData),
                        {expires: 0},
                        (err, val) => {
                            if(err) {
                                console.error('err occurred while caching the mongo db response', err);
                            }
                        });

                    res.render('index', _generateResponseData(enhancedData));
                } catch (error) {
                    next(error);
                }
            }
        })
    });

    app.get("/portfolio/:id", cacheViewFactory(mc), async (req, res) => {

        const { id } = req.params;

        try {
            // TODO: fetch data directly from mongo without a further need to filter anything
            const siteData = await SiteConfiguration.findOne({'portfolios.detailPageUrl': id}).lean();
            const portfolio = siteData.portfolios.find(portfolio => portfolio.detailPageUrl === id);

            //render the portfolio template with the required data coming from the filtered results
            res.render("portfolio", {
                portfolio
            });
        } catch (error) {
            res.send({error:true, result: false, message: "Error occurred: " + error});
        }
    });
};

module.exports = SiteController;
