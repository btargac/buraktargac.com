const fs = require('fs'),
    express = require('express'),
    path = require('path'),
    dotenv = require('dotenv').config(),
    utils = require('./lib/utils'),
    ENV = process.env.NODE_ENV || 'development',
    sendgrid  = require('sendgrid')(process.env.SENDGRID_API_KEY),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    compression = require('compression'),
    session = require('express-session'),
    memjs = require('memjs'),
    MemcachedStore = require('connect-memjs')(session),
    redirectSSL = require('redirect-ssl'),
    mongoose = require('mongoose'),
    recaptchaRoute = require('./routes/recaptcha-validation');

const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
    failover: true,
    timeout: 1,
    keepAlive: true
});

// Database connection
utils.connectToDatabase(mongoose).then(connection => {

    connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    connection.once('open', () => {
        console.info('connected to mongodb');
    });
});

const app = express();

// middleware to enforce https
app.use(redirectSSL.create({
    exclude: ['localhost'],
    enabled: ENV === 'production'
}));

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
    if ( file.includes("Controller.js") ) {
        require( controllerPath + "/" + file )( app, mongoose, sendgrid, mc );
    }
});
// recaptcha validation router
app.use('/recaptcha-validation', recaptchaRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (ENV === 'development') {
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
