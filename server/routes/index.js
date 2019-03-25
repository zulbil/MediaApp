var express   = require('express');
var passport  = require('passport');
var router    = express.Router();

/** Import controllers */
var userCtrl   = require('./../controllers/users'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * User routes and authenticate routes
 */
/* POST login */ 
router.post('/login', passport.authenticate('local-login', { 
//Success go to Profile Page / Fail go to login page 
  successRedirect : '/profile', 
  failureRedirect : '/login', 
  failureFlash : true 
}));

/** POST signup */
router.post('/signup', passport.authenticate('local-signup', {
//Success go to Profile Page / Fail go to Signup page 
  successRedirect : '/profile', 
  failureRedirect : '/signup', 
  failureFlash : true
}));

router.get('/login', userCtrl.loginPage); 
router.get('/signup', userCtrl.signupPage); 
router.get('/profile', userCtrl.isLoggedIn, userCtrl.userProfile);
router.get('/logout', userCtrl.userLogout); 
/**
 * End User routes
 */


module.exports = router;
