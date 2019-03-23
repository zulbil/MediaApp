/** Import Basic Module */
const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const favicon       = require('serve-favicon'); 
const mongoose      = require('mongoose'); 
const session       = require('express-session');
const mongoStore    = require('connect-mongo')(session); 
const passport      = require('passport');
const flash         = require('connect-flash');
const bodyParser    = require('body-parser');
// Import routes
const indexRouter   = require('./server/routes/index');
const usersRouter   = require('./server/routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');

// Import Database configuration
const {urlMongo} = require('./config/db'); 
// require('./config/db'); 

// Import Passport Configuration
require('./config/passport')(passport); 

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up public directory 
app.use(express.static(path.join(__dirname, 'public')));

// Required for passport 
// Secret for session 
app.use(session({
  secret: 'cavert785bgcdxobe',
  saveUninitialized: true, 
  resave: true, 
  store: new mongoStore({   // Store session on MongoDB using express-session + connect-mongo
    url: urlMongo,
    collection: 'sessions'
  })
}))

// Init passport authentication
app.use(passport.initialize());
// persist login session
app.use(passport.session());
// flash messages
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
