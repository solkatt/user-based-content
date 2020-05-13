const cors = require("cors")

module.exports = (app, gfs, upload) => {
    const controller = require('../controller/postController')

    app.use(cors())

    // Create new post
    app.post("/api/post/new", upload.single('file'), controller.createPost)

    // Get post - Behöver göras?!
    app.get("/api/post/:id")

    // Get a single image from filename
    app.get("/api/post/image/:filename", (req, res) => controller.getImageByFilename(req, res, gfs))
}
