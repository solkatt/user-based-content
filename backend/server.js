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
app.use(cors())
app.use(express.json())
// On production build
app.use(express.static('build'))



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

// For initializing gridFsStorage (image storage)
let gfs

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    // Create storage collection
    gfs = Grid(db.db, mongoose.mongo)
    gfs.collection('images')
    require('./routes/postRoutes')(app, gfs, upload)
    console.log('Connected to db with Mongoose!')
})

// Configuration for image file storage with multer
const storage = new GridFsStorage({
    url: "mongodb://localhost:27017/co-op-forum",
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                const filename = file.originalname
                // Saved with original filename in (bucketname).chunks and (bucketname).files
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

// Routes
const signin = require('./routes/signin')
const currentUser = require('./routes/getCurrentUser')

app.use('/api/account/', signin)
app.use('/api/account/user', currentUser)

app.get('/test', (req, res) => {
    res.send('TJEENA')
})

app.listen(port, () => {
    console.log(`
    (BUILD) Backend server is running at http://${host}:${port}/
    (DEV) Front server is running at http://${host}:3000/
    `)
})