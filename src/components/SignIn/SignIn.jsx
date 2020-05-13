import React, { Component } from 'react'
import {
	getFromStorage,
	setInStorage,
	removeFromStorage,
} from '../../utils/storage'
import './SignIn.css'
import '../../css/profileSidebar.css'

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
				<>
					<div className=''>
						<button type='button' onClick={this.openSignIn}>
							Sign In
						</button>
						<button type='button' onClick={this.openSignUp}>
							Sign Up
						</button>
					</div>
					<div className='sign-in-container hidden'>
						<div className='sign-in-box'>
							{{ signInError } ? <p>{signInError}</p> : null}
							<FaTimesCircle
								className='close-icon'
								onClick={this.closeSignIn}
							/>
							<p>Sign In</p>
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
							<button onClick={this.onSignIn}>Sign In</button>
						</div>
						<br />
						<br />
						<br />
					</div>
				</>
			)
		}

		return (
			<div className='profileSidebar'>
				<h3>Hej {signInUsername}! </h3>
				<button type='button'>Your Posts</button>
				<button type='button'>Create New Post</button>
				<button type='button' onClick={this.logout}>
					Log Out
				</button>
			</div>
		)
	}
}
