const Post = require('../models/Post')

// Create new post
exports.createPost = async (req, res) => {
    try {
        let post = new Post({
            user: req.body.user,
            title: req.body.title,
            text: req.body.text
        })
        // If image was added
        if (req.file) {
            post.image = {
                _id: req.file.id,
                filename: req.file.originalname
            }
        }
        // Save post
        const saved = await post.save()
        res.status(200).send({ success: true, message: "Successfully saved post" })
    } catch (error) {
        console.log(error)
        res.end()
    }
}

// Get image by filename and stream to browser
exports.getImageByFilename = (req, res, gfs) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "No file exists"
            });
        }

        // Check if image
        if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: "Not an image"
            });
        }
    });
}