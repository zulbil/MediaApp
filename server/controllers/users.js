var gravatar	= 	require('gravatar');

var loginPage 	=	function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/profile');
	}
	res.render('login', { title: 'Login Page', message: req.flash('loginMessage') });
}

var signupPage	=	function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/profile');
	}
    res.render('signup', { title: 'Signup Page', message: req.flash('signupMessage') });
};

var userProfile	=	function (req, res) {
	res.render('profile', { title: 'Profile Page', user : req.user, avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'}, true) });
}

var userLogout	=	function (req, res) {
	req.logout();
  	res.redirect('/');
}

module.exports = {
	loginPage,
	signupPage,
	userProfile,
	userLogout
}
