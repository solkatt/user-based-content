module.exports = (app, gfs, upload) => {
    const controller = require('../controller/postController')

    // Create new post
    app.post("/api/post/new", upload.single('file'), controller.createPost)

    // Get post
    app.get("/api/post/:id")

    // Get a single image from filename
    app.get("/api/post/image/:filename", (req, res) => controller.getImageByFilename(req, res, gfs))
}
