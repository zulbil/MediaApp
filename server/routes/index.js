var express   = require('express');
var passport  = require('passport');
var router    = express.Router();

/** Import controllers */
var indexCtrl	= require('./../controllers/index');
var userCtrl   	= require('./../controllers/users');
var commentCtrl = require('./../controllers/comments');
var imagesCtrl 	= require('./../controllers/images');
var videosCtrl 	= require('./../controllers/videos');

/** Import middleware */
var isLoggedIn 	= require('./../middleware/authenticate');

/* GET home page. */
router.get('/', indexCtrl.home);

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
router.get('/profile', isLoggedIn, userCtrl.userProfile);
router.get('/logout', userCtrl.userLogout);
/**
 * End User routes
 */

/** Comments routes  */
router.get('/comments', isLoggedIn, commentCtrl.commentList);
router.post('/comment/create', isLoggedIn, commentCtrl.createComment);
router.delete('/comment/remove/:id', isLoggedIn, commentCtrl.removeComment);
router.patch('/comment/edit/:id', isLoggedIn, commentCtrl.editComment );

/** Images routes */
router.get('/images', isLoggedIn, imagesCtrl.showImages );
router.post('/upload/images', isLoggedIn, imagesCtrl.uploadImages);

/** Videos routes  */
router.get('/videos', isLoggedIn, videosCtrl.showVideos);
router.post('/upload/videos', isLoggedIn, videosCtrl.uploadVideos);


module.exports = router;
