var home = function (req, res ) {
	res.render('index', { title: 'Express' });
}

module.exports = {
	home
}
