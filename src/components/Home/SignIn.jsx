import React, { Component } from 'react'
import { getFromStorage, setInStorage, removeFromStorage } from '../../utils/storage'

export default class SignIn extends Component {
    constructor(props){
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
				<div>
					<div>
						{{ signInError } ? <p>{signInError}</p> : null}
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
