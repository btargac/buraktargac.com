
/**
 * Module dependencies.
 */

var fs = require('fs'),
    express = require('express'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    mongoose = require('mongoose'),
    config = require('config'),
    utils = require('./lib/utils'),
    ENV = process.env.NODE_ENV || 'development',
    sendgrid  = require('sendgrid')('btargac', process.env.SENDGRID_PASS),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    favicon = require('serve-favicon'),
    session = require('express-session'),
    serveStatic = require('serve-static'),
    errorHandler = require('errorhandler');

// Database
var mongoose = utils.connectToDatabase(mongoose, config.db);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public/img/favicon.png')));
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json({
    extended: true,
    keepExtensions: true,
    uploadDir: path.join(__dirname, '/public/img/portfolio'),
    limit: '2mb'
  }));
app.use(methodOverride());
app.use(cookieParser('your secret here'));
app.use(session({
    secret: 'buraktargac',
    saveUninitialized: true,
    resave: true
}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

// Defining models
require('./models/SiteConfiguration')(mongoose);
require('./models/User')(mongoose);

// Register Controllers
var controllerPath = path.join(__dirname, '/controllers');
fs.readdirSync( controllerPath ).forEach( function ( file ) {
    if ( ~file.indexOf( "Controller.js" ) ) require( controllerPath + "/" + file )( app, mongoose, config, sendgrid );
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});