const Post = require('../models/Post')
const mongoose = require("mongoose")
// Remove post from database
exports.removePost = async (req, res, db) => {
    console.log(req.body)
console.log(mongoose.Types.ObjectId(req.userId))
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
        const { user } = foundPost
        // If post author does not match current user online
        if (user !== req.userId) {
            
            return res.json({ success: false, message: "You are not allowed to delete that post" })
        }
        // If post contains an image - delete it
        if (foundPost.image.imageId !== undefined && foundPost.image.imageId !== null && foundPost.image.imageId !== "") {
            const removeFile = await db.collection('images.files').deleteOne({
                _id: mongoose.Types.ObjectId(foundPost.image.imageId)
            })
            const removeChunks = await db.collection('images.chunks').deleteMany({
                'files_id': mongoose.Types.ObjectId(foundPost.image.imageId)
            })
            if (removeChunks.deletedCount === 0 && removeFile.deletedCount === 0) {
                console.log('No image was found, file has already been deleted or never existed in the first place, but keep deleting post');
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

exports.updatePost = async (req, res, db) => {
    try {
        const oldPost = await Post.findOne({ _id: req.params.id })
        
        if (!oldPost) {
            return res.json({ success: false, message: "Post not found" })
        }
        if (req.userId !== oldPost.user) {
            return res.json({ success: false, message: "Access denied" })
        }
        
        const post = new Post({
            user: req.userId,
            title: req.body.title,
            text: req.body.text,
        })
        
        // Assign old image if available
        if (oldPost.image) {
            post.image = oldPost.image
        }
        if (req.body.file === "") {
            deleteImage(oldPost, db)
            post.image = { imageId: "", filename: "" }

        }
        // Assign or replace if image file attached to request
        if (req.file) {
            post.image = {
                imageId: req.file.id,
                filename: req.file.filename
            }
        }
        console.log("NEW POST", post)
        console.log("OLDPOST", oldPost)
        console.log("REQ FILE", req.file)
        console.log("REQ BODY", req.body)
        const { user, text, title, image } = post

        const updatedPost = new Post(Object.assign(oldPost, { user, text, title, image }))
console.log(updatedPost)
        await updatedPost.save()
        req.userId = null
        res.json({ success: true, message: "Success", result: updatedPost })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Failed updating post", error: error })
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
                imageId: req.file.id,
                filename: req.file.filename
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
        console.log("error creating post", error)
        res.json({ success: false, message: "Failed saving post", error: error })
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

exports.checkIfHasImage = async (postId) => {
    const post = await Post.findOne({ _id: postId })
    if (post.image !== {} && post.image !== undefined && post.image.imageId !== "" && post.image.imageId !== undefined) {
        return post
    }
    return false
}

async function deleteImage(post, db) {
    console.log("DB: ",JSON.stringify(post.image.imageId))
    const removeFile = await db.collection('images.files').deleteOne({
        _id: mongoose.Types.ObjectId(post.image.imageId)
    })
    const removeChunks = await db.collection('images.chunks').deleteMany({
        "files_id": mongoose.Types.ObjectId(post.image.imageId)
    }, (error) => console.log("Error deleting image", error))
    return {removeChunks, removeFile}
}