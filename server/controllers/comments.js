var gravatar		= 	require('gravatar');
var Comment 		= 	require('./../models/comments');
var {ObjectID}      = 	require('mongodb');

// List comments
var commentList 	= function (req, res) {
	Comment.find({}).sort('created').then((comments) => {
		res.render('comments', {
			title: 'Comment Page',
			comments: comments,
			gravatar: gravatar.url(comments.email, {s: '80', r: 'x', d: 'retro'}, true)
		});
	}).catch((error) => {
		return res.status(400).send({ message: error });
	})
};

/** Create a comment */
var createComment	= 	function (req, res) {

	var newComment  		= new Comment();
	newComment.title    	= req.body.title;
	newComment.content    	= req.body.content;
	newComment.user       	= req.user;

	newComment.save().then(() => {
		res.redirect('/comments');
	}, (err) => {
		return res.status(400).send({ message: error });
	})
};


/** Delete a comment ***/
var removeComment 	= 	function (req, res) {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(400).send({message: 'The id is not valid'});
	}

	Comment.findOneIdAndRemove({
		'_id':id,
		'creator': req.user._id
	}).then(() => {
		res.redirect('/comments');
	}).catch((error) => {
		res.status(400).send({message: error });
	});
}

/** Edit a comment */
var editComment		=	function (req, res) {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(400).send({message: 'The id is not valid'});
	}

	var query = {
		'_id': id,
		'creator': req.user._id
	};

	Comment.findOneAndUpdate(query, {$set: req.body }, {new: true }).then((comment) => {
		if(!comment) {
			return res.status(404).send({message: 'Not found'});
		}
		res.status(200).send({message: 'Comment updated'});
	}).catch((error) => {
		res.status(400).send({ message: error });
	})
}

module.exports 	=	{
	commentList,
	createComment,
	removeComment,
	editComment
}
