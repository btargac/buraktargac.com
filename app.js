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
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    compression = require('compression'),
    session = require('express-session'),
    memjs = require('memjs'),
    MemcachedStore = require('connect-memjs')(session),
    Recaptcha = require('express-recaptcha').Recaptcha,
    redirectSSL = require('redirect-ssl'),
    mongoose = require('mongoose');

const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
    failover: true,
    timeout: 1,
    keepAlive: true
});

// init reCAPTCHA
const recaptcha = new Recaptcha(process.env.reCAPTCHA_KEY, process.env.reCAPTCHA_SECRET, {
    theme: 'dark',
    hl: 'en'
});

// Database connection
utils.connectToDatabase(mongoose, config.db);

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.once('open', () => {
    console.info('connected to mongodb');
});

const app = express();

// middleware to enforce https
app.use(redirectSSL);

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
app.use(session({
    secret: 'buraktargac',
    resave: 'false',
    saveUninitialized: 'false',
    store: new MemcachedStore({
        servers: [process.env.MEMCACHIER_SERVERS],
        prefix: '_session_'
    })
}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Defining models
require('./models/SiteConfiguration')(mongoose);
require('./models/User')(mongoose);

// Register Controllers and routes
const controllerPath = path.join(__dirname, '/controllers');
fs.readdirSync( controllerPath ).forEach( function ( file ) {
    if ( ~file.indexOf( "Controller.js" ) ) require( controllerPath + "/" + file )( app, mongoose, config, sendgrid, recaptcha, mc );
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
// no stacktrace leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
