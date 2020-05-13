const cors = require("cors")

module.exports = (app, gfs, upload) => {
    const controller = require('../controller/postController')

    app.use(cors())

    // Create new post
    app.post("/api/post/new", upload.single('file'), controller.createPost)

    // Get all saved posts
    app.get("/api/post/all", controller.getAllPosts)

    // Get post by id
    app.get("/api/post/:id", controller.getUserPosts)

    // Get a single image from filename
    app.get("/api/post/image/:filename", (req, res) => controller.getImageByFilename(req, res, gfs))
}
