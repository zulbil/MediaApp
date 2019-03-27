var passport      = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var { User }      = require('./../server/models/users');

module.exports = function (passport) {
    // Passport init Setup
    // Serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize the user for session
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });

    // Signin
    passport.use('local-login',new LocalStrategy({
      // change default username and password, to email and password
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, email, password, done) {
        if ( email ) {
          // format to lower-case
          email = email.toLowerCase();
          // process asynchronous
          process.nextTick(function (){
            User.findOne({ 'local.email': email }).then((user) => {
              // Check user record and sending message
              if (!user) {
                return done(null, false, req.flash('loginMessage', 'No such user found'));
              }
              if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Your password is wrong'));
              } else {
                // Everything is ok
                return done(null, user);
              }
            }).catch((error) => {
              return done(error);
            })
          })
        }
      }
    ));

    // Signup local strategy
    passport.use('local-signup',new LocalStrategy({
        // change default username and password, to email and password
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, email, password, done) {
        if (email) {
          // format to lowercase
          email = email.toLowerCase();
          // process asynchronous
          process.nextTick(function (){
            // check if user is already login
            if (!req.user) {
              User.findOne({ 'local.email' : email }).then((user) => {
                if (user) {
                  return done(null, false, req.flash('signupMessage', 'This email is already taken'));
                } else {
                  // Create a new user
                  var newUser = new User();
                  newUser.local.firstname   = req.body.firstname;
                  newUser.local.lastname    = req.body.lastname;
                  newUser.local.username    = req.body.username;
                  newUser.local.email       = req.body.email;
                  newUser.local.password    = req.body.password

                  // Save Data
                  newUser.save().then(()=> {
                    return done(null, req.user, req.flash('loginMessage', 'Your account is created, you can log in now!'));
                  }).catch((error) => {
                      throw error;
                  })
                }
              })
            } else {
              return done(null, req.user)
            }
          })
        }
      }
    ));
}
