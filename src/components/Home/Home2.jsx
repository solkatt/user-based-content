import React, { Component } from 'react'

import { getFromStorage, setInStorage, removeFromStorage } from '../../utils/storage'

export default class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: true,
			token: '', // Are signed in
			signUpError: '',
			signInError: '',
			signInUsername: '',
			signInPassword: '',
			signUpFirstName: '',
			signUpLastName: '',
			signUpUsername: '',
			signUpPassword: '',
		}

		this.onChangeSignInUsername = this.onChangeSignInUsername.bind(this)
		this.onChangeSignInPassword = this.onChangeSignInPassword.bind(this)
		this.onChangeSignUpFirstName = this.onChangeSignUpFirstName.bind(this)
		this.onChangeSignUpLastName = this.onChangeSignUpLastName.bind(this)
		this.onChangeSignUpUsername = this.onChangeSignUpUsername.bind(this)
		this.onChangeSignUpPassword = this.onChangeSignUpPassword.bind(this)
		this.onSignIn = this.onSignIn.bind(this)
		this.onSignUp = this.onSignUp.bind(this)
		this.logout = this.logout.bind(this)
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
	onChangeSignUpUsername(event) {
		this.setState({
			signUpUsername: event.target.value,
		})
	}
	onChangeSignUpPassword(event) {
		this.setState({
			signUpPassword: event.target.value,
		})
	}
	onChangeSignUpFirstName(event) {
		this.setState({
			signUpFirstName: event.target.value,
		})
	}
	onChangeSignUpLastName(event) {
		this.setState({
			signUpLastName: event.target.value,
		})
	}

	onSignUp() {
		const {
			signUpFirstName,
			signUpLastName,
			signUpUsername,
			signUpPassword,
		} = this.state

		this.setState({
			isLoading: true,
		})

		fetch('/api/account/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				firstName: signUpFirstName,
				lastName: signUpLastName,
				username: signUpUsername,
				password: signUpPassword,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				console.log(json)
				console.log(signUpFirstName)

				if (json.success) {
					this.setState({
						signUpError: json.message,
						isLoading: false,
						signUpUsername: '',
						signUpPassword: '',
						signUpFirstName: '',
						signUpLastName: '',
					})
				} else {
					this.setState({
						signUpError: json.message,
						isLoading: false,
					})
				}
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
						removeFromStorage('storage-object', { token: json.token })
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

	render() {
		const {
			isLoading,
			token,
			signInError,
			signUpError,
			signInUsername,
			signInPassword,
			signUpFirstName,
			signUpLastName,
			signUpUsername,
			signUpPassword,
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
				<div>
					<div>
						{{ signInError } ? <p>{signInError}</p> : null}
						<p>Redan medlem?</p>
						<input
							type='text'
							placeholder='Användarnamn'
							defaultValue={signInUsername}
							onChange={this.onChangeSignInUsername}
						/>
						<br />
						<input
							type='password'
							placeholder='Lösenord'
							defaultValue={signInPassword}
							onChange={this.onChangeSignInPassword}
						/>
						<br />
						<button onClick={this.onSignIn}>Logga in</button>
					</div>
					<br />
					<br />
					<br />
					<div>
						{signUpError ? <p>{signUpError}</p> : null}
						<p>Registrera dig</p>
						<input
							type='text'
							placeholder='Förnamn'
							defaultValue={signUpFirstName}
							onChange={this.onChangeSignUpFirstName}
						/>{' '}
						<br />
						<input
							type='text'
							placeholder='Efternamn'
							defaultValue={signUpLastName}
							onChange={this.onChangeSignUpLastName}
						/>{' '}
						<br />
						<input
							type='text'
							placeholder='Användarnamn'
							defaultValue={signUpUsername}
							onChange={this.onChangeSignUpUsername}
						/>{' '}
						<br />
						<input
							type='password'
							placeholder='Lösenord'
							defaultValue={signUpPassword}
							onChange={this.onChangeSignUpPassword}
						/>{' '}
						<br />
						<button onClick={this.onSignUp}>Registrera dig</button>
					</div>
				</div>
			)
		}

		return (
			<div>
				<p>Account</p>
		<h2>{signInUsername}</h2>
				<button type='button' onClick={this.logout}>
					Log Out
				</button>
			</div>
		)
	}
}
