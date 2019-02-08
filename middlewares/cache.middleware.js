// cache middleware for rendered views

const cacheViewFactory = (mc) => {
    const cacheView = (req, res, next) => {
        const view_key = '_view_cache_' + req.originalUrl || req.url;

        mc.get(view_key, function(err, val) {
            if(err == null && val != null) {
                res.send(val.toString('utf8'));
                return;
            }
            // Cache the rendered view for future requests
            res.sendRes = res.send;
            res.send = function(body){
                mc.set(view_key, body, {expires: 0}, function(err, val){
                    if(err) {
                        console.log('err occurred while caching the rendered portfolio view', err);
                    }
                });
                res.sendRes(body);
            };
            next();
        });
    };

    return cacheView;
};


module.exports = cacheViewFactory;
