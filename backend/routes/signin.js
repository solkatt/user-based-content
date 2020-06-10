const User = require('.././models/User')
const UserSession = require('.././models/UserSession')

const express = require('express')
const router = express.Router()

router.use(express.json())

// Sign Up
router.post('/signup', (req, res, next) => {
	const { body } = req
	console.log('body', body)

	let { firstName, lastName, username, password } = body

	console.log('here')

	if (!firstName) {
		return res.json({
			success: false,
			message: 'Error: First name can not be empty',
		})
	}
	if (!lastName) {
		return res.json({
			success: false,
			message: 'Error: Last name can not be empty',
		})
	}
	if (!username) {
		return res.json({
			success: false,
			message: 'Error: Username can not be empty',
		})
	}
	if (!password) {
		return res.json({
			success: false,
			message: 'Error: Password can not be empty',
		})
	}

	username = username.toLowerCase()
	User.find(
		{
			username: username,
		},
		(err, previousUsers) => {
			if (err) {
				return res.json({
					success: false,
					message: 'Error: Server error',
				})
			} else if (previousUsers.length > 0) {
				return res.json({
					success: false,
					message: 'Error: Account already exist',
				})
			} else {
				// Save new user
				const newUser = new User()

				newUser.username = username
				newUser.firstName = firstName
				newUser.lastName = lastName
				newUser.password = newUser.generateHash(password)

				newUser.save((err, user) => {
					if (err) {
						return res.json({
							success: false,
							message: 'Error: Server error',
						})
					}
					return res.json({ success: true, message: 'Signed Up' })
				})
			}
		}
	)
})

router.post('/signin', (req, res, next) => {
	const { body } = req
	// console.log(req)
	let { username, password } = body

	if (!username) {
		return res.json({
			success: false,
			message: 'Error: Username can not be empty',
		})
	}
	if (!password) {
		return res.json({
			success: false,
			message: 'Error: Password can not be empty',
		})
	}

	username = username.toLowerCase()

	User.find(
		{
			username: username,
		},
		(err, users) => {
			if (err) {
				return res.json({
					success: false,
					message: 'Error: Server error',
				})
			}
			if (users.length != 1) {
				return res.json({
					success: false,
					message: 'Invalid Username',
				})
			}

			const user = users[0]
			if (!user.validPassword(password)) {
				return res.json({
					success: false,
					message: 'Invalid Password',
				})
			}

			//Correct User
			const userSession = new UserSession()
			userSession.userId = user._id
			userSession.save((err, doc) => {
				if (err) {
					return res.json({
						success: false,
						message: 'Error: Server error',
					})
				}

				return res.json({
					success: true,
					message: 'Valid sign in',
					token: doc._id,
				})
			})
		}
	)
})

router.get('/verify', (req, res, next) => {
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
			} else {
				return res.send({
					success: true,
					message: 'Good',
				})
			}
		}
	)
	return false
})

router.get('/logout', async (req, res, next) => {
	// Get the token
	const { query } = req
	const { token } = query

	//Verify Token is ine of a kind and not deleted
	await UserSession.findOneAndUpdate(
		{
			_id: token,
			isDeleted: false,
		},
		{
			$set: {
				isDeleted: true,
			},
		},
		null,
		(err, sessions) => {
			if (err) {
				return res.json({
					success: false,
					message: 'Error: Server Error',
				})
			}

			return res.json({
				success: true,
				message: 'Good',
			})
		}
	)
})

module.exports = router
