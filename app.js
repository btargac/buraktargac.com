/**
 * Module dependencies.
 */

const newrelic = require('newrelic'),
    fs = require('fs'),
    express = require('express'),
    path = require('path'),
    config = require('config'),
    utils = require('./lib/utils'),
    ENV = process.env.NODE_ENV || 'development',
    sendgrid  = require('sendgrid')(process.env.SENDGRID_API_KEY),
    multer = require('multer'),
    methodOverride = require('method-override'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    Recaptcha = require('express-recaptcha'),
    mongoose = require('mongoose');

// init reCAPTCHA

const recaptcha = new Recaptcha(process.env.reCAPTCHA_KEY, process.env.reCAPTCHA_SECRET, {
    theme: 'dark',
    hl: 'en'
});

// Database
const mongooseInstance = utils.connectToDatabase(mongoose, config.db);
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public/img/favicon.png')));
app.use(compression());
app.use(logger('dev'));
app.use(express.json({
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
require('./models/SiteConfiguration')(mongooseInstance);
require('./models/User')(mongooseInstance);

// Register Controllers and routes
const controllerPath = path.join(__dirname, '/controllers');
fs.readdirSync( controllerPath ).forEach( function ( file ) {
    if ( ~file.indexOf( "Controller.js" ) ) require( controllerPath + "/" + file )( app, mongooseInstance, config, sendgrid, recaptcha );
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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