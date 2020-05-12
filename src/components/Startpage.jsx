import React, { component } from 'react'
import '../css/startpage.css'

import Post from './Post'
import ProfileSidebar from './ProfileSidebar'
import Home from './Home/Home'

function Startpage() {
	return (
		<div className='startpageContainer'>
			<div className='startpageHeader'>
				<h1 className='startpageTitle'>Coop Forum!</h1>
				<ProfileSidebar />
			</div>
			<Post
				imageSource='https://images.unsplash.com/photo-1515542743364-f002238fe5f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
				title={'Mitt nya husdjur'}
				description={
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas iaculis, turpis nec imperdiet consequat, velit eros fermentum nulla, at tempor metus erat finibus nulla. Pellentesque blandit augue et lectus tincidunt aliquet. Praesent iaculis sollicitudin nibh. Mauris bibendum tempus nibh, non convallis sapien varius sit amet. Proin pellentesque enim at rhoncus consequat. Donec tempus mattis volutpat. Vestibulum eget accumsan nunc, a tempor diam. Proin eu gravida enim. Fusce hendrerit, mi a finibus rutrum, elit leo tristique elit, id commodo massa velit ut odio. Suspendisse cursus nisl in cursus feugiat. Curabitur auctor fringilla ipsum, eu venenatis diam tincidunt at. Morbi quis erat justo.'
				}
			/>
			<Home />
		</div>
	)
}

export default Startpage
