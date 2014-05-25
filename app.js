
/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose'),
	config = require('config'),
	utils = require('./lib/utils'),
  ENV = process.env.NODE_ENV || 'development';

// Database
var mongoose = utils.connectToDatabase(mongoose, config.db);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon(path.join(__dirname, 'public/img/favicon.png')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Defining models
require('./models/SiteConfiguration')(mongoose);
require('./models/User')(mongoose);

// Defining Controllers
['SiteConfiguration', 'Admin','FormSubmit','AdminLoggedIn'].forEach(function (controller) {
    require('./controllers/' + controller + 'Controller')(app, mongoose, config);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});