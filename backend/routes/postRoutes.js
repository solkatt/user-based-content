const cors = require("cors")

module.exports = (app, gfs, upload, db) => {
    const controller = require('../controller/postController')

    app.use(cors())

    app.delete("/api/post/remove/:id", (req, res) => controller.removePost(req, res, db))

    // Create new post
    app.post("/api/post/new", upload.single('file'), controller.createPost)

    // Get all saved posts
    app.get("/api/post/all", controller.getAllPosts)

    // Get post by id
    app.get("/api/post/:id", controller.getUserPosts)

    // Get a single image from filename
    app.get("/api/post/image/:filename", (req, res) => controller.getImageByFilename(req, res, gfs))

    app.put('/api/post/update/:id', (req, res) => controller.updatePost(req, res) )
}
