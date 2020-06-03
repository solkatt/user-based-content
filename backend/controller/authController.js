function auth (req, res, next) {

const token = req.body.user

    console.log('HÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄR', token)
    console.log(req.body.formData)
    if (!token) return res.status(401).send({ error: 'Access Denied' })

    try {
// check token against session tokens i DB 

        next()
    } catch(err) {
        res.status(400).json({ message: 'Invalid Token'})
    }
}


module.exports = {
    auth
}