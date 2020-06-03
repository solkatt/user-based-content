import React, { Component } from 'react'
import '../RenderPost/RenderPost.css'
import './startpage.css'

import Post from '../RenderPost/RenderPost'
import SignIn from '../SignIn/SignIn'
import SignUp from '../SignUp/SignUp'

class Startpage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			allPosts: [],
			postsElements: []
		}
	}

	async fetchPosts() {
		await fetch("http://localhost:3001/api/post/all",
			{ method: "GET" })
			.then(res => res.json())
			.then((json) => {
				this.setState({
					isLoading: false,
					allPosts: json.allUserPosts,
					postsElements: this.renderPosts(json.allUserPosts)
				})
			}).catch(error => console.log(error))
	}

	renderPosts = (posts) => {
        const allPosts = posts.map(post => { 
			return (
			<Post key={post._id} data={post} /> 
			 )})
        return allPosts
	}
	
	componentDidMount() {
		this.fetchPosts()
	}

	render() {
		const { isLoading, postsElements } = this.state
		return (
			<div className='startpageContainer'>
				<div className='startpageHeader'>
					<h1 className='startpageTitle'>Coop Forum!</h1>
					<SignIn yourPostsButton createButton logOutButton/>
					<SignUp />
				</div>
				{isLoading ? <p>Loading...</p> : postsElements}
			</div>
		)
	}
}

export default Startpage
