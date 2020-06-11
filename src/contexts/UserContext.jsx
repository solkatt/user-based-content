import React, { Component, createContext } from 'react'
import {
	getFromStorage,
	setInStorage,
	removeFromStorage,
} from '../utils/storage'

const UserContext = createContext()


// const UserContext = createContext({
// 	username: '',
// })


export class UserProvider extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: false,
			userId: '',
			username: '',
			token: '',
			setUsername: () => { },
			getUserData: this.getUserData,
		}

		this.setUsername = this.setUsername.bind(this)
	}

	componentDidMount() {
		this.getUserData()
	}


	getUserData = async () => {
		const obj = await getFromStorage('storage-object')
		if (obj && obj.token) {
			const { token } = obj
			let userId = ''
			await fetch('/api/account/user/data?token=' + token)
				.then((res) => res.json())
				.then(async (json) => {
					if (json.success) {
						userId = json.userId
						this.setState({
							userId: json.userId,
							isLoading: false,
							token: token,
						})
						if (userId) {
							await fetch('/api/account/user/user?userId=' + userId)
								.then((res) => res.json())
								.then((json) => {
									if (json.success) {
										this.setState({
											username: json.username,
											isLoading: false,
										})
									} else {
										this.setState({
											isLoading: false,
										})
									}
								})
						}
					} else {
						this.setState({
							isLoading: false,
						})
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

	getUserId = async () => {
		try {
			let token;
			if (await getFromStorage('storage-object') !== null) {
				token = await getFromStorage('storage-object').token;
			}
			const result = await fetch("/api/account/user/data?token=" + token)
				.then(res => res.json())
				.then(json => {
					if (json.success) {
						return json.userId
					}
				})
			return result
		} catch (error) {

		}
	}


	getUsername = async (userId) => {
		try {
			const result = await fetch('/api/account/user/user?userId=' + userId)
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						return json.username
					}
				})
			return result
		} catch (error) {
			return alert("Error getting username")
		}
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
			<UserContext.Provider value={this.state, { getUsername: this.getUsername, getUserId: this.getUserId }}>
				{this.props.children}
			</UserContext.Provider>
		)
	}
}
export default UserContext;
export const UserConsumer = UserContext.Consumer
