// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import './SignUp.css'
import { FaTimesCircle, FaBluetooth } from 'react-icons/fa'

export default class SignUp extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			signUpError: '',
			signUpFirstName: '',
			signUpLastName: '',
			signUpUsername: '',
			signUpPassword: '',
		}

		this.onChangeSignUpFirstName = this.onChangeSignUpFirstName.bind(this)
		this.onChangeSignUpLastName = this.onChangeSignUpLastName.bind(this)
		this.onChangeSignUpUsername = this.onChangeSignUpUsername.bind(this)
		this.onChangeSignUpPassword = this.onChangeSignUpPassword.bind(this)
		this.onSignUp = this.onSignUp.bind(this)
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

	closeSignUp() {
		let popUp = document.querySelector('.sign-up-container')
		popUp.classList.add('hidden')
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
					console.log('SUCCESS')
				} else {
					console.log('ELSE')
					this.setState({
						signUpError: json.message,
						isLoading: false,
					})
				}
			})
	}

	render() {
		const {
			signUpError,
			signUpFirstName,
			signUpLastName,
			signUpUsername,
			signUpPassword,
		} = this.state

		return (
			<div className='sign-up-container hidden'>
				<div className='sign-up-box'>
					{signUpError ? <p>{signUpError}</p> : null}

					<div>
						<p>Ny användare</p>
						<FaTimesCircle
							className='close-icon'
							onClick={this.closeSignUp}
						/>
					</div>
					<input
						type='text'
						placeholder='Förnamn'
						value={signUpFirstName}
						onChange={this.onChangeSignUpFirstName}
					/>{' '}
					<br />
					<input
						type='text'
						placeholder='Efternamn'
						value={signUpLastName}
						onChange={this.onChangeSignUpLastName}
					/>{' '}
					<br />
					<input
						type='text'
						placeholder='Användarnamn'
						value={signUpUsername}
						onChange={this.onChangeSignUpUsername}
					/>{' '}
					<br />
					<input
						type='password'
						placeholder='Lösenord'
						value={signUpPassword}
						onChange={this.onChangeSignUpPassword}
					/>{' '}
					<br />
					<button onClick={this.onSignUp}>Registrera dig</button>
				</div>
			</div>
		)
	}
}
