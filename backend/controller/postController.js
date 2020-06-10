const Post = require('../models/Post')
const mongoose = require("mongoose")

// Remove post from database
/**
 * @param {Response} res
 */
exports.removePost = async (req, res, db) => {
    const { post } = req.query

    try {
        // Find post to remove
        const foundPost = await Post.findOne({
            _id: post
        })
        // If post was not found
        if (!foundPost) {
            return res.json({ success: false, message: "Post was not found" })
        }
        // If post author does not match current user online
        if (foundPost.user !== req.userId) {
            return res.json({ success: false, message: "You are not allowed to delete that post" })
        }
        // If post contains an image - delete it
        if (foundPost.image._id !== undefined && foundPost.image._id !== null) {
            const removeFile = await db.collection('images.files').deleteOne({
                _id: mongoose.Types.ObjectId(foundPost.image._id)
            })
            const removeChunks = await db.collection('images.chunks').deleteOne({
                'files_id': mongoose.Types.ObjectId(foundPost.image._id)
            })
            if (removeChunks.deletedCount === 0 && removeFile.deletedCount === 0) {
                console.log('No image was found, file has already been deleted or never existed in the first place');
                return res.status(500).json({
                    success: true,
                    message: "No image was found"
                })
            }
        }
        // Delete post
        await Post.deleteOne({
            _id: foundPost._id
        }, (error, result) => {
            if (result.deletedCount < 0) {
                console.log("Not deleted, post was not found")
                return res.json({
                    success: false,
                    message: "Error while deleting post: post was not found and deleted"
                })
            }
            if (error) {
                console.log(error)
                return res.json({
                    success: false,
                    message: "Error while deleting post"
                })
            } else {
                return res.json({
                    result: result,
                    success: true,
                    message: "Successfully deleted post"
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server error", error: error })
    }
}


exports.updatePost = async (req, res) => {

    console.log('REQ PARAMS', req.params.id)
    console.log('REQ:', req.body)
    try {
        let post = new Post({
            user: req.body.user,
            title: req.body.title,
            text: req.body.text,
        })
        // If image was added
        if (req.file) {
            post.image = {
                _id: req.file.id,
                filename: req.file.originalname
            }
        }
        //UPDATE POST
        Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, function (err, result) {
            if (err) {
                console.log(err)
            }
            console.log('RESULT', result)
            res.json()
        }

        )
        res.status(200).json({
            success: true,
            message: "Successfully updated post"
        })



        // // Save post
        // const saved = await post.save()
        // res.status(200).json({ success: true, message: "Successfully saved post" })
    } catch (error) {
        console.log(error)
        res.end()
    }

}

// Create new post
exports.createPost = async (req, res) => {
    try {
        let post = new Post({
            user: req.userId,
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
        res.status(200).json({
            success: true,
            message: "Successfully saved post",
            post: saved
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Failed saving post" })
    }
}

// Get image by filename and stream to browser
exports.getImageByFilename = (req, res, gfs) => {
    gfs.files.findOne({
        filename: req.params.filename
    }, (err, file) => {
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
        }).sort({
            '_id': 'desc'
        })
        res.status(200).json({
            allUserPosts: posts
        })
    } catch (error) {
        console.log(error)
    }
}

exports.getUserPosts = async (req, res) => {
    try {
        const user = await Post.find({
            user: req.params.id
        }, (error, userPosts) => {
            if (userPosts.length < 0) {
                return res.status(404).json({
                    success: false,
                    message: "No posts were found"
                })
            }
            return userPosts
        })
        res.status(200).json({
            allUserPosts: user
        })
    } catch (error) {
        console.log("Error getting user posts ", error)
        res.status(500).json({
            success: false,
            message: "Failed to fetch all posts"
        })
    }
}