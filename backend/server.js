const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const User = require('./models/User')

const port = process.env.PORT || 3001
const host = process.env.HOST || 'localhost'

const app = express()

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

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
	console.log('Connected to db with Mongoose!')
})

app.use(express.static('build'))
app.use(express.json())

app.use('/api/account/', signin)

app.get('/test', (req, res) => {
	res.send('TJEENA')
})

app.listen(port, () => {
	console.log(`
    (BUILD) Backend server is running at http://${host}:${port}/
    (DEV) Front server is running at http://${host}:3000/
    `)
})
