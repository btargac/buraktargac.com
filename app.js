/**
 * Module dependencies.
 */

var fs = require('fs'),
    express = require('express'),
    path = require('path'),
    config = require('config'),
    utils = require('./lib/utils'),
    ENV = process.env.NODE_ENV || 'development',
    sendgrid  = require('sendgrid')('btargac', process.env.SENDGRID_PASS),
    multer = require('multer'),
    methodOverride = require('method-override'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    recaptcha = require('express-recaptcha'),
    mongoose = require('mongoose');

// init reCAPTCHA
recaptcha.init(process.env.reCAPTCHA_KEY, process.env.reCAPTCHA_SECRET, {
  theme: 'dark',
  hl: 'en'
});

// Database
var mongoose = utils.connectToDatabase(mongoose, config.db);
var app = express();

// view engine setup
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
app.use(cookieParser('buraktargac'));
app.use(session({
    secret: 'buraktargac',
    saveUninitialized: true,
    resave: true
}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Defining models
require('./models/SiteConfiguration')(mongoose);
require('./models/User')(mongoose);

// Register Controllers and routes
var controllerPath = path.join(__dirname, '/controllers');
fs.readdirSync( controllerPath ).forEach( function ( file ) {
    if ( ~file.indexOf( "Controller.js" ) ) require( controllerPath + "/" + file )( app, mongoose, config, sendgrid, recaptcha );
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;