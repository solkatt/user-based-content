const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")

const multer = require("multer")
const Grid = require("gridfs-stream")
const GridFsStorage = require("multer-gridfs-storage")
const cors = require("cors")
const crypto = require("crypto")

const port = process.env.PORT || 3001
const host = process.env.HOST || 'localhost'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({ origin: "http://localhost:3000" }))

const signin = require('./routes/signin')

mongoose.connect(
    'mongodb://localhost:27017/co-op-forum',
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
        if (error) {
            console.log('Error connecting to MongoDB')
        } else {
            console.log('Connected to MongoDB!')
        }
    }
)

mongoose.set('useFindAndModify', false)

const db = mongoose.connection

// Test User
/*
const newUser = new User({
    username: 'CooltNamn',
    password: 'cooltlösenord'
})

// Test save User to database
newUser.save(function (error, newUser) {
    if (error) {
        return console.log(`
        Error name: ${error.name}
        Error message: ${error._message}`)
    }
    console.log('Successfully saved new user!')
});
*/
let gfs

app.use(express.json())

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    gfs = Grid(db.db, mongoose.mongo)
    gfs.collection('images')
    require('./routes/postRoutes')(app, gfs, upload)
    console.log('Connected to db with Mongoose!')
})

app.use(express.static('build'))

app.use('/api/account/', signin)

const storage = new GridFsStorage({
    url: "mongodb://localhost:27017/co-op-forum",
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                const filename = file.originalname
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images',
                }
                resolve(fileInfo)
            })
        })
    },
})

const upload = multer({ storage })

app.get('/test', (req, res) => {
    res.send('TJEENA')
})

app.listen(port, () => {
    console.log(`
    (BUILD) Backend server is running at http://${host}:${port}/
    (DEV) Front server is running at http://${host}:3000/
    `)
})