import React from 'react'
import '../css/profileSidebar.css'

function ProfileSidebar(props) {
	return (
		<div className='profileSidebar'>
			<h3>Hej Kalle! </h3>
			<button type='button'>Your Posts</button>
			<button type='button'>Create New Post</button>
		</div>
	)
}

export default ProfileSidebar
