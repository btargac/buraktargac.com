// cache middleware for rendered views

const cacheViewFactory = (mc) => {
    return (req, res, next) => {
        const view_key = `_view_cache_${req.originalUrl || req.url}`;

        mc.get(view_key, function(err, val) {
            if(!err && !!val) {
                res.send(val.toString('utf8'));
                return;
            }
            // Cache the rendered view for future requests
            res.sendRes = res.send;
            res.send = function (body) {
                if (typeof body === 'string') {
                    mc.set(view_key, body, {expires: 0}, function (err, val) {
                        if (err) {
                            console.log('err occurred while caching the rendered portfolio view', err);
                        }
                    });
                }
                res.sendRes(body);
            };
            next();
        });
    };

};


module.exports = cacheViewFactory;
