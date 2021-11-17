const formidable = require('formidable');

AdminController = function (app, mongoose) {

    const User = mongoose.model('User');

    app.get("/admin", function(req, res) {
        res.render("admin", {
            title: 'Login Page'
        });
    });

    app.post("/login", function(req, res) {

        let form = new formidable.IncomingForm(),
            username,
            password;

        form.parse(req, function(err, fields) {
            username = fields.username;
            password = fields.password;

            User.findOne({username: username, password: password}, function(err, userInfo) {
                if (err) {
                    res.status(500)
                        .send({
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

    });

};

module.exports = AdminController;