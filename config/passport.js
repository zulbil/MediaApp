var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

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
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, email, password, done) {
        // ...
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
        // ...
      }
    ));
}