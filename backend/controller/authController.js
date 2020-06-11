const UserSession = require("../models/UserSession")

async function auth(req, res, next) {
    // Immediately deny if token is missing in request
    if ((req.body.token === "" && req.params.token === {}) ||
        (req.body.token === {} && req.params.token === "")) {
        if (res !== null) return res.status(401).send({ success: false, message: 'Access denied' })
        return false
    } 
    try {
        // Verify token is one of a kind and not deleted
        const userSession = await UserSession.findOne(
            {
                _id: req.body.token ? req.body.token : req.params.token,
                isDeleted: false,
            })
        if (!userSession) {
            if (res !== undefined) {
                return res.json({
                    success: false,
                    message: 'Error: Server Error',
                })
            }
            return false
        }

        // Pass userId in req.body for use in createPost middleware
        // Must be put in either req.local or req.body, 
        // because 'response' is not passed along from multer to this middleware
        req.userId = userSession.userId

        if (typeof next === "function") {
            next()
        }
        return true
    } catch (err) {
        console.log("Error: ", err.message)
        if (res !== undefined) {
            res.status(500).json({ success: false, message: 'Unknown server error occured', error: err })
        }
        return false
    }
}


module.exports = { auth }