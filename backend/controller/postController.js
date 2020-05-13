const Post = require('../models/Post')

exports.createPost = async (req, res) => {
    try {
        const post = new Post({
            user: req.body.user,
            title: req.body.title,
            text: req.body.text,
            image: {
                _id: req.file.id,
                filename: req.file.originalname
            }
        })
        const saved = await post.save()
        res.status(200).send(saved._id)
    } catch (error) {
        console.log(error)
        res.end()
    }
}

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