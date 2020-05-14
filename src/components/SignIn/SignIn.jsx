import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {
	getFromStorage,
	setInStorage,
	removeFromStorage,
} from '../../utils/storage'
import './SignIn.css'
import { UserConsumer } from '../../contexts/UserContext'

// ICONS
import { FaTimesCircle } from 'react-icons/fa'

//

export default class SignIn extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			token: '', // Are signed in
			signInError: '',
			signInUsername: '',
			signInPassword: '',
			createPost: false,
			userPosts: false,
		}

		this.onChangeSignInUsername = this.onChangeSignInUsername.bind(this)
		this.onChangeSignInPassword = this.onChangeSignInPassword.bind(this)
		this.onSignIn = this.onSignIn.bind(this)
		this.logout = this.logout.bind(this)
		this.closeSignIn = this.closeSignIn.bind(this)
	}

	componentDidMount() {
		const obj = getFromStorage('storage-object')
		if (obj && obj.token) {
			const { token } = obj
			fetch('/api/account/verify?token=' + token)
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						this.setState({
							token: token,
							isLoading: false,
						})
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

	onChangeSignInUsername(event) {
		this.setState({
			signInUsername: event.target.value,
		})
	}
	onChangeSignInPassword(event) {
		this.setState({
			signInPassword: event.target.value,
		})
	}

	onSignIn() {
		const { signInUsername, signInPassword } = this.state

		this.setState({
			isLoading: true,
		})

		fetch('/api/account/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: signInUsername,
				password: signInPassword,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				console.log(json)

				if (json.success) {
					setInStorage('storage-object', { token: json.token })

					this.setState({
						signInError: json.message,
						isLoading: false,
						signInPassword: '',
						// signInUsername: '',
						token: json.token,
					})
				} else {
					this.setState({
						signInError: json.message,
						isLoading: false,
					})
					// set Sign In Popup Message not hidden
					// this.signInErrorMsg(this.state.signInError)
				}
			})
	}

	logout() {
		this.setState({
			isLoading: true,
		})

		const obj = getFromStorage('storage-object')
		if (obj && obj.token) {
			const { token } = obj
			fetch('/api/account/logout?token=' + token)
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						this.setState({
							token: '',
							isLoading: false,
						})
						removeFromStorage('storage-object', {
							token: json.token,
						})
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

	closeSignIn() {
		let popUp = document.querySelector('.sign-in-container')
		popUp.classList.add('hidden')
	}

	openSignIn() {
		let popUp = document.querySelector('.sign-in-container')
		popUp.classList.remove('hidden')
	}

	openSignUp() {
		let popUp = document.querySelector('.sign-up-container')
		popUp.classList.remove('hidden')
	}

	render() {
		const {
			isLoading,
			token,
			signInError,
			signInUsername,
			signInPassword,
		} = this.state

		if (isLoading) {
			return (
				<div>
					<p>Loading...</p>
				</div>
			)
		}

		if (!token) {
			return (
				<UserConsumer>
					{(userState) => (
						<>
							{{ signInError } ? (
								<div className='errorMsg'>
									<p>{signInError}</p>
								</div>
							) : null}

							<div className='profileContainer'>
								<button type='button' onClick={this.openSignIn}>
									Sign In
								</button>
								<button type='button' onClick={this.openSignUp}>
									Sign Up
								</button>
							</div>

							{/* {{signInError} ? this.signInErrorMsg('äggFlärp') : null} */}

							<div className='sign-in-container hidden'>
								<div className='sign-in-box'>
									<div>
										<p>Sign In</p>
										<FaTimesCircle
											className='close-icon'
											onClick={this.closeSignIn}
										/>
									</div>
									<input
										type='text'
										placeholder='Username'
										defaultValue={signInUsername}
										onChange={this.onChangeSignInUsername}
									/>
									<br />
									<input
										type='password'
										placeholder='Password'
										defaultValue={signInPassword}
										onChange={this.onChangeSignInPassword}
									/>
									<br />
									<button
										onClick={() => {
											this.onSignIn()
										}}
									>
										Sign In
									</button>
								</div>
								<br />
								<br />
								<br />
							</div>
						</>
					)}
				</UserConsumer>
			)
		}

		return (
			<UserConsumer>
				{(userState) => (
					<div className='profileContainer'>
						{userState.setUsername()}
						<h3>Hej {userState.username}! </h3>
						<button
							type='button'
							onClick={() => {
								this.setState({ userPosts: true })
								console.log(this.state.userPosts, 'click')
							}}
						>
							Your Posts
							{this.state.userPosts && <Redirect to='/post' />}
						</button>
						<button
							type='button'
							onClick={() => {
								this.setState({ createPost: true })
								console.log(this.state.createPost, 'click')
							}}
						>
							Create New Post
							{this.state.createPost && <Redirect to='/new' />}
						</button>
						<button type='button' onClick={this.logout}>
							Log Out
						</button>
					</div>
				)}
			</UserConsumer>
		)
	}
}
