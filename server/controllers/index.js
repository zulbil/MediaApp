var gravatar 	= require('gravatar');
var home 		= function (req, res ) {
	var user 	= null,
		picture = null;

	if (req.isAuthenticated()) {
		 user 		= req.user;
		 picture 	= gravatar.url(user.local.email, { s:' 80', r:'x', d:'retro'}, true );
	}
	res.render('index', { title: 'Express', user: user, picture: picture });
}

module.exports = {
	home
}
