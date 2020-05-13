import React, { Component } from 'react'
import './startpage.css'

import Post from '../Post/Post'
import SignIn from '../SignIn/SignIn'
import SignUp from '../SignUp/SignUp'

function Startpage() {
	return (
		<div className='startpageContainer'>
			<div className='startpageHeader'>
				<h1 className='startpageTitle'>Coop Forum!</h1>
				<SignIn />
				<SignUp />
			</div>
		</div>
	)
}

export default Startpage
