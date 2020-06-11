const cors = require("cors")
const { auth } = require('../controller/authController')

module.exports = (app, gfs, upload, db) => {
    const controller = require('../controller/postController')

    app.use(cors())

    app.delete("/api/post/remove/:token", auth, (req, res) => controller.removePost(req, res, db))


    /** (Authorize > Image upload >) Authorize > Save post
     * The upload middleware handles formdata and must be the first one fired
     * Therefore the first auth is directly inside the function body in server.js line 77
     * If no image is attached, upload never fires, therefore there must be auth
     * before the createPost middleware
     */
    app.post("/api/post/new", upload.single('file'), auth, controller.createPost)

    // Get all saved posts
    app.get("/api/post/all", controller.getAllPosts)

    // Get post by id
    app.get("/api/post/:id", controller.getUserPosts)

    // Get a single image from filename
    app.get("/api/post/image/:filename", (req, res) => controller.getImageByFilename(req, res, gfs))

    app.put('/api/post/update/:id', upload.single('file'), auth, (req, res) => controller.updatePost(req, res, db))
}
