import React, { Component, createContext } from 'react'
import {
	getFromStorage,
	setInStorage,
	removeFromStorage,
} from '../utils/storage'

const UserContext = createContext({
	username: '',
})

export class UserProvider extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: false,
			userId: '',
			username: '',
			setUsername: () => {},
		}

		this.setUsername = this.setUsername.bind(this)
	}

	componentDidMount() {
		console.log('BAJS')

		const obj = getFromStorage('storage-object')
		if (obj && obj.token) {
			const { token } = obj
			let userId = ''
			fetch('/api/account/user/data?token=' + token)
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						userId = json.userId
						this.setState({
							userId: json.userId,
							isLoading: false,
						})
						console.log('JSON HÄR', json)
						if (userId) {
							fetch('/api/account/user/user?userId=' + userId)
								.then((res) => res.json())
								.then((json) => {
									if (json.success) {
										this.setState({
											username: json.username,
											isLoading: false,
										})
										console.log('JSON HÄR', json)
									} else {
										this.setState({
											isLoading: false,
										})
										console.log('ELSE')
									}
								})
						}
					} else {
						this.setState({
							isLoading: false,
						})
						console.log('ELSE')
					}
				})
		} else {
			this.setState({
				isLoading: false,
			})
		}
	}

	setUsername() {
		alert('HEJHEJ')
	}

	// IF USER ID

	// async fetchUser() {
	//     await fetch(`http://localhost:3001/api/post/${this.props.user.userId}`, {
	//       method: "GET",
	//       signal: this.abortController.signal
	//     })
	//       .then((response) => response.json())
	//       .then((json) => {
	//         this.setState({
	//           isLoading: false,
	//           postsJSON: json.allUserPosts,
	//           postsElements: this.renderPosts(json.allUserPosts),
	//         });
	//       })
	//       .catch((error) => console.log(error));
	//   }

	render() {
		return (
			<UserContext.Provider value={this.state}>
				{this.props.children}
			</UserContext.Provider>
		)
	}
}

export const UserConsumer = UserContext.Consumer
