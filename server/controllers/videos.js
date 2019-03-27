// Import modules
var fs 			= require('fs');
var mime	 	= require('mime');
// get gravatar icon from email
var gravatar 	= require('gravatar');
var {Video} 	= require('./../models/videos');

// Set images files types
var VIDEOS_TYPES	= ['video/mp4', 'video/webm', 'video/ogg', 'video/ogv'];

var showVideos 		= function (req, res ) {
	Video.find({}).sort('-created').populate('user', 'local.email').then((videos) => {
		res.render('videos', {
			title: 'Vidoes Gallery',
			videos: videos,
			gravatar: gravatar.url(videos.email, { s:' 80', r:'x', d:'retro'}, true )
		});
	}).catch((error) => {
		return res.status(400).send({ message: error });
	})
}

// Upload images
var uploadVideos 	= function ( req, res ) {
	var src,
		dest,
		targetPath,
		targetName,
		tempPath	= req.file.path;

	console.log(req.file);

	// Get the mime type of the file
	var type = mime.lookup(req.file.mimetype);
	// Get file extension
	var extension = req.file.path.split(/[. ]+/).pop();
	// check support file types
	if ( VIDEOS_TYPES.indexOf(type) == -1 ) {
		return res.status(415).send({message: 'Supported videos formats : mp4, webm, ogg, ogv' });
	}
	// Set new path to videos
	targetPath	= './public/videos/'+ req.file.originalname;
	// using read stream API to read file
	src = fs.createReadStream(tempPath);
	// using write stream API to write file
	dest = fs.createWriteStream(targetPath);
	src.pipe(dest);

	// Show error
	src.on('error', (err) => {
		if (err) {
			return res.status(500).send({ message: error });
		}
	});

	src.on('end', () => {
		// Create a new instance of the Video model
		var video	=	new Video(req.body);
		// Set the image file name
		video.videoName = req.file.originalname;
		// Set current user (id)
		video.user = req.user;
		// Save the data received
		video.save((error) => {
			if(error) {
				return res.status(400).send({ message:error });
			}
		});
		// remove from temp folder
		fs.unlink(tempPath, (err) => {
			if (err) {
				return res.status(500).send({ message: 'Woh, something bad happened here'})
			}
			// Redirect to gallery's page
			res.redirect('/videos');
		});
	});
};

module.exports = {
	showVideos,
	uploadVideos
}
