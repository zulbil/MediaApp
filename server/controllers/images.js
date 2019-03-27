// Import modules
var fs 			= require('fs');
var mime	 	= require('mime');
// get gravatar icon from email
var gravatar 	= require('gravatar');
var {Image} 	= require('./../models/images');

// Set images files types
var IMAGES_TYPES	= [ 'image/jpeg', 'image/jpg', 'image/png' ];

var showImages 		= function (req, res ) {
	Image.find({}).sort('-created').populate('user', 'local.email').then((images) => {
		res.render('images-gallery', {
			title: 'Image Gallery',
			images: images,
			gravatar: gravatar.url(images.email, { s:' 80', r:'x', d:'retro'}, true )
		});
	}).catch((error) => {
		return res.status(400).send({ message: error });
	})
}

// Upload images
var uploadImages 	= function ( req, res ) {
	console.log("File :",req.file);

	var src,
		dest,
		targetPath,
		targetName,
		tempPath	= req.file.path;


	// Get the mime type of the file
	var type = mime.lookup(req.file.mimetype);
	// Get file extension
	var extension = req.file.path.split(/[. ]+/).pop();
	// check support file types
	if ( IMAGES_TYPES.indexOf(type) == -1 ) {
		return res.status(415).send({message: 'Supported images formats : jpg, jpeg, png' });
	}
	// Set new path to images
	targetPath	= './public/images/'+ req.file.originalname;
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
		// Create a new instance of the Image model
		var image	=	new Image(req.body);
		// Set the image file name
		image.imageName = req.file.originalname;
		// Set current user (id)
		image.user = req.user;
		// Save the data received
		image.save((error) => {
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
			res.redirect('/images');
		});
	});
};

module.exports = {
	showImages,
	uploadImages
}
