const User = require('.././models/User')
const UserSession = require('.././models/UserSession')

const express = require('express')
const router = express.Router()

router.use(express.json())


router.get('/', (req, res, next) => {
   
    console.log('YJEEA USER')
    res.send('hej')
		
	
})




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
			} else {
				return res.send(
					{success: true,
					userId: sessions[0].userId})
			}
		}
	)
})

router.get('/logout', (req, res, next) => {
	// Get the token
	const { query } = req
	const { token } = query

	//Verify Token is ine of a kind and not deleted
	UserSession.findOneAndUpdate(
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
				return res.send({
					success: false,
					message: 'Error: Server Error',
				})
			}

			return res.send({
				success: true,
				message: 'Good',
			})
		}
	)
})

module.exports = router
