function auth (req, res, next) {

const token = req.body.user

    console.log('HÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄR', token)
    console.log(req.body.formData)
    
    try {
        if (!token) return res.status(401).json({ error: 'Access Denied' })
// check token against session tokens i DB 

        next()
    } catch(err) {
        res.status(400).json({ message: 'Invalid Token'})
    }
}


module.exports = {
    auth
}