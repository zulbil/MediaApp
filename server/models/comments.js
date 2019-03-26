var mongoose		=	require('mongoose');
var Schema 			= mongoose.Schema;

var commentSchema	= 	new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		required: 'Title cannot be blank',
		trim: true
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	image: {
		type: Schema.ObjectId,
		ref: 'Image'
	},
	videos: {
		type: Schema.ObjectId,
		ref: 'Video'
	}
});

var Comment		= mongoose.model('Comment', commentSchema);

module.exports = { Comment }
