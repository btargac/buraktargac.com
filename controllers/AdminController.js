var SiteConfiguration = require('../models/SiteConfiguration'),
    User = require('../models/User');


AdminController = function (app, mongoose, config) {

    var SiteConfiguration = mongoose.model('SiteConfiguration');
    var User = mongoose.model('User');

    app.get("/admin", function(req, res, next) {
        res.render("admin", {
                        title: 'Login Page'
                    });   
    });

    app.post("/login", function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        User.findOne({username: username, password: password}, function(err, userInfo) {
            if (err) {
                res.status(500);
                res.send('500', {
                    err: err,
                    url: req.url
                });
            } else {
                if (userInfo) {
                    req.session.user = userInfo;
                    res.redirect('/adminloggedin');
                } else {
                    res.render('admin', {
                        title: 'Login failed'
                    });
                }
            }
        });

    });

}

module.exports = AdminController;