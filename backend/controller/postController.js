const Post = require('../models/Post')
const mongoose = require("mongoose")

// Remove post from database
exports.removePost = async (req, res, db) => {
    try {
        const imageRemoved = await Post.findOne({ '_id': req.params.id })
        if (imageRemoved.image._id !== undefined && imageRemoved.image._id !== null) {
            const removeFile = await db.collection('images.files',).deleteOne({ '_id': mongoose.Types.ObjectId(imageRemoved.image._id) })
            const removeChunks = await db.collection('images.chunks').deleteOne({ 'files_id': mongoose.Types.ObjectId(imageRemoved.image._id) })
            if (removeChunks.deletedCount === 0 && removeFile.deletedCount === 0) {
                console.log('No image was found');
                return res.status(500).send({ success: true, message: "No image was found"})
            } else { console.log("Successfully removed image") }
        }
        const removed = await Post.deleteOne({ '_id': req.params.id }, (error, result) => {
            if (error || result.n === 0) {
                console.log(error)
                return { success: false, message: "Error while deleting post"}
            } else { return { result: result, success: true, message: "Successfully deleted post" } }
        })
        res.send(removed)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}

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

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}, (error, userPosts) => {
            return userPosts
        }).sort({ '_id': 'desc' })
        res.status(200).send({ allUserPosts: posts })
    } catch (error) {
        console.log(error)
    }
}

exports.getUserPosts = async (req, res) => {
    try {
        const user = await Post.find({ user: req.params.id }, (error, userPosts) => {
            return userPosts
        })
        res.status(200).send({ allUserPosts: user })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Failed to fetch all posts" })
    }
}