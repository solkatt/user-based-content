const User = require('.././models/User')
const UserSession = require('.././models/UserSession')

const express = require('express')
const router = express.Router()

router.use(express.json())

router.get('/', (req, res, next) => {
	console.log('YJEEA USER')
	res.send('hej')
})

// RETURNS USER ID
router.get('/data', (req, res, next) => {
	// Get the token

	const { query } = req
	const { token } = query

	//Verify Token is ine of a kind and not deleted
	UserSession.find(
		{
			_id: token,
			isDeleted: false,
		},
		(err, sessions) => {
			if (err) {
				return res.send({
					success: false,
					message: 'Error: Server Error',
				})
			}

			if (sessions.length == null) {
				return res.send({
					success: false,
					message: 'Error: Invalid',
				})
			} else if (sessions[0] !== undefined) {
				return res.send({ success: true, userId: sessions[0].userId })
			} else {
				return res
					.status(500)
					.send({ success: false, message: 'Unknown error' })
			}
		}
	)
})

// RETURNS USER ID
router.get('/user', (req, res, next) => {
	// Get the token

	const { query } = req
	const { userId } = query
	//Verify Token is ine of a kind and not deleted
	User.find(
		{
			_id: userId,
			isDeleted: false,
		},
		(err, users) => {
			if (err) {
				return res.send({
					success: false,
					message: 'Error: Server Error',
				})
			}

			if (users.length == null) {
				return res.send({
					success: false,
					message: 'Error: Invalid',
				})
			} else if (users[0] !== undefined) {
				return res.send({
					success: true,
					username: users[0].username,
				})
			} else {
				return res
					.status(500)
					.send({ success: false, message: 'Unknown error' })
			}
		}
	)
})

// router.get('/logout', (req, res, next) => {
// 	// Get the token
// 	const { query } = req
// 	const { token } = query

// 	//Verify Token is ine of a kind and not deleted
// 	UserSession.findOneAndUpdate(
// 		{
// 			_id: token,
// 			isDeleted: false,
// 		},
// 		{
// 			$set: {
// 				isDeleted: true,
// 			},
// 		},
// 		null,
// 		(err, sessions) => {
// 			if (err) {
// 				return res.send({
// 					success: false,
// 					message: 'Error: Server Error',
// 				})
// 			}

// 			return res.send({
// 				success: true,
// 				message: 'Good',
// 			})
// 		}
// 	)
// })

/**
 * Get username by requested id
 */
router.get('/:id', (req, res, next) => {
	User.findOne(
		{
			_id: req.params.id,
			isDeleted: false,
		},
		(error, users) => {
			if (error) {
				res.status(500).send(error)
			} else if (users.username === null || users.username === undefined) {
				res.status(500).send({ success: false, message: "No user found" })
			} else {
				res.send({ username: users.username })
			}
		}
	)
})

module.exports = router
